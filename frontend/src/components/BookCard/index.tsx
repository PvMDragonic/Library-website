import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../../components/Tags';
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
    const [padding, setPadding] = useState<string>('');
    const sectionRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => 
    {
        const element = sectionRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(() => 
        {
            setPadding(
                element.scrollHeight > element.clientHeight
                    ? '0.5rem 0 0.5rem 0.5rem'
                    : '0.5rem'
            );
        });

        resizeObserver.observe(element);
        
        return () => resizeObserver.disconnect();
    }, [sectionRef]);

    return (
        <div className = "book-card">
            <section
                ref = {sectionRef}
                className = "book-card__info"
                style = {{ padding: padding }}
            >
                <div className = "book-card__title">{title}</div>
                <div className = "book-card__author">{author}</div>
                <div className = "book-card__publisher">Publisher: {publisher}</div>
                <div className = "book-card__pages">Number of pages: {pages}</div>
                {tags.length > 0 && (
                    <div className = "book-card__tags">
                        <p>Tags:</p>
                        <div className = "book-card__tags-container">
                            {tags.map((tag) => (
                                <Tag
                                    key = {tag.id}
                                    label = {tag.label}
                                    color = {tag.color}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <section className = "book-card__edit">
                <button type = "button" onClick = {() => navigate(`/edit/${id}`)}>
                    Edit
                </button>
            </section>
        </div>
    )
}