import { useRef } from "react";
import { ColorPicker } from "../../components/ColorPicker";
import { Tags } from "../../pages/EditTags";
import { Tag } from "../../components/Tags";
import { api } from "../../database/api";
import DeleteIcon from "../../assets/DeleteIcon";
import SaveIcon from "../../assets/SaveIcon";

interface IEditTagEntry
{
    tag: Tags;
    index: number;
    activePickerRef: React.MutableRefObject<HTMLDivElement | null>;
    setTags: React.Dispatch<React.SetStateAction<Tags[]>>;
}

export function EditTagEntry({ tag, index, activePickerRef, setTags }: IEditTagEntry)
{
    const containerDivRef = useRef<HTMLDivElement>(null);
    const colorButtonRef = useRef<HTMLButtonElement>(null);
    const textInputRef = useRef<HTMLInputElement>(null);

    function checkExistingTag(allTags: Tags[], tagLabel: string)
    {
        const uniques = allTags.filter(tag => tag.label === tagLabel);
        return uniques.length > 0;
    }

    function updateTagLabel(event: React.ChangeEvent<HTMLInputElement>)
    {
        const labelName = event.target.value;

        setTags(prevElements => 
        {
            const currElements = [...prevElements];
            currElements[index] = {
                ...currElements[index],
                disabled: checkExistingTag(currElements, labelName),
                label: labelName === '' ? "<empty>" : labelName,
                empty: labelName === ''
            };
            return currElements;
        });
    }

    function updateTagColor(color: string)
    {
        setTags((prevElements) => 
        {
            const currElements = [...prevElements];
            currElements[index] = { ...currElements[index], color: color };
            return currElements;
        });
    }

    function colorPickerButton()
    {
        // Shows color picking <div> based on pressed button; collapses all others.
        setTags(
            prev => prev.map((tag, i) => 
            {
                const colorPicking = !tag.colorPicking;
                
                if (colorPicking)
                    activePickerRef.current = containerDivRef.current;

                return { 
                    ...tag, 
                    colorPicking: index === i ? colorPicking : false 
                }
            })
        );
    }

    async function saveTag()
    {
        // Validating the emptiness of the <input> instead of the label value itself
        // just in case some madman wants a tag named "<empty>", for whatever reason.
        if (textInputRef.current?.value.trim() != '')
        {
            if (tag.id === -1)
            {
                const response = await api.post(`tags/new`, { ...tag, label: tag.label.trim() });
                const newTag = response.data.tag;

                // It needs the actual id for future changes, instead of the temporary -1 id.
                setTags(prevElements => 
                {
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
    }

    function deleteConfirmation(value: boolean)
    {
        setTags(prevElements => 
        {
            const currElements = [...prevElements];
            currElements[index] = { ...currElements[index], delConfirm: value };
            return currElements;
        });
    }

    async function deleteTag()
    {
        if (tag.id != -1)
            await api.delete(`tags/${tag.id}`);

        // Can't remove using .filter() and tag.id because of 
        // (potentially) dupes of new empty tags with -1 for id.
        setTags(tags => [
            ...tags.slice(0, index),
            ...tags.slice(index + 1)
        ]);
    }

    return (
        <div 
            className = "tag-entry"
            ref = {containerDivRef}
        >
            {tag.delConfirm ? (
                <div className = "tag-entry__container">
                    <span className = "tag-entry__deletion-message">
                        <b>Are you sure you want to delete</b> <Tag  
                            label = {tag.label} 
                            color = {tag.color}
                            empty = {tag.empty}
                            minWidth = {true}
                        /><b>?</b>
                    </span>
                    <div className = "tag-entry__del-screen-container">
                        <button
                            type = "button"
                            className = "tag-entry__button tag-entry__button--confirm"
                            onClick = {deleteTag}
                        >
                            Confirm
                        </button>
                        <button
                            type = "button"
                            className = "tag-entry__button tag-entry__button--cancel"
                            onClick = {() => deleteConfirmation(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className = "tag-entry__container">
                        <div className = "tag-entry__input-wrapper">
                            <div className = "tag-entry__tag-wrapper">
                                <Tag  
                                    label = {tag.label} 
                                    color = {tag.color}
                                    empty = {tag.empty}
                                />
                            </div>
                            <label htmlFor = {tag.label + "name"}>
                                {tag.label}
                            </label>
                            <input 
                                className = {`tag-entry__input${tag.disabled ? ' tag-entry__input--disabled' : ''}`}
                                placeholder = "Must not be empty"
                                onChange = {(e) => updateTagLabel(e)}
                                value = {tag.empty ? '' : tag.label} 
                                ref = {textInputRef}
                                id = {tag.label + "name"}
                                type = "text" 
                            />
                        </div>
                        <div className = "tag-entry__buttons-wrapper">
                            <button 
                                type = "button" 
                                title = "Toggle color-picking interface"
                                className = "tag-entry__button tag-entry__button--color"
                                style = {{ background: tag.color }}
                                ref = {colorButtonRef}
                                onClick = {colorPickerButton}
                            />
                            <button
                                type = "button" 
                                title = "Save changes"
                                className = "tag-entry__button tag-entry__button--save"
                                onClick = {saveTag}
                                disabled = {tag.disabled || tag.empty}
                            >
                                <SaveIcon/>
                            </button>
                            <button
                                type = "button" 
                                title = "Delete tag"
                                className = "tag-entry__button tag-entry__button--delete" 
                                onClick = {() => deleteConfirmation(true)}
                            >
                                <DeleteIcon/>
                            </button>
                        </div>
                    </div>
                    {tag.colorPicking && (
                        <div 
                            className = "tag-entry__container" 
                            style = {{ paddingBottom: tag.colorPicking ? '0.25rem' : '' }}
                        >
                            <ColorPicker
                                tag = {tag}
                                setTag = {(value) => updateTagColor(value)}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}