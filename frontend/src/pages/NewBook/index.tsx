import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import { DropdownMenu } from "../../components/DropdownMenu";
import { FileSelector } from "../../components/FileSelector";
import { IBook, ITag } from '../../components/BookCard';
import { NavBar } from "../../components/NavBar";
import { api } from "../../database/api";

export const blankBook: IBook = 
{
    id: 0,
    title: "",
    author: "",
    publisher: "",
    pages: 0,
    cover: null,
    attachment: null
}

export function NewBook()
{
    const [book, setBook] = useState<IBook>(blankBook);
    const [tags, setTags] = useState<ITag[]>([]);
    const [includedTags, setIncludedTags] = useState<ITag[]>([]);
    const [fuckingLoading, setFuckingLoading] = useState<number>(0);

    const mainBodyRef = useRef<HTMLDivElement>(null);
    
    const navigate = useNavigate();
    
    useEffect(() => 
    {
        api.get('tags')
            .then((response) => {
                setTags(response.data);
            })
            .catch((error) => {
                console.log(`Error retrieving tags: ${error}`)
            });
    }, []);

    function editBook(event: React.ChangeEvent<HTMLInputElement>) 
    {
        const { name, value } = event.target;
        setBook({ ...book, [name]: value });
    }
    
    async function saveBook(event: React.FormEvent<HTMLFormElement>) 
    {
        event.preventDefault();

        try
        {
            setFuckingLoading(2);

            const newBook = (await api.post('books', book)).data.message[0] as IBook;

            for (const tag of includedTags)
            {
                // Needs to escape special characters to not bug the API with chars like '?'.
                const tagLabel = encodeURIComponent(tag.label);
                const tagExists = (await api.get(`tags/name/${tagLabel}`)).data[0] as ITag;

                if (!tagExists)
                    await api.post('tags/new', tag);

                const addedTag = (await api.get(`tags/name/${tagLabel}`)).data[0] as ITag;
                await api.post('tags/add', 
                { 
                    bookId: newBook.id, 
                    tagId: addedTag.id 
                });
            }
            
            navigate('/');
        }
        catch(error)
        {
            console.log(error);
            setFuckingLoading(0);    
        }
    }

    return (
        <>
            <NavBar
                mobile = {675}
                mainBodyRef = {mainBodyRef}
            />
            <div className = "book-form">
                <h2 
                    className = "book-form__saving book-form__saving--unselect"
                    style = {{display: fuckingLoading == 2 ? 'flex' : 'none'}}
                >
                    Saving...
                </h2>
                <form 
                    onSubmit = {saveBook} 
                    style = {{
                        pointerEvents: fuckingLoading != 0 ? 'none' : 'all',
                        opacity: fuckingLoading != 0 ? '50%' : '100%',
                        position: 'relative'
                    }}
                >
                    <header>
                        <h1>New Book</h1>
                    </header>

                    <div className = "book-form__container">
                        <div style = {{width: "50%"}}>
                            <div className = "book-form__field">
                                <label htmlFor = "title">Title:</label>
                                <input 
                                    className = "book-form__input" 
                                    type = "text" 
                                    name = "title" 
                                    id = "title" 
                                    onChange = {(e) => editBook(e)}
                                    value = {book.title} 
                                    required 
                                />
                            </div>

                            <div className = "book-form__field">
                                <label htmlFor = "author">Author:</label>
                                <input 
                                    className = "book-form__input" 
                                    type = "text" 
                                    name = "author" 
                                    id = "author" 
                                    onChange = {(e) => editBook(e)} 
                                    value = {book.author}
                                    required 
                                />
                            </div>

                            <div className = "book-form__field">
                                <label htmlFor = "publisher">Publisher:</label>
                                <input 
                                    className = "book-form__input" 
                                    type = "text" 
                                    name = "publisher" 
                                    id = "publisher" 
                                    onChange = {(e) => editBook(e)}
                                    value = {book.publisher} 
                                    required 
                                />
                            </div>

                            <div className = "book-form__field">
                                <label htmlFor = "pages">Number of pages:</label>
                                <input 
                                    className = "book-form__input" 
                                    type = "number" 
                                    name = "pages" 
                                    id = "pages" 
                                    onChange = {(e) => editBook(e)} 
                                    required
                                />
                            </div>
                        </div>
                        <FileSelector
                            book = {book}
                            setBook = {setBook}
                            setLoading = {setFuckingLoading}
                        />
                    </div>

                    <div className = "book-form__field">
                        <label>Book tags:</label>
                        <DropdownMenu 
                            options = {tags} 
                            includedTags = {includedTags}
                            setIncludedTags = {setIncludedTags}
                        />
                    </div>

                    <div className="book-form__buttons">
                        <button type="submit" className="book-form__button book-form__button--save">Save</button>
                        <button type="button" className="book-form__button book-form__button--cancel" onClick={() => navigate('/')}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    )
}