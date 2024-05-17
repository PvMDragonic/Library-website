import { useMemo, useEffect, useRef, useState } from "react";
import { useScrollable } from "../../hooks/useScrollable";
import { isDarkColor } from "../../utils/color";

interface IXContainer
{
    text: string;
    color?: string;
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

const veryLightGrey = '#82D1D3';

export function XContainer({ text, color, onClick }: IXContainer)
{
    const [divClass, setDivClass] = useState<string>('');
    const [textClass, setTextClass] = useState<string>('');

    const parentDivRef = useRef<HTMLDivElement>(null);
    const scrollingTextRef = useRef<HTMLSpanElement>(null);

    const colorScheme = useMemo(() => (
        isDarkColor(color || veryLightGrey)
    ), []);

    const { shouldScroll } = useScrollable({
        scrollingText: scrollingTextRef,
        parentDiv: parentDivRef,
        offset: 20 // Account for the 'x' button.
    })

    useEffect(() =>
    {
        const colorClass = `XContainer--${colorScheme ? 'white' : 'black'}`;
        const scrollClass = `XContainer--${shouldScroll ? 'too-big' : 'regular'}`;
        setDivClass(`XContainer ${colorClass} ${scrollClass}`);
        setTextClass(`XContainer__text${shouldScroll ? ' XContainer__text--too-big' : ''}`);
    }, [shouldScroll]);

    return (
        <div 
            ref = {parentDivRef}
            className = {divClass}
            style = {{ backgroundColor: color || veryLightGrey }}
        >
            <span 
                ref = {scrollingTextRef}
                className = {textClass}
            >
                {text}
            </span>
            <span 
                className = {`XContainer__close XContainer__close--${colorScheme ? 'white' : 'black'}`}
                style = {{ backgroundColor: color || veryLightGrey }}
                onClick = {onClick}
            >
                🗙
            </span>
        </div>
    )
}