import { useRef, useEffect, useState, CSSProperties } from 'react';
import { isDarkColor } from '../../utils/color';
import { SearchType } from '../../pages/Home';

interface IOptionContainer
{
    type: string;
    color: string;
    label: string;
    setSearch: React.Dispatch<React.SetStateAction<SearchType>>;
}

export function OptionContainer({ type, label, color, setSearch }: IOptionContainer)
{
    const [textClass, setTextClass] = useState<string>();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    
    useEffect(() =>
    {
        const scrollingText = textRef.current;
        const button = buttonRef.current;

        if (!scrollingText || !button) 
            return;

        const resizeObserver = new ResizeObserver(() => 
        {
            const widthDiff = (scrollingText.offsetWidth - button.offsetWidth) + 10;
            const animDistance = widthDiff > 10 ? widthDiff * -1 : -10;
            const animDuration = animDistance * -3 / 10;
    
            scrollingText.style.setProperty('--scroll-duration', `${animDuration}s`);
            scrollingText.style.setProperty('--scroll-distance', `${animDistance}px`);
    
            setTextClass(
                scrollingText.offsetWidth > (button.offsetWidth - 5) 
                    ? 'options-bar__option-label' 
                    : ''
            );
        });

        resizeObserver.observe(button);

        return () => resizeObserver.disconnect();
    }, [buttonRef]);

    const colorStyle = { 
        '--option-text-hover-color': `${isDarkColor(color) ? '#FFFFFF' : '#000000'}`,
        '--option-bg-hover-color': `${color}` 
    }

    const actuallyEmpty = label === '';
    const correctedLabel = actuallyEmpty ? 'Unknown' : label;

    return (
        <button 
            ref = {buttonRef}
            type = "button"
            className = "options-bar__option-button"
            onClick = {() => setSearch({ type: type, value: label })}
            style = {colorStyle as CSSProperties}
        >
            <span className = {textClass} ref = {textRef}>
                {actuallyEmpty 
                    ? <i>{correctedLabel}</i> 
                    : correctedLabel
                }
            </span>
        </button>
    );
}