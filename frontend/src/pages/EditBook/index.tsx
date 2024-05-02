import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { DeleteMessage } from "../../components/DeleteMessage";
import { BookForm } from "../../components/BookForm";
import { IBook } from "../../components/BookCard";
import { blankBook } from "../NewBook";
import { api } from "../../database/api";

export function EditBook() 
{
    const [book, setBook] = useState<IBook>(blankBook);
    const [deleteMsg, setDeleteMsg] = useState(false);

    const { id } = useParams();

    const header = useMemo(() => (
        <header>
            <h1>Edit book</h1>
            <button 
                type = "button" 
                className = "book-form__button book-form__button--delete" 
                onClick = {() => setDeleteMsg(true)}
            >
                Delete book
            </button>
        </header>
    ), [setDeleteMsg]);

    useEffect(() =>
    {
        api.get(`books/id/${id}`)
            .then(response => 
                setBook(response.data[0])
            )
            .catch(error => 
                console.log(`Error retrieving book: ${error}`)    
            );
    }, []);

    async function saveBook()
    {
        await api.put('books', book);
    }

    if (deleteMsg)
    {
        return (
            <DeleteMessage 
                id = {book!.id} 
                title = {book!.title} 
                abortDeletion = {setDeleteMsg}
            />
        )
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