import { 
    useImperativeHandle, 
    useEffect, 
    useRef, 
    useState, 
    forwardRef, 
    useContext,
    Ref
} from "react";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../ColorScheme";
import WholeWordIcon from "../../assets/WholeWordIcon";
import ClearIcon from "../../assets/ClearIcon";

interface ISearchBar
{
    // Called when the input.label changes or toggleCase gets pressed.
    onChange: (
        searchValue: string, 
        toggleCase: boolean,
        wholeWord: boolean,
        enterPress?: boolean
    ) => void;
}

export interface SearchBarHandle 
{
    setSearch: (value: string) => void;
}

function SearchBarComponent({ onChange }: ISearchBar, ref: Ref<SearchBarHandle>)
{
    const [searchValue, setSearchValue] = useState<string>('');
    const [toggleCase, setToggleCase] = useState<boolean>(false);
    const [wholeWord, setWholeWord] = useState<boolean>(false);

    const searchBarRef = useRef<HTMLInputElement>(null);
    const matchCaseRef = useRef<HTMLButtonElement>(null);
    const wholeWordRef = useRef<HTMLButtonElement>(null);
    const clearSearchRef = useRef<HTMLButtonElement>(null);
    
    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();
    
    useImperativeHandle(ref, () => ({ setSearch: setSearchValue }));

    useEffect(() => 
    {
        onChange(searchValue, toggleCase, wholeWord);
    }, [searchValue, toggleCase, wholeWord]);

    function handleSearchEnterPress(event: React.KeyboardEvent<HTMLInputElement>)
    {
        if (event.key === 'Enter')
        {
            // Closes side-menu on <SearchBar> 'Enter' press when in full width.
            onChange(searchValue, toggleCase, wholeWord, true);
            event.preventDefault();
        }
    }

    function handleInputBlur(event: React.FocusEvent<HTMLInputElement>)
    {
        // Keeps search bar focused when a button is clicked (if it was already focused).
        if (event.relatedTarget === matchCaseRef.current || 
            event.relatedTarget === wholeWordRef.current ||
            event.relatedTarget === clearSearchRef.current)
            searchBarRef.current?.focus();
    }

    function handleClearInput(event: React.MouseEvent<HTMLButtonElement>)
    {
        // Clicking triggers 'handleDocumentClick()' on <DropdownMenu>.
        event.stopPropagation();
        setSearchValue('');
    }

    const buttonBaseClass = `searchbar__button searchbar__button--${colorMode}`;
    const clearButtonClass = `searchbar__button searchbar__button--clear searchbar__button--clear-${colorMode}`;

    return (
        <div className = "searchbar">
            {searchValue !== '' && (
                <button 
                    type = "button"
                    id = "clearSearchBtn"
                    title = {t('searchBarClearBtnTitle')}
                    className = {clearButtonClass}
                    onClick = {(e) => handleClearInput(e)}
                    ref = {clearSearchRef}
                >
                    <ClearIcon/>
                </button>
            )}
            <button 
                type = "button"
                id = "wholeWordBtn"
                title = {t('searchBarWholeWordBtnTitle')}
                className = {`${buttonBaseClass} searchbar__button--whole-word`}
                style = {{ opacity: wholeWord ? '100%' : '50%' }}
                onClick = {() => setWholeWord(previous => !previous)}
                ref = {wholeWordRef}
            >
                <WholeWordIcon/>
            </button>
            <button 
                type = "button"
                id = "caseSensitivityBtn"
                title = {t('searchBarToggleCaseBtnTitle')}
                className = {`${buttonBaseClass} searchbar__button--toggle-case`}
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
                {t('searchBarLabel')}
            </label>
            <input
                type = "text"
                id = "searchBar"
                className = {`searchbar__input searchbar__input--${colorMode}`}
                placeholder = {t('searchBarPlaceholder')}
                onChange = {(e) => setSearchValue(e.target.value)}
                onKeyDown = {handleSearchEnterPress}
                onBlur = {(e) => handleInputBlur(e)}
                value = {searchValue}
                ref = {searchBarRef}
            />
        </div>
    )
}

// This is to create an optional custom ref for the component.
export const SearchBar = forwardRef(SearchBarComponent);