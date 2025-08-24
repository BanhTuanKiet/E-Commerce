import { Accordion, Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getObject, getPrimitive, toReadAble } from '../util/DataClassify'
import { useEffect, useState } from 'react'
import axios from '../config/AxiosConfig'
import ProductCard from '../component/Card/ProductCard'

export default function Compare() {
  const { category, compareIds } = useParams()
  const [products, setProducts] = useState()
  const [objectKeys, setObjectKeys] = useState()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ids = compareIds.split('vs')

        const responses = await Promise.all(
          ids.map(id => axios.get(`/products/${category}/${id}/detail`))
        )

        const productsData = responses.map(res => res.data)
        console.log(Object.entries(productsData[0]))
        setProducts(productsData)
        setObjectKeys(getObject(productsData[0]))
      } catch (error) {
        console.log(error)
      }
    }

    fetchProducts()
  }, [compareIds])

  return (
    <div className='mx-auto' style={{ width: "80%" }}>
      <Row className="g-3">
        <Col lg={3} >
        
        </Col>
        {products?.map((product, index) => (
          <Col lg={3} md={4} sm={6} xs={12} key={index} className='px-0 mt-3'>
            <ProductCard product={product} keys={getPrimitive(product )} />
          </Col>
        ))}
      </Row>
      <Row className="mt-4 text-start">
        <Accordion defaultActiveKey="0" >
          {objectKeys?.map((key, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header className="fw-semibold">{toReadAble(key)}</Accordion.Header>
              <Accordion.Body>
                {Object.entries(products[0][key]).map(([childKey], childIdx) => (
                  <Row key={childIdx} className="mb-2 align-items-start border-bottom border-2">
                    <Col md={3} className="text-muted py-2">
                      {toReadAble(childKey)}:
                    </Col>
                    {products.map((product, i) => {
                      const value = product[key][childKey]
                      return (
                        <Col
                          md={Math.floor(9 / products.length)}
                          key={i}
                          className="text-muted py-2"
                          style={{ minHeight: 'auto' }}
                        >
                          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }} >
                            {typeof value === 'object' ? '-' : value}
                          </div>
                        </Col>
                      )
                    })}
                  </Row>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Row>
    </div>
  )
}