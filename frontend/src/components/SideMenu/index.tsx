import { useContext, useEffect, useRef } from "react";
import { ColorModeContext } from "../../components/ColorScheme";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";

interface ISideMenu
{
    children: React.ReactNode;
    showMenu: boolean;
    mainBodyRef: React.RefObject<HTMLDivElement>;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SideMenu({ children, showMenu, mainBodyRef, setShowMenu }: ISideMenu)
{
    const sectionRef = useRef<HTMLDivElement>(null);
    const showMenuRef = useRef<boolean>(false);

    const { hasScroll } = useHasScrollbar({ elementRef: sectionRef })
    const { colorMode } = useContext(ColorModeContext);

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

    const showNotShow = showMenu ? 'show' : 'hide';
    const scrollNoScroll = hasScroll ? 'scroll' : 'no-scroll';
    const sectionClass = `side-menu side-menu--${colorMode} side-menu--${showNotShow} side-menu--${scrollNoScroll}`; 

    return (
        <section 
            ref = {sectionRef}
            className = {sectionClass}
        >
            {children}
        </section>
    )
}