import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../ColorScheme";

interface INavOptions
{
    mobile?: boolean;
}

export function NavOptions({ mobile }: INavOptions)
{
    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    const containerClass = 
        mobile === undefined
            ? "navbar__links"
            : "navbar__side-menu-links";

    const buttonClass = `navbar__navigation-button navbar__navigation-button--${colorMode}`;

    return (
        <ul className = {containerClass}>
            <li>
                <a href = '/' className = {buttonClass}>
                    {t('homeNavigationBtn')}
                </a>
            </li>
            <li>
                <a href = '/new' className = {buttonClass}>
                    {t('newBookNavigationBtn')}
                </a>
            </li>
            <li>
                <a href = '/tags' className = {buttonClass}>
                    {t('editTagsNavigationBtn')}
                </a>
            </li>
        </ul>
    )
}