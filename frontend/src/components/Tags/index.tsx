import { isDarkColor } from '../../utils/color';
import { ITag } from '../BookCard';

export function Tag({ label, color }: Omit<ITag, 'id'>)
{
    return (
        <div 
            className = {`tag-container ${isDarkColor(color) ? 'tag-container--dark' : 'tag-container--light'}`} 
            style = {{background: color}}
        >
            <span>{label}</span>
        </div>
    );
}