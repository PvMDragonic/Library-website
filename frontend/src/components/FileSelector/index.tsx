import { useEffect, useRef, useState } from 'react';
import { useFilePicker } from 'use-file-picker';
import { 
    FileAmountLimitValidator, 
    FileTypeValidator, 
    FileSizeValidator 
} from 'use-file-picker/validators';
import { useDragAndDropFile } from '../../hooks/useDragAndDrop';
import { ImageSelector } from '../ImageSelector';
import { setFileData } from './files';
import { IBook } from '../BookCard';
import RevertCoverIcon from '../../assets/RevertCoverIcon';
import ClearCoverIcon from '../../assets/ClearCoverIcon';
import DropFileIcon from '../../assets/DropFileIcon';
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
    const [fileHovering, setFileHovering] = useState<boolean>(false);
    const dropAreaRef = useRef<HTMLDivElement>(null);

    const { openFilePicker, clear, loading, errors } = useFilePicker({
        readAs: 'DataURL',
        multiple: false,
        validators: [
            new FileAmountLimitValidator({ max: 1 }),
            new FileTypeValidator(['epub', 'pdf', 'png', 'jpg']),
            new FileSizeValidator({ maxFileSize: 104857600 /* 100mb */ }),
        ],
        // 'useFilePicker' needs to clear 'dragAndDropFile' because they work separately.
        onFilesSelected: () => clearFile(),
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

    const { fileLoading, fileErrors, clearFile } = useDragAndDropFile({
        containerRef: dropAreaRef,
        maxFileSize: 104857600 /* 100mb */,
        fileFormats: ['epub', 'pdf', 'png', 'jpg'],
        onFileHovered: () => setFileHovering(true),
        onFileUnhover: () => setFileHovering(false),
        onFileDropped: () => 
        {
            setFileHovering(false);
            clear(); // 'dragAndDropFile' then needs to clear 'useFilePicker'.
        },
        onFilesSuccessfullySelected: async ({ fileType, fileContent }) => 
        {
            setFileData({
                bookFile: fileContent, 
                fileType: fileType,
                setOriginalCover, 
                setBook
            });
        }
    });

    function clearSelectedFile()
    {
        clear();
        clearFile();
        setOriginalCover(null);
        setBook(currBook => ({ 
            ...currBook, 
            ['title']: '', 
            ['author']: '',
            ['publisher']: '',
            ['release']: undefined,
            ['attachment']: null ,
            ['cover']: null
        }));
    }

    useEffect(() => 
    {
        // It doesn't go through file selection when editing (where 'ogCover' is set).
        if (!originalCover && book.cover)
            setOriginalCover(book.cover);

        // Needs to run on 'book' instead of on start because book isn't ready on start.
    }, [book]);

    useEffect(() => setLoading(loading || fileLoading ? 1 : 0), [loading, fileLoading]);

    if (loading || fileLoading) 
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
            <div 
                ref = {dropAreaRef}
                className = "file-selector"
            >
                <button 
                    type = "button" 
                    onClick = {() => openFilePicker()}
                    className = "file-selector__container"
                >
                    {fileHovering ? <DropFileIcon/> : <AddFileIcon/>}
                    {errors.length || fileErrors.length ? (
                        <>
                            <p>Something went wrong:</p>
                            {errors.map((err, index) => (
                                <p key={index}>{err.name}</p>
                            ))}
                            {fileErrors.map((err, index) => (
                                <p key={index}>{err}</p>
                            ))}
                        </>
                    ) : (
                        <p>Click to select or<br/>drag & drop a file</p>
                    )}
                </button>
            </div>
        )
    }

    if (!book.attachment)
    {
        return (
            <div 
                ref = {dropAreaRef}
                style = {{position: 'relative'}} 
                className = "file-selector"
            >
                {!fileHovering ? (
                    <div className = "file-selector__buttons-container">
                        <button 
                            type = "button"
                            title = "Clear book cover"
                            onClick = {() => setBook(currBook => ({ ...currBook, ['cover']: null}))}
                            className = "file-selector__button file-selector__button--remove-image"
                        >
                            <ClearCoverIcon/>
                        </button>
                        <button 
                            type = "button"
                            title = "Add book file"
                            onClick = {() => openFilePicker()}
                            className = "file-selector__button file-selector__button--clear-image"
                        >
                            <AddFileIcon/>
                        </button>
                        <ImageSelector
                            setCoverImage = {(image) => setBook(currBook => ({ ...currBook, ['cover']: image}))}
                        />
                    </div>
                ) : (
                    <DropFileIcon/>
                )}
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
        <div 
            ref = {dropAreaRef}
            style = {{position: 'relative'}} 
            className = "file-selector"
        >
            {!fileHovering ? (
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
            ) : (
                <div className = "file-selector__drop-icon-container">
                    <DropFileIcon/>
                </div>
            )}
            <button
                type = "button"
                onClick = {() => openFilePicker()}
                className = "file-selector__container"
                style = {
                    {
                        backgroundImage: `url(${book.cover || 'none'})`, 
                        opacity: `${fileHovering ? '50%' : '100%'}`
                    }
                }
            >
                {book.cover ? null : "[NO IMAGE]"}
            </button>
        </div>
    );
}