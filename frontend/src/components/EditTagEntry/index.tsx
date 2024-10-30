import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../../components/ColorScheme";
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
    const [playAnimation, setPlayAnimation] = useState<boolean>(false);

    const containerDivRef = useRef<HTMLDivElement>(null);
    const colorButtonRef = useRef<HTMLButtonElement>(null);
    const textInputRef = useRef<HTMLInputElement>(null);

    // Need a ref to access it inside the useEffect.
    const playAnimRef = useRef<boolean>(false);

    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    useEffect(() => activateUnsavedIndicator(), [tag.colorPicking]);

    useEffect(() =>
    {
        playAnimRef.current = playAnimation;
    }, [playAnimation]);

    useEffect(() =>
    {
        const equalLabels = tag.label === tag.savedLabel;
        const equalColors = tag.color === tag.savedColor;
        const condition1 = playAnimRef.current && equalLabels && equalColors;
        const condition2 = tag.empty || tag.disabled;

        if (condition1 || condition2)
            setPlayAnimation(false);
    }, [tag.label, tag.color]);

    function activateUnsavedIndicator()
    {
        if (!tag.saved && !tag.colorPicking && !tag.empty && !tag.disabled)
            setPlayAnimation(true)
    }

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
            const currTag = currElements[index];

            currElements[index] = {
                ...currTag,
                disabled: checkExistingTag(currElements, labelName),
                label: labelName === '' ? "<empty>" : labelName,
                empty: labelName === '',
                saved: labelName === currTag.savedLabel && 
                    currTag.color === currTag.savedColor
            };

            return currElements;
        });
    }

    function updateTagColor(color: string)
    {
        setTags(prevElements => 
        {
            const currElements = [...prevElements];

            currElements[index] = { 
                ...currElements[index], 
                color: color,
                saved: false
            };

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

            setTags(prevElements => 
            {
                const currElements = [...prevElements];
                const currTag = currElements[index];
    
                currElements[index] = { 
                    ...currTag, 
                    savedLabel: currTag.label,
                    savedColor: currTag.color,
                    saved: true
                };
    
                return currElements;
            });

            setPlayAnimation(false);
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

    const buttonClassName = `tag-entry__button tag-entry__button--${colorMode} tag-entry__button`;
    const buttonAnimation = `${playAnimation ? ` tag-entry__button--animation-${colorMode}` : ''}`
    const inputClassName = `tag-entry__input${tag.disabled ? ` tag-entry__input--${colorMode}-disabled` : ''} tag-entry__input--${colorMode}`;

    return (
        <div 
            className = {`tag-entry tag-entry--${colorMode}`}
            ref = {containerDivRef}
        >
            {tag.delConfirm ? (
                <div className = "tag-entry__container">
                    <span className = {`tag-entry__del-message tag-entry__del-message--${colorMode}`}>
                        <b>{t('tagDeleteConfirmation')}</b> <Tag  
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
                            {t('confirmButton')}
                        </button>
                        <button
                            type = "button"
                            className = "tag-entry__button tag-entry__button--cancel"
                            onClick = {() => deleteConfirmation(false)}
                        >
                            {t('cancelButton')}
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
                                className = {inputClassName}
                                placeholder = {t('notEmptyPlaceholderText')}
                                onChange = {(e) => updateTagLabel(e)}
                                onBlur = {activateUnsavedIndicator}
                                value = {tag.empty ? '' : tag.label} 
                                ref = {textInputRef}
                                id = {tag.label + "name"}
                                type = "text" 
                            />
                        </div>
                        <div className = "tag-entry__buttons-wrapper">
                            <button 
                                type = "button" 
                                title = {t('toggleColorPickingTitle')}
                                className = {`${buttonClassName}--color`}
                                style = {{ background: tag.color }}
                                ref = {colorButtonRef}
                                onClick = {colorPickerButton}
                            />
                            <button
                                type = "button" 
                                title = {t('saveChangesBtnTitle')}
                                className = {`${buttonClassName}--save${buttonAnimation}`}
                                onClick = {saveTag}
                                disabled = {tag.disabled || tag.empty}
                            >
                                <SaveIcon/>
                            </button>
                            <button
                                type = "button" 
                                title = {t('deleteTagBtnTitle')}
                                className = {`${buttonClassName}--delete`}
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