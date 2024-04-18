interface IXContainer
{
    text: string;
    color?: string;
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

const veryLightGrey = 'hsl(182, 48%, 67%)';

export function XContainer({ text, color, onClick }: IXContainer)
{
    return (
        <div 
            className = "XContainer"
            style = {{ backgroundColor: color || veryLightGrey }}
        >
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