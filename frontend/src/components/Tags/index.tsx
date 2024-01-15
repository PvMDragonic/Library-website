import { useState, useRef, useEffect } from 'react';
import { isDarkColor } from '../../utils/color';
import { ITag } from '../BookCard';

export function Tag({ label, color }: Omit<ITag, 'id'>)
{
    const scrollingTextRef = useRef<HTMLSpanElement>(null);
    const parentDivRef = useRef<HTMLDivElement>(null);

    const [divClass, setDivClass] = useState<string>();
    const [textClass, setTextClass] = useState<string>();
    
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

            const tooBig = scrollingText.offsetWidth > (parentDiv.offsetWidth - 5) ? '--too-big' : '';
            const isDark = isDarkColor(color) ? 'tag-container--dark' : 'tag-container--light';  
            const baseText = `tag-container__text tag-container__text${tooBig}`;  

            setTextClass(() => 
                label == '<empty>' ? `${baseText} tag-container__text--empty` : baseText
            );

            setDivClass(() => 
                `tag-container ${isDark} tag-container${tooBig}`
            );
        }
        // Running on 'offsetWidth' prevents incorrect --too-big during page load;
        // Running on 'label' ensures that --empty is added when the name input is first cleared.
    }, [label, scrollingTextRef.current?.offsetWidth]);

    return (
        <div className = {divClass} style = {{background: color}} ref = {parentDivRef}>
            <span className = {textClass} ref = {scrollingTextRef}>
                {label}
            </span>
        </div>
    );
}