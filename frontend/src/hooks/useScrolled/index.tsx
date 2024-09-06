import { useEffect, useState } from "react";

interface IScrolled
{
    element: React.RefObject<HTMLElement>;
}

/**
 * Used to tell if a given element's scrollbar has been scrolled to the end or not.
 * 
 * @param {React.RefObject<HTMLElement>} element - A React useRef pointing to the element to observe for scrolling. 
 * @return {{ scrolledBottom: boolean }} Whether or not the given element's scrollbar is at the end.
 */
export function useScrolled({ element }: IScrolled): { scrolledBottom: boolean }
{
    const [scrolledBottom, setScrolledBottom] = useState<boolean>(false);

    useEffect(() =>
    {
        const elem = element.current;
        if (!elem) return;

        const checkScroll = () =>
        {
            requestAnimationFrame(() => 
            {
                const { scrollTop, scrollHeight, clientHeight } = elem;
                setScrolledBottom(scrollTop + clientHeight >= scrollHeight);
            });
        }

        elem.addEventListener('scroll', checkScroll);
        const mutationObserver = new MutationObserver(checkScroll);
        const resizeObserver = new ResizeObserver(checkScroll);
        mutationObserver.observe(elem, { childList: true, subtree: true });
        resizeObserver.observe(elem);

        return () => 
        {
            elem.removeEventListener('scroll', checkScroll);
            mutationObserver.disconnect();
            resizeObserver.disconnect();
        };
    }, [element]);

    return { scrolledBottom };
}