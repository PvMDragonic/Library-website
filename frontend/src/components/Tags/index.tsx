import { useState, useRef, useEffect } from 'react';
import { isDarkColor } from '../../utils/color';
import { ITag } from '../BookCard';

export function Tag({ label, color }: Omit<ITag, 'id'>)
{
    const [tooBig, setTooBig] = useState<string>('');
    const scrollingTextRef = useRef<HTMLSpanElement>(null);
    const parentDivRef = useRef<HTMLDivElement>(null);

    const isDark = isDarkColor(color) ? 'tag-container--dark' : 'tag-container--light';
    const divClassName = `tag-container ${isDark} tag-container${tooBig}`;
    const textClassName = `tag-container__text tag-container__text${tooBig}`;
    
    useEffect(() => 
    {
        const scrollingText = scrollingTextRef.current;

        return () => 
        {
            if (scrollingText)
                scrollingText.style.animationDuration = "0s"; 
        };
    }, []);

    useEffect(() => 
    {
        const scrollingText = scrollingTextRef.current;
        const parentDiv = parentDivRef.current;
        
        if (scrollingText && parentDiv) 
        {
            const widthDiff = (scrollingText.offsetWidth - parentDiv.offsetWidth) + 10;
            const animDistance = widthDiff > 10 ? widthDiff * -1 : -10;
            const animDuration = animDistance * -3 / 10;
        
            scrollingText.style.animationDuration = `${animDuration}s`;
            scrollingText.style.setProperty('--scroll-distance', `${animDistance}px`);
        }
      }, [label]);

    useEffect(() =>
    {
        const text = scrollingTextRef.current;
        const div = parentDivRef.current;
        
        if (text && div) 
        {    
            setTooBig(() =>
                text.offsetWidth > (div.offsetWidth - 5) 
                ? '--too-big' 
                : ''
            );
        }

    }, [label]);

    return (
        <div className = {divClassName} style = {{background: color}} ref = {parentDivRef}>
            <span className = {textClassName} ref = {scrollingTextRef}>
                {label}
            </span>
        </div>
    );
}