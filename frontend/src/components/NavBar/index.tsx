import { useTranslation } from 'react-i18next';
import { HamburguerMenu } from '../HamburguerMenu';
import { LanguageButton } from '../LanguageButton';
import { LightDarkButton } from '../LightDarkButton';
import { ColorModeContext } from '../ColorScheme';
import { NavOptions } from '../NavOptions';
import { useContext } from 'react';

interface INavBar 
{
    mobile: boolean;
    showSideMenu: boolean;
    setShowSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBar({ mobile, showSideMenu, setShowSideMenu }: INavBar)
{
    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    return (
        <nav 
            className = {`navbar navbar--${colorMode}`} 
            role = "navigation" 
            aria-label = "Main"
        >
            <div className = "navbar__menu">
                {mobile && (
                    <HamburguerMenu 
                        mobile = {mobile}
                        showSideMenu = {showSideMenu}
                        setShowSideMenu = {setShowSideMenu}
                    />
                )}
                <h1 className = {`navbar__title navbar__title--${colorMode}`}>
                    {t('libraryTitle')}
                </h1>
            </div>
            <div 
                className = "navbar__container"
                style = {{
                    ...(mobile && { marginRight: '-0.35rem' }),
                    gap: mobile ? '0.65rem' : '1rem'
                }}
            >
                <LightDarkButton/>
                <LanguageButton/>
                {!mobile && (
                    <NavOptions/>
                )}
            </div>
        </nav>
    )
}