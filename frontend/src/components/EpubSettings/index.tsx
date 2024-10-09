import { useEffect, useRef, useState } from "react";
import { Rendition, Contents } from "epubjs";
import SettingsIcon from "../../assets/SettingsIcon";
import ArrowLeftIcon from "../../assets/ArrowLeftIcon";
import ArrowRightIcon from "../../assets/ArrowRightIcon";

interface IEpubSettings
{
    renditionRef: React.RefObject<Rendition | undefined>;
    colorScheme: 'Light' | 'Dark';
    setColorScheme: React.Dispatch<React.SetStateAction<'Light' | 'Dark'>>;
}

export function EpubSettings({ renditionRef, colorScheme, setColorScheme }: IEpubSettings)
{
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [fontFamilies, setFontFamilies] = useState<string[]>([]);
    const [defaultTA, setDefaultTA] = useState<string>('');
    const [textAlign, setTextAlign] = useState<string>('');
    const [lineHeight, setLineHeight] = useState<number>(-1);
    const [defaultLH, setDefaultLH] = useState<number>(-1);
    const [fontIndex, setFontIndex] = useState<number>(0);
    const [fontSize, setFontSize] = useState<number>(100);

    const sectionRef = useRef<HTMLDivElement>(null);
    const collapsedRef = useRef<boolean>(true);

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

            // Line height
            const _lineHeight = computedStyle.lineHeight;
            const lineHeightNumber = Math.floor(
                _lineHeight === 'normal'
                    ? parseFloat(computedStyle.fontSize) * 1.2
                    : parseFloat(_lineHeight)
            );
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

    useEffect(() => renditionRef.current?.themes.fontSize(`${fontSize}%`), [fontSize]);
    useEffect(() => renditionRef.current?.themes.font(fontFamilies[fontIndex]), [fontIndex]);
    useEffect(() => renditionRef.current?.themes.override('text-align', textAlign), [textAlign]);
    useEffect(() => renditionRef.current?.themes.override('line-height', `${Number(lineHeight)}px`), [lineHeight]);

    function handleFontSize(increment: number)
    {
        setFontSize(currSize =>
        {
            const newSize = currSize + increment;
            return newSize >= 50 && newSize <= 200
                ? newSize
                : currSize;
        });
    }

    function handleFontIndex(increment: number)
    {
        setFontIndex(
            // Increments the index and wraps around if it go out of bounds.
            currIndex => (currIndex + increment + fontFamilies.length) % fontFamilies.length
        );
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

        setTextAlign(current => 
        {
            const len = allAligments.length;
            return allAligments[
                (allAligments.indexOf(current) + increment + len) % len
            ];
        });
    }

    function capitalizeFirstLetter(str: string) 
    {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const sectionClass = `epub-settings epub-settings--${collapsed? 'closed' : 'opened'}`;

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
                <div className = "epub-settings__option-container">
                    <p>Font size</p>
                    <div>
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => handleFontSize(-10)}
                            disabled = {fontSize <= 50}
                        >
                            <ArrowLeftIcon/>    
                        </button> 
                        <p>
                            {fontSize}%    
                        </p> 
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => handleFontSize(10)}
                            disabled = {fontSize >= 200}
                        >
                            <ArrowRightIcon/>
                        </button>
                    </div>
                    <p>Font type</p>
                    <div>
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => handleFontIndex(-1)}
                        >
                            <ArrowLeftIcon/>    
                        </button> 
                        <p>
                            {fontIndex === 0 ? 'Default' : fontFamilies[fontIndex]}
                        </p> 
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => handleFontIndex(1)}
                        >
                            <ArrowRightIcon/>
                        </button>
                    </div>
                    <p>Line height</p>
                    <div>
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => setLineHeight(prev => prev - 0.5)}
                            disabled = {lineHeight <= 10}
                        >
                            <ArrowLeftIcon/>    
                        </button> 
                        <p>
                            {lineHeight === defaultLH ? 'Default' : `${lineHeight}px`}
                        </p> 
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => setLineHeight(prev => prev + 0.5)}
                            disabled = {lineHeight >= 50}
                        >
                            <ArrowRightIcon/>
                        </button>
                    </div>
                    <p>Align text</p>
                    <div>
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => handleTextAlign(-1)}
                        >
                            <ArrowLeftIcon/>    
                        </button> 
                        <p>
                            {textAlign === defaultTA ? 'Default' : capitalizeFirstLetter(textAlign)}
                        </p> 
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => handleTextAlign(1)}
                        >
                            <ArrowRightIcon/>
                        </button>
                    </div>
                    <p>Color scheme</p>
                    <div>
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => setColorScheme('Light')}
                            disabled = {colorScheme === 'Light'}
                        >
                            <ArrowLeftIcon/>    
                        </button> 
                        <p>
                            {colorScheme}
                        </p> 
                        <button 
                            className = "epub-settings__option-button"
                            onClick = {() => setColorScheme('Dark')}
                            disabled = {colorScheme === 'Dark'}
                        >
                            <ArrowRightIcon/>
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}