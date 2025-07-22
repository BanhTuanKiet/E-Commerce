import React, { useState } from "react"
import { Card, Col, Container, Row, Button } from "react-bootstrap"

const promotions = [
  {
    title: "Mac",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/mac-home-update.png",
  },
  {
    title: "Samsung",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/samsung-home-update.png",
  },
  {
    title: "iPad",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/ipad-home-update.png",
  },
  {
    title: "Laptop",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/lap-home-update.png",
  },
  {
    title: "Laptop 2",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/lap-home-update.png",
  },
  {
    title: "Laptop 3",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/lap-home-update.png",
  },
]

const itemsPerPage = 4

export default function CustomCarousel() {
  const [startIndex, setStartIndex] = useState(0)

  const next = () => {
    setStartIndex((prev) => (prev + 1) % promotions.length)
  }

  const prev = () => {
    setStartIndex((prev) => (prev - 1 + promotions.length) % promotions.length)
  }

  // Get 4 items starting from current index, loop around
  const getVisibleItems = () => {
    const visible = []
    for (let i = 0; i < itemsPerPage; i++) {
      visible.push(promotions[(startIndex + i) % promotions.length])
    }
    return visible
  }

  const visibleItems = getVisibleItems()

  return (
    <Container className="py-3">
      <h4 className="fw-bold mb-4">ƯU ĐÃI SINH VIÊN</h4>
      <div className="d-flex align-items-center">
        <Button variant="light" onClick={prev}>&lt;</Button>
        <Row className="flex-nowrap overflow-hidden w-100 mx-2">
          {visibleItems.map((item, idx) => (
            <Col key={idx} md={3}>
              <Card className="border-0 rounded-4 h-100 overflow-hidden">
                <Card.Img
                  src={item.image}
                  alt={item.title}
                  style={{ objectFit: "cover", height: "100%", width: "100%" }}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Button variant="light" onClick={next}>&gt;</Button>
      </div>
    </Container>
  )
}