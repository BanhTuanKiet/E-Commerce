import { useContext, useEffect, useState } from 'react'
import SaleProductCarousel from '../component/SaleProducts'
import axios from '../util/AxiosConfig'
import CategoryBanner from '../component/CategoryBanner'
import { SearchContext } from '../context/SearchContext'
import { Col, Row } from 'react-bootstrap'
import ProductCard from '../component/Card/ProductCard'
import { getPrimitive } from '../util/DataClassify'
import CompareBar from '../component/CompareBar'
import Sort from '../component/Sort'
import NotFoundSearch from '../component/NotFoundSearch'

export default function Home() {
  const [saleProducts, setSaleProducts] = useState()
  const [keys, setKeys] = useState()
  const { searchTerm, products, setProducts, productsCompare, setProductsCompare, handleCompareProducts } = useContext(SearchContext)
  const [sortOrder, setSortOrder] = useState('default')

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
    if (!products || !sortOrder) return

    const sortedProducts = [...(products || [])].sort((a, b) => {
      if (sortOrder === 'sale') return b.discount - a.discount
      if (sortOrder === 'asc') return a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100)
      if (sortOrder === 'desc') return b.price * (1 - b.discount / 100) - a.price * (1 - a.discount / 100)
      return 0
    })

    setProducts(sortedProducts)
  }, [sortOrder])

  useEffect(() => {
    if (products && products.length > 0) {
      setKeys(getPrimitive(products[0]))
    }
  }, [products])

  return (
    <div className="min-vh-100">
      <div className="mx-auto w-75">
        <CategoryBanner category="Home" />

        {searchTerm && searchTerm !== '' && !products?.length ? (
          // 1. Không tìm thấy sản phẩm
          <NotFoundSearch
            type="product"
            onClear={() => setProducts([])} // ví dụ clear search/filter
          />
        ) : products && products.length ? (
          // 2. Có sản phẩm hiển thị
          <>
            <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} />
            <Row className="g-3 row-cols-5 mt-3">
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
          // 3. Trang Home mặc định (Sale carousel)
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
