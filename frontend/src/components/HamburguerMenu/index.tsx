import { useEffect } from 'react';

interface IHamburguer 
{
    mainBodyRef?: React.RefObject<HTMLDivElement>;
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function HamburguerMenu({ mainBodyRef, setSideMenu }: IHamburguer)
{
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
            title = "Open mobile side-menu"
            className = "hamburger-menu" 
            onClick = {() => setSideMenu(prev => !prev)}
        >
            <div className = "hamburger-menu__bar"/>
            <div className = "hamburger-menu__bar"/>
            <div className = "hamburger-menu__bar"/>
        </button>
    );
};
