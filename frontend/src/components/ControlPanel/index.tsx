import ArrowLeftIcon from "../../assets/ArrowLeftIcon";
import ArrowRightIcon from "../../assets/ArrowRightIcon";
import LongStripIcon from "../../assets/LongStripIcon";
import SinglePageIcon from "../../assets/SinglePageIcon";
import ZoomInIcon from "../../assets/ZoomInIcon";
import ZoomOutIcon from "../../assets/ZoomOutIcon";

interface IControlPanel
{
    scale: number;
    numPages: number;
    pageNumber: number;
    singlePage: boolean;
    hasScroll: boolean;
    sectionScrolled: boolean;
    documentRef: React.RefObject<HTMLDivElement>;
    allPagesRef: React.RefObject<HTMLDivElement[] | null[]>;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    setSinglePage: React.Dispatch<React.SetStateAction<boolean>>;
    setScale: React.Dispatch<React.SetStateAction<number>>;
}

const OFFSET = 6 * parseFloat(getComputedStyle(document.documentElement).fontSize);

export function ControlPanel({ 
    scale, 
    numPages, 
    pageNumber, 
    singlePage, 
    allPagesRef, 
    documentRef,
    hasScroll, 
    sectionScrolled, 
    setPageNumber, 
    setScale, 
    setSinglePage 
}: IControlPanel) 
{
    function handlePageSelect(targetPage: number)
    {
        setPageNumber(prevPageNumber => 
        {
            const target = prevPageNumber + targetPage;
            
            if (!singlePage) 
            {
                const thisPageRef = allPagesRef.current?.[target - 1];
                const document = documentRef.current;
                if (!document || !thisPageRef) return target;

                thisPageRef.scrollIntoView();

                const scrollbarAtBottom = document.scrollHeight - (document.scrollTop + 0.5) <= document.clientHeight;

                if (!scrollbarAtBottom)
                    document.scrollBy({ top: -OFFSET }); // Compensates for the 4rem page padding-top.
            }

            return target;
        });
    }

    return (
        <div 
            className = "control-pannel"
            style = {{
                // Added dynamically because it'd clip the very top of the first 
                // page when the scrollbar is at the very top, which looked weird.
                ...(sectionScrolled && { boxShadow: '0rem 1rem 0.5rem rgb(255, 255, 255)' }),
                marginRight: hasScroll ? '3.5rem' : '2rem' 
            }}
        >
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
            <button
                type = "button"
                title = "Zoom in"
                className = "control-pannel__button"
                disabled = {scale >= 2.0}
                onClick = {() => setScale(scale + 0.1)}
            >
                <ZoomInIcon/>
            </button>
            <span>{(scale * 100).toFixed()}%</span>
            <button
                type = "button"
                title = "Zoom out"
                className = "control-pannel__button"
                disabled = {scale < 0.6}
                onClick = {() => setScale(scale - 0.1)}
            >
                <ZoomOutIcon/>
            </button>
            <button
                type = "button"
                title = {`Display mode — ${singlePage ? 'Single-page mode' : 'Long-strip mode'}`}
                className = "control-pannel__button"
                onClick = {() => setSinglePage(prev => !prev)}
            >
                {singlePage ? (
                    <SinglePageIcon/>
                ) : (
                    <LongStripIcon/>
                )}
            </button>
        </div>
    )
}