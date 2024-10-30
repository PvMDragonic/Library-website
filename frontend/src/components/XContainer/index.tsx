import { useMemo, useEffect, useRef, useState } from "react";
import { useScrollable } from "../../hooks/useScrollable";
import { isDarkColor } from '../../utils/color';
import { Capitalizer } from "../Capitalizer";

interface IXContainer
{
    text: string;
    color?: string;
    limitSize?: boolean; 
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

const veryLightGrey = '#C2BCBC';

export function XContainer({ text, color, limitSize, onClick }: IXContainer)
{
    const [divClass, setDivClass] = useState<string>('');
    const [textClass, setTextClass] = useState<string>('');

    const parentDivRef = useRef<HTMLDivElement>(null);
    const scrollingTextRef = useRef<HTMLSpanElement>(null);

    const colorScheme = useMemo(() => (
        isDarkColor(color || veryLightGrey)
    ), [color]);

    const { shouldScroll } = useScrollable({
        scrollingText: scrollingTextRef,
        parentDiv: parentDivRef,
        offset: 20 // Account for the 'x' button.
    })

    useEffect(() =>
    {
        const willLimit = shouldScroll && limitSize;
        const textColorClass = `XContainer--${colorScheme ? 'white' : 'black'}`;
        const scrollClass = `XContainer--${willLimit ? 'too-big' : 'regular'}`;

        setDivClass(`XContainer ${textColorClass} ${scrollClass}`);
        setTextClass(`XContainer__text${willLimit ? ' XContainer__text--too-big' : ''}`);
    }, [shouldScroll, limitSize, color]);

    return (
        <div 
            ref = {parentDivRef}
            className = {divClass}
            style = {{ 
                backgroundColor: color || veryLightGrey,
                maxWidth: limitSize ? '8.5rem' : 'none'  
            }}
        >
            <span 
                ref = {scrollingTextRef}
                className = {textClass}
            >
                <Capitalizer 
                    text = {text}
                />
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