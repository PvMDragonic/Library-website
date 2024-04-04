import JSZip from 'jszip';
import { useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useFilePicker } from 'use-file-picker';
import { 
    FileAmountLimitValidator, 
    FileTypeValidator, 
    FileSizeValidator 
} from 'use-file-picker/validators';
import { ImageSelector } from '../ImageSelector';
import { IBook } from '../BookCard';
import AddFileIcon from '../../assets/AddFileIcon';
import DeleteIcon from '../../assets/DeleteIcon';

interface IFileSelector 
{
    book: IBook;
    setBook: React.Dispatch<React.SetStateAction<IBook>>;
    setLoading: React.Dispatch<React.SetStateAction<number>>;
}

export function FileSelector({ book, setBook, setLoading }: IFileSelector) 
{
    const { openFilePicker, clear, loading, errors } = useFilePicker({
        readAs: 'DataURL',
        multiple: true,
        validators: [
            new FileAmountLimitValidator({ max: 1 }),
            new FileTypeValidator(['epub', 'pdf']),
            new FileSizeValidator({ maxFileSize: 536870912 /* 500mb */ }),
        ],
        onFilesSuccessfullySelected: async ({ plainFiles, filesContent }) => 
        {
            const bookFile = filesContent[0].content;

            if (plainFiles[0].type.includes("epub"))
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
                                return `data:image/${imageFormat};base64,${btoa(binaryCover)}`;
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
            else // .pdf
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
        }
    });

    async function fetchEpubData(zip: JSZip): Promise<{ title: string, author: string, publisher: string } | null> 
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

    function clearSelectedFile()
    {
        clear(); // Not sure if really necessary, but just in case.
        setBook(currBook => ({ 
            ...currBook, 
            ['title']: '', 
            ['author']: '',
            ['publisher']: '',
            ['attachment']: null ,
            ['cover']: null
        }));
    }

    useEffect(() => 
    {
        setLoading(loading ? 1 : 0);
    }, [loading]);

    if (loading) 
    {
        return (
            <div className = "file-selector">
                <i className = "book-form__saving--unselect">Loading...</i>
            </div>
        );
    }

    if (!book.attachment) 
    {
        return (
            <div className = "file-selector">
                <button 
                    type = "button" 
                    onClick = {() => openFilePicker()}
                    className = "file-selector__container"
                >
                    <AddFileIcon/>
                    {errors.length > 0 && (
                        <>
                            <p>Something went wrong:</p>
                            {errors.map((err, index) => (
                                <p key = {index}>{err.name}</p>
                            ))}
                        </>
                    )}
                    {errors.length == 0 && (
                        <p>Click to select a file</p>
                    )}
                </button>
            </div>
        )
    }

    return (
        <div style = {{position: 'relative'}} className = "file-selector">
            <ImageSelector
                setCoverImage = {
                    (image) => setBook(currBook => ({ ...currBook, ['cover']: image}))
                }
            />
            <button 
                type = "button"
                onClick = {() => clearSelectedFile()}
                className = "file-selector__button"
            >
                <DeleteIcon/>
            </button>
            {book.cover && (
                <button 
                    type = "button" 
                    onClick = {() => openFilePicker()}
                    className = "file-selector__container"
                    style = {{backgroundImage: `url(${book.cover})`}}
                />
            )}
            {!book.cover && (
                <button 
                    type = "button" 
                    onClick = {() => openFilePicker()}
                    className = "file-selector__container"
                >[NO IMAGE]</button>
            )}
        </div>
    );
}