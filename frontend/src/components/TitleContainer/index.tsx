import { useRef, useEffect, useState } from 'react';
import { SearchType } from '../../pages/Home';

interface ITitleContainer
{
    totalBooks: number
    searchOption: SearchType | undefined;
}

export function TitleContainer({ totalBooks, searchOption }: ITitleContainer)
{
    const [parentDivSize, setParentDivSize] = useState<number>(0);
    const [textClass, setTextClass] = useState<string>();

    const parentDivRef = useRef<HTMLDivElement>(null);
    const titleTextRef = useRef<HTMLHeadingElement>(null);
    
    useEffect(() => 
    {
        const parentDiv = parentDivRef.current;
        if (!parentDiv) return;

        const resizeObserver = new ResizeObserver(
            () => setParentDivSize(parentDiv.offsetWidth)
        );
    
        resizeObserver.observe(parentDiv);

        return () => resizeObserver.unobserve(parentDiv);
    }, []);

    useEffect(() =>
    {
        const titleText = titleTextRef.current;
        if (!titleText) return;

        const widthDiff = (titleText.offsetWidth - parentDivSize) + 10;
        const animDistance = widthDiff > 10 ? widthDiff * -1 : -10;
        const animDuration = animDistance * -3 / 10;

        titleText.style.setProperty('--scroll-duration', `${animDuration}s`);
        titleText.style.setProperty('--scroll-distance', `${animDistance}px`);

        setTextClass(titleText.offsetWidth > (parentDivSize - 5) 
            ? 'main-title__header main-title__header--scroll' 
            : 'main-title__header'
        );
    }, [parentDivSize, searchOption]);

    return (
        <div className = "main-title">
            <div className = "main-title__header-container" ref = {parentDivRef}>
                {searchOption && searchOption.type !== '' ? (
                    <h1 className = {textClass} ref = {titleTextRef}>
                        {searchOption.value === '' ? (
                            <span>
                                {searchOption.type}: <i>Unknown</i>
                            </span>
                        ) : (
                            `${searchOption.type}: "${searchOption.value}"`
                        )}
                    </h1>
                ) : (
                    <h1 className = "main-title__header">
                        My Books
                    </h1>
                )}
            </div>
            <span className = "main-title__total-books">
                Total Books: {totalBooks}
            </span>
        </div>
        
    );
}