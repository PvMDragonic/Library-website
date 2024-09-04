import { useEffect, useState } from "react";

interface IEnlarger
{
    parentRef: React.RefObject<HTMLDivElement>;
}

export function useEnlarger({ parentRef }: IEnlarger)
{
    const [limitSize, setLimitSize] = useState<boolean>(false);

    useEffect(() => 
    {
        const parent = parentRef.current;
        if (!parent) return;

        const currElements: { element: HTMLElement; width: number }[] = [];

        const mutationObserver = new MutationObserver((mutations: MutationRecord[]) =>
        {
            for (const mutation of mutations)
            {   
                // Need to calculate stuff on 'attributes' because CSS 
                // isn't loaded when 'mutation.addedNodes' is triggered.
                if (mutation.type === 'attributes')
                {
                    const element = mutation.target as HTMLElement;
                    if (!element.classList.contains('XContainer'))
                        continue;

                    if (currElements)
                    {
                        const elementIndex = currElements.findIndex(subArray => subArray.element === element);
                        if (elementIndex !== -1)
                            continue;
                    } 
                    
                    const width = parseFloat(getComputedStyle(element).width);
                    currElements.push({ element, width });
                }
                    
                if (mutation.type === 'childList' && mutation.removedNodes)
                {
                    // When removing the author's placeholder message.
                    if (!currElements) continue;

                    mutation.removedNodes.forEach(node => 
                    {
                        if (node.nodeType === Node.ELEMENT_NODE) 
                        {
                            const element = node as HTMLElement;

                            // The element doesn't exist anymore when it's deleted, so finding
                            // it's width from 'mutation.removedNodes' is impossible. The solution
                            // is to compare the elements themselves.
                            const index = currElements.findIndex(subArray => subArray.element === element);

                            if (index !== -1) 
                                currElements.splice(index, 1);
                        }
                    });
                }
            }

            if (currElements)
            {
                const totalWidth = currElements.reduce((sum, item) => sum + item.width, 0);
                setLimitSize(totalWidth >= parent.clientWidth);
            }
        });

        mutationObserver.observe(parent, { 
            childList: true,
            subtree: true, // Needed to trigger attributes when the children's CSS loads.
            attributes: true,
            attributeFilter: ['style', 'class'] 
        });

        return () => mutationObserver.disconnect();
    }, [parentRef]);

    return { limitSize };
}