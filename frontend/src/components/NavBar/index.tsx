export function NavBar()
{
    return (
        <div className="navbar">
            <div className="navbar__title">Library</div>
                <div className="navbar__links">
                    <a href='/' className="navbar__button">Home</a>
                    <a href='/new' className="navbar__button">New Book</a>
                    <a href='/tags' className="navbar__button">Edit Tags</a>
                </div>
        </div>
    )
}