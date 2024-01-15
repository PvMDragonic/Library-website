export function NavBar()
{
    return (
        <nav className="navbar" role="navigation" aria-label="Main">
            <h1 className="navbar__title">
                Library
            </h1>
            <ul className="navbar__links">
                <li className="navbar__item">
                    <a href='/' className="navbar__button">Home</a>
                </li>
                <li className="navbar__item">
                    <a href='/new' className="navbar__button">New Book</a>
                </li>
                <li className="navbar__item">
                    <a href='/tags' className="navbar__button">Edit Tags</a>
                </li>
            </ul>
        </nav>
    )
}