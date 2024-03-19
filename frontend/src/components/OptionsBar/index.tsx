import { useEffect, useRef } from "react";
import { BookTags, SearchType } from "../../pages/Home";
import { OptionContainer} from "../../components/OptionContainer";
import { IBook, ITag} from "../../components/BookCard";
import { SearchBar } from "../../components/SearchBar";
import EraseIcon from "../../assets/EraseIcon";

interface IOptionsBar
{
    books: IBook[];
    tags: ITag[];
    bookTags: BookTags[];
    searchOption: SearchType;
    setShowSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchOption: React.Dispatch<React.SetStateAction<SearchType>>;
    setDisplayOptions: React.Dispatch<React.SetStateAction<IBook[]>>;
}

export function OptionsBar({ books, tags, bookTags, searchOption, setShowSideMenu, setSearchOption, setDisplayOptions }: IOptionsBar) 
{
    const mainBodyRef = useRef<HTMLDivElement>(null);

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

    const uniqueAuthors = [...new Set(books.map(book => book.author))];
    const uniquePublishers = [...new Set(books.map(book => book.publisher))];

    return (
        <section 
            ref = {mainBodyRef}
            className = "options-bar"
        >
            <SearchBar
                onChange = {handleSearch}
            />
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
                    label = {author}
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
    );
}