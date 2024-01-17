import { useEffect, useState } from "react";
import { IBook, ITag } from "../../components/BookCard";
import { SearchBar } from "../../components/SearchBar";
import { SearchType } from "../../pages/Home";
import { api } from "../../database/api";
import EraseIcon from "../../assets/EraseIcon";

interface BookTags
{
    id: number;
    id_book: number;
    id_tag: number;
}

interface IOptionsBar
{
    mobile: boolean;
    sideMenu: boolean;
    searchOption: SearchType;
    setSearchOption: React.Dispatch<React.SetStateAction<SearchType>>;
    setDisplayOptions: React.Dispatch<React.SetStateAction<IBook[]>>;
}

export function OptionsBar({ mobile, sideMenu, searchOption, setSearchOption, setDisplayOptions }: IOptionsBar) 
{
    const [tags, setTags] = useState<ITag[]>([]);
    const [books, setBooks] = useState<IBook[]>([]);
    const [bookTags, setBookTags] = useState<BookTags[]>([]);

    useEffect(() => 
    {
        api.get('books')
            .then(response => {
                const data = response.data;
                setDisplayOptions(data);
                setBooks(data);
            })
            .catch(error => {
                console.log(`Error while retrieving books: ${error}`);
            });

        api.get('tags')
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.log(`Error while retrieving tags: ${error}`);
            });

        api.get('tags/relations')
            .then(response => {
                setBookTags(response.data);
            })
            .catch(error => {
                console.log(`Error while retrieving tags: ${error}`);
            });
    }, []);

    useEffect(() => 
    {
        if (!searchOption) return;

        switch (searchOption.type) 
        {
            case 'Title':
            {
                const { wholeWord, toggleCase, value } = searchOption;
                const search = toggleCase ? value : value.toLowerCase();

                return setDisplayOptions(
                    books.filter(book => {
                        const label = toggleCase ? book.title : book.title.toLowerCase();
                        return wholeWord ? label === search : label.includes(search);
                    })
                );
            }

            case 'Tag': 
            {
                const fullTagData = tags.find(tag => tag.label === searchOption.value)!;
                const thisBookTags = bookTags.filter(bookTag => bookTag.id_tag === fullTagData.id);

                return setDisplayOptions(
                    thisBookTags
                        .map(bookTag => books.find(book => book.id === bookTag.id_book))
                        .filter(book => book !== undefined) as IBook[]
                );
            }

            case 'Author':
                return setDisplayOptions(
                    books.filter(book => book.author === searchOption.value)
                );

            case 'Publisher':
                return setDisplayOptions(
                    books.filter(book => book.publisher === searchOption.value)
                );

            default:
                return setDisplayOptions(books);
        }
    }, [searchOption, tags, books, bookTags]);

    function handleSearch(searchValue: string, toggleCase: boolean, wholeWord: boolean) 
    {
        if (!searchValue) return setSearchOption({ type: '', value: '' });

        setSearchOption({ 
            type: 'Title', 
            value: searchValue, 
            toggleCase: toggleCase, 
            wholeWord: wholeWord 
        });
    };

    const uniqueAuthors = [...new Set(books.map(book => book.author))];
    const uniquePublishers = [...new Set(books.map(book => book.publisher))];

    const optionsBarContainerClassName = mobile 
        ? `main-home__side-menu main-home__side-menu${sideMenu ? '--show' : '--hide'}` 
        : 'options-bar';

    return (
        <div className = {optionsBarContainerClassName}>
            <div className = "options-bar__search-bar">
                <SearchBar
                    onChange = {handleSearch}
                />  
            </div>
            <section className = "options-bar__container">
                {searchOption && !['', 'Title'].includes(searchOption.type) && (
                    <button
                        type = "button"
                        title = "Clear filter option"
                        className = "options-bar__reset-search"
                        onClick = {() => setSearchOption({ type: '', value: '' })}
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
                            className = "options-bar__option-button"
                            onClick = {() => setSearchOption({ type: 'Tag', value: tag.label })}
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
                            className = "options-bar__option-button"
                            onClick = {() => setSearchOption({ type:'Author', value: author })}
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
                            className = "options-bar__option-button"
                            onClick = {() => setSearchOption({ type:'Publisher', value: pub })}
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
    );
}