import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useContext } from "react";
import { AuthorsInput, AuthorsInputHandle } from "../AuthorsInput";
import { FileSelector, FileSelectorHandle } from "../FileSelector";
import { DropdownMenu, DropdownMenuHandle } from "../DropdownMenu";
import { ColorModeContext } from "../../components/ColorScheme";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";
import { useMobileLayout } from "../../hooks/useMobileLayout";
import { IBook, ITag } from "../../components/BookCard";
import { NavBar } from "../../components/NavBar";
import { api } from "../../database/api";

interface IBookForm
{
    header: React.ReactNode;
    delMsg?: boolean;
    book: IBook;
    setBook: React.Dispatch<React.SetStateAction<IBook>>;
    saveBook: () => Promise<void>;
}

export function BookForm({ header, delMsg, book, setBook, saveBook }: IBookForm)
{
    const [tags, setTags] = useState<ITag[]>([]);
    const [loading, setLoading] = useState<number>(0);

    const mainBodyRef = useRef<HTMLDivElement>(null);
    const bookFormRef = useRef<HTMLFormElement>(null);
    const elementsRef = [
        useRef<HTMLInputElement>(null), // titleInputRef
        useRef<AuthorsInputHandle>(null), // authorsInputRef
        useRef<HTMLInputElement>(null),  // publisherRef
        useRef<HTMLInputElement>(null),  // releaseRef
        useRef<FileSelectorHandle>(null), // fileSelectorRef
        useRef<DropdownMenuHandle>(null)  // dropdownMenuRef
    ] as const;

    const { colorMode } = useContext(ColorModeContext);
    const { hasScroll } = useHasScrollbar({ elementRef: bookFormRef });
    const { mobileLayout } = useMobileLayout({ widthMark: 675 });
    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => 
    {
        api.get(`tags`)
            .then(
                response => setTags(response.data)
            )
            .catch(
                error => console.log(`Error while retrieving tags: ${error}`)
            );
    }, []);

    function handleKeyPress(event: React.KeyboardEvent, index: number)
    {
        if (event.key !== 'Enter' && event.key !== 'Tab')
            return;

        // The default needs to go throught for 'Enter' on <FileSelector>.
        if (event.key === 'Tab' || (event.key === 'Enter' && index !== 4))
            event.preventDefault();

        elementsRef[index].current?.focus();
    }

    function bookReleaseValue()
    {
        // It's a Date object if the data came from a file's metadata.
        if (book.release instanceof Date)
            return book.release?.toISOString().split('T')[0];
    
        // Otherwise, it's a string if set directly via the <input> or from the database.
        if (typeof book.release === "string")
            return String(book.release).split('T')[0];

        // Prevents error about changing from uncontrolled (undefined) to controlled state.
        return '';
    }

    function editBook(event: React.ChangeEvent<HTMLInputElement>) 
    {
        const { name, value } = event.target;
        setBook({ ...book, [name]: value });
    }

    async function handleSaveBook(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault();

        try
        {
            setLoading(2);
            await saveBook();
            navigate('/');
        }
        catch (error) 
        {
            console.log('Error saving book:', error);
            setLoading(0);
        }
    }
    
    return (
        <>
            <NavBar
                mobile = {mobileLayout}
                mainBodyRef = {mainBodyRef}
            />
            <div className = {`book-form book-form--${colorMode}`}>
                <h2 
                    className = {`book-form__saving book-form__saving--${colorMode}`}
                    style = {{display: loading == 2 ? 'flex' : 'none'}}
                >
                    {t('savingText')}...
                </h2>
                <form 
                    ref = {bookFormRef} 
                    className = {`book-form__form book-form__form--${colorMode}`}
                    onSubmit = {handleSaveBook} 
                    style = {{
                        paddingRight: hasScroll ? '0.75rem' : '1.5rem',
                        pointerEvents: loading != 0 ? 'none' : 'all',
                        opacity: loading != 0 ? '50%' : '100%',
                        position: 'relative'
                    }}
                >
                    {header}
                    {!delMsg && (
                        <>
                            <div className = "book-form__container">
                                <div style = {{width: "50%"}}>
                                    <div className = "book-form__field">
                                        <label 
                                            htmlFor = "title"
                                            className = {`book-form__label book-form__label--${colorMode}`}
                                        >
                                            {t('bookTypeTitle')}:
                                        </label>
                                        <input
                                            id = "title" 
                                            type = "text" 
                                            name = "title" 
                                            ref = {elementsRef[0]}
                                            className = {`book-form__input book-form__input--${colorMode}`}
                                            onChange = {(e) => editBook(e)}
                                            onKeyDown = {(e) => handleKeyPress(e, 1)}
                                            value = {book.title} 
                                            required 
                                        />
                                    </div>

                                    <div className = "book-form__field">
                                        <label className = {`book-form__label book-form__label--${colorMode}`}>
                                            {t('pluralAuthorsText')}
                                        </label>
                                        <AuthorsInput
                                            ref = {elementsRef[1]}
                                            book = {book}
                                            setBook = {setBook}
                                            focusCallback = {(e) => handleKeyPress(e, 2)}
                                        />
                                    </div>

                                    <div className = "book-form__field">
                                        <label 
                                            htmlFor = "publisher"
                                            className = {`book-form__label book-form__label--${colorMode}`}
                                        >
                                            {t('bookTypePublisher')}:
                                        </label>
                                        <input
                                            type = "text"
                                            id = "publisher" 
                                            name = "publisher" 
                                            ref = {elementsRef[2]}
                                            className = {`book-form__input book-form__input--${colorMode}`} 
                                            onChange = {(e) => editBook(e)}
                                            onKeyDown = {(e) => handleKeyPress(e, 3)}
                                            value = {book.publisher} 
                                        />
                                    </div>

                                    <div className = "book-form__field">
                                        <label 
                                            htmlFor = "release"
                                            className = {`book-form__label book-form__label--${colorMode}`}
                                        >
                                            {t('bookReleaseDate')}
                                        </label>
                                        <input 
                                            type = "date" 
                                            id = "release" 
                                            name = "release" 
                                            ref = {elementsRef[3]}
                                            className = {`book-form__input book-form__input--${colorMode}`} 
                                            value = {bookReleaseValue()}
                                            onChange = {(e) => editBook(e)} 
                                            onKeyDown = {(e) => handleKeyPress(
                                                e, mobileLayout ? 5 : 4 // tags for mobile; file sel. for desktop.
                                            )}
                                        />
                                    </div>
                                </div>
                                <FileSelector
                                    ref = {elementsRef[4]}
                                    book = {book}
                                    setBook = {setBook}
                                    setLoading = {setLoading}
                                    focusCallback = {(e) => handleKeyPress(
                                        e, mobileLayout ? 0 : 5 // title for mobile; tags for desktop.
                                    )}
                                />
                            </div>

                            <div className = "book-form__field">
                                <label className = {`book-form__label book-form__label--${colorMode}`}>
                                    {t('bookTagsText')}
                                </label>
                                <DropdownMenu
                                    ref = {elementsRef[5]} 
                                    tags = {tags} 
                                    book = {book}
                                    setTags = {setTags}
                                    setBook = {setBook}
                                />
                            </div>

                            <div className = "book-form__buttons">
                                <button 
                                    type = "submit" 
                                    className = "book-form__button book-form__button--save"
                                >
                                    {t('saveButton')}
                                </button>
                                <button 
                                    type = "button" 
                                    className = "book-form__button book-form__button--cancel" 
                                    onClick = {() => navigate('/')}
                                >
                                    {t('cancelButton')}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </>
    )
}