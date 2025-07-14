import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../util/AxiosConfig'
import { getPrimitive } from '../util/DataClassify'
import PhoneCard from '../component/Card/PhoneCard'
import { Col, Row } from 'react-bootstrap'
import ProductFilterSidebar from '../component/ProductFilterSidebar'

export default function Category() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [keys, setKeys] = useState()
  const [keysFilter, setKeysFilter] = useState()
  const [filterSelections, setFilterSelections] = useState({})

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
    const fetchProducts = async () => {
      try {
        if (Object.keys(filterSelections).length === 0) {
          const res = await axios.get(`/products/${category}`)
          setProducts(res.data)
        } else {
          const options = encodeURIComponent(JSON.stringify(filterSelections))
          const res = await axios.get(`/products/${category}/filter/${options}`)
          setProducts(res.data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchProducts()
  }, [category, filterSelections])

  useEffect(() => {
    if (products.length > 0) {
      setKeys(getPrimitive(products[0]))
    }
  }, [products])

  const handleCheckboxChange = (key, value) => {
    if (key === "price") {
      setFilterSelections(prev => ({ ...prev, price: { min: value.min, max: value.max } }))
      return
    }

    if (typeof value === "string") {
      if (value.includes("inch")) {
        value = value.split(" ")[0]
      } else if (value.startsWith("<")) {
        const end = parseFloat(value.replace(/[^\d.]/g, ""))
        value = { start: 0, end }
      } else if (value.startsWith(">")) {
        const start = parseFloat(value.replace(/[^\d.]/g, ""))
        value = { start, end: start * start }
      } else if (value.includes("-")) {
        const [start, , end] = value.split(" ")
        value = { start: parseFloat(start), end: parseFloat(end) }
      }
    }

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

  return (
    <div className='w-75 mx-auto'>
      <Row>
        <Col md={2} className='p-0 pt-1 ps-2'>
          <ProductFilterSidebar keysFilter={keysFilter?.filters} handleCheckboxChange={handleCheckboxChange} />
        </Col>
        <Col md={10}>
          <Row className='g-1'>
            {products.map((product, index) => (
              <Col lg={3} md={6} xs={12} key={index}>
                <PhoneCard product={product} keys={keys} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  )
}
