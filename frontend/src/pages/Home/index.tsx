import { useState, useEffect, useRef } from "react";
import { BookCard, ITag } from "../../components/BookCard";
import { SearchBar } from "../../components/SearchBar";
import { IBook } from "../../components/BookCard";
import { NavBar } from "../../components/NavBar";
import { api } from "../../database/api";
import EraseIcon from "../../assets/EraseIcon";

interface searchType
{
    type: string;
    value: string;
}

interface BookTags
{
    id: number;
    id_book: number;
    id_tag: number;
}

export function Home() 
{
    const [books, setBooks] = useState<IBook[]>([]);
    const [tags, setTags] = useState<ITag[]>([]);
    const [bookTags, setBookTags] = useState<BookTags[]>([]);
    const [searchOption, setSearchOption] = useState<searchType>();
    const [displayOptions, setDisplayOptions] = useState<IBook[]>([]);

    useEffect(() =>
    {
        api.get('books')
            .then(response => {
                const data = response.data;
                setDisplayOptions(data);
                setBooks(data);
            })
            .catch(error => {
                console.log(`Error retrieving books: ${error}`);
            });

        api.get('tags')
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.log(`Error retrieving tags: ${error}`);
            });

        api.get('tags/relations')
            .then(response => {
                setBookTags(response.data);
            })
            .catch(error => {
                console.log(`Error retrieving tags: ${error}`);
            });
    }, []);

    function handleSearch(searchValue: string, toggleCase: boolean, wholeWord: boolean)
    {
        const search = toggleCase ? searchValue : searchValue.toLowerCase();
    
        // <SearchBar> will call this function when it first loads.
        if (!search) 
        {
            // Needs to reset for when the page first loads or the searchbar gets cleared.
            setSearchOption({type: '', value: ''});
            setDisplayOptions(books);
            return;
        }
        
        setSearchOption({ type: 'Title', value: search });
        setDisplayOptions(
            books.filter(book => {
                const label = toggleCase ? book.title : book.title.toLowerCase();
                return wholeWord ? label === search : label.includes(search);
            })
        );
    }

    function resetFilterButton()
    {
        setDisplayOptions(books);
        setSearchOption({ type: '', value: '' });
    }

    function filterSearchOptions(searchType: string, searchValue: string)
    {
        if (searchType === 'Tag')
        {
            const fullTagData = tags.find(tag => tag.label === searchValue)!;

            // Searches to see if there are any books with the tag id.
            const thisBookTags = bookTags.filter(bookTag => bookTag.id_tag == fullTagData.id);
            if (!thisBookTags) return null;

            // Sets all books that have the given tag id associated with them.
            setDisplayOptions(
                thisBookTags.map(bookTag => 
                    books.find(book => book.id === bookTag.id_book)
                ).filter(book => book !== undefined) as IBook[]
            );
        }

        if (searchType === 'Author')
            setDisplayOptions(
                books.filter(book => book.author === searchValue)
            );

        if (searchType === 'Publisher')
            setDisplayOptions(
                books.filter(book => book.publisher === searchValue)
            );

        setSearchOption({ type: searchType, value: searchValue });
    }

    const uniqueAuthors = [...new Set(books.map(book => book.author))];
    const uniquePublishers = [...new Set(books.map(book => book.publisher))];

    return (
        <>
            <NavBar />
            <div className = "main-home">
                <div>
                    <div className = "main-home__searchbar">
                        <SearchBar
                            onChange = {handleSearch}
                        />   
                    </div>               
                    <section className = "main-home__options-container">
                        {searchOption && !['', 'Title'].includes(searchOption.type) && (
                            <button
                                type = "button"
                                title = "Clear filter option"
                                className = "main-home__reset-search"
                                onClick = {resetFilterButton}
                            >
                                <EraseIcon/>
                            </button>
                        )}
                        <h4>Tags:</h4>
                        {tags.map(tag => {
                            return (
                                <button 
                                    key = {`tag${tag.label}`}
                                    type = "button" 
                                    className = "main-home__option-button"
                                    onClick = {() => filterSearchOptions('Tag', tag.label)}
                                    style = {{ '--option-hover-color': `${tag.color}` } as React.CSSProperties}
                                >
                                    {tag.label}
                                </button>
                            )
                        })}
                        {tags.length == 0 && (
                            <p><i>None</i></p>
                        )}
                        <h4>Authors:</h4>
                        {uniqueAuthors.map(author => {
                            return (
                                <button 
                                    key = {`author${author}`}
                                    type = "button" 
                                    className = "main-home__option-button"
                                    onClick = {() => filterSearchOptions('Author', author)}
                                    style = {{ '--option-hover-color': 'hsl(210, 7%, 71%)' } as React.CSSProperties} 
                                >
                                    {author}
                                </button>
                            )
                        })}
                        {uniqueAuthors.length == 0 && (
                            <p><i>None</i></p>
                        )}
                        <h4>Publishers:</h4>
                        {uniquePublishers.map(pub => {
                            return (
                                <button
                                    key = {`pub${pub}`}
                                    type = "button" 
                                    className = "main-home__option-button"
                                    onClick = {() => filterSearchOptions('Publisher', pub)}
                                    style = {{ '--option-hover-color': 'hsl(210, 7%, 71%)' } as React.CSSProperties} 
                                >
                                    {pub}
                                </button>
                            )
                        })}
                        {uniquePublishers.length == 0 && (
                            <p><i>None</i></p>
                        )}
                    </section>
                </div>
                <div>
                    <div className = "main-home__title">
                        {searchOption && searchOption.type !== '' ? (
                            <h1>{searchOption.type}: "{searchOption.value}"</h1>
                        ) : (
                            <h1>My Books</h1>
                        )}
                        <span>Total Books: {displayOptions.length}</span>
                    </div>
                    <section className="main-home__books-list">
                        {displayOptions.map((book) => {
                            return (
                                <BookCard
                                    key = {book.id}
                                    id = {book.id}
                                    title = {book.title}
                                    author = {book.author}
                                    publisher = {book.publisher}
                                    pages = {book.pages}                        
                                />
                            );
                        })}
                    </section>
                </div>
            </div>
        </>
    );
}