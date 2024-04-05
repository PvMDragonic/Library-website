interface IXContainer
{
    text: string;
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
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