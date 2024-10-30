import { useTranslation } from 'react-i18next';
import { HamburguerMenu } from '../HamburguerMenu';
import { LanguageButton } from '../LanguageButton';
import { LightDarkButton } from '../LightDarkButton';
import { ColorModeContext } from '../ColorScheme';
import { NavOptions } from '../NavOptions';
import { useContext } from 'react';

interface INavBar 
{
    mobile?: boolean;
    sideMenu?: boolean;
    mainBodyRef?: React.RefObject<HTMLDivElement>;
    setSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBar({ mobile, sideMenu, mainBodyRef, setSideMenu }: INavBar)
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
                {setSideMenu && (
                    <HamburguerMenu 
                        mobile = {mobile}
                        sideMenu = {sideMenu}
                        mainBodyRef = {mainBodyRef}
                        setSideMenu = {setSideMenu}
                    />
                )}
                <h1 className = {`navbar__title navbar__title--${colorMode}`}>
                    {t('libraryTitle')}
                </h1>
            </div>
            <div className = "navbar__container">
                <LightDarkButton/>
                <LanguageButton/>
                {!mobile && (
                    <NavOptions/>
                )}
            </div>
        </nav>
    )
}