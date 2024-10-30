import { useContext, useEffect, useRef, useState } from "react";
import { Rendition, Contents } from "epubjs";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../ColorScheme";
import { DataContext } from "../../pages/Reader";
import { EpubOption } from "../EpubOption";
import SettingsIcon from "../../assets/SettingsIcon";

interface IEpubSettings
{
    identifier: string;
    colorScheme: 'Light' | 'Dark';
    renditionRef: React.RefObject<Rendition | undefined>;
    setColorScheme: React.Dispatch<React.SetStateAction<'Light' | 'Dark'>>;
}

export function EpubSettings({ identifier, colorScheme, renditionRef, setColorScheme }: IEpubSettings)
{
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [displayDefault, setDisplayDefault] = useState<boolean>(false);
    const [fontFamilies, setFontFamilies] = useState<string[]>([]);
    const [defaultTA, setDefaultTA] = useState<string>('');
    const [textAlign, setTextAlign] = useState<string>('');
    const [lineHeight, setLineHeight] = useState<number>(-1);
    const [defaultLH, setDefaultLH] = useState<number>(-1);
    const [fontIndex, setFontIndex] = useState<number>(0);
    const [fontSize, setFontSize] = useState<number>(100);

    const sectionRef = useRef<HTMLDivElement>(null);
    const collapsedRef = useRef<boolean>(true);

    const fullscreenContext = useContext(DataContext);

    const { colorMode } = useContext(ColorModeContext);
    const { t } = useTranslation();

    // Closes the settings menu on mobile.
    useEffect(() => 
    {
        function handleDocumentClick(event: MouseEvent)
        {
            // The <svg> gets deleted when the button is clicked, so
            // checking if the section contains it will always return
            // false (meaning it doesn't work).
            const tagName = (event.target as HTMLElement).tagName;
            if (tagName === 'svg' || tagName === 'path')
                return;

            if (!sectionRef.current?.contains(event.target as Node)) 
                setCollapsed(true);
        };

        document.addEventListener('click', handleDocumentClick);

        return () => document.removeEventListener('click', handleDocumentClick);
    }, []);

    useEffect(() => 
    {
        collapsedRef.current = collapsed;
    }, [collapsed]);

    useEffect(() => 
    {
        async function handleRendition()
        {
            // This should only run once, after the epub loads.
            const rendRef = renditionRef.current;
            if (!rendRef) return;

            const defaultColor = colorMode === 'lm' ? 'Light' : 'Dark';
            const savedFontSize = Number(localStorage.getItem(`library${identifier}EpubFontSize`));
            const savedFontFamilies = JSON.parse(localStorage.getItem(`library${identifier}EpubFontFamilies`)!);
            const savedFontIndex = Number(localStorage.getItem(`library${identifier}EpubFontIndex`));
            const savedDefaultLH = Number(localStorage.getItem(`library${identifier}EpubDefaultLH`));
            const savedLineHeight = Number(localStorage.getItem(`library${identifier}EpubLineHeight`));
            const savedDefaultTA = localStorage.getItem(`library${identifier}EpubDefaultTA`);
            const savedTextAlign = localStorage.getItem(`library${identifier}EpubTextAlign`);
            const savedColorScheme = localStorage.getItem(`libraryEpubColorScheme`) || defaultColor;
            const savedFullscreen = JSON.parse(localStorage.getItem(`libraryEpubFullScreen`)!) || false;
            const savedDisplayDefaults = JSON.parse(localStorage.getItem(`libraryEpubDisplayDefaults`)!) || false;

            // Generic/non-specific to a given book.
            setColorScheme(savedColorScheme! as "Light" | "Dark");
            fullscreenContext?.setFullScreen(savedFullscreen);
            setDisplayDefault(savedDisplayDefaults);

            // Assumes that if one exists, others do too.
            if (savedFontSize)
            {
                setFontSize(savedFontSize);
                setFontFamilies(savedFontFamilies);
                setFontIndex(savedFontIndex);
                setDefaultLH(savedDefaultLH);
                setLineHeight(savedLineHeight);
                setDefaultTA(savedDefaultTA!);
                setTextAlign(savedTextAlign!);
                return;
            }

            let computedStyle: CSSStyleDeclaration;
    
            // 'rendRef.getContents()' may not have finished loading by the time this runs.
            while (true)
            {
                // Sleep for 100ms.
                await (new Promise(resolve => setTimeout(resolve, 100)));

                // TypeScript be dumb like that thinking it's a single object, instead of an array of them.
                const contents = (rendRef.getContents() as unknown as Contents[]);
                if (!contents || contents.length === 0) continue;
                
                const iframe = contents[0].document;
                if (!iframe) continue;

                // The <iframe> counts as a separate window, so it needs its own listener.
                iframe.addEventListener('click', () => 
                {
                    if(!collapsedRef.current)
                        setCollapsed(true);
                });
                computedStyle = window.getComputedStyle(iframe.body);
                break; 
            }

            // Font size
            localStorage.setItem(`library${identifier}EpubFontSize`, fontSize.toString());

            // Line height
            const _lineHeight = computedStyle.lineHeight;
            const lineHeightNumber = Math.floor(
                _lineHeight === 'normal'
                    ? parseFloat(computedStyle.fontSize) * 1.2
                    : parseFloat(_lineHeight)
            );

            localStorage.setItem(`library${identifier}EpubDefaultLH`, lineHeightNumber.toString());
            localStorage.setItem(`library${identifier}EpubLineHeight`, lineHeightNumber.toString());
            setLineHeight(lineHeightNumber);
            setDefaultLH(lineHeightNumber);
            
            // Font types
            setFontFamilies(() => 
            {
                const _fontFamilies = [
                    'Arial',
                    'Georgia',
                    'Courier New',
                    'Times New Roman',
                    'Helvetica',
                    'Verdana',
                    'Tahoma'
                ];

                // Removes leading/trailing non-alphabetic characters.
                const _defaultFont = computedStyle.fontFamily
                    .replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '')
                    .trim();

                const allFamilies = [_defaultFont];
                for (const family of _fontFamilies)
                    if (!allFamilies.some(fam => fam === family))
                        allFamilies.push(family);

                localStorage.setItem(`library${identifier}EpubFontFamilies`, JSON.stringify(allFamilies));
                localStorage.setItem(`library${identifier}EpubFontInde`, "0");
                return allFamilies;
            });

            // Text align
            const _textAlign = computedStyle.textAlign;
            const direction = computedStyle.direction;
            const correctedAlignment = direction && (_textAlign === 'start' || _textAlign === 'end')
                ? direction === 'ltr'
                    ? _textAlign === 'start' ? 'left' : 'right' // Left-to-right 
                    : _textAlign === 'start' ? 'right' : 'left' // Right-to-left
                : _textAlign;

            localStorage.setItem(`library${identifier}EpubDefaultTA`, correctedAlignment);
            localStorage.setItem(`library${identifier}EpubTextAlign`, correctedAlignment);
            setTextAlign(correctedAlignment);
            setDefaultTA(correctedAlignment);
        }

        handleRendition();
    }, [renditionRef.current]);

    useEffect(() => 
    {
        const rendition = renditionRef.current;
        if (!rendition) return;

        // This changes the content being displayed (handled by EpubJS).
        // The React-Reader wrapper visuals is handled via the 'readerStyles' prop.
        rendition.themes?.override('color', colorScheme === 'Light' ? '#000' : '#fff');
        rendition.themes?.override('background', colorScheme === 'Light' ? '#fff' : '#000');
    }, [colorScheme]);

    // Even on cursed <div>s, fontSize() still works as intended.
    useEffect(() => renditionRef.current?.themes.fontSize(`${fontSize}%`), [fontSize]);
    useEffect(() => renditionRef.current?.themes.font(fontFamilies[fontIndex]), [fontIndex]);
    useEffect(() => renditionRef.current?.themes.override('text-align', textAlign), [textAlign]);
    useEffect(() => renditionRef.current?.themes.override('line-height', `${Number(lineHeight)}px`), [lineHeight]);

    useEffect(() =>
    {
        // For some epubs that use <div>s for formatting and whatnot, custom CSS is needed to
        // override them because EpubJS' .overide() doesn't work on <div>, so the solution is
        // to inject a custom <div> CSS with !important.
        renditionRef.current?.themes.default({ 
            "div": 
            { 
                "font-family": `${fontFamilies[fontIndex]} !important`,
                "line-height": `${lineHeight}px !important`,
                "text-align": `${textAlign} !important` 
            }
        });
    }, [fontIndex, lineHeight, textAlign]);

    function handleFontSize(increment: number)
    {
        setFontSize(currSize =>
        {
            const newSize = currSize + increment;
            localStorage.setItem(`library${identifier}EpubFontSize`, newSize.toString());
            return newSize >= 50 && newSize <= 200
                ? newSize
                : currSize;
        });
    }

    function handleFontIndex(increment: number)
    {
        setFontIndex(currIndex =>
        {
            // Increments the index and wraps around if it go out of bounds.
            const nextIndex = (currIndex + increment + fontFamilies.length) % fontFamilies.length;
            localStorage.setItem(`library${identifier}EpubFontIndex`, nextIndex.toString());
            return nextIndex;
        });
    }

    function handleLineHeight(increment: number)
    {
        setLineHeight(prev =>
        {
            const newLineHeight = prev + increment;
            localStorage.setItem(`library${identifier}EpubLineHeight`, newLineHeight.toString());
            return newLineHeight;
        });
    }

    function handleTextAlign(increment: number)
    {
        const rendition = renditionRef.current;
        if (!rendition) return;

        const baseAlignments = [
            'left',
            'right',
            'center',
            'justify'
        ];

        const allAligments = [defaultTA];
        for (const alignment of baseAlignments)
            if (!allAligments.some(align => align === alignment))
                allAligments.push(alignment);

        setTextAlign(currIndex => 
        {
            const len = allAligments.length;
            const nextIndex = (allAligments.indexOf(currIndex) + increment + len) % len;
            const alignment = allAligments[nextIndex];
            localStorage.setItem(`library${identifier}EpubTextAlign`, alignment);
            return alignment;
        });
    }

    function handleColorScheme(scheme: 'Light' | 'Dark' )
    {
        setColorScheme(scheme);
        localStorage.setItem(`libraryEpubColorScheme`, scheme);
    }

    function handleFullScreen(value: boolean)
    {
        fullscreenContext?.setFullScreen(value);
        localStorage.setItem(`libraryEpubFullScreen`, JSON.stringify(value));
    }

    function handleDisplayDefault(mode: boolean)
    {
        setDisplayDefault(mode);
        localStorage.setItem(`libraryEpubDisplayDefaults`, JSON.stringify(mode));
    }

    function capitalizeFirstLetter(str: string) 
    {
        if (str) // 'fontFamilies[fontIndex]' may be null during loading.
            return str.charAt(0).toUpperCase() + str.slice(1);
        return str;
    }

    const sectionClass = `epub-settings epub-settings--${colorScheme} epub-settings--${colorMode}`;

    const fontSizeText = fontSize === 100 
        ? (displayDefault ? `${fontSize}% (${t('defaultText')})` : '100%') 
        : `${fontSize}%`;
    const fontTypeText = fontIndex === 0 
        ? (displayDefault ? `${capitalizeFirstLetter(fontFamilies[fontIndex])} (${t('defaultText')})` : t('defaultText')) 
        : fontFamilies[fontIndex];
    const lineHeightText = lineHeight === defaultLH 
        ? (displayDefault ? `${lineHeight}px (${t('defaultText')})` : t('defaultText')) 
        : `${lineHeight}px`;
    const textAlignText = textAlign === defaultTA 
        ? (displayDefault ? `${t(`align${capitalizeFirstLetter(textAlign)}Text`)} (${t('defaultText')})` : t('defaultText'))
        : t(`align${capitalizeFirstLetter(textAlign)}Text`);

    return (
        <section 
            ref = {sectionRef}
            className = {sectionClass}
            style = {{ padding: collapsed ? '0.25rem' : '0.5rem' }}
            onClick = {() => setCollapsed(false)}
            onMouseLeave = {() => setCollapsed(true)}
        >
            {collapsed ? (
                <SettingsIcon/>
            ) : (
                <div className = {`epub-settings__option-container epub-settings__option-container--${colorMode}`}>
                    <EpubOption
                        title = {t('fontSizeText')}
                        text = {fontSizeText}
                        disabledLeft = {fontSize <= 50}
                        disabledRight = {fontSize >= 200}
                        plus = {() => handleFontSize(10)}
                        minus = {() => handleFontSize(-10)}
                    />
                    <EpubOption
                        title = {t('fontTypeText')}
                        text = {fontTypeText}
                        plus = {() => handleFontIndex(+1)}
                        minus = {() => handleFontIndex(-1)}
                    />
                    <EpubOption
                        title = {t('lineHeightText')}
                        text = {lineHeightText}
                        disabledLeft = {lineHeight <= 10}
                        disabledRight = {lineHeight >= 50}
                        plus = {() => handleLineHeight(0.5)}
                        minus = {() => handleLineHeight(-0.5)}
                    />
                    <EpubOption
                        title = {t('alignTextText')}
                        text = {textAlignText}
                        plus = {() => handleTextAlign(1)}
                        minus = {() => handleTextAlign(-1)}
                    />
                    <EpubOption
                        title = {t('colorSchemeText')}
                        text = {t(`display${colorScheme}Value`)}
                        disabledLeft = {colorScheme === 'Light'}
                        disabledRight = {colorScheme === 'Dark'}
                        plus = {() => handleColorScheme('Dark')}
                        minus = {() => handleColorScheme('Light')}
                    />
                    <EpubOption
                        title = {t('hideNavigationText')}
                        text = {fullscreenContext?.fullscreen ? t('displayHiddenValue') : t('displayShownValue')}
                        disabledLeft = {!fullscreenContext?.fullscreen}
                        disabledRight = {fullscreenContext?.fullscreen}
                        plus = {() => handleFullScreen(true)}
                        minus = {() => handleFullScreen(false)}
                    />
                    <EpubOption
                        title = {t('displayDefaultsText')}
                        text = {displayDefault ? t('displayExplicitValue') : t('displayHiddenValue2')}
                        disabledLeft = {!displayDefault}
                        disabledRight = {displayDefault}
                        plus = {() => handleDisplayDefault(true)}
                        minus = {() => handleDisplayDefault(false)}
                    />
                </div>
            )}
        </section>
    )
}