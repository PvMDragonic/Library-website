import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { isDarkColor } from '../../utils/color';
import { ColorPicker } from '../ColorPicker';
import { SearchBar } from '../SearchBar';
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
    const [availableOptions, setAvailableOptions] = useState<ITag[]>([]);
    const [newTagValue, setNewTagValue] = useState<ITag>(emptyTag);
    const [errorVisible, setErrorVisisble] = useState<boolean>(false);
    const [colorPicking, setColorPicking] = useState<boolean>(false);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Called whenever a click happens inside the dropdown menu.
    useEffect(() => 
    {
        function handleDocumentClick(event: MouseEvent)
        {
            // If the click event occurred outside the search input element.
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) 
            {
                setColorPicking(false);
                setShowOptions(false);
                setErrorVisisble(false);
                setNewTagValue(emptyTag);
            }
        };

        document.addEventListener('click', handleDocumentClick);

        return () => { document.removeEventListener('click', handleDocumentClick) };
    }, []);

    useEffect(() => 
    {
        setAvailableOptions([...addedTags, ...options]);
    }, [addedTags, options]);

    useEffect(() => 
    {
        setErrorVisisble(
            [...addedTags, ...options].some(tag => tag.label === newTagValue.label)
        );
    }, [newTagValue]);

    // Top 10 solutions in the history of coding. Fuck, I hate this (sometimes).
    function addTagButton()
    {
        if (newTagValue.label !== '' && !errorVisible)
        {
            handleOptionToggle(newTagValue);
            setAddedTags((prevElements) => [newTagValue, ...prevElements]);
            setNewTagValue(emptyTag);
            setColorPicking(false);
        }
    }

    // Can't be used for the add button cuz of different event.
    function handleNewTagValue(event: KeyboardEvent<HTMLInputElement>)
    {
        if (event.key !== 'Enter')
            return;

        if (newTagValue.label === '' || errorVisible)
        {
            event.preventDefault();
            return;
        }

        handleOptionToggle(newTagValue);
        setAddedTags((prevElements) => [newTagValue, ...prevElements]);
        setNewTagValue(emptyTag);
        setColorPicking(false);
        
        // Makes so it wont trigger the 'required' property on the other fields.
        event.preventDefault();
    }

    function handleOptionToggle(option: ITag, event?: React.MouseEvent)
    {
        // Prevents the menu from opening when a tag is removed.
        if (event) event.stopPropagation();

        setIncludedTags((prevSelected) => 
        {
            return checkIncludedTag(option)
                ? prevSelected.filter(selected => selected.label !== option.label)
                : [...prevSelected, option];
        });
    };

    function handleSelectAllToggle()
    {
        setIncludedTags((prevSelected) => 
        {
            // If all are selected, remove those; else, add ones not selected.
            return availableOptions.every(tag => includedTags.some(option => option.id === tag.id))
                ? prevSelected.filter(tag => !availableOptions.some(option => option.id === tag.id))  
                : [...prevSelected, ...availableOptions.filter(tag => !prevSelected.some(option => option.id === tag.id))] 
        });
    };
    
    function checkIncludedTag(option: ITag)
    {
        return includedTags.some(tag =>
            tag.id === option.id && tag.label === option.label
        )
    }

    function filterOptions(searchValue: string, toggleCase: boolean, wholeWord: boolean)
    {
        const combined = [...addedTags, ...options];
        const search = toggleCase ? searchValue : searchValue.toLowerCase();

        setAvailableOptions(
            search === ''
                ? combined
                : combined.filter(tag => {
                    const label = toggleCase ? tag.label : tag.label.toLowerCase();
                    return wholeWord ? label === search : label.includes(search);
                })
        );
    }
    
    return (
        <div 
            className = "dropdown" 
            onClick = {() => setShowOptions(true)}
            style = {{ cursor: !showOptions ? "pointer" : "auto" }} 
            ref = {dropdownRef}
        >
            <p 
                className = "dropdown__error-message"
                style = {{ 
                    display: errorVisible ? 'block' : 'none',
                    top: colorPicking ? '0.45rem' : '3.15rem' 
                }}
            >
                This tag already exists!
            </p>
            <div 
                className = "dropdown__list-wrapper" 
                style = {{ display: showOptions ? "block" : "none" }}
            >
                {!colorPicking && (
                    <div className = "dropdown__searchbar-container">
                        <SearchBar
                            onChange = {filterOptions}
                        />
                    </div>
                )}
                <div className = {!colorPicking ? 'dropdown__list' : ''}>
                    <div style = {{ position: 'relative' }}>
                        <button 
                            type = "button" 
                            title = "Add new tag"
                            className = "dropdown__add-button"
                            onClick = {() => addTagButton()}
                        />
                        <button
                            type = "button"
                            title = "Toggle color-picking interface" 
                            className = "dropdown__color-select"
                            style = {{ background: newTagValue.color }}
                            onClick = {() => setColorPicking(!colorPicking)}
                        />
                        <label className = "dropdown__hide-label" htmlFor = "newTagInput">New tag input field</label>
                        <input
                            id = "newTagInput"
                            placeholder = "New tag"
                            className = "dropdown__new-tag"
                            value = {newTagValue.label}
                            onChange = {(e) => setNewTagValue({ ...newTagValue, label: e.target.value })}
                            onKeyDown = {handleNewTagValue}
                        />
                    </div>
                    {colorPicking && (
                        <ColorPicker
                            tag = {newTagValue}
                            setTag = {(value) => setNewTagValue({ ...newTagValue, color: value })}
                        />
                    )}
                    {!colorPicking && (
                        <>
                            {availableOptions.length > 0 && (
                                <>
                                    <div onClick = {handleSelectAllToggle}>
                                        <input 
                                            id = "selectAll"
                                            type = "checkbox" 
                                            className = "dropdown__checkbox"
                                            checked = {availableOptions.every(tag => checkIncludedTag(tag))} 
                                            readOnly 
                                        />
                                        <label htmlFor = "selectAll">Select all</label>
                                    </div>
                                    <span className = "dropdown__separator-line"/>
                                    {availableOptions.map((option, index) => (
                                        <div key = {index} onClick = {() => handleOptionToggle(option)}>
                                            <input 
                                                id = {"tag" + option.label}
                                                type = "checkbox" 
                                                className = "dropdown__checkbox" 
                                                checked = {checkIncludedTag(option)} 
                                                readOnly 
                                            />
                                            <label 
                                                htmlFor = {"tag" + option.label}
                                                onClick = {(e) => e.stopPropagation()}
                                            >
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </>
                            )}
                            {availableOptions.length === 0 && (
                                <p className = "dropdown__no-tags">No tags available!</p>
                            )}
                        </>
                    )}
                </div>
            </div>
            {includedTags.map((option, index) => {
                const tagColor = isDarkColor(option.color);
                return (
                    <span 
                        key = {index} 
                        className = {`dropdown__option-text ${tagColor 
                            ? 'dropdown__option-text--dark' 
                            : 'dropdown__option-text--light'}`}
                        style = {{background: option.color}}
                    >
                        {option.label}
                        <span 
                            className = {`dropdown__option-del ${tagColor 
                                ? 'dropdown__option-del--dark' 
                                : 'dropdown__option-del--light'}`} 
                            onClick = {(e) => handleOptionToggle(option, e)}
                        >
                            🗙
                        </span>
                    </span>
                )
            })}
        </div>
    );
};