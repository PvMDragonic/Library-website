import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../../database/api";

export interface IBook 
{
    id: number;
    title: string;
    author: string;
    publisher: string;
    pages: number;
}

export interface ITag
{
    id: number;
    label: string;
    color: string;
}

export function BookCard({ id, title, author, publisher, pages }: IBook) 
{
    const [tags, setTags] = useState<ITag[]>([]);
    
    const navigate = useNavigate();

    useEffect(() =>
    {
        api.get(`tags/id/${id}`)
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.log(`Error while retrieving tags: ${error}`);
            });
    }, []);

    return (
        <div className = "book-card">
            <section className = "book-card__info">
                <div className = "book-card__title">{title}</div>
                <div className = "book-card__author">{author}</div>
                <div className = "book-card__publisher">Publisher: {publisher}</div>
                <div className = "book-card__pages">Number of pages: {pages}</div>
                <div className = "book-card__pages">
                    Tags:
                    {tags.map((tag) => 
                        <p key = {tag.id}>
                            {tag.label}
                        </p>
                    )}
                </div>
                
            </section>

            <section className = "book-card__edit">
                <button type = "button" onClick = {() => navigate(`/edit/${id}`)}>Edit</button>
            </section>
        </div>
    )
}