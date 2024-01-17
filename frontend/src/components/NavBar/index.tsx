import { HamburguerMenu } from '../HamburguerMenu';

interface INavBar 
{
    sideMenu?: boolean;
    setSideMenu?: (type: boolean) => void;
}

export function NavBar({ sideMenu, setSideMenu }: INavBar)
{
    return (
        <nav 
            className = "navbar" 
            role = "navigation" 
            aria-label = "Main"
        >
            <div className = "navbar__menu">
                {setSideMenu && (
                    <HamburguerMenu 
                        onClick = {() => setSideMenu(!sideMenu)}
                    />
                )}
                <h1 className = "navbar__title">
                    Library
                </h1>
            </div>
            <ul className = "navbar__links">
                <li className = "navbar__item">
                    <a href = '/' className = "navbar__button">
                        Home
                    </a>
                </li>
                <li className = "navbar__item">
                    <a href = '/new' className = "navbar__button">
                        New Book
                    </a>
                </li>
                <li className = "navbar__item">
                    <a href = '/tags' className = "navbar__button">
                        Edit Tags
                    </a>
                </li>
            </ul>
        </nav>
    )
}