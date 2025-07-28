import { use, useEffect, useState } from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import { getPrimitive } from "../util/DataClassify"
import SaleProductCard from "./Card/SaleProductCard"

export default function SaleProductCarousel({ saleProducts }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [keys, setKeys] = useState()
  const [isHovered, setIsHovered] = useState(false)
  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    if (saleProducts.length > 0) {
      setKeys(getPrimitive(saleProducts[0]))
    }
  }, [saleProducts])

  const maxIndex = Math.max(0, saleProducts.length - ITEMS_PER_PAGE)

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + ITEMS_PER_PAGE > maxIndex ? 0 : prev + ITEMS_PER_PAGE
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - ITEMS_PER_PAGE < 0 ? maxIndex : prev - ITEMS_PER_PAGE
    )
  }

  return (
    <Container className="px-0" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="bg-danger text-white py-3 px-4 rounded-top  d-flex align-items-center justify-content-between">
        <h4 className="mb-0 fw-bold">🔥 SẢN PHẨM NỔI BẬT</h4>
      </div>

      <div className="bg-danger p-4 rounded-bottom position-relative">
        {isHovered && (
          <>
            <Button
              variant="light"
              style={{ left: "0.5%" }}
              className="position-absolute top-50 translate-middle-y shadow-sm z-3 border"
              onClick={prevSlide}
            >
              ‹
            </Button>
            <Button
              variant="light"
              style={{ right: "0.5%" }}
              className="position-absolute top-50 translate-middle-y shadow-sm z-3 border"
              onClick={nextSlide}
            >
              ›
            </Button>
          </>
        )}

        <div className="d-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
          {saleProducts.slice(currentIndex, currentIndex + 5).map((product) => (
            <SaleProductCard key={product.id} product={product} keys={keys} />
          ))}
        </div>
      </div>
    </Container>
  )
}