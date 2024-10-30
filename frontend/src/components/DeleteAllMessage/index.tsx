import { useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ColorModeContext } from "../ColorScheme";
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
    const { colorMode } = useContext(ColorModeContext);
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

    const textClass = `delete-all__text delete-all__text--${colorMode}`;

    return (
        <div className = {`delete-all delete-all--${colorMode}`}>
            <div className = "delete-all__wrapper">
                <h1 className = {`delete-all__title delete-all__title--${colorMode}`}>
                    {t('deleteAllWarningText')}
                </h1>
                {tags.some(tag => !tag.available) ? (
                    <>
                        <p className = {textClass}>
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
                    <p className = {textClass}>
                        <Trans 
                            i18nKey = "deleteAllTagsText" 
                            components = {{ 1: <b/> }} 
                        />
                    </p>
                )}
                <p className = {textClass}>
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