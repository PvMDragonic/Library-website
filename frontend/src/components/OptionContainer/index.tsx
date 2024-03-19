import { useRef, useEffect, useState, CSSProperties } from 'react';
import { SearchType } from '../../pages/Home';

interface IOptionContainer
{
    type: string;
    label: string;
    color: string;
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
    
    return (
        <button 
            ref = {buttonRef}
            type = "button"
            className = "options-bar__option-button"
            onClick = {() => setSearch({ type: type, value: label })}
            style = {{ '--option-hover-color': `${color}` } as CSSProperties}
        >
            <span className = {textClass} ref = {textRef}>
                {label}
            </span>
        </button>
    );
}