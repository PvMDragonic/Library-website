import { useContext, useEffect, useRef } from "react";
import { ColorModeContext } from "../ColorScheme";

interface ISideMenu
{
    children: React.ReactNode;
    showMenu: boolean;
    mainBodyRef: React.RefObject<HTMLDivElement>;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SideMenu({ children, showMenu, mainBodyRef, setShowMenu }: ISideMenu)
{
    const { colorMode } = useContext(ColorModeContext);
    const showMenuRef = useRef<boolean>(false);

    useEffect(() =>
    {
        showMenuRef.current = showMenu;
    }, [showMenu]);

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
                setShowMenu(false);  
        }

        document.addEventListener('click', (e) => handleDocumentClick(e));

        return () => document.removeEventListener('click', (e) => handleDocumentClick(e));
    }, []);

    const sectionClass = `side-menu side-menu--${colorMode} side-menu--${showMenu ? 'show' : 'hide'}`; 

    return (
        <section className = {sectionClass}>
            {children}
        </section>
    )
}