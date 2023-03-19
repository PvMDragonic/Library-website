import React, { useEffect, useState } from "react";
import { DropdownMenu, ITag } from "../../components/DropdownMenu";
import { useNavigate } from 'react-router-dom';
import { NavBar } from "../../components/NavBar";
import { api } from "../../database/api";

export const blankBook = 
{
    id: 0,
    title: "",
    author: "",
    publisher: "",
    pages: 0
}

export function NewBook()
{
    const [books, setBooks] = useState(blankBook);
    const [tags, setTags] = useState<ITag[]>([]);
    const [includedTags, setIncludedTags] = useState<ITag[]>([]);

    const navigate = useNavigate();
    
    useEffect(() => 
    {
        api.get('tags')
            .then((response) => {
                setTags(response.data);
            })
            .catch((error) => {
                console.log(`Error retrieving tags: ${error}`)
            });
    }, []);

    function editBook(event: React.ChangeEvent<HTMLInputElement>) 
    {
        const { name, value } = event.target;
        setBooks({ ...books, [name]: value });
    }
    
    async function saveBook(event: React.FormEvent<HTMLFormElement>) 
    {
        event.preventDefault();
        
        try
        {
            await api.post('books', books);

            const newBook = (await api.get(`books/name/${books.title}`)).data[0];

            for (const tag of includedTags)
            {
                const tagExists = (await api.get(`tags/name/${tag.label}`)).data[0];
                if (!tagExists)
                {
                    await api.post('tags/new', tag);
                }

                const addedTag = (await api.get(`tags/name/${tag.label}`)).data[0];
                await api.post('tags/add', 
                { 
                    bookId: newBook.id, 
                    tagId: addedTag.id 
                });
            }
            
            navigate('/');
        }
        catch(error)
        {
            console.log(error);    
        }
    }

    return (
        <>
            <NavBar />
            <div className="book-form">
                <form onSubmit={saveBook}>
                    <header>
                        <h1>New Book</h1>
                    </header>

                    <div className="book-form__field">
                        <label htmlFor="title">Title:</label>
                        <input className="book-form__input" type="text" name="title" id="title" onChange={(e) => editBook(e)} required />
                    </div>

                    <div className="book-form__field">
                        <label htmlFor="author">Author:</label>
                        <input className="book-form__input" type="text" name="author" id="author" onChange={(e) => editBook(e)} required />
                    </div>

                    <div className="book-form__field">
                        <label htmlFor="publisher">Publisher:</label>
                        <input className="book-form__input" type="text" name="publisher" id="publisher" onChange={(e) => editBook(e)} required />
                    </div>

                    <div className="book-form__field">
                        <label htmlFor="pages">Number of pages:</label>
                        <input className="book-form__input" type="number" name="pages" id="pages" onChange={(e) => editBook(e)} required />
                    </div>

                    <div className="book-form__field">
                        <label>Book tags:</label>
                        <DropdownMenu 
                            options = {tags} 
                            includedTags = {includedTags}
                            setIncludedTags = {setIncludedTags}
                        />
                    </div>

                    <div className="book-form__buttons">
                        <button type="submit" className="book-form__button book-form__button--save">Save</button>
                        <button type="button" className="book-form__button book-form__button--cancel" onClick={() => navigate('/')}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    )
}