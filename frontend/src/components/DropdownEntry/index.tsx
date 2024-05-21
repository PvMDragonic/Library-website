import { useRef } from "react";
import { useScrollable } from "../../hooks/useScrollable";

interface IDropdownEntry
{
    optLabel: string;
    checked: boolean;
    onClick: () => void;
}

export function DropdownEntry({ optLabel, checked, onClick }: IDropdownEntry)
{
    const parentDivRef = useRef<HTMLDivElement>(null);
    const scrollingTextRef = useRef<HTMLSpanElement>(null);

    const { shouldScroll } = useScrollable({
        scrollingText: scrollingTextRef,
        parentDiv: parentDivRef,
        offset: 20
    });

    return (
        <div 
            ref = {parentDivRef}
            onClick = {onClick}
        >
            <div className = "dropdown__checkbox">
                <input 
                    id = {"tag" + optLabel}
                    type = "checkbox" 
                    checked = {checked} 
                    readOnly 
                />
            </div>
            <label 
                htmlFor = {"tag" + optLabel}
                onClick = {(e) => e.stopPropagation()}
            >
                <span 
                    ref = {scrollingTextRef}
                    className = {shouldScroll ? 'dropdown__scrolling-text' : ''}
                >
                    {optLabel}
                </span>
            </label>
        </div>
    )
}