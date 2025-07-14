import { Route, Routes } from 'react-router-dom'
import Home from '../page/Home.jsx'
import Index from '../page/index'
import Category from '../page/Category.jsx'
import ProductDetail from '../page/ProductDetail.jsx'
import Cart from '../page/Cart.jsx'
import ImageUploader from '../page/ImageUploader.jsx'
import Signup from '../page/Singup.jsx'
import Signin from '../page/Signin.jsx'

function AppRoute() {
    return (
        <Routes>
            <Route path='/' element={<Index><Home /></Index>} />
            <Route path='/uploads' element={<Index><ImageUploader /></Index>} />
            <Route path='/:category' element={<Index><Category /></Index>} />
            <Route path='/:category/:id' element={<Index><ProductDetail /></Index>} />
            <Route path='/cart' element={<Index><Cart /></Index>} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
        </Routes>
    )
}

export default AppRoute