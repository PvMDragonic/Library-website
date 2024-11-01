import { useTranslation } from 'react-i18next';
import { useEffect, useState, useContext } from 'react';
import { useMobileLayout } from '../../hooks/useMobileLayout';
import { LanguageButton } from '../LanguageButton';
import { HamburguerMenu } from '../HamburguerMenu';
import { LightDarkButton } from '../LightDarkButton';
import { ColorModeContext } from '../ColorScheme';
import { NavOptions } from '../NavOptions';
import { SideMenu } from '../SideMenu';

interface INavBar 
{
    mobile: number | boolean;
    mainBodyRef: React.RefObject<HTMLDivElement>;
    sideMenuContent?: React.ReactNode;
    sideMenuStateProps?: [
        boolean, 
        React.Dispatch<React.SetStateAction<boolean>>
    ];
}

export function NavBar({ mobile, mainBodyRef, sideMenuContent, sideMenuStateProps }: INavBar)
{
    // Creates it's own state variable if not provided; else, use the provided props.
    const [showSideMenu, setShowSideMenu] = sideMenuStateProps 
        ? sideMenuStateProps 
        : useState<boolean>(false);

    const mobileLayout = typeof mobile === "number" 
        ? useMobileLayout({ widthMark: mobile }).mobileLayout 
        : mobile;

    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    // Prevents the <SideMenu> from showing up open when switching layouts (if it was left open before).
    useEffect(() => setShowSideMenu(false), [mobileLayout]);

    return (
        <>
            <nav 
                className = {`navbar navbar--${colorMode}`} 
                role = "navigation" 
                aria-label = "Main"
                style = {{ paddingLeft: mobileLayout ? '0.5rem' : '1rem' }}
            >
                <div className = "navbar__menu">
                    {mobileLayout && (
                        <HamburguerMenu
                            showSideMenu = {showSideMenu!}
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
                        ...(mobileLayout && { marginRight: '-0.35rem' }),
                        gap: mobileLayout ? '0.65rem' : '1rem'
                    }}
                >
                    <LightDarkButton/>
                    <LanguageButton/>
                    {!mobileLayout && (
                        <NavOptions/>
                    )}
                </div>
            </nav>
            {mobileLayout && (
                <SideMenu 
                    mainBodyRef = {mainBodyRef}
                    showSideMenu = {showSideMenu}
                    setShowSideMenu = {setShowSideMenu}
                >
                    <NavOptions 
                        sideMenu = {mobileLayout} 
                    />
                    {sideMenuContent}
                </SideMenu>
            )}
        </>
    )
}