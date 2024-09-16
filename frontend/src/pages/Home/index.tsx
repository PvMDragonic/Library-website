import { useState, useEffect, useRef } from "react";
import { TitleContainer } from "../../components/TitleContainer";
import { useScrolled } from "../../hooks/useScrolled";
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
    enterPress?: boolean;
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
    const booksWrapperRef = useRef<HTMLDivElement>(null);

    const { scrolledBottom } = useScrolled({
        element: booksWrapperRef
    })
    
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
                mobile = {mobile}
                sideMenu = {sideMenu}
                mainBodyRef = {booksListRef}
                setSideMenu = {setSideMenu}
            />
            <div className = "main-home">
                <OptionsBar
                    mobile = {mobile}
                    sideMenu = {sideMenu}
                    searchOption = {searchOption}
                    setSideMenu = {setSideMenu}
                    setSearchOption = {setSearchOption}
                    setDisplayOptions = {setDisplayOptions}
                />
                <div className = "main-home__container" ref = {booksListRef}>
                    <TitleContainer
                        totalBooks = {displayOptions.length}
                        searchOption = {searchOption}
                    />
                    <div 
                        ref = {booksWrapperRef}
                        className = "main-home__books-scroll-wrapper"
                        style = {{
                            ...(!scrolledBottom && { borderBottom: '0.1rem solid hsl(210, 7%, 71%)' })
                        }}
                    >    
                        <section className = "main-home__books-list">
                            {displayOptions.map((book) => {
                                return (
                                    <BookCard
                                        key = {book.id}
                                        id = {book.id}
                                        title = {book.title}
                                        authors = {book.authors}
                                        tags = {book.tags}
                                        publisher = {book.publisher}
                                        release = {book.release}  
                                        cover = {book.cover} 
                                        type = {book.type}                     
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