import { ITag } from '../BookCard';

export function Tag({ label, color }: Omit<ITag, 'id'>)
{
    return (
        <div className = "tag-container" style = {{background: color}}>
            <span>{label}</span>
        </div>
    );
}