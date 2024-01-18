import { useEffect, useState } from "react";

interface IHasScrollbar
{
    elementRef: React.RefObject<HTMLElement>;
}

export function useHasScrollbar({ elementRef }: IHasScrollbar)
{
    const [hasScroll, setHasScroll] = useState<boolean>(false);

    useEffect(() =>
    {
        const element = elementRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(() =>
        {
            setHasScroll(
                element.scrollHeight > element.clientHeight
            );
        });

        resizeObserver.observe(element);

        return () => resizeObserver.disconnect();
    }, [elementRef.current])

    return { hasScroll };
}