import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

    const { t, i18n } = useTranslation();

    const { id } = useParams();

    const regularHeader = useMemo(() => 
    (
        <header>
            <h1>{t('editBookHeader')}</h1>
            <div>
                {JSON.stringify(ogBook) !== JSON.stringify(book) && (
                    <button 
                        type = "button"
                        title = {t('revertEditsBtnTitle')} 
                        style = {{ '--resetButtonContent': `"‎ ${t('revertEditsBtnText')}"` } as React.CSSProperties } 
                        onClick= {() => setBook(ogBook)}
                        className = "book-form__button book-form__button--reset" 
                    >
                        <RevertCoverIcon/>
                    </button>
                )}
                <button 
                    type = "button"
                    title = {t('deleteBookBtnTitle')}
                    style = {{ '--deleteButtonContent': `"‎ ${t('deleteBookBtnTitle')}"` } as React.CSSProperties } 
                    onClick = {() => setDeleteMsg(true)}
                    className = "book-form__button book-form__button--delete"
                >
                    <DeleteIcon/>
                </button>
            </div>
        </header>
    ), [book, i18n.language]);
 
    // <DeleteMessage> gets absolute-positioned over the <form>.
    const deleteHeader = useMemo(() => 
    (
        <>
            <header>
                <h1>{t('deleteBookBtnTitle')}</h1>
            </header>

            <DeleteMessage 
                id = {book.id}
                title = {book.title}
                abortDeletion = {setDeleteMsg}
            />
        </>
    ), [book, i18n.language]);

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

        const authorsNew = book.authors;
        const authorsOld = ogBook.authors;
        const authorsRemoved = authorsOld.filter(
            oldAuthor => !authorsNew.some(
                newAuthor => oldAuthor.label === newAuthor.label
            ) 
        );
        
        for (const author of authorsRemoved)
            await api.delete(`authors/${author.id}`, { params: { author: author.label }});
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