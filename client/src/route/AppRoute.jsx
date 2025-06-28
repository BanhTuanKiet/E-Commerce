import { Route, Routes } from 'react-router-dom'
import Home from '../page/Home.jsx'
import Index from '../page/index'
import Category from '../page/Category.jsx'
import ProductDetail from '../page/ProductDetail.jsx'

function AppRoute() {
    return (
        <Routes>
            <Route path='/' element={<Index><Home /></Index>} />
            <Route path='/:category' element={<Index><Category /></Index>} />
            <Route path='/:category/:id' element={<Index><ProductDetail /></Index>} />
        </Routes>
    )
}

export default AppRoute