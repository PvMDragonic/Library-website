import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useMobileLayout } from "../../hooks/useMobileLayout";
import { ColorModeContext } from "../../components/ColorScheme";
import { TitleContainer } from "../../components/TitleContainer";
import { BookCard, ITag } from "../../components/BookCard";
import { OptionsBar } from "../../components/OptionsBar";
import { useScrolled } from "../../hooks/useScrolled";
import { IBook } from "../../components/BookCard";
import { NavBar } from "../../components/NavBar";
import { SideMenu } from "../../components/SideMenu";
import { NavOptions } from "../../components/NavOptions";
import { api } from "../../database/api";

export interface SearchType
{
    type: string;
    value: string;
    firstLoad?: boolean;
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
    const [searchOption, setSearchOption] = useState<SearchType>(emptySearch);
    const [displayOptions, setDisplayOptions] = useState<IBook[]>([]);
    const [showSideMenu, setShowSideMenu] = useState<boolean>(false);

    const mainBodyRef = useRef<HTMLDivElement>(null);
    const booksListRef = useRef<HTMLDivElement>(null);
    const booksWrapperRef = useRef<HTMLDivElement>(null);

    const { scrolledBottom } = useScrolled({ element: booksWrapperRef });
    const { mobileLayout } = useMobileLayout({ widthMark: 800 });
    const { colorMode } = useContext(ColorModeContext);
    
    const cachedOptionsBar = useMemo(() => 
    {
        return (
            <OptionsBar
                books = {books}
                tags = {tags}
                mobile = {mobileLayout}
                searchOption = {searchOption}
                setSideMenu = {setShowSideMenu}
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
    }, []);

    useEffect(() => 
    {
        if (!mobileLayout)
            setShowSideMenu(false)
    }, [mobileLayout]);

    return (
        <>
            <NavBar 
                mobile = {mobileLayout}
                showSideMenu = {showSideMenu}
                setShowSideMenu = {setShowSideMenu}
            />
            {mobileLayout && (
                <SideMenu 
                    showMenu = {showSideMenu}
                    mainBodyRef = {mainBodyRef}
                    setShowMenu = {setShowSideMenu}
                >
                    <NavOptions 
                        mobile = {mobileLayout} 
                    />
                    {cachedOptionsBar}
                </SideMenu>
            )}
            <div 
                ref = {mainBodyRef}
                className = {`main-home main-home--${colorMode}`}
            >
                {!mobileLayout && (cachedOptionsBar)}
                <div className = "main-home__container" ref = {booksListRef}>
                    <TitleContainer
                        totalBooks = {displayOptions.length}
                        searchOption = {searchOption}
                    />
                    <div 
                        ref = {booksWrapperRef}
                        className = {`main-home__books-wrapper main-home__books-wrapper--${colorMode}`}
                        // Monkey brain solution to prevent CSS polution.
                        style = {{ '--scrolled-bottom': String(!scrolledBottom) } as React.CSSProperties}
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