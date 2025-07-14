import { useEffect, useState } from "react"
import { Card, Container, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import "../style/SaleProducts.css"

export default function SaleProductCarousel({ saleProducts }) {
  const navigate = useNavigate()
  const [isPaused, setIsPaused] = useState(false)

  const maxDiscount = saleProducts.length > 0 ? Math.max(...saleProducts.map((p) => p.discount)) : 0

  if (!saleProducts.length) {
    return (
      <div className="sale-section-wrapper">
        <Container className="text-center py-5">
          <h4>Không có sản phẩm sale nào.</h4>
        </Container>
      </div>
    )
  }

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 1200, min: 992 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 992, min: 768 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 2,
    },
  }

  return (
    <div className="sale-section-wrapper">
      <Container>
        <div className="position-relative mb-5">
          <div className="d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
            <div className="position-relative">
              <div className="d-flex align-items-stretch overflow-hidden rounded-4 shadow-lg sale-banner">
                <div className="bg-danger d-flex align-items-center justify-content-center px-4 py-3 text-white sale-tag">
                  <span className="fw-bold fs-4 text-uppercase letter-spacing-2 sale-text">SALE</span>
                </div>
                <div className="bg-primary d-flex align-items-center px-4 py-3 text-white discount-info">
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <span className="text-uppercase fw-semibold letter-spacing-1 opacity-75">
                      {saleProducts[0].category}
                    </span>
                    <span className="text-white opacity-50">•</span>
                    <span className="fw-medium opacity-75">UP TO</span>
                    <span className="fw-bold fs-2 text-warning discount-percentage">{maxDiscount}%</span>
                    <span className="fw-medium opacity-75">OFF</span>
                  </div>
                </div>
              </div>
              <div className="position-absolute top-0 start-0 w-100 h-100 sale-sparkles">
                <div className="position-absolute sparkle sparkle-1">✨</div>
                <div className="position-absolute sparkle sparkle-2">⭐</div>
                <div className="position-absolute sparkle sparkle-3">💫</div>
              </div>
            </div>
          </div>
        </div>

        <Carousel
          responsive={responsive}
          infinite
          autoPlay={!isPaused}
          autoPlaySpeed={3000}
          arrows
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {saleProducts.map((item) => {
            const salePrice = item.price * (1 - item.discount / 100)

            return (
              <div
                key={item._id}
                className="px-2"
                onClick={() => navigate(`/${item?.category.toLowerCase()}s/${item?._id}`)}
                style={{ cursor: "pointer" }}
              >
                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-effect">
                  <div
                    className="position-relative bg-white d-flex align-items-center justify-content-center"
                    style={{ height: "180px" }}
                  >
                    <img
                      src={item?.images[0] || "/placeholder.svg"}
                      className="w-100 h-100 p-2"
                      alt={item.title}
                      style={{
                        objectFit: "contain",
                        maxHeight: "170px",
                      }}
                    />
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-0 m-2 px-2 py-1"
                      style={{ fontSize: "0.7rem" }}
                    >
                      SALE {item.discount}%
                    </Badge>
                  </div>
                  <Card.Body className="d-flex flex-column justify-content-between p-3">
                    <Card.Title className="mb-2 fw-medium" style={{ fontSize: "0.9rem", minHeight: "40px" }}>
                      {item.model}
                    </Card.Title>
                    <div>
                      <div className="d-flex align-items-baseline mb-1">
                        <Card.Text className="text-danger fw-bold me-2 mb-0" style={{ fontSize: "1rem" }}>
                          {salePrice.toLocaleString()}₫
                        </Card.Text>
                        <Card.Text
                          className="text-muted text-decoration-line-through mb-0"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {item.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}₫
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
      </Container>
    </div>
  )
}