import { HexColorInput, HexColorPicker } from "react-colorful"
import { useState } from "react";
import { ITag } from "../BookCard";

interface IColorPicker
{
    tag: Omit<ITag, 'id'>;
    setTag: (value: string) => void;
}

export function ColorPicker({ tag, setTag }: IColorPicker)
{
    const [prevColor, setPrevColor] = useState<string>(tag.color);

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
                {tag.color !== prevColor && (
                    <div className = "color-picker__subcontainer">
                        <button
                            type = "button"
                            className = "color-picker__button color-picker__button--previous"
                            onClick = {(e) => {
                                    // Prevents color-picker from closing.
                                    e.stopPropagation();
                                    setTag(prevColor);
                                }
                            }
                        >
                            Previous
                        </button>
                    </div>
                )}
                {tag.color !== '#FF9999' && (
                    <div className = "color-picker__subcontainer">
                        <button
                            type = "button"
                            className = "color-picker__button color-picker__button--default"
                            onClick = {(e) => {
                                    // Prevents closure of the color-picker.
                                    e.stopPropagation();
                                    setTag('#FF9999');
                                }
                            }
                        >
                            Default
                        </button>
                    </div>   
                )}
            </div>
            <div onMouseDown = {() => setPrevColor(tag.color)}>    
                <HexColorPicker 
                    color = {tag.color} 
                    onChange = {(value) => setTag(value)} 
                />
            </div>
        </div>
    )
}