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
    release: Date | undefined; // Date instead of string due to different locale formatting.
    cover: string | null;
    attachment: string | null;
}

export interface ITag
{
    id: number;
    label: string;
    color: string;
}

// FYI: 'release' comes as a string from the database, despite the IBook interface saying otherwise.
// As such, TypeScript won't let you '.split()' it directly, because it thinks it's a Date.
export function BookCard({ id, title, author, publisher, release, cover }: Omit<IBook, 'attachment'>) 
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
                style = {{ 
                    padding: hasScroll ? '0.5rem 0 0.5rem 0.5rem' : '0.5rem', 
                    backgroundImage: `url(${cover})` 
                }}
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
                <div className = "book-card__release">
                    <span>Release date:</span> {release?.toString().split('T')[0].replaceAll('-', '/')}
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