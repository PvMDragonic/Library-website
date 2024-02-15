import { useState, useRef, useEffect } from 'react';
import { isDarkColor } from '../../utils/color';
import { ITag } from '../BookCard';

type TagCard = Omit<ITag, 'id'> & 
{
    empty?: boolean; // Just in case the label is actually "<empty>".
    minWidth?: boolean; // Add minWidth during delete screen.
};

export function Tag({ label, color, empty, minWidth }: TagCard)
{
    const scrollingTextRef = useRef<HTMLSpanElement>(null);
    const parentDivRef = useRef<HTMLDivElement>(null);

    const [divClass, setDivClass] = useState<string>();
    const [textClass, setTextClass] = useState<string>();
    const [parentSize, setParentSize] = useState<number>();

    useEffect(() => 
    {
        const parentDiv = parentDivRef.current;
        if (parentDiv) 
        {
            // Watches the parentDiv size to ensure proper '--too-big' on 
            // initial load or when coming back from <DeleteAllTags> screen.
            const resizeObserver = new ResizeObserver(() => setParentSize(parentDiv.offsetWidth));
            resizeObserver.observe(parentDiv);
            return () => resizeObserver.disconnect();
        }
    }, []);

    useEffect(() => 
    {
        const scrollingText = scrollingTextRef.current;

        if (scrollingText && parentSize) 
        {
            const widthDiff = (scrollingText.offsetWidth - parentSize) + 10;
            const animDistance = widthDiff > 10 ? widthDiff * -1 : -10;
            const animDuration = animDistance * -3 / 10;
        
            scrollingText.style.setProperty('--scroll-duration', `${animDuration}s`);
            scrollingText.style.setProperty('--scroll-distance', `${animDistance}px`);

            const tooBig = scrollingText.offsetWidth > (parentSize - 5) ? '--too-big' : '';
            const isDark = isDarkColor(color) ? 'tag-container--dark' : 'tag-container--light';  
            const baseText = `tag-container__text tag-container__text${tooBig}`;  

            setTextClass(() => 
                empty ? `${baseText} tag-container__text--empty` : baseText
            );

            setDivClass(() => 
                `tag-container ${isDark} tag-container${tooBig}`
            );
        }
        // Running on 'label' ensures that --empty is added when the name input is first cleared.
        // Running on 'empty' ensures that --empty is added when label "<empty>" actually goes empty.
        // Running on 'color' updates the text color in real time, instead of only when the page reloads.
    }, [label, empty, color, parentSize]);

    function divStyle()
    {
        // It needs a minWidth to prevent glitching when the screen 
        // shrinks and there isn't enough space for the tag left.
        if (minWidth)
            return {
                background: color,
                minWidth: '2.75rem' // Anything below 2.75 makes it glitch aswell.
            }
        
        return {
            background: color
        }   
    }

    return (
        <div className = {divClass} style = {divStyle()} ref = {parentDivRef}>
            <span className = {textClass} ref = {scrollingTextRef}>
                {label}
            </span>
        </div>
    );
}