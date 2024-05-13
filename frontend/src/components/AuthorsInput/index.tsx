import { 
    Ref,
    forwardRef,
    useImperativeHandle, 
    useEffect, 
    useRef, 
    useState 
} from "react";
import { IAuthor, IBook } from "../BookCard";
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
    
    const authorButtonsRef = useRef<HTMLButtonElement[]>([]);
    const authorsOuterDivRef = useRef<HTMLDivElement>(null);
    const authorsInnerDivRef = useRef<HTMLDivElement>(null);
    const authorsInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

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
            const authors = authorString !== '' ? authorString.split(';') : [];

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

        const lowerCaseAuthors = authorString.toLowerCase();
        const typingName = lowerCaseAuthors.split(';').pop()?.trim();

        setFilteredAuthors(() => 
        {
            return registeredAuthors.filter(author => 
            {
                const lowerCaseLabel = author.label.toLowerCase().trim();
                const alreadyAdded = lowerCaseAuthors.includes(lowerCaseLabel);
                
                if (justClicked)
                    return !alreadyAdded;

                const containsCurrentlyTyping = lowerCaseLabel.includes(typingName || '');
                const alreadyTypped = typingName === lowerCaseLabel;

                return !alreadyAdded && containsCurrentlyTyping && !alreadyTypped;
            });
        });
    }, [justClicked, authorString]);

    useEffect(() => 
    {
        if (showInput)
        {
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
        // The splitting removes the incomplete name after the last semi-colon.
        const authors = justClicked ? mostRecent : authorString.split(';').slice(0, -1).join('; ');
        setAuthorString(authors ? `${authors}; ${author.label}` : author.label);
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
            className = "authors-input"
            onKeyDown = {(e) => handleOuterKeyPress(e)} 
            tabIndex = {0}
        >
            <div 
                ref = {authorsInnerDivRef}
                className = "authors-input__main-container" 
                onClick = {() => setShowInput(true)}
            >
                {book.authors.length > 0 && book.authors.map((author, index) => {
                    const trimAuthor = author.label.trim();
                    return trimAuthor && (
                        <XContainer
                            key = {trimAuthor + index}
                            text = {trimAuthor}
                            onClick = {(e) => removeAuthor(author, e)}
                        />
                    );
                })}
                {book.authors.length === 0 && (
                    <p>Separate authors by semi-colon.</p>
                )}
            </div>
            <div 
                ref = {wrapperRef}
                className = "authors-input__input-wrapper" 
                onKeyDown = {(e) => handleWrapperKeyDown(e)}
                style = {{ 
                    display: showInput ? 'flex' : 'none',
                    paddingRight: hasScroll ? '0rem' : '0.25rem' 
                }}
            >
                <label className = "dropdown__hide-label" htmlFor = "author">
                    Authors:
                </label>
                <input 
                    id = "author" 
                    type = "text"  
                    className = "book-form__input"
                    autoComplete = "off"
                    placeholder = "Separate authors by semi-colon."
                    onChange = {(e) => setAuthorString(e.target.value)} 
                    onKeyDown = {handleInputKeyPress}
                    value = {authorString}  
                    ref = {authorsInputRef}
                />
                {filteredAuthors.map((author, index) =>
                    <button 
                        type = 'button'
                        className = 'authors-input__author-button'
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