import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorModeContext } from '../ColorScheme';

interface IHamburguer 
{
    showSideMenu: boolean;
    setShowSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function HamburguerMenu({ showSideMenu, setShowSideMenu }: IHamburguer)
{
    const [topClass, setTopClass] = useState<string>('deact-top');
    const [midClass, setMidClass] = useState<string>('deact-mid');
    const [botClass, setBotClass] = useState<string>('deact-bot');

    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    useEffect(() => 
    {
        if (!showSideMenu)
        {
            setTopClass('deact-top');
            setMidClass('deact-mid');
            setBotClass('deact-bot');
        }
        else
        {
            setTopClass('act-top');
            setMidClass('act-mid');
            setBotClass('act-bot');
        }
    }, [showSideMenu]);

    return (
        <button 
            title = {t(`hambMenuBtnTitle${showSideMenu ? 'Close' : 'Open'}`)}
            className = {`hamburger-menu hamburger-menu--${colorMode}`}
            onClick = {() => setShowSideMenu(prev => !prev)}
        >
            <div className = {`hamburger-menu__bar hamburger-menu__bar--${topClass} hamburger-menu__bar--${colorMode}`}/>
            <div className = {`hamburger-menu__bar hamburger-menu__bar--${midClass} hamburger-menu__bar--${colorMode}`}/>
            <div className = {`hamburger-menu__bar hamburger-menu__bar--${botClass} hamburger-menu__bar--${colorMode}`}/>
        </button>
    );
};
