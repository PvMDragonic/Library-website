import { useEffect, useState } from "react";

interface IScrollable
{
    scrollingText: React.RefObject<HTMLSpanElement>;
    parentDiv: React.RefObject<HTMLDivElement>;
    offset?: number; // How much space on the right.
}

/**
 * Used to determine whether or not a given container's text is too big and should scroll (to display it all).
 * 
 * @param {IScrollable} props - The configuration object for the scrollable component.
 * @param {React.RefObject<HTMLSpanElement>} props.scrollingText - A reference to the text element that will scroll horizontally.
 * @param {React.RefObject<HTMLDivElement>} props.parentDiv - A reference to the parent container that limits the scrolling area.
 * @param {number} [props.offset=5] - Optional. Specifies the amount of space (in pixels) to leave on the right of the scrolling text.
 * 
 * @returns {Object} An object containing the scrolling state.
 * @returns {boolean} return.shouldScroll - Indicates whether the text should scroll (`true`) or not (`false`).
 */
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

    return { shouldScroll }
}