import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useScrollable } from '../../hooks/useScrollable';
import { isDarkColor } from '../../utils/color';
import { Capitalizer } from '../Capitalizer';
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

    const { t } = useTranslation();

    const { shouldScroll } = useScrollable({
        scrollingText: scrollingTextRef,
        parentDiv: parentDivRef
    });

    // It needs a minWidth to prevent glitching when the screen 
    // shrinks and there isn't enough space for the tag left.
    const divStyle = useMemo(() => ({
        background: color,
        minWidth: minWidth ? '2.75rem' : 'none' // Anything below 2.75 makes it glitch aswell.
    }), [minWidth, color]);

    useEffect(() => 
    {
        const colorClass = `tag-container--${isDarkColor(color) ? 'dark' : 'light'}`;
        const divScrollClass = shouldScroll ? ' tag-container--too-big' : '';
        setDivClass(`tag-container ${colorClass}${divScrollClass}`);

        const textScrollClass = shouldScroll ? ' tag-container__text--too-big' : '';
        const emptyClass = empty ? ' tag-container__text--empty' : '';
        setTextClass(`tag-container__text${textScrollClass}${emptyClass}`);
    }, [empty, color, shouldScroll]);

    
    return (
        <div 
            className = {divClass} 
            style = {divStyle} 
            ref = {parentDivRef}
        >
            <span 
                className = {textClass} 
                ref = {scrollingTextRef}
            >
                <Capitalizer 
                    text = {empty ? t('emptyTagLabel') : label}
                />
            </span>
        </div>
    );
}