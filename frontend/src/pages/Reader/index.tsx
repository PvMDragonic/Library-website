import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { blankBook } from "../../pages/NewBook";
import { NavBar } from "../../components/NavBar";
import { IBook } from "../../components/BookCard";
import { api } from "../../database/api";
import { EpubReader } from "./epub";
import { PdfReader } from "./pdf";

export interface IReader
{
    attachment: string;
    title: string;
    id?: number;
}

export function Reader()
{
    const [bookFile, setBookFile] = useState<IBook>(blankBook);

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
            <NavBar
                mobile = {675}
                mainBodyRef = {mainBodyRef}
            />
            <div 
                ref = {mainBodyRef}
                className = "file-reader"
            >
                {type === 'epub' ? (
                    <EpubReader
                        attachment = {bookFile.attachment!}
                        title = {bookFile.title}
                    />
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