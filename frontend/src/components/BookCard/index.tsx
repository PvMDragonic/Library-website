import { useNavigate } from 'react-router-dom';

export interface IBook 
{
    id: number;
    title: string;
    author: string;
    publisher: string;
    pages: number;
}

export function BookCard({ id, title, author, publisher, pages }: IBook) 
{
    const navigate = useNavigate();

    return (
        <div className="book-card">
            <section className="book-card__info">
                <div className="book-card__title">{title}</div>
                <div className="book-card__author">{author}</div>
                <div className="book-card__publisher">Publisher: {publisher}</div>
                <div className="book-card__pages">Number of pages: {pages}</div>
            </section>

            <section className="book-card__edit">
                <button type="button" onClick={() => navigate(`/edit/${id}`)}>Edit</button>
            </section>
        </div>
    )
}