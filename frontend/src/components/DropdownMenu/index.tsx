import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { isDarkColor } from '../../utils/color';
import { ColorPicker } from '../ColorPicker';
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
    const [toggleCase, setToggleCase] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchBarRef = useRef<HTMLInputElement>(null);
    const matchCaseRef = useRef<HTMLButtonElement>(null);

    // Called whenever a click happens inside the dropdown menu.
    useEffect(() => 
    {
        document.addEventListener('click', handleDocumentClick);

        return () => { document.removeEventListener('click', handleDocumentClick) };
    }, []);

    useEffect(() => 
    {
        setAvailableOptions(
            filterOptions([...addedTags, ...options])
        );
    }, [toggleCase, searchValue, addedTags, options]);

    useEffect(() => 
    {
        setErrorVisisble(
            [...addedTags, ...options].some(tag => tag.label === newTagValue.label)
        );
    }, [newTagValue]);

    function handleSearchEnterPress(event: KeyboardEvent<HTMLInputElement>)
    {
        if (event.key === 'Enter')
            event.preventDefault();
    }

    function matchCaseButton(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        setToggleCase(!toggleCase);
        event.preventDefault();
    }

    // Top 10 solutions in the history of coding. Fuck, I hate this (sometimes).
    function addTagButton(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        if (newTagValue.label !== '' && !errorVisible)
        {
            handleOptionToggle(newTagValue);
            setAddedTags((prevElements) => [newTagValue, ...prevElements]);
            setNewTagValue(emptyTag);
            setColorPicking(false);
        }

        // Prevents the button from submitting (which makes it go to the homescreen).
        event.preventDefault();
    }

    function colorSelectButton(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        setColorPicking(!colorPicking);
        event.preventDefault();
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

    function handleDocumentClick(event: MouseEvent)
    {
        // If the click event occurred outside the dropdown menu.
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) 
        {
            setColorPicking(false);
            setShowOptions(false);
            setErrorVisisble(false);
            setNewTagValue(emptyTag);
            setSearchValue('');
        }
    };

    function checkIncludedTag(option: ITag)
    {
        return includedTags.some(tag =>
            tag.id === option.id && tag.label === option.label
        )
    }

    function filterOptions(tags: ITag[])
    {
        const search = toggleCase ? searchValue : searchValue.toLowerCase();
        return search !== ''
            ? tags.filter(tag => 
                (toggleCase ? tag.label : tag.label.toLowerCase()).includes(search)
            )
            : tags;
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
                    <div style = {{ position: 'relative' }}>
                        <button
                            title = "Toggle case sensitivity"
                            className = 'dropdown__match-case-btn'
                            style = {{ opacity: toggleCase ? '100%' : '50%' }}
                            onClick = {(e) => matchCaseButton(e)}
                            ref = {matchCaseRef}
                        >
                            Aa
                        </button>
                        <label className = "dropdown__hide-label" htmlFor = "searchBar">Avaliable tags search bar</label>
                        <input
                            id = "searchBar"
                            className = 'dropdown__searchbar'
                            placeholder = "Search for tags"
                            value = {searchValue}
                            ref = {searchBarRef}
                            onChange = {(e) => setSearchValue(e.target.value)}
                            onKeyDown = {handleSearchEnterPress}
                            onBlur = {
                                // Prevents the search bar from losing focus when clicking
                                // on the match case button while the search bar is active.
                                (e) => e.relatedTarget == matchCaseRef.current 
                                    ? searchBarRef.current?.focus() 
                                    : null
                            }
                        />
                    </div>
                )}
                <div className = {!colorPicking ? 'dropdown__list' : ''}>
                    <div style = {{ position: 'relative' }}>
                        <button 
                            title = "Add new tag"
                            className = "dropdown__add-button"
                            onClick = {(e) => addTagButton(e)}
                        />
                        <button 
                            title = "Toggle color-picking interface"
                            className = "dropdown__color-select"
                            style = {{ background: newTagValue.color }}
                            onClick = {(e) => colorSelectButton(e)}
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
                                            checked = {filterOptions(includedTags).length === availableOptions.length} 
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