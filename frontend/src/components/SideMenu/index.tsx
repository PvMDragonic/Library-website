import { useEffect, useRef } from "react";

interface ISideMenu
{
    children: React.ReactNode;
    showSideMenu: boolean;
    mainBodyRef: React.RefObject<HTMLDivElement>;
    setShowSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SideMenu({ children, showSideMenu, mainBodyRef, setShowSideMenu }: ISideMenu)
{
    const showMenuRef = useRef<boolean>(false);

    useEffect(() =>
    {
        showMenuRef.current = showSideMenu;
    }, [showSideMenu]);

    useEffect(() => 
    {
        // Closes the <SideMenu> when a click happens outside of it.
        function handleDocumentClick(event: MouseEvent)
        {
            // No need to run this all the time if the <SideMenu> is closed.
            if (!showMenuRef.current) return;

            const mainBody = mainBodyRef?.current;
            if (!mainBody) return;

            if (mainBody.contains(event.target as Node)) 
                setShowSideMenu(false);  
        }

        document.addEventListener('click', (e) => handleDocumentClick(e));

        return () => document.removeEventListener('click', (e) => handleDocumentClick(e));
    }, []);

    return (
        <section className = {`side-menu side-menu--${showSideMenu ? 'show' : 'hide'}`}>
            {children}
        </section>
    )
}