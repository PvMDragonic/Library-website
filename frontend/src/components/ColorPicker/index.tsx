import { HexColorInput, HexColorPicker } from "react-colorful"
import { ITag } from "../BookCard";

interface IColorPicker
{
    tag: ITag;
    setTag: (value: string) => void;
}

export function ColorPicker({ tag, setTag }: IColorPicker)
{
    return (
        <div className = "color-picker">
            <div className = "color-picker__container">
                <div className = "color-picker__subcontainer">
                    <p>HEX VALUE:</p>
                    <HexColorInput 
                        color = {tag.color} 
                        onChange = {(value) => setTag(value)} 
                    />
                </div>
            </div>   
            <HexColorPicker 
                color = {tag.color} 
                onChange = {(value) => setTag(value)} 
            />
        </div>
    )
}