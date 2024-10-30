import { useContext, useEffect, useRef } from "react";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";
import { ColorModeContext } from "../ColorScheme";

interface ISideMenu
{
    children: React.ReactNode;
    showSideMenu: boolean;
    mainBodyRef: React.RefObject<HTMLDivElement>;
    setShowSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SideMenu({ children, showSideMenu, mainBodyRef, setShowSideMenu }: ISideMenu)
{
    const sectionRef = useRef<HTMLDivElement>(null);
    const showMenuRef = useRef<boolean>(false);
    const touchStartRef = useRef<number | null>(null);
    const touchEndRef = useRef<number | null>(null);

    const { hasScroll } = useHasScrollbar({ elementRef: sectionRef });
    const { colorMode } = useContext(ColorModeContext);

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

    useEffect(() =>
    {
        function handleTouchStart(event: TouchEvent)
        {
            touchStartRef.current = event.targetTouches[0].clientX;
            touchEndRef.current = null; // Otherwise, the swipe is fired even with usual touch events.
        }

        function handleTouchMove(event: TouchEvent)
        {
            touchEndRef.current = event.targetTouches[0].clientX;
        }

        function handleTouchEnd()
        {
            const touchStart = touchStartRef.current;
            const touchEnd = touchEndRef.current;
            if (!touchStart || !touchEnd) return;

            const isRightSwipe = (touchStart - touchEnd) < -50;
            if (!showSideMenu && isRightSwipe && touchStart < window.innerWidth * 0.25) 
                setShowSideMenu(true);
        }

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd)

        return () => 
        {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        }
    }, []);
    
    const showNotShow = showSideMenu ? 'show' : 'hide';
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