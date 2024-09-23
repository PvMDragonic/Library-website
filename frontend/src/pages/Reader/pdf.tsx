import { useRef, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import { ControlPanel } from "../../components/ControlPanel";
import { IReader } from ".";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdf.worker.min.mjs',
    import.meta.url,
).toString();

export function PdfReader({ attachment }: IReader)
{
    const [scale, setScale] = useState<number>(1.0);
    const [numPages, setNumPages] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [singlePage, setSinglePage] = useState<boolean>(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<HTMLDivElement[] | null[]>([]);

    function loading()
    {
        return (
            <div className = "file-reader__loading">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div
            ref = {containerRef} 
            className = "file-reader__pdf-container"
        >
            <ControlPanel
                scale = {scale}
                numPages = {numPages}
                pageNumber = {pageNumber}
                singlePage = {singlePage}
                allPagesRef = {pageRefs}
                setPageNumber = {setPageNumber}
                setSinglePage = {setSinglePage}
                setScale = {setScale}
            />
            <Document 
                file = {attachment} 
                className = "file-reader__pdf-document"
                onLoadSuccess = {(pdf) => setNumPages(pdf.numPages)}
                loading = {loading}
            >
                {singlePage ? (
                    <Page 
                        scale = {scale}
                        pageNumber = {pageNumber}
                        className = "file-reader__pdf-page"
                        height = {containerRef.current?.clientHeight! * 0.85} 
                    />
                ) : (
                    Array.from(
                        new Array(numPages),
                        (_, index) => (
                            <div 
                                ref = {(element) => pageRefs.current[index] = element}
                                key = {`page_${index + 1}`}
                            >
                                <Page
                                    scale = {scale}
                                    pageNumber = {index + 1}
                                    className = "file-reader__pdf-page"
                                    height = {containerRef.current?.clientHeight! * 0.85} 
                                />
                                {index !== (numPages - 1) && (
                                    <div style = {{ height: '1.5rem' }}/>
                                )}
                            </div>
                        )
                    )
                )}
            </Document>
        </div>
    )
}