import { useEffect, useState } from 'react';
import { useFilePicker } from 'use-file-picker';
import { 
    FileAmountLimitValidator, 
    FileTypeValidator, 
    FileSizeValidator 
} from 'use-file-picker/validators';
import { ImageSelector } from '../ImageSelector';
import { setFileData } from './files';
import { IBook } from '../BookCard';
import RevertCoverIcon from '../../assets/RevertCoverIcon';
import ClearCoverIcon from '../../assets/ClearCoverIcon';
import AddFileIcon from '../../assets/AddFileIcon';
import DeleteIcon from '../../assets/DeleteIcon';

interface IFileSelector 
{
    book: IBook;
    setBook: React.Dispatch<React.SetStateAction<IBook>>;
    setLoading: React.Dispatch<React.SetStateAction<number>>;
}

export function FileSelector({ book, setBook, setLoading }: IFileSelector) 
{
    const [originalCover, setOriginalCover] = useState<string | null>(null);

    const { openFilePicker, clear, loading, errors } = useFilePicker({
        readAs: 'DataURL',
        multiple: true,
        validators: [
            new FileAmountLimitValidator({ max: 1 }),
            new FileTypeValidator(['epub', 'pdf', 'png', 'jpg']),
            new FileSizeValidator({ maxFileSize: 104857600 /* 100mb */ }),
        ],
        onFilesSuccessfullySelected: async ({ plainFiles, filesContent }) => 
        {
            setFileData({
                bookFile: filesContent[0].content, 
                fileType: plainFiles[0].type,
                setOriginalCover, 
                setBook
            });
        }
    });

    function clearSelectedFile()
    {
        clear(); // Not sure if really necessary, but just in case.
        setOriginalCover(null);
        setBook(currBook => ({ 
            ...currBook, 
            ['title']: '', 
            ['author']: '',
            ['publisher']: '',
            ['attachment']: null,
            ['cover']: null
        }));
    }

    useEffect(() => setLoading(loading ? 1 : 0), [loading]);

    if (loading) 
    {
        return (
            <div className = "file-selector">
                <i className = "book-form__saving--unselect">Loading...</i>
            </div>
        );
    }

    if (!book.attachment && !book.cover) 
    {
        return (
            <div className = "file-selector">
                <button 
                    type = "button" 
                    onClick = {() => openFilePicker()}
                    className = "file-selector__container"
                >
                    <AddFileIcon/>
                    {errors.length > 0 && (
                        <>
                            <p>Something went wrong:</p>
                            {errors.map((err, index) => (
                                <p key = {index}>{err.name}</p>
                            ))}
                        </>
                    )}
                    {errors.length == 0 && (
                        <p>Click to select a file</p>
                    )}
                </button>
            </div>
        )
    }

    if (!book.attachment)
    {
        return (
            <div style = {{position: 'relative'}} className = "file-selector">
                <div className = "file-selector__buttons-container">
                    <button 
                        type = "button"
                        onClick = {() => setBook(currBook => ({ ...currBook, ['cover']: null}))}
                        className = "file-selector__button file-selector__button--remove-image"
                    >
                        <ClearCoverIcon/>
                    </button>
                    <button 
                        type = "button"
                        onClick = {() => openFilePicker()}
                        className = "file-selector__button file-selector__button--clear-image"
                    >
                        <AddFileIcon/>
                    </button>
                    <ImageSelector
                        setCoverImage = {(image) => setBook(currBook => ({ ...currBook, ['cover']: image}))}
                    />
                </div>
                <button 
                    type = "button" 
                    className = "file-selector__container"
                    onClick = {() => openFilePicker()}
                    style = {{backgroundImage: `url(${book.cover})`}}
                />
            </div>
        );
    }
    
    return (
        <div style = {{position: 'relative'}} className = "file-selector">
            <div className = "file-selector__buttons-container">
                <button 
                    type = "button"
                    title = "Delete book file"
                    onClick = {() => clearSelectedFile()}
                    className = "file-selector__button file-selector__button--remove-file"
                >
                    <DeleteIcon/>
                </button>
                {book.cover && (
                    <button 
                        type = "button"
                        title = "Clear book cover"
                        onClick = {() => setBook(currBook => ({ ...currBook, ['cover']: null}))}
                        className = "file-selector__button file-selector__button--clear-image"
                    >
                        <ClearCoverIcon/>
                    </button>
                )}
                <ImageSelector
                    setCoverImage = {(image) => setBook(currBook => ({ ...currBook, ['cover']: image}))}
                />
                {originalCover !== book.cover && (
                    <button 
                        type = "button"
                        title = "Revert book cover"
                        onClick = {() => setBook(currBook => ({ ...currBook, ['cover']: originalCover}))}
                        className = "file-selector__button file-selector__button--revert-image"
                    >
                        <RevertCoverIcon/>
                    </button>
                )}
            </div>
            {book.cover && (
                <button 
                    type = "button" 
                    onClick = {() => openFilePicker()}
                    className = "file-selector__container"
                    style = {{backgroundImage: `url(${book.cover})`}}
                />
            )}
            {!book.cover && (
                <button 
                    type = "button" 
                    onClick = {() => openFilePicker()}
                    className = "file-selector__container"
                >[NO IMAGE]</button>
            )}
        </div>
    );
}