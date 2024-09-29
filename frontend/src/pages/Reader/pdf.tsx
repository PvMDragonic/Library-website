import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import { ControlPanel } from "../../components/ControlPanel";
import { IReader } from ".";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useHasScrollbar } from "../../hooks/useHasScrollbar";

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
    const [scrolled, setScrolled] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<HTMLDivElement[] | null[]>([]);

    const { hasScroll } = useHasScrollbar({ elementRef: sectionRef });

    function handleScroll()
    {
        const section = sectionRef.current;
        if (!section) return;

        const scrollTop = section.scrollTop;
        
        setScrolled(scrollTop > 0);
        
        setPageNumber(() => 
        {
            // Hit the end before the last page pass the threshold.
            if (scrollTop + section.clientHeight >= section.scrollHeight)
                return numPages;   

            const pageHeight = pageRefs.current[0]?.clientHeight;
            const scrollDiff = scrollTop / pageHeight!;
            
            // The 0.02 is to jump to the next integer a bit earlier,
            // aligning perfectly as the next page finishes appearing.
            return Math.floor(scrollDiff + 0.02) + 1;
        });
    }

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
                hasScroll = {hasScroll}
                sectionScrolled = {scrolled}
                documentRef = {sectionRef}
                setPageNumber = {setPageNumber}
                setSinglePage = {setSinglePage}
                setScale = {setScale}
            />
            <section 
                ref = {sectionRef}
                onScroll = {handleScroll}
            >
                <Document 
                    file = {attachment} 
                    onLoadSuccess = {(pdf) => setNumPages(pdf.numPages)}
                    loading = {loading}
                >
                    {singlePage ? (
                        <div style = {{ paddingBottom: '1.5rem' }}>
                            <Page 
                                scale = {scale}
                                pageNumber = {pageNumber}
                                className = "file-reader__pdf-page"
                                height = {containerRef.current?.clientHeight! * 0.85} 
                            />
                        </div>
                    ) : (
                        Array.from(
                            new Array(numPages),
                            (_, index) => (
                                <div 
                                    ref = {(element) => pageRefs.current[index] = element}
                                    key = {`page_${index + 1}`}
                                    style = {{ paddingBottom: '1.5rem' }}
                                >
                                    <Page
                                        scale = {scale}
                                        pageNumber = {index + 1}
                                        className = "file-reader__pdf-page"
                                        height = {containerRef.current?.clientHeight! * 0.85} 
                                    />
                                </div>
                            )
                        )
                    )}
                </Document>
            </section>
        </div>
    )
}