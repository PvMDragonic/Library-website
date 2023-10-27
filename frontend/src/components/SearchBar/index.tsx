import { useEffect, useRef, useState } from "react";

interface ISearchBar
{
    // Called when the input.label changes or toggleCase gets pressed.
    onChange: (searchValue: string, toggleCase: boolean) => void;
}

export function SearchBar({ onChange }: ISearchBar)
{
    const [search, setSearch] = useState<string>('');
    const [toggleCase, setToggleCase] = useState<boolean>(false);

    const searchBarRef = useRef<HTMLInputElement>(null);
    const matchCaseRef = useRef<HTMLButtonElement>(null);

    useEffect(() => 
    {
        onChange(search, toggleCase);
    }, [search, toggleCase]);

    function handleSearchEnterPress(event: React.KeyboardEvent<HTMLInputElement>)
    {
        if (event.key === 'Enter')
            event.preventDefault();
    }

    function handleInputBlur(event: React.FocusEvent<HTMLInputElement>)
    {
        // Keeps search bar focused when button is clicked (if it was already focused).
        if (event.relatedTarget === matchCaseRef.current)
            searchBarRef.current?.focus();
    }

    return (
        <div className = "searchbar">
            <button 
                type = "button"
                title = "Toggle case sensitivity"
                className = 'searchbar__toggle-case'
                style = {{ opacity: toggleCase ? '100%' : '50%' }}
                onClick = {() => setToggleCase(previous => !previous)}
                ref = {matchCaseRef}
            >
                Aa
            </button>
            <label 
                className = "dropdown__hide-label" 
                htmlFor = "searchBar"
            >
                Search bar
            </label>
            <input
                type = "text"
                id = "searchBar"
                className = "searchbar__input"
                placeholder = "Search"
                onChange = {(e) => setSearch(e.target.value)}
                onKeyDown = {handleSearchEnterPress}
                onBlur = {(e) => handleInputBlur(e)}
                ref = {searchBarRef}
                value = {search}
            />
        </div>
    )
}