import { useEffect, useRef, useState } from "react";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";
import { ColorPicker } from "../../components/ColorPicker";
import { NavBar } from "../../components/NavBar";
import { ITag } from "../../components/BookCard";
import { Tag } from "../../components/Tags";
import { api } from "../../database/api";
import PlusCircleIcon from "../../assets/PlusCircleIcon";
import DeleteIcon from "../../assets/DeleteIcon";
import SaveIcon from "../../assets/SaveIcon";

const blankTag = 
{
    id: -1,
    label: "<empty>",
    color: "#FF9999",
    colorPicking: false,
    delConfirm: false,
    disabled: false,
    empty: true
}

type Tags = ITag & 
{ 
    colorPicking: boolean,
    delConfirm: boolean 
    disabled: boolean,
    empty: boolean,
};

export function EditTags()
{
    const [tags, setTags] = useState<Tags[]>([]);
    
    const colorPickerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const colorButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const textInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const containerRef = useRef<HTMLTableSectionElement>(null);

    const { hasScroll } = useHasScrollbar({ 
        elementRef: containerRef 
    });

    useEffect(() => {
        api.get('tags').then(
            (response) => setTags(response.data)
        ).catch(
            (error) => console.log(`Error while retrieving tags: ${error}`)
        );
    }, []);

    useEffect(() => 
    {
        document.addEventListener('click', handleDocumentClick);

        return () => { document.removeEventListener('click', handleDocumentClick) };
    }, []);

    function handleDocumentClick(event: MouseEvent)
    {
        const targetNode = event.target as Node;
        const clickedColorPicker = colorPickerRefs.current.some(ref => ref && ref.contains(targetNode));
        const colorButtonClickedIndex = colorButtonRefs.current.findIndex(ref => ref && ref.contains(targetNode));

        if (clickedColorPicker) return;

        // Shows color picking <div> based on pressed button; collapses all others.
        setTags(
            prev => prev.map((elem, index) => (
                { ...elem, colorPicking: index === colorButtonClickedIndex ? !elem.colorPicking : false }
            )
        ));
    };

    function handleLabelNameInput(label: string, index: number)
    {
        if (tags[index].empty)
            return '';
        return label;   
    }

    function checkExistingTag(tagLabel: string)
    {
        const uniques = tags.filter(tag => tag.label === tagLabel);
        return uniques.length > 0;
    }

    function updateTagLabel(index: number, event: React.ChangeEvent<HTMLInputElement>)
    {
        const labelName = event.target.value.trim();

        setTags((prevElements) => 
        {
            const currElements = [...prevElements];
            currElements[index] = {
                ...currElements[index],
                disabled: checkExistingTag(labelName),
                label: labelName === '' ? "<empty>" : labelName,
                empty: labelName === ''
            };
            return currElements;
        });
    }

    function updateTagColor(index: number, color: string)
    {
        setTags((prevElements) => {
            const currElements = [...prevElements];
            currElements[index] = { ...currElements[index], color: color };
            return currElements;
        });
    }

    async function saveTag(index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        // Validating the emptiness of the <input> instead of the label value itself
        // just in case some madman wants a tag named "<empty>", for whatever reason.
        if (textInputRefs.current[index]?.value.trim() != '')
        {
            const tag = tags[index];
            if (tag.id === -1)
            {
                const response = await api.post(`tags/new`, tag);
                const newTag = response.data.tag;

                // It needs the actual id for future changes, instead of the temporary -1 id.
                setTags((prevElements) => {
                    const currElements = [...prevElements];
                    currElements[index] = { ...currElements[index], id: newTag.id };
                    return currElements;
                });
            }
            else
            {
                await api.put(`tags/${tag.id}`, tag);
            }
        }

        event.preventDefault();
    }

    function deleteConfirmation(value: boolean, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        setTags((prev) => {
            const curr = [...prev];
            curr[index] = { ...curr[index], delConfirm: value };
            return curr;
        });

        event.preventDefault();
    }

    async function deleteTag(tagId: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        if (tagId != -1)
            await api.delete(`tags/${tagId}`);

        // Can't remove using .filter() and tag.id because of 
        // (potentially) dupes of new empty tags with -1 for id.
        setTags((prev) => [
            ...prev.slice(0, index),
            ...prev.slice(index + 1)
        ]);

        event.preventDefault();
    }

    const containerClass = `edit-tags__container edit-tags__container--${hasScroll ? 'scroll' : 'no-scroll'}`;

    return (
        <>
            <NavBar/>
            <div className = "edit-tags">
                <section 
                    className = {containerClass}
                    ref = {containerRef}
                >
                    <header className = "edit-tags__header">
                        <h1>Edit tags</h1>
                        <button 
                            type = "button" 
                            className = "edit-tags__button edit-tags__button--new-tag" 
                            onClick = {() => setTags((prev) => [blankTag, ...prev])}>
                                <PlusCircleIcon/>
                                ‎ New tag
                        </button>
                    </header>
                    {tags.map((tag, index) => {
                        return (
                            <div key = {index} className = "edit-tags__tag-box">
                                {tag.delConfirm && (
                                    <div className = "edit-tags__tag-info">
                                        <p>Are you sure you want to delete "{tag.label}"?</p>
                                        <button 
                                            className = "edit-tags__button edit-tags__button--confirm"
                                            onClick = {(e) => deleteTag(tag.id, index, e)}
                                        >Confirm</button>
                                        <button 
                                            className = "edit-tags__button edit-tags__button--cancel"
                                            onClick = {(e) => deleteConfirmation(false, index, e)}
                                        >Cancel</button>
                                    </div>
                                )}
                                {!tag.delConfirm && (
                                    <>
                                        <div className = "edit-tags__tag-info">
                                            <div className = "edit-tags__tag-container">
                                                <Tag  
                                                    label = {tag.label} 
                                                    color = {tag.color}
                                                    empty = {tag.empty}
                                                />
                                            </div>
                                            <label htmlFor = {tag.label + "name"}>{tag.label}</label>
                                            <input 
                                                className = {`edit-tags__input${tag.disabled ? ' edit-tags__input--disabled' : ''}`}
                                                placeholder = "Must not be empty"
                                                onChange = {(e) => updateTagLabel(index, e)}
                                                value = {handleLabelNameInput(tag.label, index)} 
                                                ref = {(element) => textInputRefs.current[index] = element}
                                                id = {tag.label + "name"}
                                                type = "text" 
                                            />
                                            <button 
                                                className = "edit-tags__button edit-tags__button--color"
                                                style = {{ background: tag.color }}
                                                onClick = {(e) => e.preventDefault()}
                                                ref = {(element) => colorButtonRefs.current[index] = element}
                                            />
                                            <button
                                                className = "edit-tags__button edit-tags__button--save"
                                                onClick = {(e) => saveTag(index, e)}
                                                disabled = {tag.disabled || tag.empty}>
                                                <SaveIcon/>
                                            </button>
                                            <button
                                                className = "edit-tags__button edit-tags__button--delete" 
                                                onClick = {(e) => deleteConfirmation(true, index, e)}>
                                                <DeleteIcon/>
                                            </button>
                                        </div>
                                        {tag.colorPicking && (
                                            <div className = "edit-tags__tag-info" ref = {(element) => colorPickerRefs.current[index] = element}>
                                                <ColorPicker
                                                    tag = {tag}
                                                    setTag = {(value) => updateTagColor(index, value)}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </section>
            </div>
        </>
    )
}