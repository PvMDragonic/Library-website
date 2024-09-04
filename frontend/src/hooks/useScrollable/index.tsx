import { useEffect, useState } from "react";

interface IScrollable
{
    scrollingText: React.RefObject<HTMLSpanElement>;
    parentDiv: React.RefObject<HTMLDivElement | HTMLButtonElement>;
    offset?: number; // How much space on the right.
}

export function useScrollable({ scrollingText, parentDiv, offset = 5 }: IScrollable)
{
    const [shouldScroll, setShouldScroll] = useState<boolean>(false);

    useEffect(() => 
    {
        const parentRef = parentDiv.current;
        const textRef = scrollingText.current;
        if (!parentRef || !textRef) return;

        const resizeObserver = new ResizeObserver(() => 
        {
            const parentWidth = parentRef.offsetWidth;
            const textWidth = textRef.offsetWidth;

            const widthDiff = (textWidth - parentWidth) + 10;
            const tooBig = textWidth > (parentWidth - offset);

            if (tooBig)
            {
                const animDistance = (widthDiff * -1) - (offset - 5);
                const animDuration = animDistance * -3 / 10;
            
                textRef.style.setProperty('--scroll-duration', `${animDuration}s`);
                textRef.style.setProperty('--scroll-distance', `${animDistance}px`);
            }

            setShouldScroll(tooBig);
        });

        resizeObserver.observe(parentRef);
        resizeObserver.observe(textRef);

        return () => resizeObserver.disconnect();        
    }, []);

    return ({ shouldScroll })
}