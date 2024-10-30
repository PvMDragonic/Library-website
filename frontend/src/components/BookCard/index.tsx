import { useContext, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHasScrollbar } from '../../hooks/useHasScrollbar';
import { ColorModeContext } from '../ColorScheme';
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
    type?: string;
    progress?: string;
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

export function BookCard({ id, title, authors, publisher, tags, release, cover, type }: Omit<IBook, 'attachment'>) 
{
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // It must observe the section but check the container's size, or
    // else it can get stuck on a loop if the padding changes make
    // the 'scrollHeigh > clientHeight' comparison shift again.
    const { hasScroll } = useHasScrollbar({ 
        elementRef: sectionRef,
        altCompareRef: containerRef
    });
    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    const navigate = useNavigate();
    
    function handleMouseDown(event: React.MouseEvent)
    {
        if (!type) event.preventDefault();
    }

    function handleBookClick()
    {
        if (!type) return;

        navigate(`/read/${id}`, { state: { type: type } });
    }

    const bookCardClass = `book-card book-card--${type ? 'type' : 'no-type'}-${colorMode} book-card--${colorMode}`;

    const bookInfoClass = `book-card__info book-card__info--${cover ? 'cover' : `no-cover-${colorMode}`}`; 

    const containerClass = `book-card__container book-card__container--${cover ? `cover book-card__container--cover-${colorMode}` : 'no-cover'} book-card__container--${colorMode}`;

    const authorsNames = authors ? authors.map(author => author.label).join('; ') : null;
    
    // 'release' comes as a string from the database, despite the IBook interface saying otherwise.
    // As such, TypeScript won't let you '.split()' it directly, because it thinks it's a Date. 
    const formattedRelease = release?.toString().split('T')[0].replaceAll('-', '/');

    // Memoizing 'cuz the cover is a big-ass string.
    const sectionStyling = useMemo(() => ({
        ...(cover && { backgroundImage: `url(${cover})` }),
        ...(type && { cursor: 'pointer' })
    }), [cover, type]);

    return (
        <div 
            className = {bookCardClass}
            onMouseDown = {(e) => handleMouseDown(e)}
        >
            <section
                ref = {sectionRef} 
                style = {sectionStyling} 
                className = {bookInfoClass}
                onClick = {handleBookClick}
            >
                {type && (
                    <div className = {`book-card__file-type book-card__file-type--${colorMode}`}>
                        <div/> {type}
                    </div>
                )}
                <div 
                    ref = {containerRef} 
                    className = {containerClass}
                    style = {{ padding: hasScroll ? '0.5rem 0 0.5rem 0.5rem' : '0.5rem', }}
                >
                    <div 
                        className = "book-card__title"
                        style = {{ paddingTop: type && !cover ? '0.5rem' : '0rem' }}
                    >
                        <p>{title}</p>
                    </div>
                    <div className = "book-card__author">
                        {authorsNames ? (
                            <p>{authorsNames}</p>
                        ) : (
                            <p><i>{t('bookTypeUnknown')}</i></p>
                        )}
                    </div>
                    <div className = "book-card__publisher">
                        <p><span>{t('bookTypePublisher')}:</span><br/>{publisher ? (
                            publisher
                        ) : (
                            <i>{t('bookTypeUnknown')}</i>
                        )}</p>
                    </div>
                    <div className = "book-card__release">
                        <p><span>{t('bookReleaseDate')}</span><br/>{formattedRelease ? (
                            formattedRelease
                        ) : (
                            <i>{t('bookTypeUnknown')}</i>
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
                </div>
            </section>
            <section className = {`book-card__edit book-card__edit--${colorMode}`}>
                <button type = "button" onClick = {() => navigate(`/edit/${id}`)}>
                    {t('editBookBtn')}
                </button>
            </section>
        </div>
    )
}