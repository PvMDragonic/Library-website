import { useRef, useEffect, useState } from 'react';
import { useScrollable } from '../../hooks/useScrollable';
import { SearchType } from '../../pages/Home';

interface ITitleContainer
{
    totalBooks: number
    searchOption: SearchType | undefined;
}

export function TitleContainer({ totalBooks, searchOption }: ITitleContainer)
{
    const parentDivRef = useRef<HTMLDivElement>(null);
    const titleTextRef = useRef<HTMLHeadingElement>(null);
    
    const { shouldScroll } = useScrollable({
        scrollingText: titleTextRef,
        parentDiv: parentDivRef
    });

    const textClass = shouldScroll 
        ? 'main-title__header main-title__header--scroll' 
        : 'main-title__header';

    return (
        <div className = "main-title">
            <div className = "main-title__header-container" ref = {parentDivRef}>
                <h1 className = {textClass} ref = {titleTextRef}>
                    {searchOption && searchOption.type !== '' ? (
                        searchOption.value === '' ? (
                            <span>
                                {searchOption.type}: <i>Unknown</i>
                            </span>
                        ) : (
                            `${searchOption.type}: "${searchOption.value}"`
                        )
                    ) : (
                        'My Books'
                    )}
                </h1>
            </div>
            <span className = "main-title__total-books">
                Total Books: {totalBooks}
            </span>
        </div>
        
    );
}