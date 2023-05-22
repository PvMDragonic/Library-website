import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { ITag } from '../BookCard';

const emptyTag = 
{
    id: -1,
    label: "",
    color: "#FF9999"
}

interface DropdownMenu 
{
    options: ITag[];
    includedTags: ITag[];
    setIncludedTags: React.Dispatch<React.SetStateAction<ITag[]>>
}

export function DropdownMenu({ options, includedTags, setIncludedTags }: DropdownMenu)
{
    const [addedTags, setAddedTags] = useState<ITag[]>([]);
    const [newTagValue, setNewTagValue] = useState<ITag>(emptyTag);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => 
    {
        document.addEventListener('click', handleDocumentClick);

        return () => { document.removeEventListener('click', handleDocumentClick) };
    }, []);

    function handleNewTagValue(event: KeyboardEvent<HTMLInputElement>)
    {
        if (event.key !== 'Enter')
            return;

        if (newTagValue.label === '')
        {
            event.preventDefault();
            return;
        }
        
        handleOptionToggle(newTagValue);
        setAddedTags((prevElements) => [newTagValue, ...prevElements]);
        setNewTagValue(emptyTag);

        // Makes so it wont trigger the 'required' property on the other fields.
        event.preventDefault();
    }

    function handleOptionToggle(option: ITag)
    {
        setIncludedTags((prevSelected) => 
        {
            return prevSelected.includes(option)
                ? prevSelected.filter(selected => selected !== option)
                : [...prevSelected, option];
        });
    };

    function handleSelectAllToggle()
    {
        setIncludedTags((prevSelected) => 
        {
            return prevSelected.length !== options.length + addedTags.length
                ? [...addedTags, ...options]
                : [];
        });
    };

    function handleDocumentClick(event: MouseEvent)
    {
        // If the click event occurred outside the dropdown menu.
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) 
            setShowOptions(false);
    };

    function checkIncludedTag(option: ITag)
    {
        return includedTags.some(tag =>
            tag.id === option.id && tag.label === option.label
        )
    }

    const combined = [...addedTags, ...options];

    return (
        <div 
            className = "dropdown" 
            onClick = {() => setShowOptions(true)}
            style = {{ cursor: !showOptions ? "pointer" : "auto" }} 
            ref = {dropdownRef}
        >
            <div 
                className = "dropdown__list-wrapper" 
                style = {{ display: showOptions ? "block" : "none" }}
            >
                <div className = "dropdown__list">
                    <input
                        placeholder = "New tag"
                        className = "dropdown__new-tag"
                        value = {newTagValue.label}
                        onChange = {(e) => setNewTagValue({ ...newTagValue, label: e.target.value })}
                        onKeyDown = {handleNewTagValue}
                    />
                    <div onClick = {handleSelectAllToggle}>
                        <input 
                            type = "checkbox" 
                            className = "dropdown__checkbox" 
                            checked = {includedTags.length === combined.length} 
                            readOnly 
                        />
                        <label>All</label>
                    </div>
                    <span className = "dropdown__separator-line" />
                    {combined.map((option, index) => (
                        <div
                            key = { index}
                            onClick = {() => handleOptionToggle(option)}
                        >
                            <input 
                                type = "checkbox" 
                                className = "dropdown__checkbox" 
                                checked = {checkIncludedTag(option)} 
                                readOnly 
                            />
                            <label>{option.label}</label>
                        </div>
                    ))}
                </div>
            </div>
            {includedTags.map((option, index) => (
                <span key = {index} className = "dropdown__option-text">
                    {option.label}
                    <span className = "dropdown__option-del" onClick = {() => handleOptionToggle(option)}>
                        🗙
                    </span>
                </span>
            ))}
        </div>
    );
};