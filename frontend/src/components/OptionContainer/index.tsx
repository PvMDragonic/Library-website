import { useRef, useContext, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollable } from '../../hooks/useScrollable';
import { ColorModeContext } from '../ColorScheme';
import { isDarkColor } from '../../utils/color';
import { SearchType } from '../../pages/Home';
import { Capitalizer } from '../Capitalizer';

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

    const { t } = useTranslation();
    const { colorMode } = useContext(ColorModeContext);
    const { shouldScroll } = useScrollable({
        scrollingText: textRef,
        parentDiv: buttonRef
    });
    
    const colorStyle = { 
        '--option-text-hover-color': `${isDarkColor(color) ? '#FFFFFF' : '#000000'}`,
        '--option-bg-hover-color': `${color}` 
    }

    const textClass = shouldScroll 
        ? 'options-bar__option-label options-bar__option-label--scroll' 
        : 'options-bar__option-label';

    const actuallyEmpty = label === '';
    
    return (
        <button 
            ref = {buttonRef}
            type = "button"
            className = {`options-bar__option-button options-bar__option-button--${colorMode}`}
            onClick = {() => setSearch({ type: type, value: label })}
            style = {colorStyle as CSSProperties}
        >
            <span className = {textClass} ref = {textRef}>
                {actuallyEmpty ? (
                    <i>
                        <Capitalizer
                            text = {t('bookTypeUnknown')}
                        />
                    </i>
                ) : (
                    <Capitalizer
                        text = {label}
                    />
                )}  
            </span>
        </button>
    );
}