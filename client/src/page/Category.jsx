
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../util/AxiosConfig'
import { getPrimitive } from '../util/DataClassify'
import PhoneCard from '../component/Card/PhoneCard'
import { Col, Row, Spinner } from 'react-bootstrap'
import ProductFilterSidebar from '../component/ProductFilterSidebar'
import CompareBar from '../component/CompareBar'
import { warning } from '../util/NotifyUtil'

export default function Category() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [keys, setKeys] = useState()
  const [keysFilter, setKeysFilter] = useState()
  const [filterSelections, setFilterSelections] = useState({})
  const [sortOrder, setSortOrder] = useState("default")
  const [productsCompare, setProductsCompare] = useState([])

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(`/filter_options/${category}`)
        setKeysFilter(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchFilterOptions()
  }, [category])

  useEffect(() => {
    const storedCompare = localStorage.getItem("productsCompare")
    if (storedCompare) setProductsCompare(JSON.parse(storedCompare))
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res
        if (Object.keys(filterSelections).length === 0) {
          res = await axios.get(`/products/${category}`)
        } else {
          const options = encodeURIComponent(JSON.stringify(filterSelections))
          res = await axios.get(`/products/${category}/filter/${options}`)
        }

        let sortedProducts = res.data

        if (sortOrder === "sale") {
          sortedProducts = [...sortedProducts].sort((a, b) => b.discount - a.discount)
        } else if (sortOrder === "asc") {
          sortedProducts = [...sortedProducts].sort((a, b) => a.price - b.price)
        } else if (sortOrder === "desc") {
          sortedProducts = [...sortedProducts].sort((a, b) => b.price - a.price)
        }

        setProducts(sortedProducts)
      } catch (error) {
        console.error(error)
      }
    }

    fetchProducts()
  }, [category, filterSelections, sortOrder])

  useEffect(() => {
    if (products.length > 0) {
      setKeys(getPrimitive(products[0]))
    }
  }, [products])

  useEffect(() => {
    localStorage.setItem("productsCompare", JSON.stringify(productsCompare))
  }, [productsCompare])

  const handleCheckboxChange = (key, value) => {
    if (key === "price") {
      setFilterSelections(prev => ({ ...prev, price: { min: value.min, max: value.max } }))
      return
    }
    console.log(key, value)
    if (typeof value === "string") {
      if (value.includes("inch")) {
        value = value.split(" ")[0]
      } else if (value.startsWith("<")) {
        const end = parseFloat(value.replace(/[^\d.]/g, ""))
        value = { start: 0, end }
      } else if (value.startsWith(">")) {
        console.log(1)
        const start = parseFloat(value.replace(/[^\d.]/g, ""))
        value = { start, end: start * start }
      } else if (value.includes("-") && !"USB".indexOf(value)) {
        const [start, , end] = value.split(" ")
        value = { start: parseFloat(start), end: parseFloat(end) }
      }
    }
    console.log(value)
    setFilterSelections(prev => {
      const prevValues = prev[key] || []
      const alreadySelected = prevValues.some(v => JSON.stringify(v) === JSON.stringify(value))

      const newValues = alreadySelected
        ? prevValues.filter(v => JSON.stringify(v) !== JSON.stringify(value))
        : [...prevValues, value]

      if (newValues.length === 0) {
        const { [key]: _, ...rest } = prev
        return rest
      }

      return { ...prev, [key]: newValues }
    })
  }

  const handleCompareProducts = (product) => {
    if (productsCompare.length > 0 && productsCompare[0].category !== product.category) return warning("Only compare products in the same category")
    if (productsCompare.length > 2) return warning("Only up to 3 products can be compared")
    if (productsCompare.some(p => p._id === product._id)) return warning("Product already in comparison list")
    setProductsCompare(prev => [...prev, product])
  }

  return (
    <div className="container my-5" style={{ width: "80%" }}>
      <Row className="g-4">
        <Col md={2} className="p-0">
          <div className="border rounded  bg-light position-sticky" style={{ top: '20px' }}>
            <ProductFilterSidebar
              keysFilter={keysFilter?.filters}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
        </Col>
        <Col md={10}>
          <div className="border rounded p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 text-muted">{products.length} products found</p>
              <select
                className="form-select w-auto"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="default">Sort by default</option>
                <option value="sale">Sale price</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-5">
                <img
                  src="https://via.placeholder.com/150?text=No+Products"
                  alt="No products"
                  className="img-fluid mb-3"
                  style={{ maxWidth: '150px' }}
                />
                <p className="text-muted">No products found for this category.</p>
              </div>
            ) : (
              <Row className="g-3">
                {products.map((product, index) => (
                  <Col lg={3} md={4} sm={6} xs={12} key={index} className='px-0 mt-3'>
                    <PhoneCard product={product} keys={keys} handleCompareProducts={handleCompareProducts} />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Col>
      </Row>

      {productsCompare.length > 0 &&
        <Row>
          <Col>
            <CompareBar 
              products={productsCompare}
              onClear={() => setProductsCompare([])}
              setProductsCompare={setProductsCompare}
            />
          </Col>
        </Row>
      }
    </div>
  )
}
