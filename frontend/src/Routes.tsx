import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditBook } from './pages/EditBook';
import { NewBook } from './pages/NewBook';
import { Home } from './pages/Home';

export function AppRoutes()
{
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='new' element={<NewBook/>}/>
                <Route path='/edit/:id' element={<EditBook/>}/>
            </Routes>
        </BrowserRouter>
    )
}