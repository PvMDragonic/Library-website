import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { ColorModeContext } from "../ColorScheme";
import { ITag } from "../BookCard";

interface IColorPicker
{
    tag: Omit<ITag, 'id'>;
    setTag: (value: string) => void;
}

export function ColorPicker({ tag, setTag }: IColorPicker)
{
    const [prevColor, setPrevColor] = useState<string>(tag.color);
    
    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    return (
        <div className = "color-picker">
            <div className = "color-picker__container">
                <div className = {`color-picker__subcontainer color-picker__subcontainer--${colorMode}`}>
                    <p>{t('hexValueText')}</p>
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
                            {t('previousColorBtnText')}
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
                            {t('defaultColorBtnText')}
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