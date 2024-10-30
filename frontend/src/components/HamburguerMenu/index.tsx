import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorModeContext } from '../ColorScheme';

interface IHamburguer 
{
    mobile?: boolean;
    sideMenu?: boolean;
    mainBodyRef?: React.RefObject<HTMLDivElement>;
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function HamburguerMenu({ mobile, sideMenu, mainBodyRef, setSideMenu }: IHamburguer)
{
    const [topClass, setTopClass] = useState<string>('deact-top');
    const [midClass, setMidClass] = useState<string>('deact-mid');
    const [botClass, setBotClass] = useState<string>('deact-bot');

    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    useEffect(() => 
    {
        // Prevents the hamb menu from staying an X if one leaves the 
        // side-menu open and goes back and forth from the mobile layout.
        // Also called by side-menu buttons when it's in full width mode.
        if (mobile || !sideMenu)
        {
            setTopClass('deact-top');
            setMidClass('deact-mid');
            setBotClass('deact-bot');
        }

        if (sideMenu)
        {
            setTopClass('act-top');
            setMidClass('act-mid');
            setBotClass('act-bot');
        }
    }, [mobile, sideMenu]);

    useEffect(() => 
    {
        function handleDocumentClick(event: MouseEvent)
        {
            // Closes the side-menu when a click happens outside of it.
            const mainBody = mainBodyRef?.current;
            if (mainBody && mainBody.contains(event.target as Node)) 
                setSideMenu(false);       
        }

        document.addEventListener('click', (e) => handleDocumentClick(e));

        return () => document.removeEventListener('click', (e) => handleDocumentClick(e));
    }, []);

    return (
        <button 
            className = {`hamburger-menu hamburger-menu--${colorMode}`}
            title = {t(`hambMenuBtnTitle${sideMenu ? 'Close' : 'Open'}`)}
            onClick = {() => setSideMenu(prev => !prev)}
        >
            <div className = {`hamburger-menu__bar hamburger-menu__bar--${topClass} hamburger-menu__bar--${colorMode}`}/>
            <div className = {`hamburger-menu__bar hamburger-menu__bar--${midClass} hamburger-menu__bar--${colorMode}`}/>
            <div className = {`hamburger-menu__bar hamburger-menu__bar--${botClass} hamburger-menu__bar--${colorMode}`}/>
        </button>
    );
};
