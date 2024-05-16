import { useMemo } from "react";
import { isDarkColor } from "../../utils/color";

interface IXContainer
{
    text: string;
    color?: string;
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

const veryLightGrey = '#82D1D3';

export function XContainer({ text, color, onClick }: IXContainer)
{
    const colorScheme = useMemo(() => (
        isDarkColor(color || veryLightGrey)
    ), []);

    return (
        <div 
            className = {`XContainer XContainer--${colorScheme ? 'white' : 'black'}`}
            style = {{ backgroundColor: color || veryLightGrey }}
        >
            {text}
            <span 
                className = {`XContainer__close XContainer__close--${colorScheme ? 'white' : 'black'}`}
                onClick = {onClick}
            >
                🗙
            </span>
        </div>
    )
}