import { useTranslation } from "react-i18next";
import { useState, useMemo, useContext } from "react";
import { ColorModeContext } from "../../components/ColorScheme";
import { BookForm } from "../../components/BookForm";
import { IBook } from "../../components/BookCard";
import { api } from "../../database/api";
import RevertCoverIcon from "../../assets/RevertCoverIcon";

export const blankBook: IBook = 
{
    id: 0,
    title: "",
    publisher: "",
    authors: [],
    tags: [],
    release: undefined,
    cover: null,
    attachment: null
}

const stringifiedBlank = JSON.stringify(blankBook);

export function NewBook()
{
    // Created here instead of inside <BookForm> because <EditBook> needs them,
    // so creating them inside the child component would lead to duplicates.
    const [book, setBook] = useState<IBook>(blankBook);

    const { colorMode } = useContext(ColorModeContext);
    const { t, i18n } = useTranslation();

    const header = useMemo(() => 
    (
        <header className = {`book-form__header book-form__header--${colorMode}`}>
            <h1>{t('newBookHeader')}</h1>
            <div>
                {stringifiedBlank !== JSON.stringify(book) && (
                    <button 
                        type = "button" 
                        title = {t('clearBookBtnTitle')}
                        style = {{ '--clearButtonContent': `"‎ ${t('clearBookBtnText')}"` } as React.CSSProperties } 
                        className = "book-form__button book-form__button--clear" 
                        onClick = {() => setBook(blankBook)}
                    >
                        <RevertCoverIcon/>
                    </button>
                )}
            </div>
        </header>
    ), [book, i18n.language, colorMode]);

    async function saveBook()
    {
        await api.post('books', book);
    }

    return (
        <BookForm
            header = {header}
            book = {book}
            setBook = {setBook}
            saveBook = {saveBook}
        />
    )
}