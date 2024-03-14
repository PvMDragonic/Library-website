import { useEffect, useRef, useState } from "react";
import { DeleteAllMessage } from "../../components/DeleteAllMessage";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";
import { EditTagEntry } from "../../components/EditTagEntry";
import { SearchBar } from "../../components/SearchBar";
import { NavBar } from "../../components/NavBar";
import { ITag } from "../../components/BookCard";
import { api } from "../../database/api";
import PlusCircleIcon from "../../assets/PlusCircleIcon";
import DeleteIcon from "../../assets/DeleteIcon";

const blankTag = 
{
    id: -1,
    label: "<empty>",
    color: "#FF9999",
    savedLabel: "<empty>",
    savedColor: "#FF9999",
    colorPicking: false,
    delConfirm: false,
    disabled: false,
    available: true,
    saved: true,
    empty: true  
}

export type Tags = ITag & 
{ 
    savedLabel: string,
    savedColor: string,
    colorPicking: boolean,
    delConfirm: boolean,
    available: boolean,
    disabled: boolean, 
    saved: boolean,
    empty: boolean
};

export function EditTags()
{
    const [tags, setTags] = useState<Tags[]>([]);
    const [deleteMsg, setDeleteMsg] = useState(false);

    const containerRef = useRef<HTMLTableSectionElement>(null);
    const activePickerRef = useRef<HTMLDivElement>(null);
    const mainBodyRef = useRef<HTMLDivElement>(null);

    // Needs a ref to keep 'tags' accessible inside 'handleDocumentClick'.
    const tagsRef = useRef<Tags[]>(tags);
    
    const { hasScroll } = useHasScrollbar({ elementRef: containerRef });

    useEffect(() => 
    {
        api.get('tags').then(
            (response) => setTags(
                // Database lacks the added attributes from 'Tags' type.
                response.data.map((tag: ITag) => ({
                    ...tag,
                    savedLabel: tag.label,
                    savedColor: tag.color,
                    colorPicking: false,
                    delConfirm: false,
                    disabled: false,
                    available: true,
                    saved: true,
                    empty: false
                }))
            )
        ).catch(
            (error) => console.log(`Error while retrieving tags: ${error}`)
        );
    }, []);

    useEffect(() => 
    {
        function handleDocumentClick(event: MouseEvent)
        {
            // Returns if there's no open color picker.
            if (tagsRef.current.findIndex(tag => tag.colorPicking) === -1) 
                return;
            
            // Returns if the click happened inside the active color picker.
            if (activePickerRef.current?.contains(event.target as Node))
                return;

            setTags(
                prevElements => prevElements.map(elem => ({ ...elem, colorPicking: false }))
            );
        };

        document.addEventListener('click', handleDocumentClick);

        return () => document.removeEventListener('click', handleDocumentClick);
    }, []);

    useEffect(() => 
    {
        tagsRef.current = tags;
    }, [tags]);

    useEffect(() => 
    {
        if (!deleteMsg) return;

        const container = containerRef.current;
        if (!container) return;

        // Scrolls the main <section> to prevent a broken visual state during <DeleteAllMessage>.
        container.scrollTop = 0;
    }, [deleteMsg]);

    function filterOptions(searchValue: string, toggleCase: boolean, wholeWord: boolean)
    {
        const search = toggleCase ? searchValue : searchValue.toLowerCase();

        setTags(prev =>
            prev.map(tag => {
                const label = toggleCase ? tag.label : tag.label.toLowerCase();
                return {
                    ...tag,
                    available: wholeWord ? label === search : label.includes(search)
                };
            })
        );
    }

    const containerClass = `edit-tags__container edit-tags__container--${
        hasScroll && !deleteMsg ? 'scroll' : 'no-scroll'
    }`;

    return (
        <>
            <NavBar
                mobile = {675}
                mainBodyRef = {mainBodyRef}
            />
            <div 
                ref = {mainBodyRef}
                className = "edit-tags"
            >
                <section 
                    className = {containerClass}
                    style = {{ overflow: deleteMsg ? 'hidden' : 'auto' }}
                    ref = {containerRef}
                >
                    <header className = "edit-tags__header">
                        <div>
                            <h1>Edit tags</h1>
                        </div>
                        {!deleteMsg && (
                            <div>
                                {tags.some(tag => tag.available) && (
                                    <button 
                                        type = "button" 
                                        className = "edit-tags__button edit-tags__button--del-all" 
                                        onClick = {() => setDeleteMsg(true)}
                                    >
                                        <DeleteIcon/>
                                        ‎ Delete all
                                    </button>
                                )}
                                <button 
                                    type = "button" 
                                    className = "edit-tags__button edit-tags__button--new-tag" 
                                    onClick = {() => setTags((prev) => [blankTag, ...prev])}
                                >
                                    <PlusCircleIcon/>
                                    ‎ New tag
                                </button>
                            </div>
                        )}
                    </header>
                    {deleteMsg && (
                        <DeleteAllMessage
                            tags = {tags}
                            setTags = {setTags}
                            setDeleteMsg = {setDeleteMsg}
                        />
                    )}
                    {tags.length !== 0 && (
                        <SearchBar
                            onChange = {filterOptions}
                        />
                    )}
                    {tags.some(tag => tag.available) ? (
                        <>
                            {tags.map((tag, index) => {
                                return tag.available && (
                                    <EditTagEntry
                                        key = {`${tag.id}${index}`}
                                        tag = {tag}
                                        index = {index}
                                        activePickerRef = {activePickerRef}
                                        setTags = {setTags}
                                    />
                                )
                            })}
                        </>
                    ) : (
                        <h2>Such wow, much empty!</h2>
                    )}
                </section>
            </div>
        </>
    )
}