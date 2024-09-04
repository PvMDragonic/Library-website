import { useEffect, useState } from 'react';

interface IDragAndDrop 
{
    containerRef: React.RefObject<HTMLDivElement>;
    onFilesSuccessfullySelected?: (fileSelection: FileSelection) => Promise<void>; 
    onFileDropped?: () => void;
    onFileHovered?: () => void;
    onFileUnhover?: () => void;
    fileFormats?: string[];
    maxFileSize?: number;
}

interface FileSelection 
{
    fileType: string;
    fileContent: string;
}

export function useDragAndDropFile(params: IDragAndDrop) 
{
    const { 
        containerRef = null, 
        maxFileSize = 10485760, 
        fileFormats = [], 
        onFilesSuccessfullySelected,
        onFileHovered, 
        onFileUnhover, 
        onFileDropped 
    } = params;

    // .jpg gets read as 'jpeg' by FileReader().
    if (fileFormats.includes('jpg'))
        fileFormats.push('jpeg')

    const [fileLoading, setFileLoading] = useState<boolean>(false);
    const [fileErrors, setFileErrors] = useState<string[]>([]);

    useEffect(() => 
    {
        const divRef = containerRef?.current;
        if (!divRef) return;

        divRef.addEventListener('dragover', handleDragOver);
        divRef.addEventListener('dragleave', handleFileUnhover);
        divRef.addEventListener('drop', handleFileDrop);
      
        return () => 
        {
            divRef.removeEventListener('dragover', handleDragOver);
            divRef.removeEventListener('dragleave', handleFileUnhover);
            divRef.removeEventListener('drop', handleFileDrop);
        };
    }, []);

    function clearFile()
    {
        setFileErrors([]);
        setFileLoading(false);
    }

    function handleDragOver(event: DragEvent)
    {
        event.preventDefault();
        event.stopPropagation();

        // Prevents shenanigans related to hovering a file
        // over a child component of the <div> that's containerRef.
        // Very niche problem, I suppose, which could be dealt by
        // disabling pointer-events via CSS, but disabling them
        // prevents the button from triggering onClick.
        const div = containerRef?.current;
        if (div && !div.contains(event.relatedTarget as Node))
            onFileHovered?.();
    }

    function handleFileUnhover(event: DragEvent)
    {
        event.preventDefault();
        event.stopPropagation();

        // As per the above explanation.
        const div = containerRef?.current;
        if (div && !div.contains(event.relatedTarget as Node)) 
            onFileUnhover?.();
    }

    async function handleFileDrop(event: DragEvent)
    {
        event.preventDefault();
        event.stopPropagation();

        onFileDropped?.();

        const data = event.dataTransfer;
        if (!data) return;
        
        const files = data.files;
        if (files.length == 0) return; 

        setFileLoading(true);

        const file = files[0];
        const errors: string[] = []; 
        const reader = new FileReader();

        if (!fileFormats.some(sub => file.type.includes(sub)))
            errors.push('FileTypeError');
            
        if (file.size > maxFileSize)
            errors.push('FileSizeError');

        reader.onload = (event) => 
        {
            if (errors.length == 0)
            {
                onFilesSuccessfullySelected?.({
                    fileType: file.type,
                    fileContent: event.target?.result as string
                });
            }
            
            // This needs to be inside the reader, to prevent 
            // weird async behaviour from the setStates.
            setFileLoading(false);
            setFileErrors(errors);
        };

        reader.readAsDataURL(file);     
    }

    return { fileLoading, fileErrors, clearFile };
}