import React, { useState } from "react";
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

    const navigate = useNavigate();

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
                        <input type="text" name="title" id="title" onChange={(e) => editBook(e)} required />
                    </div>

                    <div className="book-form__field">
                        <label htmlFor="author">Author:</label>
                        <input type="text" name="author" id="author" onChange={(e) => editBook(e)} required />
                    </div>

                    <div className="book-form__field">
                        <label htmlFor="publisher">Publisher:</label>
                        <input type="text" name="publisher" id="publisher" onChange={(e) => editBook(e)} required />
                    </div>

                    <div className="book-form__field">
                        <label htmlFor="pages">Number of pages:</label>
                        <input type="number" name="pages" id="pages" onChange={(e) => editBook(e)} required />
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