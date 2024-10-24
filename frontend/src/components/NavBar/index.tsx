import { useTranslation } from 'react-i18next';
import { HamburguerMenu } from '../HamburguerMenu';
import { LanguageButton } from '../LanguageButton';
import { NavOptions } from '../NavOptions';

interface INavBar 
{
    mobile?: boolean;
    sideMenu?: boolean;
    mainBodyRef?: React.RefObject<HTMLDivElement>;
    setSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBar({ mobile, sideMenu, mainBodyRef, setSideMenu }: INavBar)
{
    const { t } = useTranslation();

    return (
        <nav 
            className = "navbar" 
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
                <h1 className = "navbar__title">
                    {t('libraryTitle')}
                </h1>
            </div>
            <div className = "navbar__container">
                <LanguageButton/>
                {!mobile && (
                    <NavOptions/>
                )}
            </div>
        </nav>
    )
}