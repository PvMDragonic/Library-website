import { useRef, CSSProperties } from 'react';
import { useScrollable } from '../../hooks/useScrollable';
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
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const { shouldScroll } = useScrollable({
        scrollingText: textRef,
        parentDiv: buttonRef
    });

    const colorStyle = { 
        '--option-text-hover-color': `${isDarkColor(color) ? '#FFFFFF' : '#000000'}`,
        '--option-bg-hover-color': `${color}` 
    }

    const textClass = shouldScroll ? 'options-bar__option-label' : '';

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