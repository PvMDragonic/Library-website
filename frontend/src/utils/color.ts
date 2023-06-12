export function isDarkColor(hexValue: string): boolean 
{
    hexValue = hexValue.replace('#', '');

    const red = parseInt(hexValue.substring(0, 2), 16);
    const green = parseInt(hexValue.substring(2, 4), 16);
    const blue = parseInt(hexValue.substring(4, 6), 16);

    const averageBrightness = (red + green + blue) / 3 / 255;

    // Anything below this is marked as dark.
    // #444444 hits just below it, as reference.
    return averageBrightness < 0.5;
}