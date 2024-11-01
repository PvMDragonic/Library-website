import { useEffect, useState } from "react";

interface IMobileLayout
{
    widthMark: number;
}

/**
 * Determines whether or not the current screen width qualifies as mobile.
 * 
 * @param {number} widthMark - The number in pixels that marks the point when the mobile layout starts.
 * @returns {{ mobileLayout: boolean }} Whether or not the current screen qualifies as mobile.
 */
export function useMobileLayout({ widthMark }: IMobileLayout): { mobileLayout: boolean }
{
    const [mobileLayout, setMobileLayout] = useState<boolean>(false);

    useEffect(() => 
    {
        function handleResize() 
        {
            setMobileLayout(window.innerWidth < widthMark);
        };

        handleResize();
    
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { mobileLayout };
}