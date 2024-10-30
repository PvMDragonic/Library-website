import { useTranslation } from 'react-i18next';
import { useFilePicker } from 'use-file-picker';
import { 
    FileAmountLimitValidator, 
    FileTypeValidator, 
    FileSizeValidator 
} from 'use-file-picker/validators';
import { Ref,
    forwardRef,
    useImperativeHandle, 
    useEffect, 
    useRef, 
    useState, 
    useContext
} from 'react';
import { useDragAndDropFile } from '../../hooks/useDragAndDrop';
import { ColorModeContext } from '../ColorScheme';
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
    focusCallback: (e: React.KeyboardEvent) => void;
}

export interface FileSelectorHandle
{
    focus: () => void;
}

function FileSelectorComponent({ book, setBook, setLoading, focusCallback }: IFileSelector, ref: Ref<FileSelectorHandle>) 
{
    const [originalCover, setOriginalCover] = useState<string | null>(null);
    const [fileHovering, setFileHovering] = useState<boolean>(false);
    const [focusIndex, setFocusIndex] = useState<number>(0);

    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    const fileButtonRef = useRef<HTMLButtonElement>(null);
    const dropAreaRef = useRef<HTMLDivElement>(null);

    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    useImperativeHandle(ref, () => ({
        focus: () => fileButtonRef.current?.focus()
    }));

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
            ['attachment']: null,
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

    function handleNavigation(event: React.KeyboardEvent)
    {
        if (event.key !== 'Tab')
            return;

        event.preventDefault();

        const elems = buttonsContainerRef.current;
        if (!elems) return;

        const children = elems.children;
        if (focusIndex > children.length - 1)
        {
            focusCallback(event);
            setFocusIndex(0);
        }
        else
        {
            (children[focusIndex] as HTMLButtonElement).focus();
            setFocusIndex(prev => prev + 1);
        }
    }

    if (loading || fileLoading) 
    {
        return (
            <div className = {`file-selector file-selector--${colorMode}`}>
                <i className = "book-form__saving--unselect">Loading...</i>
            </div>
        );
    }

    const containerClass = `file-selector__container file-selector__container--${colorMode}`; 
    const buttonClass = `file-selector__button file-selector__button--${colorMode} file-selector__button`;

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
                    onKeyDown = {(e) => focusCallback(e)}
                    className = {containerClass}
                    ref = {fileButtonRef}
                >
                    {fileHovering ? <DropFileIcon/> : <AddFileIcon/>}
                    {errors.length || fileErrors.length ? (
                        <>
                            <p>{t('fileErrorText')}</p>
                            {errors.map((err, index) => (
                                <p key={index}>{t(err.name)}</p>
                            ))}
                            {fileErrors.map((err, index) => (
                                <p key={index}>{t(err)}</p>
                            ))}
                        </>
                    ) : (
                        <p>{t('fileInstructionText1')}<br/>{t('fileInstructionText2')}</p>
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
                    <div 
                        className = {containerClass}
                        onKeyDown = {(e) => handleNavigation(e)}
                        ref = {buttonsContainerRef}
                    >
                        <button 
                            type = "button"
                            title = {t('clearCoverBtnTitle')}
                            onClick = {() => setBook(currBook => ({ ...currBook, ['cover']: null}))}
                            className = {`${buttonClass}--remove-image`}
                        >
                            <ClearCoverIcon/>
                        </button>
                        <button 
                            type = "button"
                            title = {t('addBookFileBtnTitle')}
                            onClick = {() => openFilePicker()}
                            className = {`${buttonClass}--clear-image`}
                        >
                            <AddFileIcon/>
                        </button>
                        <ImageSelector
                            buttonClass = {buttonClass}
                            setCoverImage = {(image) => setBook(currBook => ({ ...currBook, ['cover']: image}))}
                        />
                    </div>
                ) : (
                    <DropFileIcon/>
                )}
                <button 
                    type = "button" 
                    onClick = {() => openFilePicker()}
                    onKeyDown = {(e) => handleNavigation(e)}
                    style = {{backgroundImage: `url(${book.cover})`}}
                    ref = {fileButtonRef}
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
                <div 
                    className = "file-selector__buttons-container"
                    onKeyDown = {(e) => handleNavigation(e)}
                    ref = {buttonsContainerRef}
                >
                    <button 
                        type = "button"
                        title = {t('deleteBookFileBtnTitle')}
                        onClick = {() => clearSelectedFile()}
                        className = {`${buttonClass}--remove-file`}
                    >
                        <DeleteIcon/>
                    </button>
                    {book.cover && (
                        <button 
                            type = "button"
                            title = {t('clearCoverBtnTitle')}
                            onClick = {() => setBook(currBook => ({ ...currBook, ['cover']: null}))}
                            className = {`${buttonClass}--clear-image`}
                        >
                            <ClearCoverIcon/>
                        </button>
                    )}
                    <ImageSelector
                        buttonClass = {buttonClass}
                        setCoverImage = {(image) => setBook(currBook => ({ ...currBook, ['cover']: image}))}
                    />
                    {originalCover !== book.cover && (
                        <button 
                            type = "button"
                            title = {t('revertCoverBtnTitle')}
                            onClick = {() => setBook(currBook => ({ ...currBook, ['cover']: originalCover}))}
                            className = {`${buttonClass}--revert-image`}
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
                onKeyDown = {(e) => handleNavigation(e)}
                className = {containerClass}
                ref = {fileButtonRef}
                style = {
                    {
                        backgroundImage: `url(${book.cover || 'none'})`, 
                        opacity: `${fileHovering ? '50%' : '100%'}`
                    }
                }
            >
                {book.cover ? null : t('noBookCoverText')}
            </button>
        </div>
    );
}

// Creates an optional custom ref for the component.
export const FileSelector = forwardRef(FileSelectorComponent);