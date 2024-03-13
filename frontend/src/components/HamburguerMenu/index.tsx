import { useEffect, useState } from 'react';

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
            title = "Open mobile side-menu"
            className = "hamburger-menu" 
            onClick = {() => setShowSideMenu(prev => !prev)}
        >
            <div className = {`hamburger-menu__bar hamburger-menu__bar--${topClass}`}/>
            <div className = {`hamburger-menu__bar hamburger-menu__bar--${midClass}`}/>
            <div className = {`hamburger-menu__bar hamburger-menu__bar--${botClass}`}/>
        </button>
    );
};
