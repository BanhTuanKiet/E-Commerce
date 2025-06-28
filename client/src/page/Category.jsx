import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../util/AxiosConfig'
import { getPrimitive } from '../util/DataClassify'
import PhoneCard from '../component/Card/PhoneCard'
import { Col, Row } from 'react-bootstrap'
import ProductFilterSidebar from '../component/ProductFilterSidebar'

export default function Category() {
    const { category } = useParams()
    const [products, setProducts] = useState()
    const [keys, setKeys] = useState()
    const [keysFilter, setKeysFilter] = useState()
    const [filterSelections, setFilterSelections] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/products/${category}`)
                setProducts(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchProducts()
    }, [category])

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await axios.get(`/filter_options/${category}`)
                setKeysFilter(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchFilterOptions()
    }, [category])

    useEffect(() => {
        if (products && products.length > 0) {
            setKeys(getPrimitive(products[0]))
        }
    }, [products])

    useEffect(() => {
        const filterProducts = async () => {
            try {
                const options = encodeURIComponent(JSON.stringify(filterSelections))

                const response = await axios.get(`/products/${category}/filter/${options}`)
                console.log(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        if (Object.keys(filterSelections).length === 0) return

        filterProducts()
    }, [category, filterSelections])

    const handleCheckboxChange = (key, value) => {
        setFilterSelections((prev) => {
            const prevValues = prev[key] || []
            const alreadySelected = prevValues.includes(value)

            return {
                ...prev,
                [key]: alreadySelected
                    ? prevValues.filter((v) => v !== value)
                    : [...prevValues, value],
            }
        })
    }

    return (
        <div>
            <Row>
                <Col md={2} className='p-0 ps-2' >
                    <ProductFilterSidebar keysFilter={keysFilter?.filters} handleCheckboxChange={handleCheckboxChange} />
                </Col>
                <Col md={10} >
                    <Row className='g-1'>
                        {products?.map((product, index) => (
                            <Col lg={3} md={6} xs={12} >
                                <PhoneCard product={product} keys={keys} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

        </div>
    )
}
