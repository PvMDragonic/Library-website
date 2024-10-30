import { useTranslation } from "react-i18next";
import { useContext, useEffect, useRef } from "react";
import { IAuthor, IBook, ITag} from "../../components/BookCard";
import { ColorModeContext } from "../../components/ColorScheme";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";
import { OptionContainer} from "../../components/OptionContainer";
import { useScrolled } from "../../hooks/useScrolled";
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

    const { scrolledBottom } = useScrolled({ element: containerRef });
    const { hasScroll } = useHasScrollbar({ elementRef: containerRef });
    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

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

    const defaultColor = colorMode === 'lm' ? 'hsl(184, 50%, 50%)' : 'hsl(0, 5%, 75%)';

    const containerStyle = 
    {
        paddingRight: hasScroll || mobileLayout ? '0rem' : '0.5rem',
        '--scrolled-bottom': String(!scrolledBottom),
        ...(hasScroll && { paddingLeft: '0.5rem' }),
        ...(showErase && { paddingTop: '0.5rem' })
    };

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
                    paddingRight: mobileLayout ? '0rem' : (hasScroll ? '1.5rem' : '0.5rem'),
                    ...(hasScroll && { paddingLeft: '0.5rem' })
                }}
            >
                <SearchBar 
                    onChange = {handleSearch}
                />
            </div>
            <div 
                ref = {containerRef}
                style = {containerStyle}
                className = {`options-bar__container options-bar__container--${colorMode}`}
            >
                {showErase && (
                    <button
                        type = "button"
                        title = {t('resetFilterBtnTitle')}
                        className = {`options-bar__reset-search options-bar__reset-search--${colorMode}`}
                        onClick = {() => setSearchOption({ type: '', value: '' })}
                    >
                        <EraseIcon/>
                    </button>
                )}
                <h4>{t('tagsMenuLabel')}</h4>
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
                    <p><i>{t('emptyMenuEntry')}</i></p>
                )}
                <h4>{t('authorsMenuEntry')}</h4>
                {uniqueAuthors.map((author, index) => 
                    <OptionContainer
                        key = {`${author.label}${index}`}
                        type = {"Author"}
                        label = {author.label}
                        color = {defaultColor}
                        setSearch = {setSearchOption}
                    />
                )}
                {uniqueAuthors.length == 0 && (
                    <p><i>{t('emptyMenuEntry')}</i></p>
                )}
                <h4>{t('publishersMenuEntry')}</h4>
                {uniquePublishers.map((publisher, index) => 
                    <OptionContainer
                        key = {`${publisher}${index}`}
                        type = {"Publisher"}
                        label = {publisher}
                        color = {defaultColor}
                        setSearch = {setSearchOption}
                    />
                )}
                {uniquePublishers.length == 0 && (
                    <p><i>{t('emptyMenuEntry')}</i></p>
                )}
            </div>
        </section>
    );
}