import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
            className = "delete"
        >
            <div className = "delete__container">
                <span className = "delete__text">
                    <b>Are you sure you want to delete this book?</b>
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
                    Yes
                </button>
                <button 
                    type = "button" 
                    className = "delete__button delete__button--no" 
                    onClick = {()=> abortDeletion(false)}
                >
                    No
                </button>
            </div>
        </div>
    )
}