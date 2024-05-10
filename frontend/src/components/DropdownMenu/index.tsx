import { 
    Ref,
    forwardRef,
    useImperativeHandle, 
    useEffect, 
    useRef, 
    useState 
} from "react";
import { SearchBar, SearchBarHandle } from '../SearchBar';
import { isDarkColor } from '../../utils/color';
import { ColorPicker } from '../ColorPicker';
import { IBook, ITag } from '../BookCard';

const emptyTag = 
{
    id: -1,
    label: "",
    color: "#FF9999"
}

interface DropdownMenu 
{
    tags: ITag[];
    book: IBook; 
    setBook: React.Dispatch<React.SetStateAction<IBook>>;
}

export interface DropdownMenuHandle
{
    focus: () => void;
}

function DropdownMenuComponent({ tags, book, setBook }: DropdownMenu, ref: Ref<DropdownMenuHandle>)
{
    const [addedTags, setAddedTags] = useState<ITag[]>([]);
    const [availableOptions, setAvailableOptions] = useState<ITag[]>([]);
    const [newTagValue, setNewTagValue] = useState<ITag>(emptyTag);
    const [errorVisible, setErrorVisisble] = useState<boolean>(false);
    const [colorPicking, setColorPicking] = useState<boolean>(false);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listWrapperRef = useRef<HTMLDivElement>(null);
    const searchBarRef = useRef<SearchBarHandle>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            setShowOptions(true);
            // Has to wait for it to be rendered first before focusing.
            setTimeout(() => listWrapperRef.current?.focus(), 50);
        }
    }));

    // Called whenever a click happens inside the dropdown menu.
    useEffect(() => 
    {
        function handleDocumentClick(event: MouseEvent)
        {
            // If the click event occurred outside the search input element.
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) 
                closeDropdown();
        };

        document.addEventListener('click', handleDocumentClick);

        return () => { document.removeEventListener('click', handleDocumentClick) };
    }, []);

    useEffect(() => 
    {
        setAvailableOptions([...addedTags, ...tags]);
    }, [addedTags, tags]);

    useEffect(() => 
    {
        setErrorVisisble(
            [...addedTags, ...tags].some(tag => tag.label === newTagValue.label)
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
    function handleNewTagValue(event: React.KeyboardEvent<HTMLInputElement>)
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

        setBook((prevSelected) => 
        {
            const includedTags = checkIncludedTag(option)
                ? prevSelected.tags.filter(selected => selected.label !== option.label)
                : [...prevSelected.tags, option]
            return { ...prevSelected, ['tags']: includedTags }
        });
    }

    function handleSelectAllToggle()
    {
        setBook(prevSelected => 
        {
            // If all are selected, remove those; else, add ones not selected.
            const includedTags = availableOptions.every(tag => prevSelected.tags.some(option => option.id === tag.id))
                ? prevSelected.tags.filter(tag => !availableOptions.some(option => option.id === tag.id))  
                : [...prevSelected.tags, ...availableOptions.filter(
                    tag => !prevSelected.tags.some(option => option.id === tag.id)
                )]

            return { ...prevSelected, ['tags']: includedTags }
        });
    }

    function handleNavigation(event: React.KeyboardEvent)
    {
        if (event.key === 'Escape' && showOptions)
        {
            event.preventDefault();
            dropdownRef.current?.focus();
            closeDropdown();
        }

        if (event.key === 'Enter' && !showOptions)
        {
            event.preventDefault();
            setShowOptions(true);
            setTimeout(() => listWrapperRef.current?.focus(), 50);
        }
    }

    function closeDropdown()
    {
        setColorPicking(false);
        setShowOptions(false);
        setErrorVisisble(false);
        setNewTagValue(emptyTag);

        if (searchBarRef.current)
            searchBarRef.current.setSearch('');
    }

    function checkIncludedTag(option: ITag)
    {
        return book.tags.some(tag =>
            tag.id === option.id && tag.label === option.label
        )
    }

    function filterOptions(searchValue: string, toggleCase: boolean, wholeWord: boolean)
    {
        const combined = [...addedTags, ...tags];
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
            onKeyDown = {(e) => handleNavigation(e)}
            style = {{ cursor: !showOptions ? "pointer" : "auto" }} 
            ref = {dropdownRef}
            tabIndex = {0}
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
                ref = {listWrapperRef}
                tabIndex = {0}
            >
                {!colorPicking && (
                    <div className = "dropdown__searchbar-container">
                        <SearchBar
                            ref = {searchBarRef}
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
            {book.tags.map((option, index) => {
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

// Creates an optional custom ref for the component.
export const DropdownMenu = forwardRef(DropdownMenuComponent);