import { useEffect, useState } from 'react'
import SaleProductCarousel from '../component/SaleProducts'
import axios from '../util/AxiosConfig'
import CategoryBanner from '../component/CategoryBanner'

export default function Home() {
  const [saleProducts, setSaleProducts] = useState()

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const response = await axios.get(`/products/sales`)
        setSaleProducts(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSaleProducts()
  }, [])

  return (
    <div className=" min-vh-100">
      <div className="mx-auto w-75">
        <CategoryBanner category={"Home"} />
        
        {saleProducts?.map((item, index) => (
          <div key={index} className='mb-5'>
            <SaleProductCarousel saleProducts={item} />
          </div>
        ))}
      </div>
    </div>
  )
}
