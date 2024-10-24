import { useTranslation } from 'react-i18next';

export function LanguageButton()
{
    const { t, i18n } = useTranslation();

    function handleLanguageChange()
    {
        i18n.language === 'en' 
            ? i18n.changeLanguage('pt') 
            : i18n.changeLanguage('en');
    }

    return (
        <button 
            className = "navbar__option-button"
            onClick = {handleLanguageChange}
            title = {t('langOptionBtnTitle')}
        >
            {i18n.language === 'en' ? 'EN' : 'PT'}
        </button>
    )
}