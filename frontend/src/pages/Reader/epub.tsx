import { useEffect, useState } from "react";
import { ReactReader } from 'react-reader';
import { Rendition } from "epubjs";
import { IReader } from ".";

export function EpubReader({ attachment, title }: IReader)
{
    const [currPage, setCurrPage] = useState<string | number>(0);
    const [epubUrl, setEpubUrl] = useState<ArrayBuffer | string>('');

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
    }, [attachment])

    return (
        <ReactReader
            url = {epubUrl}
            title = {title}
            location = {currPage}
            locationChanged = {(loc: string) => setCurrPage(loc)}
            getRendition = {(rendition) => fixChapterSelect(rendition)}
        />
    )
}