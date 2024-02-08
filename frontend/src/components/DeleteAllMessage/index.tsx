import { Tags } from "../../pages/EditTags";
import { Tag } from "../../components/Tags";
import { api } from "../../database/api";

interface IDeleteAllMessage
{
    tags: Tags[];
    setTags: React.Dispatch<React.SetStateAction<Tags[]>>;
    setDeleteMsg: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteAllMessage({ tags, setTags, setDeleteMsg }: IDeleteAllMessage)
{
    function deleteAllTags()
    {
        setTags(currTags => 
        {
            // Deletes all shown tags (all if no <SearchBar> filter).
            currTags.filter(tag => tag.available).forEach(tag => 
            {
                if (tag.id != -1)
                    api.delete(`tags/${tag.id}`);
            });

            // Keeps the ones unavaliable (none if no <SearchBar> filter).
            return currTags.filter(tag => !tag.available);
        });
        setDeleteMsg(false);
    }

    return (
        <div className = "delete-all">
            <div className = "delete-all__wrapper">
                <h1 className = "delete-all__title">
                    Warning:
                </h1>
                {tags.some(tag => !tag.available) ? (
                    <>
                        <p className = "delete-all__text">
                            Are you sure you want to delete the following tags?
                        </p>
                        <div className = "delete-all__tags-container">
                            {tags.map((tag, index) => {
                                return tag.available && (
                                    <Tag
                                        key = {index}  
                                        label = {tag.label} 
                                        color = {tag.color}
                                        empty = {tag.empty}
                                    />
                                )
                            })}
                        </div>
                    </>
                ) : (
                    <p className = "delete-all__text">
                        Are you sure you want to delete <b>ALL</b> tags?
                    </p>
                )}
                <p className = "delete-all__text">
                    <i>This process is irreversible.</i>
                </p>
                <div className = "delete-all__buttons-container">
                    <button 
                        type = "button"
                        title = "Delete all tags" 
                        className = "delete-all__button delete-all__button--confirm"
                        onClick = {deleteAllTags}
                    >
                        Delete
                    </button>
                    <button 
                        type = "button" 
                        title = "Cancel all tags deletion"
                        className = "delete-all__button delete-all__button--cancel"
                        onClick = {() => setDeleteMsg(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}