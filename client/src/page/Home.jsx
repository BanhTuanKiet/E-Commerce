import React, { useEffect, useState } from 'react'
import Carousels from '../component/Carousels'
import SaleProductCarousel from '../component/SaleProducts'
import axios from '../util/AxiosConfig'
import NewProducts from '../component/NewProducts'

export default function Home() {
  const [saleProducts, setSaleProducts] = useState()
  const [newProducts, setNewProducts] = useState()

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await axios.get(`/products/state/${"new"}`)
        setNewProducts(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchNewProducts()
  }, [])

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
    <div className='mx-auto w-75'>
      <NewProducts newProducts={newProducts} />
      <Carousels />
      <h4>Today Only – Hot Deal</h4>
      {saleProducts?.map((item, index) => (
        <>
          <SaleProductCarousel saleProducts={item} />
        </>
      ))}
    </div>
  )
}
