import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorModeContext } from '../ColorScheme';

export function LanguageButton()
{
    const { colorMode } = useContext(ColorModeContext);
    const { t, i18n } = useTranslation();

    function handleLanguageChange()
    {
        i18n.language === 'en' 
            ? i18n.changeLanguage('pt') 
            : i18n.changeLanguage('en');
    }

    return (
        <button 
            className = {`navbar__option-button navbar__option-button--${colorMode}`}
            onClick = {handleLanguageChange}
            title = {t('langOptionBtnTitle')}
        >
            {i18n.language === 'en' ? 'EN' : 'PT'}
        </button>
    )
}