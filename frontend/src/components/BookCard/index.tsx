import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHasScrollbar } from '../../hooks/useHasScrollbar';
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
    const sectionRef = useRef<HTMLDivElement>(null);

    const { hasScroll } = useHasScrollbar({ 
        elementRef: sectionRef 
    });

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
            <section
                ref = {sectionRef}
                className = "book-card__info"
                style = {{ padding: hasScroll ? '0.5rem 0 0.5rem 0.5rem' : '0.5rem' }}
            >
                <div className = "book-card__title">
                    {title}
                </div>
                <div className = "book-card__author">
                    {author}
                </div>
                <div className = "book-card__publisher">
                    <span>Publisher:</span> {publisher}
                </div>
                <div className = "book-card__pages">
                    <span>Number of pages:</span> {pages}
                </div>
                {tags.length > 0 && (
                    <div className = "book-card__tags">
                        <p>Tags:</p>
                        <div className = "book-card__tags-container">
                            {tags.map((tag) => (
                                <Tag
                                    key = {tag.id}
                                    label = {tag.label}
                                    color = {tag.color}
                                    empty = {false}
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