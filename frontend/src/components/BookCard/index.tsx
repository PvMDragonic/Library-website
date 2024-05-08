import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHasScrollbar } from '../../hooks/useHasScrollbar';
import { Tag } from '../Tags';

export interface IBook 
{
    id: number;
    title: string;
    publisher: string;
    authors: IAuthor[];
    tags: ITag[];
    release: Date | undefined; // Date instead of string due to different locale formatting.
    cover: string | null;
    attachment: string | null;
}

export interface IAuthor
{
    id: number;
    label: string;
}

export interface ITag
{
    id: number;
    label: string;
    color: string;
}

// FYI: 'release' comes as a string from the database, despite the IBook interface saying otherwise.
// As such, TypeScript won't let you '.split()' it directly, because it thinks it's a Date.
export function BookCard({ id, title, authors, publisher, tags, release, cover }: Omit<IBook, 'attachment'>) 
{
    const sectionRef = useRef<HTMLDivElement>(null);

    const { hasScroll } = useHasScrollbar({ 
        elementRef: sectionRef 
    });

    const navigate = useNavigate();
    
    const authorsNames = authors ? authors.map(author => author.label).join('; ') : null;

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
                    <p>{authorsNames ? (
                        authorsNames
                    ) : (
                        <i>Unknown</i>
                    )}</p>
                </div>
                <div className = "book-card__publisher">
                    <p><span>Publisher:</span> {publisher ? (
                        publisher
                    ) : (
                        <i>Unknown</i>
                    )}</p>
                </div>
                <div className = "book-card__release">
                    <p><span>Release date:</span> {release ? (
                        release?.toString().split('T')[0].replaceAll('-', '/')
                    ) : (
                        <i>Unknown</i>
                    )}</p>
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