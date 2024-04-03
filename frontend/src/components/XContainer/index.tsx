interface IXContainer
{
    text: string;
    onClick: () => void;
}

export function XContainer({ text, onClick }: IXContainer)
{
    return (
        <div className = "XContainer">
            {text}
            <span 
                className = "XContainer__close"
                onClick = {onClick}
            >
                🗙
            </span>
        </div>
    )
}