"use client" // This component uses client-side hooks and Bootstrap, so it needs to be a Client Component.

import { useEffect, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from "lucide-react"
import { Container, Row, Col, Button, Badge, Card, Carousel } from "react-bootstrap"
// 'bootstrap/dist/css/bootstrap.min.css' is now imported in app/globals.css

const NewProducts = ({ newProducts }) => {
  const [product, setProduct] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (newProducts && newProducts.length > 0) {
      setProduct(newProducts[currentIndex])
    } else {
      setProduct(null) // Ensure product is null if no products are available
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
            minHeight: "60vh",
          }}
        >
          <Col>
            <p className="text-muted text-center fs-4">No new products available at the moment.</p>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <div className="new-products-section border border-primary rounded-4 bg-white">
      <div
        className="position-absolute top-0 start-0 p-4 decorative-text-animation"
        style={{
          fontSize: "2.5rem" /* Larger font size */,
          fontWeight: "bold",
          color: "#6c757d" /* Muted color */,
          zIndex: 0 /* Ensure it's behind main content if needed */,
          transform: "translateY(-50px)" /* Initial position for animation */,
          opacity: 0 /* Initial opacity for animation */,
          left: "5%" /* Adjust left position */,
          top: "10%" /* Adjust top position */,
          lineHeight: "1.2",
        }}
      >
        ✨<br />
        NEW
        <br />
        COLLECTION
        <br />⭐
      </div>
      <Container className="position-relative" style={{ zIndex: 1 }}>
        <Row className="align-items-center" style={{ minHeight: "60vh" }}>
          <Col key={currentIndex} md={6} lg={5} className="order-md-1 order-2 mb-4 mb-md-0 animate-fade-in-slide-up">
            <div className="mb-0 p-3">
              <Badge bg="primary" pill className="d-inline-flex align-items-center mb-2">
                <SparklesIcon size={14} className="me-1 sparkle-pulse" /> New
              </Badge>
              <div className="mt-2">
                <h6 className="text-muted text-uppercase fw-medium small">{product.brand}</h6>
                <h1 className="fw-bold mb-3">{product.model}</h1>
              </div>
              <p className="text-secondary mb-4">{product.description}</p>
              <div className="d-flex align-items-center gap-2 mb-4">
                {product?.price && (
                  <div className="d-flex align-items-center">
                    <span className="fw-bold fs-4 text-danger">
                      {product.discount > 0
                        ? `${(product.price * (1 - product.discount / 100)).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
                        : `${product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-muted text-decoration-line-through ms-2 small">
                        {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Button variant="primary" size="lg" className="rounded-pill px-4 hover-scale-button">
                Shop Now
              </Button>
            </div>
          </Col>
          {/* Product Image */}
          <Col md={6} lg={7} className="order-md-2 order-1">
            <Card className="shadow-lg position-relative rounded-4 product-card-border">
              <Carousel
                activeIndex={currentIndex}
                onSelect={handleSelect}
                interval={null}
                indicators={true}
                prevIcon={
                  <span className="carousel-control-prev-icon" aria-hidden="true">
                    <ChevronLeftIcon size={24} />
                  </span>
                }
                nextIcon={
                  <span className="carousel-control-next-icon" aria-hidden="true">
                    <ChevronRightIcon size={24} />
                  </span>
                }
                className="custom-carousel-controls"
              >
                {newProducts.map((item) => (
                  <Carousel.Item key={item.id}>
                    <div
                      className="d-flex justify-content-center align-items-center bg-white p-4 rounded-4"
                      style={{
                        height: "400px",
                      }}
                    >
                      <img
                        src={item.images?.[0] || "/placeholder.svg?height=400&width=400"}
                        alt={item.title || item.model}
                        className="d-block mx-auto product-image-hover"
                        style={{
                          maxHeight: "350px", 
                          objectFit: "contain",
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
