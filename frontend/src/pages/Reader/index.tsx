import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { blankBook } from "../../pages/NewBook";
import { NavBar } from "../../components/NavBar";
import { IBook } from "../../components/BookCard";
import { api } from "../../database/api";
import { EpubReader } from "./epub";
import { PdfReader } from "./pdf";
import React from "react";

export interface IReader
{
    attachment: string;
    title: string;
    id?: number;
}

interface IDataContext 
{
    fullscreen: boolean;
    setFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DataContext = React.createContext<IDataContext | null>(null);

export function Reader()
{
    const [bookFile, setBookFile] = useState<IBook>(blankBook);
    const [fullscreen, setFullScreen] = useState<boolean>(false);

    const mainBodyRef = useRef<HTMLDivElement>(null);
    
    const { type } = useLocation().state;
    const { id } = useParams();

    useEffect(() => 
    {
        api.get(`books/id/${id}`)
            .then(
                response => setBookFile(response.data[0] as IBook)
            )
            .catch(
                error => console.log(`Error while retrieving tags: ${error}`)
            );
    }, []);

    return (
        <>
            {!fullscreen && (
                <NavBar
                    mobile = {675}
                    mainBodyRef = {mainBodyRef}
                />
            )}
            <div 
                className = "file-reader"
                style = {{ height: !fullscreen ? 'calc(100vh - 3rem)' : '100vh' }}
            >
                {type === 'epub' ? (
                    <DataContext.Provider value = {{ fullscreen, setFullScreen }}>
                        <EpubReader
                            attachment = {bookFile.attachment!}
                            title = {bookFile.title}
                        />
                    </DataContext.Provider>
                ) : (
                    <PdfReader
                        attachment = {bookFile.attachment!}
                        title = {bookFile.title}
                        id = {bookFile.id}
                    />
                )}
            </div>
        </>
    )
}