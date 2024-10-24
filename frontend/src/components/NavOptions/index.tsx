import { useTranslation } from "react-i18next";

interface INavOptions
{
    sideMenu?: boolean;
}

export function NavOptions({ sideMenu }: INavOptions)
{
    const { t } = useTranslation();

    const containerClass = 
        sideMenu === undefined
            ? "navbar__links"
            : "navbar__side-menu-links";

    return (
        <ul className = {containerClass}>
            <li>
                <a href = '/' className = "navbar__navigation-button">
                    {t('homeNavigationBtn')}
                </a>
            </li>
            <li>
                <a href = '/new' className = "navbar__navigation-button">
                    {t('newBookNavigationBtn')}
                </a>
            </li>
            <li>
                <a href = '/tags' className = "navbar__navigation-button">
                    {t('editTagsNavigationBtn')}
                </a>
            </li>
        </ul>
    )
}