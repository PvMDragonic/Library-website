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
    const [scrollMode, setScrollMode] = useState<number>(0);
    const [singlePage, setSinglePage] = useState<boolean>(true);
    const [scrolled, setScrolled] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<HTMLDivElement[] | null[]>([]);
    
    const scrollModeRef = useRef<number>(0);
    const numPagesRef = useRef<number>(0);

    useEffect(() => 
    {
        scrollModeRef.current = scrollMode;
    }, [scrollMode]);

    useEffect(() =>
    {
        numPagesRef.current = numPages;
    }, [numPages]);

    useEffect(() => 
    {
        const container = containerRef.current;
        if (!container) return;

        function handleWheel(event: WheelEvent)
        {
            const section = sectionRef.current;
            if (!section) return;

            switch(scrollModeRef.current)
            {
                case 0: // Regular scroll; no need to code.
                    break;

                case 1:
                {
                    event.preventDefault();

                    setPageNumber(prev => 
                    {
                        const scrollDown = event.deltaY > 0;
                        const nextPage = scrollDown ? prev + 1 : prev - 1;
                        const atLimit = nextPage === 0 || nextPage > numPagesRef.current;
            
                        return !atLimit ? nextPage : prev;
                    });
                    break;
                }

                case 2: // Scroll both up/down and pages.
                {
                    const atVeryTop = section.scrollTop === 0;
                    const atVeryBottom = section.scrollTop + section.clientHeight >= section.scrollHeight;
        
                    // If it's not at one of the ends, then behave as usual.
                    if (!atVeryTop && !atVeryBottom) return;

                    setPageNumber(currPage => 
                    {
                        if (atVeryTop && event.deltaY < 0)
                        {
                            const prevPage = currPage - 1;
                            if (prevPage > 0) 
                            {
                                setTimeout(() => section.scrollTop = section.scrollHeight, 50);
                                return prevPage;
                            }
                        }

                        if (atVeryBottom && event.deltaY > 0 && currPage < numPagesRef.current)
                            return currPage + 1;

                        return currPage;
                    });

                    break;
                }

                case 3: // Scroll to zoom in and out.
                {
                    event.preventDefault();

                    setScale(currScale =>
                    {
                        const nextScale = event.deltaY < 0 ? currScale + 0.1 : currScale - 0.1;
                        return nextScale > 0.5 && nextScale < 2.1 ? nextScale : currScale;
                    }); 
                    break;
                }
            }
        }
    
        // Needs to be handled this way instead of via 'onWheel' directly
        // on the container due to React events being passive, thus not
        // allowing 'event.preventDefault()' from disabling scroll.
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => container.removeEventListener('wheel', handleWheel);
    }, [containerRef.current]);

    const { hasScroll } = useHasScrollbar({ elementRef: sectionRef });

    function handleScroll()
    {
        const section = sectionRef.current;
        if (!section) return;

        const scrollTop = section.scrollTop;
        
        setScrolled(scrollTop > 0);
        
        if (singlePage) return;
        
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
                scrollMode = {scrollMode}
                singlePage = {singlePage}
                allPagesRef = {pageRefs}
                hasScroll = {hasScroll}
                sectionScrolled = {scrolled}
                documentRef = {sectionRef}
                setPageNumber = {setPageNumber}
                setScrollMode = {setScrollMode}
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