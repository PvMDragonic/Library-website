import { HamburguerMenu } from '../HamburguerMenu';
import { NavOptions } from '../NavOptions';

interface INavBar 
{
    mobile?: boolean;
    showSideMenu?: boolean;
    setShowSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBar({ mobile, showSideMenu, setShowSideMenu }: INavBar)
{
    return (
        <nav 
            className = "navbar" 
            role = "navigation" 
            aria-label = "Main"
            style = {{ paddingLeft: mobile ? '0.5rem' : '1rem' }}
        >
            <div className = "navbar__menu">
                {mobile && setShowSideMenu && (
                    <HamburguerMenu
                        showSideMenu = {showSideMenu!}
                        setShowSideMenu = {setShowSideMenu} 
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