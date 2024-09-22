import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditBook } from './pages/EditBook';
import { EditTags } from './pages/EditTags';
import { NewBook } from './pages/NewBook';
import { Reader } from './pages/Reader';
import { Home } from './pages/Home';

export function AppRoutes()
{
    return(
        <BrowserRouter>
            <Routes>
                <Route path = '/' element = {<Home/>}/>
                <Route path = 'new' element = {<NewBook/>}/>
                <Route path = '/edit/:id' element = {<EditBook/>}/>
                <Route path = 'read/:id' element = {<Reader/>}/>
                <Route path = 'tags' element = {<EditTags/>}/>
            </Routes>
        </BrowserRouter>
    )
}