import { useState, useRef, useEffect, useMemo } from "react";
import { useMobileLayout } from "../../hooks/useMobileLayout";
import { BookCard, ITag } from "../../components/BookCard";
import { NavOptions } from "../../components/NavOptions";
import { OptionsBar } from "../../components/OptionsBar";
import { SideMenu } from "../../components/SideMenu";
import { IBook } from "../../components/BookCard";
import { NavBar } from "../../components/NavBar";
import { api } from "../../database/api";

export interface BookTags
{
    id: number;
    id_book: number;
    id_tag: number;
}

export interface SearchType
{
    type: string;
    value: string;
    toggleCase?: boolean;
    wholeWord?: boolean;
}

const emptySearch = 
{ 
    type: '', 
    value: '' 
};

export function Home() 
{
    const [tags, setTags] = useState<ITag[]>([]);
    const [books, setBooks] = useState<IBook[]>([]);
    const [bookTags, setBookTags] = useState<BookTags[]>([]);

    const [searchOption, setSearchOption] = useState<SearchType>(emptySearch);
    const [displayOptions, setDisplayOptions] = useState<IBook[]>([]);
    const [showSideMenu, setShowSideMenu] = useState<boolean>(false);

    const mainBodyRef = useRef<HTMLDivElement>(null);
    const booksListRef = useRef<HTMLDivElement>(null);

    const { mobileLayout } = useMobileLayout({ 
        widthMark: 800 
    });

    const cachedOptionsBar = useMemo(() => 
    {
        return (
            <OptionsBar
                books = {books}
                tags = {tags}
                bookTags = {bookTags}
                searchOption = {searchOption}
                setSearchOption = {setSearchOption}
                setDisplayOptions = {setDisplayOptions}
            />
        )
    }, [books, tags, mobileLayout, searchOption]);

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

    useEffect(() => setShowSideMenu(false), [mobileLayout]);

    return (
        <>
            <NavBar 
                mobile = {mobileLayout}
                showSideMenu = {showSideMenu}
                setShowSideMenu = {setShowSideMenu}
            />
            {mobileLayout && (
                <SideMenu 
                    mainBodyRef = {mainBodyRef}
                    showSideMenu = {showSideMenu}
                    setShowSideMenu = {setShowSideMenu}
                >
                    <NavOptions 
                        sideMenu = {showSideMenu}
                    />
                    {cachedOptionsBar}
                </SideMenu>
            )}
            <div 
                ref = {mainBodyRef}
                className = "main-home" 
            >
                {!mobileLayout && (cachedOptionsBar)}
                <div className = 'main-home__container' ref = {booksListRef}>
                    <div className = "main-home__title">
                        {searchOption && searchOption.type !== '' ? (
                            <h1>{searchOption.type}: "{searchOption.value}"</h1>
                        ) : (
                            <h1>My Books</h1>
                        )}
                        <span>Total Books: {displayOptions.length}</span>
                    </div>
                    <section className = "main-home__books-list">
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