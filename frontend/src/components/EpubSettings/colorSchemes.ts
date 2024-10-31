import { IReactReaderStyle, ReactReaderStyle } from "react-reader";

export const lightReaderTheme: IReactReaderStyle = 
{
    ...ReactReaderStyle,
    arrow: 
    {
        ...ReactReaderStyle.arrow,
        color: 'hsl(200, 5%, 23%)' // $color_light_black
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
        color: 'hsl(200, 5%, 23%)' // $color_light_black
    },
    tocArea: 
    {
        ...ReactReaderStyle.tocArea,
        background: 'hsl(0, 20%, 87.5%)' // $color_dark_white
    },
    tocAreaButton:
    {
        ...ReactReaderStyle.tocAreaButton,
        color: 'hsl(200, 5%, 23%)', // $color_light_black
        borderColor: 'rgb(255, 255, 255)' // $color_pure_white
    },
    tocButtonExpanded: 
    {
        ...ReactReaderStyle.tocButtonExpanded,
        background: 'hsl(0, 20%, 87.5%)' // $color_dark_white
    },
    tocButtonBar: 
    {
        ...ReactReaderStyle.tocButtonBar,
        background: 'hsl(200, 5%, 23%)', // $color_light_black
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
        borderColor: '#ccc',
        background: '#111'
    },
    tocAreaButton:
    {
        ...ReactReaderStyle.tocAreaButton,
        borderColor: '#000',
        color: '#ccc'
    },
    tocButtonExpanded: 
    {
        ...ReactReaderStyle.tocButtonExpanded,
        background: '#222',
    },
    tocButtonBar: 
    {
        ...ReactReaderStyle.tocButtonBar,
        background: '#ccc',
        height: 3
    },
    tocButton:
    {
        ...ReactReaderStyle.tocButton,
        borderRadius: 4,
    }
}