import { HamburguerMenu } from '../HamburguerMenu';
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
                    Library
                </h1>
            </div>
            {!mobile && (
                <NavOptions/>
            )}
        </nav>
    )
}