import { Route, Routes } from 'react-router-dom'
import Home from '../page/Home.jsx'
import Index from '../page/index'
import Category from '../page/Category.jsx'
import ProductDetail from '../page/ProductDetail.jsx'
import Cart from '../page/Cart.jsx'
import ImageUploader from '../page/ImageUploader.jsx'
import Signup from '../page/Singup.jsx'
import Signin from '../page/Signin.jsx'
import Order from '../page/Profile/Order.jsx'
import Compare from '../page/Compare.jsx'
import OrderDetail from '../page/Profile/OrderDetail.jsx'
import Profile from '../page/Profile/Profile.jsx'
import Admin from '../page/Admin/index.jsx'
import Review from '../page/Profile/Review.jsx'
import PaymentResultVNP from '../page/ResultPaymentVNPAY.jsx'

function AppRoute() {
    return (
        <Routes>
            <Route path='/' element={<Index><Home /></Index>} />
            <Route path='/uploads' element={<Index><ImageUploader /></Index>} />
            <Route path='/manage' element={<Index><Admin /></Index>} />
            <Route path='/profile' element={<Index><Profile /></Index>} />
            <Route path='/cart' element={<Index><Cart /></Index>} />
            <Route path='/payment'element={<Index><PaymentResultVNP /></Index>} />
            <Route path='/order' element={<Index><Order /></Index>} />
            <Route path='/order/:orderId' element={<Index><OrderDetail /></Index>} />
            <Route path='/review' element={<Index><Review /></Index>} />
            <Route path='/compare/:category/:compareIds' element={<Index><Compare /></Index>} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/:category' element={<Index><Category /></Index>} />
            <Route path='/:category/:id' element={<Index><ProductDetail /></Index>} />
        </Routes>
    )
}

export default AppRoute