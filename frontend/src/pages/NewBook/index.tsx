import { useState, useMemo } from "react";
import { IBook, ITag } from "../../components/BookCard";
import { BookForm } from "../../components/BookForm";
import { api } from "../../database/api";

export const blankBook: IBook = 
{
    id: 0,
    title: "",
    author: "",
    publisher: "",
    release: undefined,
    cover: null,
    attachment: null
}

export function NewBook()
{
    // Created here instead of inside <BookForm> because <EditBook> needs them,
    // so creating them inside the child component would lead to duplicates.
    const [book, setBook] = useState<IBook>(blankBook);
    const [includedTags, setIncludedTags] = useState<ITag[]>([]);

    const header = useMemo(() => (
        <header>
            <h1>New Book</h1>
        </header>
    ), []);

    async function saveBook() 
    {
        const newBook = (await api.post('books', book)).data.message[0] as IBook;

        for (const tag of includedTags)
        {
            // Needs to escape special characters to not bug the API with chars like '?'.
            const tagLabel = encodeURIComponent(tag.label);
            const tagExists = (await api.get(`tags/name/${tagLabel}`)).data[0] as ITag;

            if (!tagExists)
                await api.post('tags/new', tag);

            const addedTag = (await api.get(`tags/name/${tagLabel}`)).data[0] as ITag;
            await api.post('tags/add', 
            { 
                bookId: newBook.id, 
                tagId: addedTag.id 
            });
        }
    }

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