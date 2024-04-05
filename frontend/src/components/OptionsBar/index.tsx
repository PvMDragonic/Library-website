import { useEffect, useRef, useState } from "react";
import { OptionContainer } from "../../components/OptionContainer";
import { IAuthor, IBook, ITag } from "../../components/BookCard";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";
import { NavOptions } from "../../components/NavOptions";
import { SearchBar } from "../../components/SearchBar";
import { SearchType } from "../../pages/Home";
import { api } from "../../database/api";
import EraseIcon from "../../assets/EraseIcon";

interface IOptionsBar
{
    mobile: boolean;
    sideMenu: boolean;
    searchOption: SearchType;
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchOption: React.Dispatch<React.SetStateAction<SearchType>>;
    setDisplayOptions: React.Dispatch<React.SetStateAction<IBook[]>>;
}

export function OptionsBar({ mobile, sideMenu, searchOption, setSideMenu, setSearchOption, setDisplayOptions }: IOptionsBar) 
{
    const [tags, setTags] = useState<ITag[]>([]);
    const [books, setBooks] = useState<IBook[]>([]);

    const sideBarRef = useRef<HTMLDivElement>(null);
    const mainConRef = useRef<HTMLDivElement>(null);
    const subConRef = useRef<HTMLDivElement>(null);

    // For the mobile layout (scrollbar on the container).
    const { hasScroll: hasMainScrollbar } = useHasScrollbar({ elementRef: mainConRef });
    // For the desktop layout (scrollbar on the subcontainer).
    const { hasScroll: hasSubScrollbar } = useHasScrollbar({ elementRef: subConRef });

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
                const selectedLabel = searchOption.value;
                return setDisplayOptions(
                    books.filter(book => book.tags.some(tag => tag.label === selectedLabel))
                )
            }

            case 'Author':
            {
                const selectedAuthor = searchOption.value;
                const emptyAuthor = selectedAuthor === '';
                return setDisplayOptions(!emptyAuthor
                    ? books.filter(book => book.authors.some(author => author.label === selectedAuthor))
                    : books.filter(book => book.authors.length === 0)
                );
            }

            case 'Publisher':
            {
                const selectedPublisher = searchOption.value;
                return setDisplayOptions(
                    books.filter(book => book.publisher === selectedPublisher)
                );
            }

            default:
                return setDisplayOptions(books);
        }
    }, [searchOption, tags, books]);

    // Handles closing side-menu when button is pressed below 450px.
    useEffect(() => 
    {
        const sideBar = sideBarRef.current;
        if (!sideBar) return;
        
        // Prevents the <SearchBar> from closing the side-menu at every letter typped.
        const { type, enterPress } = searchOption;
        if ((type === 'Title' || type === '') && !enterPress) return;

        // On the first button click, 'sideBar.clientWidth' may be lower than 'window.innerWidth'.
        if (sideBar.clientWidth >= window.innerWidth * 0.9)
            setSideMenu(false); 
    }, [searchOption]);

    function handleSearch(searchValue: string, toggleCase: boolean, wholeWord: boolean, enterPress?: boolean) 
    {
        if (!searchValue)
            return setSearchOption({ type: '', value: '', enterPress: false });

        setSearchOption({ 
            type: 'Title', 
            value: searchValue, 
            toggleCase: toggleCase, 
            wholeWord: wholeWord,
            enterPress: enterPress 
        });
    };

    const unknownAuthor: IAuthor = { id: -1, label: '' };
    const uniqueAuthors = books
        .flatMap(book => 
            book.authors.length > 0 ? book.authors : [unknownAuthor]
        )
        .filter((author, index, self) => 
            index === self.findIndex(t => t.label === author.label)
        );

    const uniquePublishers = [
        ...new Set(books.map(book => book.publisher))
    ];

    const optionsBarClass = mobile 
        ? `main-home__side-menu main-home__side-menu${sideMenu ? '--show' : '--hide'}` 
        : 'options-bar';

    const optionsBarContainerClass = `options-bar__container options-bar__container--${
        mobile 
            ? (hasMainScrollbar ? 'main-scroll' : 'main-no-scroll') 
            : (hasSubScrollbar ? 'sub-scroll' : 'sub-no-scroll')
    }`;

    const showErase = searchOption && !['', 'Title'].includes(searchOption.type);

    return (
        <div 
            ref = {sideBarRef}
            className = {optionsBarClass}
        >
            <div 
                ref = {mainConRef}
                className = {optionsBarContainerClass}
            >
                {mobile && (
                    <NavOptions mobile = {mobile} />
                )}
                <div style = {{ paddingRight: hasSubScrollbar ? '1.5rem' : '0rem' }}>
                    <SearchBar onChange = {handleSearch} />
                </div>
                <section 
                    ref = {subConRef}
                    className = "options-bar__subcontainer"
                    style = {{ 
                        paddingTop: showErase ? '0.5rem' : '1.25rem'
                    }}
                >
                    {showErase && (
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
                    {tags.map((tag, index) => 
                        <OptionContainer
                            key = {`${tag.label}${index}`}
                            type = {"Tag"}
                            label = {tag.label}
                            color = {tag.color}
                            setSearch = {setSearchOption}
                        />
                    )}
                    {tags.length == 0 && (
                        <p><i>None</i></p>
                    )}
                    <h4>Authors:</h4>
                    {uniqueAuthors.map((author, index) => 
                        <OptionContainer
                            key = {`${author.label}${index}`}
                            type = {"Author"}
                            label = {author.label}
                            color = {'hsl(210, 7%, 71%)'}
                            setSearch = {setSearchOption}
                        />
                    )}
                    {uniqueAuthors.length == 0 && (
                        <p><i>None</i></p>
                    )}
                    <h4>Publishers:</h4>
                    {uniquePublishers.map((publisher, index) => 
                        <OptionContainer
                            key = {`${publisher}${index}`}
                            type = {"Publisher"}
                            label = {publisher}
                            color = {'hsl(210, 7%, 71%)'}
                            setSearch = {setSearchOption}
                        />
                    )}
                    {uniquePublishers.length == 0 && (
                        <p><i>None</i></p>
                    )}
                </section>    
            </div>
        </div>
    )
}