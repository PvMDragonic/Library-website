import { useContext, useEffect, useRef, useState } from 'react';
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
    const [height, setHeight] = useState<number>(0);
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

    useEffect(() => 
    {
        const ref = deleteRef.current;
        if (!ref) return;

        const calculateHeight = () => 
        {
            // The <header> and <DeleteMessage> itself are indexes 0 and 1 in the <form>.
            const children = ref.parentElement!.children;
            let heightSum = 0;

            for (let i = 2; i < children.length; i++) 
                heightSum += children[i].clientHeight;

            // 32 and 24 are to account for margins and paddings.
            return heightSum + 32 + 24;
        }

        // Initial reading, for when the delete message appears.
        setHeight(calculateHeight());

        // If the screen gets resized while the message is up.
        const resizeObserver = new ResizeObserver(() => 
            setHeight(calculateHeight())
        );

        resizeObserver.observe(ref);

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div 
            ref = {deleteRef}
            style = {{ height: height }}
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