import { useEffect, useRef, useState } from "react";
import { lightReaderTheme, darkReaderTheme } from "../../components/EpubSettings/colorSchemes";
import { EpubSettings } from "../../components/EpubSettings";
import { ReactReader } from 'react-reader';
import { Rendition } from "epubjs";
import { IReader } from ".";

export function EpubReader({ updateProgress, attachment, progress, title, id }: IReader)
{
    const [currPage, setCurrPage] = useState<string | number>(0);
    const [epubUrl, setEpubUrl] = useState<ArrayBuffer | string>('');
    const [colorScheme, setColorScheme] = useState<'Light' | 'Dark'>('Light');

    const renditionRef = useRef<Rendition | undefined>(undefined);
    const progressSetRef = useRef<boolean>(false);

    useEffect(() => 
    {
        if (!attachment) return;

        async function base64ToBlob()
        {
            const byteCharacters = atob(attachment.split(',')[1]);
            const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/epub+zip' });

            return blob.arrayBuffer();
        };

        base64ToBlob().then(
            blob => setEpubUrl(blob)
        ); 
    }, [attachment]);

    function handleLocationChange(location: string)
    {
        // This gets called as the epub is loading,
        // so progress updating needs to be blocked.
        if (progressSetRef.current)
            updateProgress(location);
        
        setCurrPage(location);
    }

    function fixChapterSelect(rendition: Rendition)
    {
        const spine_get = rendition.book.spine.get.bind(rendition.book.spine);
        rendition.book.spine.get = (target: string) => 
        {
            let t = spine_get(target);

            // Fixes incomplete pathing.
            if (t == null && !target.includes('Text/'))
                return spine_get(`Text/${target}`);

            // Fixes incorrect relative pathing.
            if (t == null && target.startsWith("../")) 
                return spine_get(target.substring(3));

            return t;
        }
    }

    const containerClassName = `file-reader__epub-container file-reader__epub-container--${colorScheme}`;

    return (
        <>
            <EpubSettings
                identifier = {`${id}${title}`}
                colorScheme = {colorScheme}
                renditionRef = {renditionRef}
                setColorScheme = {setColorScheme}
            />
            <div className = {containerClassName}>
                <ReactReader
                    url = {epubUrl}
                    title = {title}
                    location = {currPage}
                    locationChanged = {(loc: string) => handleLocationChange(loc)}
                    readerStyles = {colorScheme === 'Light' ? lightReaderTheme : darkReaderTheme}
                    getRendition = {(rendition) => {
                        // All of this only runs after it finishes loading.
                        renditionRef.current = rendition;
                        progressSetRef.current = true;                
                        fixChapterSelect(rendition);
                        setCurrPage(progress);
                    }}
                    epubOptions = {{
                        allowPopups: true
                    }}
                />
            </div>
        </>
    )
}