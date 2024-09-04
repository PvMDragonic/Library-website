import { useMemo } from "react";

interface ICapitalizer
{
    text: string;
}

function isLetter(char: string) 
{
    // Captures letters, including those with accentuation such as ã, é, ó, etc.
    return /^\p{L}$/u.test(char);
}

function isCapital(char: string)
{
    return /^[A-Z]$/.test(char);
}

export function Capitalizer({ text }: ICapitalizer)
{
    const capitalizedText = useMemo(() => 
    {
        return text.split(' ').map((word, wordIndex, wordArray) => 
        {
            return word.split('').map((char, charIndex, charArray) => 
            {
                const isLastChar = charIndex === charArray.length - 1;
                const addTrailingSpace = wordIndex !== wordArray.length - 1 && isLastChar;

                const style = {
                    fontSize: isCapital(char) || !isLetter(char)
                        ? '16px' 
                        : '13px'
                }

                return (
                    <span 
                        key = {`${char}${wordIndex}${charIndex}`}
                        style = {style}
                    >
                        {addTrailingSpace ? `${char} ` : char}
                    </span>
                );
            });
        });
    }, [text]);

    return <>{capitalizedText}</>;
}