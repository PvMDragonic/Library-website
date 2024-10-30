import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorModeContext } from '../ColorScheme';
import LightModeIcon from '../../assets/LightModeIcon';
import DarkModeIcon from '../../assets/DarkModeIcon';

export function LightDarkButton()
{
    const { colorMode, setColorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    return (
        <button 
            className = {`navbar__option-button navbar__option-button--${colorMode}`}
            onClick = {() => setColorMode(curr => curr === 'lm' ? 'dm' : 'lm')}
            title = {t('colorModeBtnTitle')}
        >
            {colorMode === 'lm' ? <LightModeIcon/> : <DarkModeIcon/>}
        </button>
    )
}