import ArrowLeftIcon from "../../assets/ArrowLeftIcon";
import ArrowRightIcon from "../../assets/ArrowRightIcon";

interface IEpubOption
{
    title: string;
    text: string;
    disabledLeft?: boolean;
    disabledRight?: boolean;
    plus: () => void;
    minus: () => void;
}

export function EpubOption ({ title, text, disabledLeft, disabledRight, plus, minus }: IEpubOption)
{
    return (
        <>
            <p>{title}</p>
            <div>
                <button 
                    title = "Previous"
                    className = "epub-settings__option-button"
                    onClick = {minus}
                    disabled = {disabledLeft}
                >
                    <ArrowLeftIcon/>    
                </button> 
                <p>
                    {text}   
                </p> 
                <button 
                    title = "Next"
                    className = "epub-settings__option-button"
                    onClick = {plus}
                    disabled = {disabledRight}
                >
                    <ArrowRightIcon/>
                </button>
            </div>
        </>
    )
}