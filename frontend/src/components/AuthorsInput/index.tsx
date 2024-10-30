import { 
    Ref,
    forwardRef,
    useImperativeHandle, 
    useEffect, 
    useRef, 
    useState, 
    useContext
} from "react";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../ColorScheme";
import { IAuthor, IBook } from "../BookCard";
import { useEnlarger } from "../../hooks/useEnlarger";
import { XContainer } from "../XContainer";
import { api } from "../../database/api";

interface IAuthorsInput
{
    book: IBook;
    setBook: React.Dispatch<React.SetStateAction<IBook>>;
    focusCallback: (e: React.KeyboardEvent) => void;
}

export interface AuthorsInputHandle
{
    focus: () => void;
}

function AuthorsInputComponent({ book, setBook, focusCallback }: IAuthorsInput, ref: Ref<AuthorsInputHandle>)
{
    const [registeredAuthors, setRegisteredAuthors] = useState<IAuthor[]>([]);
    const [filteredAuthors, setFilteredAuthors] = useState<IAuthor[]>([]);
    const [authorString, setAuthorString] = useState<string>('');
    const [mostRecent, setMostRecent] = useState<string>('');
    const [justClicked, setJustClicked] = useState<boolean>(false);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [hasScroll, setHasScroll] = useState<boolean>(false);
    const [caretPos, setCaretPos] = useState<number>(-1);
    
    const authorButtonsRef = useRef<HTMLButtonElement[]>([]);
    const authorsOuterDivRef = useRef<HTMLDivElement>(null);
    const authorsInnerDivRef = useRef<HTMLDivElement>(null);
    const authorsInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    const { limitSize } = useEnlarger({ 
        parentRef: authorsInnerDivRef
    }); 

    useImperativeHandle(ref, () => ({
        focus: () => {
            setShowInput(true);
            authorsInputRef.current?.focus();
        }
    }));

    useEffect(() => 
    {
        api.get('authors').then(response => 
            setRegisteredAuthors(response.data)
        ).catch(error => 
            console.log(`Error while retrieving authors: ${error}`)
        );
    }, []);

    // Called whenever a click happens inside the dropdown menu.
    useEffect(() => 
    {
        document.addEventListener('click', handleDocumentClick);

        return () => { document.removeEventListener('click', handleDocumentClick) };
    }, []);

    // Handles scroll inside the author's <div>.
    useEffect(() => 
    {
        function handleMouseEnter()
        {
            // Needs the passive to prevent a warning.
            authorsInnerDivRef.current?.addEventListener('wheel', scrollHorizontally, { passive: true });
        };
    
        function handleMouseLeave()
        {
            authorsInnerDivRef.current?.removeEventListener('wheel', scrollHorizontally);
        };
    
        function scrollHorizontally(event: any) 
        {
            const scrollableDiv = authorsInnerDivRef.current;
            if (!scrollableDiv) return;
            
            scrollableDiv.scrollLeft += event.deltaY;
        };
    
        const scrollableDiv = authorsInnerDivRef.current;
        if (!scrollableDiv) return;

        scrollableDiv.addEventListener('mouseenter', handleMouseEnter);
        scrollableDiv.addEventListener('mouseleave', handleMouseLeave);
    
        return () => 
        {
            scrollableDiv.removeEventListener('mouseenter', handleMouseEnter);
            scrollableDiv.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    //
    useEffect(() => 
    {
        if (book.authors.length > 0 && !showInput)
            setAuthorString(book.authors.map(author => author.label).join('; '));
    }, [book]);

    useEffect(() =>
    {
        if (!showInput)
        {
            // 'authorString' will be empty if manually erasing previously set author(s).
            const authors = authorString !== '' ? [...new Set(authorString.split(';'))] : [];
            
            setBook(currBooks => ({ 
                ...currBooks, 
                ['authors']: authors.map((author, index) => 
                    // The 'id' being set as the index doesn't matter, as it's not used anywhere.
                    ({ id: index, label: author.trim() } as IAuthor)) 
            }));
        }
    }, [showInput]);

    useEffect(() => 
    {
        // Initialize authorButtonsRef with empty array of correct length.
        authorButtonsRef.current = authorButtonsRef.current.slice(0, filteredAuthors.length);

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        setHasScroll(wrapper.scrollHeight > wrapper.clientHeight);
    }, [filteredAuthors]);

    useEffect(() => 
    {
        if (!showInput) return;

        setFilteredAuthors(() => 
        {
            const lcAllAuthors = authorString.toLowerCase();
            const firstPart = authorString.slice(0, caretPos);
            const secondPart = authorString.slice(caretPos);

            const lowerCaseAuthors = caretPos !== -1 
                ? firstPart.toLowerCase()
                : lcAllAuthors;

            const typingName = firstPart.endsWith(' ') 
                ? secondPart.split(';').shift()?.toLowerCase().trim()
                : lowerCaseAuthors.split(';').pop()?.trim();

            return registeredAuthors.filter(author => 
            {
                const lowerCaseLabel = author.label.toLowerCase().trim();
                const alreadyAdded = lcAllAuthors.includes(lowerCaseLabel);

                if (justClicked && caretPos === -1)
                    return !alreadyAdded;

                const containsCurrentlyTyping = lowerCaseLabel.includes(typingName || '');
                const alreadyTypped = typingName === lowerCaseLabel;

                return !alreadyAdded && containsCurrentlyTyping && !alreadyTypped;
            });
        });
    }, [justClicked, caretPos, authorString]);

    useEffect(() => 
    {
        if (showInput)
        {
            // 'handleCaretChanges()' doesn't get called when the <input> opens.
            setCaretPos(-1);
            authorsInputRef.current?.setSelectionRange(-1, -1);
            // Knows when the <AuthorsInput> was just clicked and a semi-colon is yet to be added.
            setJustClicked(true);
            // If an author gets added via 'addSelectedName()' without a semi-colon separating the previous author.
            setMostRecent(authorString);

        }
    }, [showInput]);

    useEffect(() => 
    {
        if (justClicked)
            setJustClicked(false);
    }, [authorString]);

    useEffect(() => authorsInputRef.current?.focus(), [showInput]);
    
    function handleDocumentClick(event: MouseEvent)
    {
        // If the click event occurred outside the search input element.
        const authorsContainer = authorsOuterDivRef.current;
        if (authorsContainer && !authorsContainer.contains(event.target as Node))
            setShowInput(false);
    };

    function handleCaretChanges()
    {
        const input = authorsInputRef.current;
        if (!input) return;

        const position = input.selectionStart!;
        const inputLength = input.value.length;
        setCaretPos(position !== inputLength ? position : -1);
    }

    function handleOuterKeyPress(event: React.KeyboardEvent<HTMLDivElement>)
    {
        if (event.key === 'Enter' && !showInput)
        {
            event.preventDefault();
            setShowInput(true);
            authorsInputRef.current?.focus();
        }
    }

    function handleWrapperKeyDown(event: React.KeyboardEvent<HTMLDivElement>)
    {
        // Prevents scrollbar from scrolling when pressing 'up' or 'down'.
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown')
            event.preventDefault()
    }

    function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>)
    {
        if (event.key === 'Enter' || event.key === 'Tab')
        {
            event.preventDefault();
            setShowInput(false);
            focusCallback(event);
            return;
        }

        if (event.key === 'Escape')
        {
            setShowInput(false);
            authorsOuterDivRef.current?.focus();
        }

        // Prevents errors if there's no auto-complete suggestions.
        const authorButtons = authorButtonsRef.current;
        if (!authorButtons.length) return;

        if (event.key === 'ArrowDown')
            authorButtons[0].focus();
        else if (event.key === 'ArrowUp')
            authorButtons[filteredAuthors.length - 1].focus();
    }

    function handleButtonNavigation(event: React.KeyboardEvent, index: number) 
    {
        const authorButtons = authorButtonsRef.current;
    
        if (event.key === 'ArrowUp')
        {
            const prevIndex = (index - 1 + authorButtons.length) % authorButtons.length;
            prevIndex === authorButtons.length - 1 
                ? authorsInputRef.current?.focus()
                : authorButtons[prevIndex].focus();
        }
        else if (event.key === 'ArrowDown')
        {
            const nextIndex = (index + 1) % authorButtons.length;
            nextIndex === 0 
                ? authorsInputRef.current?.focus()
                : authorButtons[nextIndex].focus();
        }
    }

    function addSelectedName(author: IAuthor)
    {  
        // Caret not at the end of the <input> field.
        if (caretPos !== -1)
        {
            // Splits at the caret position.
            const firstPart = authorString.slice(0, caretPos).split(';');
            const secondPart = authorString.slice(caretPos).split(';');
            
            const firstLenght = firstPart.length;

            // Split happened right after at a separation (semi-colon).
            if (firstLenght > 1 && firstPart[firstLenght - 1] === '')
            {
                // Simply adds the new name in-between the others.
                setAuthorString(
                    `${firstPart.join('; ')}${author.label}; ${secondPart.join('; ')}`
                );
            }
            else // Removes both parts of the name that was cut in half at the splitting. 
            {
                // Length 1 means that it was either the first or last author being changed and should be discarted entirely.
                const firstLeftover = firstPart.length > 1 ? firstPart.slice(0, -1).join('; ') : '';
                const secondLeftover = secondPart.length > 1 ? secondPart.slice(1).join('; ') : '';
    
                // Adds proper spacing and or semi-colon if/when needed.
                const formattedFirst = firstLeftover.endsWith(';') || firstLeftover === '' 
                    ? firstLeftover.endsWith(' ')
                        ? firstLeftover
                        : `${firstLeftover} ` 
                    : `${firstLeftover}; `;
                const formattedSecond = secondLeftover.startsWith(';') || secondLeftover === '' 
                    ? secondLeftover.startsWith(' ')
                        ? secondLeftover
                        : ` ${secondLeftover}` 
                    : `; ${secondLeftover}`;
                
                setAuthorString(`${formattedFirst}${author.label}${formattedSecond}`);
            }
        }
        else
        {
            const authors = justClicked ? mostRecent : authorString.split(';').slice(0, -1).join('; ');
            setAuthorString(authors 
                ? `${authors}; ${author.label}` 
                : author.label
            );
        }

        setShowInput(false);
        authorsOuterDivRef.current?.focus();
    }

    function removeAuthor(author: IAuthor, event: React.MouseEvent<HTMLSpanElement, MouseEvent>)
    {
        // Prevents the menu from opening when removing an author.
        event.stopPropagation(); 

        setAuthorString(currAuthorString =>
            currAuthorString
                .split(';')
                .map(name => name.trim())
                .filter(name => name != author.label.trim())
                .join('; ')
        );

        setBook(currBook => ({
            ...currBook,
            ['authors']: currBook.authors.filter(a => a.label.trim() != author.label.trim())
        }))
    }
    
    return ( 
        <div 
            ref = {authorsOuterDivRef}
            className = {`authors-input authors-input--${colorMode}`}
            onKeyDown = {(e) => handleOuterKeyPress(e)} 
            tabIndex = {0}
        >
            <div 
                ref = {authorsInnerDivRef}
                className = {`authors-input__container authors-input__container--${colorMode}`} 
                onClick = {() => setShowInput(true)}
            >
                {book.authors.map((author, index) => {
                    const trimAuthor = author.label.trim();
                    return trimAuthor && (
                        <XContainer
                            key = {trimAuthor + index}
                            text = {trimAuthor}
                            limitSize = {limitSize}
                            color = {colorMode === 'lm' ? '#40B7BF' : '#433D3D'}
                            onClick = {(e) => removeAuthor(author, e)}
                        />
                    );
                })}
                {book.authors.length === 0 && (
                    <p>{t('authorsPlaceholderText')}</p>
                )}
            </div>
            <div 
                ref = {wrapperRef}
                className = {`authors-input__input-wrapper authors-input__input-wrapper--${colorMode}`} 
                onKeyDown = {(e) => handleWrapperKeyDown(e)}
                style = {{ 
                    display: showInput ? 'flex' : 'none',
                    paddingRight: hasScroll ? '0rem' : '0.25rem' 
                }}
            >
                <label className = "dropdown__hide-label" htmlFor = "author">
                    {t('pluralAuthorsText')}
                </label>
                <input 
                    id = "author" 
                    type = "text"  
                    className = {`book-form__input book-form__input--${colorMode}`}
                    autoComplete = "off"
                    placeholder = "Separate authors by semi-colon."
                    onChange = {(e) => setAuthorString(e.target.value)} 
                    onKeyDown = {handleInputKeyPress}
                    onKeyUp = {handleCaretChanges}
                    onMouseUp = {handleCaretChanges}
                    value = {authorString}  
                    ref = {authorsInputRef}
                />
                {filteredAuthors.map((author, index) =>
                    <button 
                        type = 'button'
                        className = {`authors-input__author-button authors-input__author-button--${colorMode}`}
                        key = {author.id + author.label}
                        ref = {(el) => (authorButtonsRef.current[index] = el!)}
                        onClick = {() => addSelectedName(author)}
                        onKeyDown = {(e) => handleButtonNavigation(e, index)}
                    >
                        {author.label}
                    </button>
                )}
            </div>
        </div>
    )
}

// Creates an optional custom ref for the component.
export const AuthorsInput = forwardRef(AuthorsInputComponent);