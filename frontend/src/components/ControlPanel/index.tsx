import { useEffect, useMemo } from "react";
import ArrowLeftIcon from "../../assets/ArrowLeftIcon";
import ArrowRightIcon from "../../assets/ArrowRightIcon";
import LongStripIcon from "../../assets/LongStripIcon";
import SinglePageIcon from "../../assets/SinglePageIcon";
import ZoomInIcon from "../../assets/ZoomInIcon";
import ZoomOutIcon from "../../assets/ZoomOutIcon";
import MouseScrollVerticalIcon from "../../assets/MouseScrollVerticalIcon";
import MouseScrollPagesIcon from "../../assets/MouseScrollPagesIcon";
import MouseScrollBothIcon from "../../assets/MouseScrollBothIcon";
import MouseScrollZoomIcon from "../../assets/MouseScrollZoomIcon";

interface IControlPanel
{
    scale: number;
    numPages: number;
    pageNumber: number;
    scrollMode: number;
    singlePage: boolean;
    identifier: string;
    hasScroll: boolean;
    sectionScrolled: boolean;
    documentRef: React.RefObject<HTMLDivElement>;
    allPagesRef: React.RefObject<HTMLDivElement[] | null[]>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    setScrollMode: React.Dispatch<React.SetStateAction<number>>;
    setSinglePage: React.Dispatch<React.SetStateAction<boolean>>;
    setScale: React.Dispatch<React.SetStateAction<number>>;
}

const OFFSET = 6 * parseFloat(getComputedStyle(document.documentElement).fontSize);

export function ControlPanel({ 
    scale, 
    numPages, 
    pageNumber, 
    scrollMode,
    singlePage, 
    allPagesRef, 
    identifier,
    documentRef,
    hasScroll, 
    sectionScrolled, 
    setPageNumber, 
    setScrollMode,
    setScale, 
    setSinglePage 
}: IControlPanel) 
{
    const scrollButtons = useMemo(() => 
    [
        <MouseScrollVerticalIcon/>,
        <MouseScrollPagesIcon/>,
        <MouseScrollBothIcon/>,
        <MouseScrollZoomIcon/>
    ], []);

    const scrollDescriptions = 
    [
        'Scroll the page(s) up or down.',
        'Scroll from one page to another.',
        'Scroll up or down and between pages at top or bottom.',
        'Scroll to zoom a page in or out.'
    ];

    useEffect(() => 
    {
        if (!singlePage && pageNumber !== 1)
            // Needs a small delay for the page to finish loading.
            setTimeout(() => scrollToTarget(allPagesRef.current?.[pageNumber - 1]), 25);
            
        if (singlePage)
            // Going back to single-page causes the current page to jump to the last one, idk why.
            setTimeout(() => setPageNumber(pageNumber), 25);
    }, [singlePage]);

    function scrollToTarget(target: HTMLDivElement | null | undefined)
    {
        const document = documentRef.current;
        if (!document || !target) return;

        target.scrollIntoView();

        const scrollbarAtBottom = document.scrollHeight - (document.scrollTop + 0.5) <= document.clientHeight;

        if (!scrollbarAtBottom)
            document.scrollBy({ top: -OFFSET }); // Compensates for the 4rem page padding-top.
    }

    function handlePageSelect(targetPage: number)
    {
        setPageNumber(prevPageNumber => 
        {
            const target = prevPageNumber + targetPage;
            
            if (!singlePage) 
                scrollToTarget(allPagesRef.current?.[target - 1]);

            return target;
        });
    }

    function handleScale(increment: number)
    {
        setScale(prev => 
        {
            const newScale = prev + increment;

            localStorage.setItem(`library${identifier}PdfPageScale`, newScale.toString());

            return newScale;
        });    
    }

    function handlePageMode()
    {
        setSinglePage(prev => 
        {
            const newMode = !prev;

            if (!newMode && (scrollMode === 1 || scrollMode === 2)) // Scroll to change page or scroll both.
                setScrollMode(0); // Default behaviour.

            localStorage.setItem(`library${identifier}PdfPageMode`, JSON.stringify(newMode));

            return newMode;
        });
    }

    function handleScrollMode()
    {
        setScrollMode(curr => 
        {
            const newMode = singlePage
                ? curr < (scrollButtons.length - 1) ? curr + 1 : 0 // Chooses next or back to beginning.
                : curr === 0 ? 3 : 0; // Either default scroll or scroll to zoom.
            
            localStorage.setItem('libraryPdfScrollMode', newMode.toString());

            return newMode;
        });
    }

    return (
        <div 
            className = "control-pannel"
            style = {{
                // Added dynamically because it'd clip the very top of the first 
                // page when the scrollbar is at the very top, which looked weird.
                ...(sectionScrolled && { boxShadow: '0rem 1rem 0.5rem 0.05rem rgb(255, 255, 255)' }),
                marginRight: hasScroll ? '3.5rem' : '2rem' 
            }}
        >
            <div className = "control-pannel__container">
                <button
                    type = "button"
                    title = "Previous page"
                    className = "control-pannel__button"
                    disabled = {pageNumber <= 1}
                    onClick = {() => handlePageSelect(-1)}
                >
                    <ArrowLeftIcon/>
                </button>
                <span>
                    Page 
                    <input
                        type = "number"
                        name = "pageNumber"
                        className = "control-pannel__input"
                        onChange = {(e) => handlePageSelect(Number(e.target.value))}
                        value = {pageNumber}
                        max = {numPages || 1}
                        min = {1}
                    /> 
                    of {numPages}
                </span>
                <button
                    type = "button"
                    title = "Next page"
                    className = "control-pannel__button"
                    disabled = {pageNumber >= numPages}
                    onClick = {() => handlePageSelect(+1)}
                >
                    <ArrowRightIcon/>
                </button>
            </div>
            <div className = "control-pannel__container">
                <button
                    type = "button"
                    title = "Zoom in"
                    className = "control-pannel__button"
                    disabled = {scale >= 2.0}
                    onClick = {() => handleScale(0.1)}
                >
                    <ZoomInIcon/>
                </button>
                <span>{(scale * 100).toFixed()}%</span>
                <button
                    type = "button"
                    title = "Zoom out"
                    className = "control-pannel__button"
                    disabled = {scale < 0.6}
                    onClick = {() => handleScale(-0.1)}
                >
                    <ZoomOutIcon/>
                </button>
                <button
                    type = "button"
                    title = {`Display mode — ${singlePage ? 'Single-page mode' : 'Long-strip mode'}`}
                    className = "control-pannel__button"
                    onClick = {handlePageMode}
                >
                    {singlePage ? (
                        <SinglePageIcon/>
                    ) : (
                        <LongStripIcon/>
                    )}
                </button>
                <button
                    type = "button"
                    title = {`Scroll mode — ${scrollDescriptions[scrollMode]}`}
                    className = "control-pannel__button"
                    onClick = {handleScrollMode}
                >
                    {scrollButtons[scrollMode]}
                </button>
            </div>
        </div>
    )
}