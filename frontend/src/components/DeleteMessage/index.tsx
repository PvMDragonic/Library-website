import { useNavigate } from 'react-router-dom';
import { api } from '../../database/api';

interface IMessage 
{
    id: number;
    title: string
    abortDeletion: (type: boolean) => void;
}

export function DeleteMessage({ id, title, abortDeletion }: IMessage) 
{
    const navigate = useNavigate();

    function deleteBook() 
    {
        api.delete(`books/${id}`)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.log(`Error when deleting book: ${error}`);
            });
    }

    return (
        <div className="delete">
            <div className="delete__message">
                <p>Are you sure you want to delete this book?</p>
                <p><strong>{title}</strong></p>

                <div className="delete__buttons">
                    <button type="button" className='delete__button delete__button--yes' onClick={deleteBook}>Yes</button>
                    <button type="button" className='delete__button delete__button--no' onClick={()=> abortDeletion(false)}>No</button>
                </div>
            </div>
        </div>
    )
}