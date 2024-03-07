interface ISideMenu
{
    children: React.ReactNode;
    showSideMenu: boolean;
}

export function SideMenu({ children, showSideMenu }: ISideMenu)
{
    return (
        <section 
            className = {`side-menu side-menu--${showSideMenu ? 'show' : 'hide'}`}
        >
            {children}
        </section>
    )
}