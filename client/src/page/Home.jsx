import { useContext, useEffect, useState } from 'react'
import SaleProductCarousel from '../component/SaleProducts'
import axios from '../util/AxiosConfig'
import CategoryBanner from '../component/CategoryBanner'
import { SearchContext } from '../context/SearchContext'
import { Col, Row } from 'react-bootstrap'
import ProductCard from '../component/Card/ProductCard'
import { getPrimitive } from '../util/DataClassify'
import CompareBar from '../component/CompareBar'

export default function Home() {
  const [saleProducts, setSaleProducts] = useState()
  const [keys, setKeys] = useState()
  const { products, productsCompare, setProductsCompare, handleCompareProducts } = useContext(SearchContext)

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

  useEffect(() => {
    if (products && products.length > 0) {
      setKeys(getPrimitive(products[0]))
    }
  }, [products])

  return (
    <div className="min-vh-100">
      <div className="mx-auto w-75">
        <CategoryBanner category="Home" />

        {products && products.length > 0 ? (
          <>
            <Row className="g-3 row-cols-5">
              {products.map((product, index) => (
                <div key={index} className="col">
                  <ProductCard
                    product={product}
                    keys={keys}
                    handleCompareProducts={handleCompareProducts}
                  />
                </div>
              ))}
            </Row>

            {productsCompare?.length > 0 && (
              <Row>
                <Col>
                  <CompareBar
                    products={productsCompare}
                    onClear={() => setProductsCompare([])}
                    setProductsCompare={setProductsCompare}
                  />
                </Col>
              </Row>
            )}
          </>
        ) : (
          saleProducts?.map((item, index) => (
            <div key={index} className="mb-5">
              <SaleProductCarousel saleProducts={item} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
