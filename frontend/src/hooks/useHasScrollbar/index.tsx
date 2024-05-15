import { useEffect, useState } from "react";

interface IHasScrollbar
{
    elementRef: React.RefObject<HTMLElement>;
    altCompareRef?: React.RefObject<HTMLElement>;
}

/**
 * Determines whether or not a given element has a scrollbar or not.
 * 
 * @param {React.RefObject<HTMLElement>} elementRef - The main element to be observed and compared.
 * @param {React.RefObject<HTMLElement>} altCompareRef - (Optional) Alternative element to be used for height comparison.
 * @returns {{ hasScroll: boolean }} Whether or not the given element has a scrollbar.
 */
export function useHasScrollbar({ elementRef, altCompareRef }: IHasScrollbar): { hasScroll: boolean }
{
    const [hasScroll, setHasScroll] = useState<boolean>(false);

    useEffect(() =>
    {
        const element = elementRef.current;
        if (!element) return;

        const compareHeights = () =>
        {
            if (altCompareRef)
            {
                const altCompare = altCompareRef.current;
                if (!altCompare) return;

                setHasScroll(altCompare.scrollHeight > altCompare.clientHeight);
            }
            else
            {
                setHasScroll(element.scrollHeight > element.clientHeight);
            }
        }

        compareHeights();

        const resizeObserver = new ResizeObserver(compareHeights);

        resizeObserver.observe(element);

        return () => resizeObserver.disconnect();
    }, [elementRef.current, altCompareRef?.current])

    return { hasScroll };
}