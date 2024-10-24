import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useScrollable } from "../../hooks/useScrollable";
import ArrowRightIcon from "../../assets/ArrowRightIcon";
import ArrowLeftIcon from "../../assets/ArrowLeftIcon";

interface IEpubOption
{
    title: string;
    text: string;
    disabledLeft?: boolean;
    disabledRight?: boolean;
    plus: () => void;
    minus: () => void;
}

export function EpubOption ({ title, text, disabledLeft, disabledRight, plus, minus }: IEpubOption)
{
    const parentDivRef = useRef<HTMLDivElement>(null);
    const scrollableText = useRef<HTMLParagraphElement>(null);

    const { shouldScroll } = useScrollable({
        scrollingText: scrollableText,
        parentDiv: parentDivRef,
        offset: -5
    });

    const { t } = useTranslation();

    return (
        <>
            <p>{title}</p>
            <div>
                <button 
                    title = {t('previousBtnTitle')}
                    className = "epub-settings__option-button"
                    onClick = {minus}
                    disabled = {disabledLeft}
                >
                    <ArrowLeftIcon/>    
                </button> 
                <div 
                    ref = {parentDivRef}
                    className = "epub-settings__scroll-wrapper"
                    // Needs the justifyContent only when not scrolling 
                    // because it messes the scroll distance calculation.
                    style = {{ ...(!shouldScroll && { justifyContent: 'center' }) }}
                >
                    <span
                        ref = {scrollableText}
                        className = {shouldScroll ? 'epub-settings__scrolling-text' : ''}
                    >
                        {text}   
                    </span> 
                </div> 
                <button 
                    title = {t('nextBtnTitle')}
                    className = "epub-settings__option-button"
                    onClick = {plus}
                    disabled = {disabledRight}
                >
                    <ArrowRightIcon/>
                </button>
            </div>
        </>
    )
}