import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { DeleteMessage } from "../../components/DeleteMessage";
import { IBook, ITag } from "../../components/BookCard";
import { BookForm } from "../../components/BookForm";
import { blankBook } from "../NewBook";
import { api } from "../../database/api";

export function EditBook() 
{
    const [book, setBook] = useState<IBook>(blankBook);
    const [includedTags, setIncludedTags] = useState<ITag[]>([]);
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
            .then(
                response => setBook(response.data[0])
            )
            .catch(
                error => console.log(`Error retrieving book: ${error}`)
            );

        api.get(`tags/id/${id}`)
            .then(
                response => setIncludedTags(response.data)
            )
            .catch(
                error => console.log(`Error retrieving included tags: ${error}`)
            );
    }, []);

    async function saveBook() 
    {
        await api.put(`books/${id}`, book);

        // Easier to wipe and start fresh. 
        await api.delete(`tags/relationship/${id}`);

        for (const tag of includedTags)
        {
            // Needs to escape special characters to not bug the API with chars like '?'.
            const tagLabel = encodeURIComponent(tag.label);
            const tagExists = (await api.get(`tags/name/${tagLabel}`)).data[0];

            if (!tagExists)
                await api.post('tags/new', tag);

            const addedTag = (await api.get(`tags/name/${tagLabel}`)).data[0];
            await api.post('tags/add', 
            { 
                bookId: id, 
                tagId: addedTag.id 
            });
        }
    }

    if (deleteMsg)
        return (
            <DeleteMessage 
                id = {book!.id} 
                title = {book!.title} 
                abortDeletion = {setDeleteMsg}
            />
        )

    return (
        <BookForm
            header = {header}
            book = {book}
            includedTags = {includedTags}
            setBook = {setBook}
            setIncludedTags = {setIncludedTags}
            saveBook = {saveBook}
        />
    )
}