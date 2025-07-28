import Header from '../component/Header'
import Footer from '../component/Footer'


export default function index({ children }) {
    return (
        <div className='mx-auto'>
            <Header />
            <div className='mx-auto'>
                <main>{children}</main>
            </div>
            <Footer />
        </div>
    )
}