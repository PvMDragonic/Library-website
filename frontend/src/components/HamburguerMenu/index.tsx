interface IHamburguer 
{
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function HamburguerMenu({ setSideMenu }: IHamburguer)
{
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
