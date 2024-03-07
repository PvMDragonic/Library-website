import JSZip from "jszip";
import { PDFDocument } from 'pdf-lib';
import { IBook } from "../BookCard";

type EpubData = { 
    title: string; 
    author: string; 
    publisher: string 
} | null;

export async function fetchEpubData(zip: JSZip): Promise<EpubData>
{    
    let packageOpf: JSZip.JSZipObject | null = null;

    zip.forEach(zipEntry => 
    {
        if (zipEntry.endsWith('.opf') && !packageOpf) 
            packageOpf = zip.file(zipEntry);
    });

    if (!packageOpf) return null;

    const parser = new DOMParser();
    const packageXmlString = await (packageOpf as JSZip.JSZipObject).async("text");
    const packageXml = parser.parseFromString(packageXmlString, "text/xml");

    const metadata = packageXml.querySelector("metadata");
    if (!metadata) return null;

    const title = metadata.querySelector("title")?.textContent || '';
    const author = metadata.querySelector("creator")?.textContent || '';
    const publisher = metadata.querySelector("publisher")?.textContent || '';

    return { title, author, publisher };
}

interface FileData 
{ 
    bookFile: string; 
    fileType: string; 
    setBook: React.Dispatch<React.SetStateAction<IBook>>; 
    setOriginalCover: React.Dispatch<React.SetStateAction<string | null>>;
}

export async function setFileData({ bookFile, fileType, setBook, setOriginalCover}: FileData)
{
    if (fileType.includes("epub"))
    {   
        const base64WithoutPrefix = bookFile.replace(/^data:application\/epub\+zip;base64,/, '');
        const binaryData = Uint8Array.from(atob(base64WithoutPrefix), c => c.charCodeAt(0));
        JSZip().loadAsync(binaryData).then(async zip =>
        {
            const coverPromises: Promise<string>[] = [];

            zip.forEach(zipEntry => 
            {
                const imageFormat = zipEntry.endsWith(".jpg") ? 'jpg' : zipEntry.endsWith(".png") ? 'png' : null;
                if (!imageFormat || !zipEntry.toLowerCase().includes("cover"))
                    return;
    
                const rawImage = zip.file(zipEntry);
                if (!rawImage)
                    return;
    
                coverPromises.push(
                    rawImage.async("uint8array").then(imageData => 
                    {
                        const binaryCover = imageData.reduce((data, byte) => data + String.fromCharCode(byte), '');
                        const base64Cover = `data:image/${imageFormat};base64,${btoa(binaryCover)}`;
                        setOriginalCover(base64Cover);
                        return base64Cover;
                    })
                );
            });

            // Gotta wait for the cover to finish loading, or else it may setBook() as null.
            const covers = await Promise.all(coverPromises);
            const epubData = await fetchEpubData(zip);

            try
            {
                if (epubData) 
                {
                    const { title, author, publisher } = epubData;
                    // Everything *needs* to be set at once, or else it'll only set the last one you do.
                    // Something something 'book' not having updated.
                    setBook(currBook => ({
                        ...currBook,
                        ['title']: title,
                        ['author']: author,
                        ['publisher']: publisher,
                        ['attachment']: bookFile,
                        ['cover']: covers.find(cover => !!cover) || null
                    }));
                }
            } 
            catch (error) 
            {
                console.error("Error fetching EPUB data:", error);
            }
        });    
    }
    else if (fileType.includes("pdf"))
    {
        const pdfDoc = await PDFDocument.load(bookFile, { 
            updateMetadata: false 
        });
            
        const title = pdfDoc.getTitle() || '';
        const author = pdfDoc.getAuthor() || '';
        const publisher = pdfDoc.getProducer() || '';

        setBook(currBook => ({
            ...currBook,
            ['title']: title,
            ['author']: author,
            ['publisher']: publisher,
            ['attachment']: bookFile
        }));
    }
    else // .png or .jpg
    {
        setOriginalCover(bookFile);
        setBook(currBook => ({
            ...currBook, 
            ['cover']: bookFile 
        }));
    }
}