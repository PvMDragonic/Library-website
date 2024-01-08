import { useEffect, useState } from "react";
import { ColorPicker } from "../../components/ColorPicker";
import { NavBar } from "../../components/NavBar";
import { ITag } from "../../components/BookCard";
import { Tag } from "../../components/Tags";
import { api } from "../../database/api";
import DeleteIcon from "../../assets/DeleteIcon";
import SaveIcon from "../../assets/SaveIcon";

export function EditTags()
{
    const [tags, setTags] = useState<ITag[]>([]);
    const [colorPicking, setColorPicking] = useState<boolean[]>([]);

    useEffect(() => {
        api.get('tags').then(
            (response) => {
                const data = response.data;
                setTags(data);
                setColorPicking(data.map(() => false));
            }
        ).catch(
            (error) => console.log(`Error while retrieving tags: ${error}`)
        );
    }, []);

    function updateTagLabel(index: number, event: React.ChangeEvent<HTMLInputElement>)
    {
        setTags((prevElements) => {
            const currElements = [...prevElements];
            currElements[index] = { ...currElements[index], label: event.target.value };
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

    function colorButton(index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        setColorPicking((prevElements) => {
            const currElements = [...prevElements];
            currElements[index] = !currElements[index];
            return currElements;
        });
        event.preventDefault();
    }

    async function saveTag(index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        const tag = tags[index];
        await api.put(`tags/${tag.id}`, tag);

        event.preventDefault();
    }

    async function deleteTag(index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        await api.delete(`tags/${tags[index].id}`);

        event.preventDefault();
    }

    return (
        <>
            <NavBar/>
            <div className = "edit-tags">
                <section className = "edit-tags__container">
                    <header className = "edit-tags__header">
                        <h1>Edit Tags</h1>
                    </header>
                    {tags.map((tag, index) => {
                        return (
                            <div key = {index} className = "edit-tags__tag-box">
                                <div className = "edit-tags__tag-info">
                                    <div className = "edit-tags__tag-container">
                                        <Tag 
                                            label = {tag.label} 
                                            color = {tag.color}
                                        />
                                    </div>
                                    <label htmlFor = {tag.label + "name"}>{tag.label}</label>
                                    <input 
                                        className = "edit-tags__name-input"
                                        placeholder = "Tag name"
                                        id = {tag.label + "name"}
                                        onChange = {(e) => updateTagLabel(index, e)}
                                        value = {tag.label} 
                                        type = "text" 
                                    />
                                    <button 
                                        className = "edit-tags__button"
                                        onClick = {(e) => colorButton(index, e)}
                                        style = {{ background: tag.color }}
                                    />
                                    <button
                                        className = "edit-tags__button edit-tags__button--save"
                                        onClick = {(e) => saveTag(index, e)}>
                                        <SaveIcon/>
                                    </button>
                                    <button
                                        className = "edit-tags__button edit-tags__button--delete" 
                                        onClick = {(e) => deleteTag(index, e)}>
                                        <DeleteIcon/>
                                    </button>
                                </div>
                                {colorPicking[index] && (
                                    <div className = "edit-tags__tag-info">
                                        <ColorPicker
                                            tag = {tag}
                                            setTag = {(value) => updateTagColor(index, value)}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </section>
            </div>
        </>
    )
}