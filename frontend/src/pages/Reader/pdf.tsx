import { Document, Page, pdfjs } from 'react-pdf';
import { useRef, useState } from "react";
import { IReader } from ".";
import ArrowLeftIcon from "../../assets/ArrowLeftIcon";
import ArrowRightIcon from "../../assets/ArrowRightIcon";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdf.worker.min.mjs',
    import.meta.url,
).toString();

export function PdfReader({ attachment }: IReader)
{
    const [numPages, setNumPages] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const pageRef = useRef<HTMLDivElement>(null);

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
            ref = {pageRef} 
            className = "file-reader__pdf-container"
        >
            <div className = "file-reader__control-pannel">
                <button
                    type = "button"
                    title = "Previous page"
                    disabled = {pageNumber <= 1}
                    onClick = {() => setPageNumber(prevPageNumber => prevPageNumber - 1)}
                >
                    <ArrowLeftIcon/>
                </button>
                <p>Page {pageNumber} of {numPages}</p>
                <button
                    type = "button"
                    title = "Next page"
                    disabled = {pageNumber >= numPages}
                    onClick = {() => setPageNumber(prevPageNumber => prevPageNumber + 1)}
                >
                    <ArrowRightIcon/>
                </button>
            </div>
            <Document 
                file = {attachment} 
                onLoadSuccess = {(pdf) => setNumPages(pdf.numPages)}
                loading = {loading}
            >
                <Page 
                    pageNumber = {pageNumber}
                    className = "file-reader__pdf-page"
                    height = {pageRef.current?.clientHeight! * 0.85} 
                />
            </Document>
        </div>
    )
}