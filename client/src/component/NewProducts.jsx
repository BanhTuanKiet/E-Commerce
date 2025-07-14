import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react'
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Card,
  Carousel,
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
const NewProducts = ({ newProducts }) => {
  const [product, setProduct] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  useEffect(() => {
    if (newProducts && newProducts.length > 0) {
      setProduct(newProducts[currentIndex])
    }
  }, [currentIndex, newProducts])
  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex)
  }
  if (!product) {
    return (
      <Container className="py-5">
        <Row
          className="justify-content-center align-items-center"
          style={{
            minHeight: '60vh',
          }}
        >
          <Col>
            <p className="text-muted text-center fs-4">
              No new products available at the moment.
            </p>
          </Col>
        </Row>
      </Container>
    )
  }
  return (
    <div className="bg-light py-5">
      <Container>
        <Row className="align-items-center m-3" style={{ minHeight: '60vh', }}>
          {/* Product Details */}
          <Col md={6} lg={5} className="order-md-1 order-2 mb-4 mb-md-0">
            <div className="mb-3">
              <Badge
                bg="primary"
                pill
                className="d-inline-flex align-items-center mb-2"
              >
                <SparklesIcon size={14} className="me-1" /> New
              </Badge>
              <div className="mt-2">
                <h6 className="text-muted text-uppercase fw-medium small">
                  {product.brand}
                </h6>
                <h1 className=" fw-bold mb-3">{product.model}</h1>
              </div>
              <p className="text-secondary mb-4">{product.description}</p>
              <div className="d-flex align-items-center gap-2 mb-4">
                {product?.price && (
                  <div className="d-flex align-items-center">
                    <span className="fw-bold fs-4 text-danger">
                      {product.discount > 0
                        ? `${(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}đ`
                        : `${product.price.toLocaleString('vi-VN')}đ`}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-muted text-decoration-line-through ms-2 small">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Button variant="primary" size="lg" className="rounded-pill px-4">
                Shop Now
              </Button>
            </div>
          </Col>
          {/* Product Image */}
          <Col md={6} lg={7} className="order-md-2 order-1">
            <Card className="border-0 shadow-sm position-relative">
              <Carousel
                activeIndex={currentIndex}
                onSelect={handleSelect}
                interval={null}
                indicators={true}
                prevIcon={<ChevronLeftIcon size={20} />}
                nextIcon={<ChevronRightIcon size={20} />}
              >
                {newProducts.map((item) => (
                  <Carousel.Item key={item.id}>
                    <div
                      className="d-flex justify-content-center align-items-center bg-white p-1"
                      style={{
                        height: '350px',
                      }}
                    >
                      <img
                        src={ item.images?.[0] ||'/placeholder.svg?height=350&width=350'}
                        alt={item.title}
                        className="d-block mx-auto"
                        style={{
                          maxHeight: '280px',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default NewProducts