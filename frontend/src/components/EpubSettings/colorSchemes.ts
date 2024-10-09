import { IReactReaderStyle, ReactReaderStyle } from "react-reader";

export const lightReaderTheme: IReactReaderStyle = 
{
    ...ReactReaderStyle,
    arrow: 
    {
        ...ReactReaderStyle.arrow,
        color: 'hsl(191, 60%, 38%)' // $color_cyan
    },
    arrowHover: 
    {
        ...ReactReaderStyle.arrowHover,
        color: 'hsl(184, 50%, 50%)' // $color_light_cyan
    },
    readerArea: 
    {
        ...ReactReaderStyle.readerArea,
        backgroundColor: 'rgb(255, 255, 255)' // $color_pure_white
    },
    titleArea: 
    {
        ...ReactReaderStyle.titleArea,
        color: 'hsl(191, 60%, 38%)' // $color_cyan
    },
    tocArea: 
    {
        ...ReactReaderStyle.tocArea,
        background: 'hsl(191, 60%, 38%)' // $color_cyan
    },
    tocAreaButton:
    {
        ...ReactReaderStyle.tocAreaButton,
        color: 'rgb(255, 255, 255)' // $color_pure_white
    },
    tocButtonExpanded: 
    {
        ...ReactReaderStyle.tocButtonExpanded,
        background: 'hsl(191, 60%, 38%)' // $color_cyan
    },
    tocButtonBar: 
    {
        ...ReactReaderStyle.tocButtonBar,
        background: 'hsl(184, 50%, 50%)', // $color_light_cyan
        height: 3
    },
    tocButton:
    {
        ...ReactReaderStyle.tocButton,
        borderRadius: 4,
    }
}

export const darkReaderTheme: IReactReaderStyle = 
{
    ...ReactReaderStyle,
    arrow: 
    {
        ...ReactReaderStyle.arrow,
        color: 'white'
    },
    arrowHover: 
    {
        ...ReactReaderStyle.arrowHover,
        color: '#ccc'
    },
    readerArea: 
    {
        ...ReactReaderStyle.readerArea,
        backgroundColor: '#000',
    },
    titleArea: 
    {
        ...ReactReaderStyle.titleArea,
        color: '#ccc'
    },
    tocArea: 
    {
        ...ReactReaderStyle.tocArea,
        background: '#111'
    },
    tocButtonExpanded: 
    {
        ...ReactReaderStyle.tocButtonExpanded,
        background: '#222'
    },
    tocButtonBar: 
    {
        ...ReactReaderStyle.tocButtonBar,
        background: '#fff',
        height: 3
    },
    tocButton:
    {
        ...ReactReaderStyle.tocButton,
        borderRadius: 4,
    }
}