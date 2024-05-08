import { useEffect, useRef, useState } from "react";
import { IAuthor, IBook } from "../BookCard";
import { XContainer } from "../XContainer";
import { api } from "../../database/api";

interface IAuthorsInput
{
    book: IBook;
    setBook: React.Dispatch<React.SetStateAction<IBook>>;
}

export function AuthorsInput({ book, setBook }: IAuthorsInput)
{
    const [registeredAuthors, setRegisteredAuthors] = useState<IAuthor[]>([]);
    const [filteredAuthors, setFilteredAuthors] = useState<IAuthor[]>([]);
    const [authorString, setAuthorString] = useState<string>('');
    const [showInput, setShowInput] = useState<boolean>(false);
    const [hasScroll, setHasScroll] = useState<boolean>(false);
    
    const authorsOuterDivRef = useRef<HTMLDivElement>(null);
    const authorsInnerDivRef = useRef<HTMLDivElement>(null);
    const authorsInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

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
            const authors = authorString.split(';');

            setBook(currBooks => ({ 
                ...currBooks, 
                ['authors']: authors[0] !== ''
                    ? authors.map((author, index) =>
                        // The 'id' being set as the index doesn't matter, as it's not used anywhere.
                        ({ id: index, label: author.trim() } as IAuthor))
                    : []
            }));
        }
    }, [showInput]);

    useEffect(() => 
    {
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
                return !lowerCaseAuthors.includes(lowerCaseLabel) &&
                    lowerCaseLabel.includes(typingName || '') && 
                    typingName != lowerCaseLabel;
            });
        });
    }, [showInput, authorString]);

    useEffect(() => authorsInputRef.current?.focus(), [showInput]);
    
    function handleDocumentClick(event: MouseEvent)
    {
        // If the click event occurred outside the search input element.
        const authorsContainer = authorsOuterDivRef.current;
        if (authorsContainer && !authorsContainer.contains(event.target as Node))
            setShowInput(false);
    };

    function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>)
    {
        if (event.key === 'Enter')
        {
            event.preventDefault();
            setShowInput(false);
        }
    }

    function addSelectedName(author: IAuthor)
    {   
        // Removes whatever after the last semi-colon (the incomplete author name).
        const authors = authorString.split(';').slice(0, -1);

        setAuthorString(authors.length > 0 
            ? `${authors.join('; ')}; ${author.label}` 
            : author.label
        );

        setShowInput(false);
    }

    function removeAuthor(author: IAuthor, event: React.MouseEvent<HTMLSpanElement, MouseEvent>)
    {
        // Prevents the menu from opening when removing the name.
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
                        onClick = {() => addSelectedName(author)}
                    >
                        {author.label}
                    </button>
                )}
            </div>
        </div>
    )
}