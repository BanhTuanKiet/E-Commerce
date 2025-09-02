import { Accordion, Col, Row, Container, Badge, Card, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getObject, getPrimitive, toReadAble } from '../util/DataClassify'
import { useEffect, useState } from 'react'
import axios from '../config/AxiosConfig'
import ProductCard from '../component/Card/ProductCard'
import { FiChevronDown, FiChevronUp, FiX, FiCheck, FiMinus } from 'react-icons/fi'
import CompareProductCard from '../component/Card/CompareProductCard'

export default function Compare() {
  const { category, compareIds } = useParams()
  const [products, setProducts] = useState()
  const [objectKeys, setObjectKeys] = useState()
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState(new Set(['0']))
  const [highlightDifferences, setHighlightDifferences] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const ids = compareIds.split('vs')

        const responses = await Promise.all(
          ids.map(id => axios.get(`/products/detail/${id}`))
        )

        const productsData = responses.map(res => res.data)
        setProducts(productsData)
        setObjectKeys(getObject(productsData[0]))
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [compareIds])

  const toggleAccordion = (key) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedItems(newExpanded)
  }

  const getValueComparison = (values, childKey) => {
    const uniqueValues = [...new Set(values.map(v => JSON.stringify(v)))]
    return uniqueValues.length > 1 ? 'different' : 'same'
  }

  const formatValue = (value, comparison, isHighlighted) => {
    if (typeof value === 'object') return '-'
    
    const baseClasses = "p-2 rounded-2 transition-all duration-200"
    
    if (isHighlighted && comparison === 'different') {
      return (
        <span className={`${baseClasses} bg-warning bg-opacity-10 border border-warning border-opacity-25`}>
          {value || '-'}
        </span>
      )
    }
    
    return <span className={baseClasses}>{value || '-'}</span>
  }

  const CustomAccordionHeader = ({ children, eventKey, isExpanded }) => (
    <div 
      className="accordion-header-custom d-flex justify-content-between align-items-center p-3 cursor-pointer bg-light rounded-3 mb-2 hover-shadow transition-all"
      onClick={() => toggleAccordion(eventKey)}
      style={{ cursor: 'pointer' }}
    >
      <h6 className="mb-0 fw-semibold text-primary">{children}</h6>
      {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
    </div>
  )

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải dữ liệu so sánh...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="" style={{ width: "80%" }}>
      {/* Controls */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                  <Button
                    variant={highlightDifferences ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => setHighlightDifferences(!highlightDifferences)}
                    className="d-flex align-items-center gap-2"
                  >
                    {highlightDifferences ? <FiCheck size={16} /> : <FiMinus size={16} />}
                    Highlight the difference
                  </Button>
                </div>
                <div className="text-muted small">
                  Click on each item to see detailed comparison
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Cards */}
      <Row className="g-4 mb-5">
        <Col lg={3} className="d-flex align-items-center justify-content-center">
          <div className="text-center p-4">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
              <FiCheck size={24} className="text-primary" />
            </div>
            <h6 className="fw-semibold text-primary mb-2">Specifications</h6>
            <p className="text-muted small mb-0">
              See details below
            </p>
          </div>
        </Col>
        {products?.map((product, index) => (
          <Col lg={3} md={4} sm={6} xs={12} key={index}>
            <div className="h-100 position-relative" onClick={() => navigate(`/${category}/${product?._id}`)}>
              <div className="position-absolute top-0 start-50 translate-middle z-index-3">
                <Badge 
                  bg={index === 0 ? "success" : index === 1 ? "primary" : "warning"} 
                  className="px-3 py-2 rounded-pill shadow-sm"
                >
                  #{index + 1}
                </Badge>
              </div>
              <Card className="h-100 border-0 shadow-hover transition-all">
                <Card.Body className="p-0 pt-3">
                  {/* <ProductCard product={product} keys={getPrimitive(product)} /> */}
                  <CompareProductCard product={product} keys={getPrimitive(product)} /> 
                </Card.Body>
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      {/* Comparison Table */}
      <Card className="border-1 shadow-sm px-3">
        <Card.Header className="bg-white border-0 pt-3 ">
          <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
            Detailed Comparison Table
          </h5>
        </Card.Header>
        <Card.Body className="">
          <div className="comparison-table">
            {objectKeys?.map((key, index) => {
              const eventKey = index.toString()
              const isExpanded = expandedItems.has(eventKey)
              
              return (
                <div key={index} className="mb-3">
                  <CustomAccordionHeader 
                    eventKey={eventKey} 
                    isExpanded={isExpanded}
                  >
                    {toReadAble(key)}
                  </CustomAccordionHeader>
                  
                  {isExpanded && (
                    <Card className="border border-light">
                      <Card.Body className="p-0">
                        {Object.entries(products[0][key]).map(([childKey], childIdx) => {
                          const values = products.map(product => product[key][childKey])
                          const comparison = getValueComparison(values, childKey)
                          
                          return (
                            <Row 
                              key={childIdx} 
                              className="mx-0 border-bottom border-light align-items-center"
                              style={{ minHeight: '60px' }}
                            >
                              <Col md={3} className="bg-light bg-opacity-50 py-3 border-end border-light">
                                <div className="fw-medium text-dark">
                                  {toReadAble(childKey)}
                                </div>
                              </Col>
                              {products.map((product, i) => {
                                const value = product[key][childKey]
                                return (
                                  <Col
                                    md={Math.floor(9 / products.length)}
                                    key={i}
                                    className="py-3 text-center"
                                  >
                                    {formatValue(value, comparison, highlightDifferences)}
                                  </Col>
                                )
                              })}
                            </Row>
                          )
                        })}
                      </Card.Body>
                    </Card>
                  )}
                </div>
              )
            })}
          </div>
        </Card.Body>
      </Card>

      {/* Footer */}
      <div className="text-center py-5">
        <p className="text-muted">
          💡 Mẹo: Sử dụng nút "Làm nổi bật khác biệt" để dễ dàng phát hiện sự khác biệt giữa các sản phẩm
        </p>
      </div>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .shadow-hover {
          transition: all 0.3s ease;
        }
        
        .shadow-hover:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
        
        .hover-shadow:hover {
          box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
        
        .transition-all {
          transition: all 0.2s ease;
        }
        
        .z-index-2 {
          z-index: 2;
        }
        
        .z-index-3 {
          z-index: 3;
        }
        
        .comparison-table .accordion-header-custom {
          background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%);
          border: 1px solid #e9ecef;
        }
        
        .comparison-table .accordion-header-custom:hover {
          background: linear-gradient(90deg, #e9ecef 0%, #f8f9fa 100%);
          border-color: #dee2e6;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Container>
  )
}