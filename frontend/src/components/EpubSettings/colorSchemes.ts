import { IReactReaderStyle, ReactReaderStyle } from "react-reader";

// No need for a light theme, as it's the default one.
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
        background: '#fff'
    }
}