interface IHamburguer 
{
    onClick: () => void;
}

export function HamburguerMenu({ onClick }: IHamburguer)
{
    return (
        <button 
            title = "Open mobile side-menu"
            className = "hamburger-menu" 
            onClick = {() => onClick()}
        >
            <div className = "hamburger-menu__bar"/>
            <div className = "hamburger-menu__bar"/>
            <div className = "hamburger-menu__bar"/>
        </button>
    );
};
