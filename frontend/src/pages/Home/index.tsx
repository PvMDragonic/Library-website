import { useState, useEffect, useRef } from "react";
import { OptionsBar } from "../../components/OptionsBar";
import { BookCard } from "../../components/BookCard";
import { IBook } from "../../components/BookCard";
import { NavBar } from "../../components/NavBar";

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
    const [searchOption, setSearchOption] = useState<SearchType>(emptySearch);
    const [displayOptions, setDisplayOptions] = useState<IBook[]>([]);
    const [sideMenu, setSideMenu] = useState<boolean>(false);
    const [mobile, setMobile] = useState<boolean>(false);

    const booksListRef = useRef<HTMLDivElement>(null);

    useEffect(() => 
    {
        const containerRef = booksListRef.current;
        if (!containerRef) return;

        const resizeObserver = new ResizeObserver(() => 
        {
            // Has triggered the CSS media-query or not.
            if (window.innerWidth > 800) 
            {   
                setMobile(false);
                setSideMenu(false);
            } 
            else // Mobile layout.
            {
                setMobile(true);
            }
        });

        resizeObserver.observe(containerRef);
    
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <>
            <NavBar 
                mainBodyRef = {booksListRef}
                setSideMenu = {setSideMenu}
            />
            <div className = "main-home">
                <OptionsBar
                    mobile = {mobile}
                    sideMenu = {sideMenu}
                    searchOption = {searchOption}
                    setSearchOption = {setSearchOption}
                    setDisplayOptions = {setDisplayOptions}
                />
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