import { useEffect, useState } from "react";
import { BookCard } from "../../components/BookCard";
import { IBook } from "../../components/BookCard";
import { NavBar } from "../../components/NavBar";
import { api } from "../../database/api";

export function Home() 
{
    const [books, setBooks] = useState<IBook[]>([]);

    useEffect(() =>
    {
        api.get('books')
            .then((response) => {
                setBooks(response.data);
            })
            .catch((error) => {
                console.log(`Error while retrieving books: ${error}`)
            });
    }, []);

    return (
        <>
            <NavBar />
            <div className="main-home">
                <div className="main-home__title">
                    <h1>My Books</h1>
                    <span>Total Books: {books.length}</span>
                </div>
                <section className="main-home__books-list">
                    {books.map(book => (
                        <BookCard
                            key = {book.id} 
                            id = {book.id}
                            title = {book.title}
                            author = {book.author}
                            publisher = {book.publisher}
                            pages = {book.pages}
                        />
                    ))}
                </section>
            </div>
        </>
    );
}