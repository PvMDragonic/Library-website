interface INavOptions
{
    mobile?: boolean;
}

export function NavOptions({ mobile }: INavOptions)
{
    const containerClass = 
        mobile === undefined
            ? "navbar__links"
            : "navbar__side-menu-links";

    return (
        <ul className = {containerClass}>
            <li>
                <a href = '/' className = "navbar__button">
                    Home
                </a>
            </li>
            <li>
                <a href = '/new' className = "navbar__button">
                    New Book
                </a>
            </li>
            <li>
                <a href = '/tags' className = "navbar__button">
                    Edit Tags
                </a>
            </li>
        </ul>
    )
}