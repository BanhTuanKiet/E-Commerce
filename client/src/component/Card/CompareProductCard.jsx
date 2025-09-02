import React from 'react'
import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function CompareProductCard({ product, keys }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="phone-card-wrapper p-1 py-0">
      <Card
        className={`phone-card border h-100 position-relative overflow-hidden w-100`}
        style={{
          // maxWidth: '16rem',
          border: '1px solid #e9ecef',
          borderRadius: '16px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="image-container position-relative overflow-hidden"
          style={{
            borderRadius: '16px 16px 0 0',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            paddingTop: '30px',
            height: '240px'
          }}>
          <Card.Img
            variant="top"
            src={product.images[0] || ""}
            alt={product?.model}
            className='product-image object-fit-contain p-2'
            style={{
              height: '200px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isHovered ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
            }}
          />
        </div>

        <Card.Body className="p-3 pt-0">
          <Card.Title
            className="product-title fs-6 text-center fw-bold mb-2 text-truncate"
            title={product?.model}
            style={{
              color: '#1a1a1a',
              lineHeight: '1.4',
              fontSize: '0.95rem'
            }}
          >
            {product?.model}
          </Card.Title>
        </Card.Body>
      </Card>
    </div>
  )
}
