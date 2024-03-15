import { useEffect, useState } from 'react';
import { useMobileLayout } from '../../hooks/useMobileLayout';
import { HamburguerMenu } from '../HamburguerMenu';
import { NavOptions } from '../NavOptions';
import { SideMenu } from '../SideMenu';

interface INavBar 
{
    mobile: number;
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
    const [showSideMenu, setShowSideMenu] = sideMenuStateProps ? sideMenuStateProps : useState<boolean>(false);

    const { mobileLayout } = useMobileLayout({ 
        widthMark: mobile 
    });

    // Prevents the <SideMenu> from showing up open when switching layouts (if it was left open before).
    useEffect(() => setShowSideMenu(false), [mobileLayout]);

    return (
        <>
            <nav 
                className = "navbar" 
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
                    <h1 className = "navbar__title">
                        Library
                    </h1>
                </div>
                {!mobileLayout && (
                    <NavOptions/>
                )}
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