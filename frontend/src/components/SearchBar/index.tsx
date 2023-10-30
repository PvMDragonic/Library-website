import { useEffect, useRef, useState } from "react";
import WholeWordIcon from "../../assets/WholeWordIcon";
import ClearIcon from "../../assets/ClearIcon";

interface ISearchBar
{
    // Called when the input.label changes or toggleCase gets pressed.
    onChange: (
        searchValue: string, 
        toggleCase: boolean,
        wholeWord: boolean
    ) => void;
}

export function SearchBar({ onChange }: ISearchBar)
{
    const [search, setSearch] = useState<string>('');
    const [toggleCase, setToggleCase] = useState<boolean>(false);
    const [wholeWord, setWholeWord] = useState<boolean>(false);

    const searchBarRef = useRef<HTMLInputElement>(null);
    const matchCaseRef = useRef<HTMLButtonElement>(null);
    const wholeWordRef = useRef<HTMLButtonElement>(null);
    const clearSearchRef = useRef<HTMLButtonElement>(null);

    useEffect(() => 
    {
        onChange(search, toggleCase, wholeWord);
    }, [search, toggleCase, wholeWord]);

    function handleSearchEnterPress(event: React.KeyboardEvent<HTMLInputElement>)
    {
        if (event.key === 'Enter')
            event.preventDefault();
    }

    function handleInputBlur(event: React.FocusEvent<HTMLInputElement>)
    {
        // Keeps search bar focused when a button is clicked (if it was already focused).
        if (event.relatedTarget === matchCaseRef.current || 
            event.relatedTarget === wholeWordRef.current ||
            event.relatedTarget === clearSearchRef.current)
            searchBarRef.current?.focus();
    }

    return (
        <div className = "searchbar">
            {search !== '' && (
                <button 
                    type = "button"
                    title = "Clear search input"
                    className = 'searchbar__button searchbar__button--clear'
                    onClick = {() => setSearch('')}
                    ref = {clearSearchRef}
                >
                    <ClearIcon/>
                </button>
            )}
            <button 
                type = "button"
                title = "Toggle whole-word search"
                className = 'searchbar__button searchbar__button--whole-word'
                style = {{ opacity: wholeWord ? '100%' : '50%' }}
                onClick = {() => setWholeWord(previous => !previous)}
                ref = {wholeWordRef}
            >
                <WholeWordIcon/>
            </button>
            <button 
                type = "button"
                title = "Toggle case sensitivity"
                className = 'searchbar__button searchbar__button--toggle-case'
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