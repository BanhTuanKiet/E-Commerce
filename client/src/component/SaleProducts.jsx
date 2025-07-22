import { useState, useEffect } from "react"
import { Card, Container, Badge, Row, Col, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Carousel from "react-multi-carousel"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "react-multi-carousel/lib/styles.css"
import "../style/SaleProducts.css"
import MostPurchasedProductCard from "./Card/most-purchased-product-card"

function calculateTime(deadline) {
  const total = Date.parse(deadline) - Date.now()
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  return total > 0
    ? { hours, minutes, seconds }
    : { hours: 0, minutes: 0, seconds: 0 }
}

function Countdown({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(calculateTime(deadline))

  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft(calculateTime(deadline)),
      1000
    )
    return () => clearInterval(timer)
  }, [deadline])

  return (
    <div className="flash-countdown text-white bg-dark px-3 py-1 rounded">
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  )
}

export default function SaleProductCarousel({ saleProducts = null, mostPurchasedProduct, flashDeadline }) {
  const navigate = useNavigate()
  const [isPaused, setIsPaused] = useState(false)

  if (saleProducts === null) {
    return (
      <Container className="d-flex justify-content-start py-5">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="skeleton-card">
            <Skeleton height={250} width={180} />
          </div>
        ))}
      </Container>
    )
  }

  if (!saleProducts.length) {
    return (
      <div className="sale-section-wrapper">
        <Container className="text-center py-5">
          <h4>Không có sản phẩm sale nào.</h4>
        </Container>
      </div>
    )
  }

  const maxDiscount = Math.max(...saleProducts.map((p) => p.discount))
  const categoryName = saleProducts[0].category || "Sản phẩm"

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 1200, min: 992 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 992, min: 768 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 2
    }
  };

  return (
    <div className="sale-section-wrapper">
      <Container>
        <Row className="g-4">
          <Col
            md={3}
            className="d-flex align-items-center justify-content-center"
          >
            <MostPurchasedProductCard
              product={mostPurchasedProduct || saleProducts[0]}
            />
          </Col>

          <Col md={9}>
            <div className="position-relative mb-4">
              <div className="sale-banner d-flex overflow-hidden rounded-4 shadow-lg">
                <div className="sale-tag bg-danger d-flex align-items-center justify-content-center px-4 py-3">
                  <span className="sale-text text-white fw-bold fs-4 text-uppercase letter-spacing-2">
                    SALE
                  </span>
                </div>
                <div className="discount-info bg-primary d-flex align-items-center px-4 py-3 text-white">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="text-uppercase fw-semibold letter-spacing-1 opacity-75">
                      {categoryName}
                    </span>
                    <span className="text-white opacity-50">•</span>
                    <span className="fw-medium opacity-75">UP TO</span>
                    <span className="discount-percentage fw-bold fs-2 text-warning">
                      {maxDiscount}%
                    </span>
                    <span className="fw-medium opacity-75">OFF</span>
                  </div>
                </div>
              </div>

              {flashDeadline && (
                <div className="position-absolute top-0 end-0 m-2">
                  <Countdown deadline={flashDeadline} />
                </div>
              )}
            </div>

            <Carousel
              responsive={responsive}
              infinite
              autoPlay={!isPaused}
              autoPlaySpeed={3000}
              arrows
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              containerClass="carousel-container"
              itemClass="px-2"
              aria-label="Sản phẩm đang sale"
            >
              {saleProducts.map((item) => {
                const salePrice = item.price * (1 - item.discount / 100);
                return (
                  <div
                    key={item._id}
                    onClick={() =>
                      navigate(`/${item.category.toLowerCase()}s/${item._id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-effect position-relative">
                      <div
                        className="position-relative bg-white d-flex align-items-center justify-content-center"
                        style={{ height: 180 }}
                      >
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={`Ảnh sản phẩm ${item.model}`}
                          className="w-100 h-100 p-2"
                          style={{ objectFit: "contain", maxHeight: 170 }}
                          loading="lazy"
                        />
                        <Badge
                          bg="danger"
                          className="sale-badge position-absolute top-0 start-0 m-2 px-2 py-1"
                          style={{ fontSize: "0.7rem" }}
                          aria-label={`Giảm ${item.discount}%`}
                        >
                          SALE {item.discount}%
                        </Badge>
                      </div>
                      <Card.Body className="d-flex flex-column justify-content-between p-3">
                        <Card.Title
                          className="mb-2 fw-medium"
                          style={{ fontSize: "0.9rem", minHeight: 40 }}
                        >
                          {item.model}
                        </Card.Title>
                        <div>
                          <div className="d-flex align-items-baseline mb-1">
                            <Card.Text
                              className="text-danger fw-bold me-2 mb-0"
                              style={{ fontSize: "1rem" }}
                            >
                              {salePrice.toLocaleString()}₫
                            </Card.Text>
                            <Card.Text
                              className="text-muted text-decoration-line-through mb-0"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {item.price.toLocaleString()}₫
                            </Card.Text>
                          </div>
                          <div
                            className="bg-danger bg-opacity-10 text-danger px-2 py-1 rounded-2 d-inline-block"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Save {(item.price - salePrice).toLocaleString()}₫
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                )
              })}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  )
}