import { useState, useRef, useEffect, useMemo } from "react";
import { TitleContainer } from "../../components/TitleContainer";
import { useMobileLayout } from "../../hooks/useMobileLayout";
import { BookCard, ITag } from "../../components/BookCard";
import { OptionsBar } from "../../components/OptionsBar";
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
    enterPress?: boolean;
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
    const [showSideMenu, setShowSideMenu] = useState<boolean>(false);
    const [searchOption, setSearchOption] = useState<SearchType>(emptySearch);
    const [displayOptions, setDisplayOptions] = useState<IBook[]>([]);

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
                mobileLayout = {mobileLayout}
                setShowSideMenu = {setShowSideMenu}
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

    return (
        <>
            <NavBar
                mobile = {800}
                mainBodyRef = {mainBodyRef}
                sideMenuContent = {cachedOptionsBar}
                sideMenuStateProps = {[showSideMenu, setShowSideMenu]}
            />
            <div 
                ref = {mainBodyRef}
                className = "main-home" 
            >
                {!mobileLayout && (cachedOptionsBar)}
                <div className = 'main-home__container' ref = {booksListRef}>
                    <TitleContainer
                        totalBooks = {displayOptions.length}
                        searchOption = {searchOption}
                    />
                    <div className = "main-home__books-scroll-wrapper">    
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
                                        cover = {book.cover}                      
                                    />
                                );
                            })}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}