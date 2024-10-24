import { Trans, useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

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
                    {t('deleteAllWarningText')}
                </h1>
                {tags.some(tag => !tag.available) ? (
                    <>
                        <p className = "delete-all__text">
                            {t('deleteSomeTagsText')}
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
                        <Trans 
                            i18nKey = "deleteAllTagsText" 
                            components = {{ 1: <b/> }} 
                        />
                    </p>
                )}
                <p className = "delete-all__text">
                    <i>{t('deleteIrreversibleText')}</i>
                </p>
                <div className = "delete-all__buttons-container">
                    <button 
                        type = "button"
                        className = "delete-all__button delete-all__button--confirm"
                        onClick = {deleteAllTags}
                    >
                        {t('deleteButton')}
                    </button>
                    <button 
                        type = "button" 
                        className = "delete-all__button delete-all__button--cancel"
                        onClick = {() => setDeleteMsg(false)}
                    >
                        {t('cancelButton')}
                    </button>
                </div>
            </div>
        </div>
    )
}