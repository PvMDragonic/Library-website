import { useEffect, useRef } from "react";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";
import { OptionContainer} from "../../components/OptionContainer";
import { IAuthor, IBook, ITag} from "../../components/BookCard";
import { SearchBar } from "../../components/SearchBar";
import { SearchType } from "../../pages/Home";
import EraseIcon from "../../assets/EraseIcon";

interface IOptionsBar
{
    books: IBook[];
    tags: ITag[];
    mobileLayout: boolean;
    searchOption: SearchType;
    setShowSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchOption: React.Dispatch<React.SetStateAction<SearchType>>;
    setDisplayOptions: React.Dispatch<React.SetStateAction<IBook[]>>;
}

export function OptionsBar({ books, tags, mobileLayout, searchOption, setShowSideMenu, setSearchOption, setDisplayOptions }: IOptionsBar) 
{
    const mainBodyRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { hasScroll } = useHasScrollbar({ 
        elementRef: containerRef 
    });

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
        const mainBody = mainBodyRef.current;
        if (!mainBody) return;
        
        // Prevents the <SearchBar> from closing the side-menu at every letter typped.
        const { type, enterPress } = searchOption;
        if ((type === 'Title' || type === '') && !enterPress) return;

        // sideMenu.clientWidth doesn't account for its padding, so 0.85 makes up for it.
        if (mainBody.parentElement?.clientWidth! >= window.innerWidth * 0.85)
            setShowSideMenu(false); 
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

    const showErase = searchOption && !['', 'Title'].includes(searchOption.type);

    return (
        <section 
            ref = {mainBodyRef}
            className = {`options-bar options-bar--${hasScroll ? 'scroll' : 'no-scroll'}`}
            style = {{
                ...(mobileLayout && { paddingRight: '0rem' })
            }}
        >
            <div 
                className = "options-bar__search-bar-wrapper"
                style = {{
                    paddingRight: mobileLayout ? '0rem' : (hasScroll ? '1.5rem' : '0.5rem')
                }}
            >
                <SearchBar
                    onChange = {handleSearch}
                />
            </div>
            <div 
                ref = {containerRef}
                className = "options-bar__container"
                style = {{
                    paddingRight: hasScroll || mobileLayout ? '0rem' : '0.5rem',
                    ...(showErase && { paddingTop: '0.5rem' })
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
                        key = {`${author}${index}`}
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
            </div>
        </section>
    );
}