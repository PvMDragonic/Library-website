import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ColorModeContext } from '../ColorScheme';
import { api } from '../../database/api';

interface IMessage 
{
    id: number;
    title: string;
    abortDeletion: (type: boolean) => void;
}

export function DeleteMessage({ id, title, abortDeletion }: IMessage) 
{
    const deleteRef = useRef<HTMLDivElement>(null);

    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    const navigate = useNavigate();

    function deleteBook() 
    {
        api.delete(`books/${id}`)
            .then(
                () => navigate('/')
            )
            .catch(
                error => console.log(`Error deleting book: ${error}`)
            );
    }

    return (
        <div 
            ref = {deleteRef}
            className = {`delete delete--${colorMode}`}
        >
            <div className = "delete__container">
                <span className = {`delete__text delete__text--${colorMode}`}>
                    <b>{t('deleteBookMessage')}</b>
                    <br/>
                    <i>"{title}"</i>
                </span>
            </div>
            <div className = "delete__container">
                <button 
                    type = "button" 
                    className = "delete__button delete__button--yes" 
                    onClick = {deleteBook}
                >
                    {t('yesButton')}
                </button>
                <button 
                    type = "button" 
                    className = "delete__button delete__button--no" 
                    onClick = {()=> abortDeletion(false)}
                >
                    {t('noButton')}
                </button>
            </div>
        </div>
    )
}