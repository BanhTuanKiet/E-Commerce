import React from 'react'
import Header from '../component/Header'
import Footer from '../component/Footer'


export default function index({ children }) {
    return (
        <div className='w-75 mx-auto'>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    )
}
