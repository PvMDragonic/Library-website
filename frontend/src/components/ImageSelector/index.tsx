import { useFilePicker } from 'use-file-picker';
import { 
    FileAmountLimitValidator, 
    FileTypeValidator, 
    FileSizeValidator 
} from 'use-file-picker/validators';
import ChangeImageIcon from '../../assets/ChangeImageIcon';

interface IImageSelector 
{
    setCoverImage: (image: string) => void;
}

export function ImageSelector({ setCoverImage }: IImageSelector) 
{
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        validators: [
            new FileAmountLimitValidator({ max: 1 }),
            new FileTypeValidator(['jpg', 'png']),
            new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
        ],
        onFilesSuccessfullySelected: ({ filesContent }) => {
            setCoverImage(filesContent[0].content);
        }
    });

    return (
        <button
            type = "button"
            className = "book-form__file-button book-form__file-button--image"
            onClick = {() => openFilePicker()}
        >
            <ChangeImageIcon/>
        </button>
    )
}