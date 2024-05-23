import { useState, useMemo } from "react";
import { BookForm } from "../../components/BookForm";
import { IBook } from "../../components/BookCard";
import { api } from "../../database/api";

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

    const header = useMemo(() =>
    (
        <header>
            <h1>New Book</h1>
            <div>
                {stringifiedBlank !== JSON.stringify(book) && (
                    <button 
                        type="button" 
                        className="book-form__button book-form__button--reset" 
                        onClick={() => setBook(blankBook)}
                    >
                        Reset book
                    </button>
                )}
            </div>
        </header>
    ), [book]);

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