import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { DeleteMessage } from "../../components/DeleteMessage";
import { BookForm } from "../../components/BookForm";
import { IBook } from "../../components/BookCard";
import { blankBook } from "../NewBook";
import { api } from "../../database/api";
import RevertCoverIcon from "../../assets/RevertCoverIcon";
import DeleteIcon from "../../assets/DeleteIcon";

export function EditBook() 
{
    const [book, setBook] = useState<IBook>(blankBook);
    const [ogBook, setOgBook] = useState<IBook>(blankBook);
    const [deleteMsg, setDeleteMsg] = useState(false);

    const { id } = useParams();

    const regularHeader = useMemo(() => 
    (
        <header>
            <h1>Edit Book</h1>
            <div>
                {JSON.stringify(ogBook) !== JSON.stringify(book) && (
                    <button 
                        type = "button"
                        title = "Reset to saved values" 
                        className = "book-form__button book-form__button--reset" 
                        onClick = {() => setBook(ogBook)}
                    >
                        <RevertCoverIcon/>
                    </button>
                )}
                <button 
                    type = "button"
                    title = "Delete book" 
                    className = "book-form__button book-form__button--delete" 
                    onClick = {() => setDeleteMsg(true)}
                >
                    <DeleteIcon/>
                </button>
            </div>
        </header>
    ), [book]);
 
    // <DeleteMessage> gets absolute-positioned over the <form>.
    const deleteHeader = useMemo(() => 
    (
        <>
            <header>
                <h1>Delete book</h1>
            </header>

            <DeleteMessage 
                id = {book.id}
                title = {book.title}
                abortDeletion = {setDeleteMsg}
            />
        </>
    ), [book]);

    useEffect(() =>
    {
        api.get(`books/id/${id}`)
            .then(response => {
                const resp = response.data[0];
                setOgBook(resp);
                setBook(resp);
            })
            .catch(error => 
                console.log(`Error retrieving book: ${error}`)    
            );
    }, []);

    async function saveBook()
    {
        await api.put('books', book);
    }

    return (
        <BookForm
            header = {deleteMsg ? deleteHeader : regularHeader}
            delMsg = {deleteMsg}
            book = {book}
            setBook = {setBook}
            saveBook = {saveBook}
        />
    )
}