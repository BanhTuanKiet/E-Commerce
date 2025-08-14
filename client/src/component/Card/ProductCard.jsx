import { Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { formatLabel, formatValue } from '../../util/DataClassify'
import { PlusCircle, Star, Info } from 'lucide-react'
import { useState } from 'react'
import '../../style/ProductCard.css'
import { useEffect } from 'react'
import axios from '../../util/AxiosConfig'

export default function ProductCard({ product, keys, handleCompareProducts }) {
  const { category } = useParams()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [scoreRating, setScoreRating] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!product || !product._id) return

    const fetchScoreRating = async () => {
      try {
        const response = await axios.get(`/reviews/rating/${product?._id}`)
        setScoreRating(response.averageRating)
        setTotal(response.totalReviews)
      } catch (error) {
        console.log(error)
      }
    }

    fetchScoreRating()
  }, [product])

  return (
    <div className="phone-card-wrapper p-1 py-0">
      <Card
        className={`phone-card border h-100 position-relative overflow-hidden w-100 ${isHovered ? 'hovered' : ''}`}
        style={{
          maxWidth: '16rem',
          border: '1px solid #e9ecef',
          borderRadius: '16px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="badges-container position-absolute w-100 d-flex justify-content-between p-2" style={{ zIndex: 4 }}>
          {product.state && (
            <div className="badge-new bg-success text-white px-2 py-1 rounded-pill">
              <small className="fw-bold">{product.state}</small>
            </div>
          )}

          {product.discount > 0 && (
            <div className="badge-discount bg-danger text-white px-2 py-1 rounded-pill">
              <small className="fw-bold">-{product.discount}%</small>
            </div>
          )}
        </div>

        <div className={`action-buttons position-absolute d-flex flex-column gap-2 ${isHovered ? 'visible' : ''}`}
          style={{
            top: '10%',
            right: '5%',
            zIndex: 3,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(0)' : 'translateX(20px)',
            transition: 'all 0.3s ease'
          }}>
          <button
            className="btn btn-primary rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
            onClick={(e) => {
              e.stopPropagation()
              handleCompareProducts(product)
            }}
            style={{ width: '36px', height: '36px' }}
            title="Compare products"
          >
            <PlusCircle size={18} />
          </button>

          <button
            className="btn btn-primary rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
            onClick={() => navigate(`/${category}/${product?._id}`)}
            style={{ width: '36px', height: '36px' }}
            title="More"
          >
            <Info size={18} />
          </button>
        </div>

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

          <div className="image-overlay position-absolute bottom-0 w-100"
            style={{
              height: '60px',
              background: 'linear-gradient(transparent, rgba(255,255,255,0.8))',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }} />
        </div>

        <Card.Body className="p-3 pt-0">
          <Card.Title
            className="product-title fs-6 text-start fw-bold mb-2 text-truncate"
            title={product?.model}
            style={{
              color: '#1a1a1a',
              lineHeight: '1.4',
              fontSize: '0.95rem'
            }}
          >
            {product?.model}
          </Card.Title>

          <div className="rating-container d-flex align-items-center">
            <div className="stars d-flex me-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < scoreRating ? '#ffc107' : 'none'}
                  color={i < scoreRating ? '#ffc107' : '#dee2e6'}
                />
              ))}
            </div>
            <small className="text-muted">({total})</small>
          </div>

          {product?.price && (
            <div className="price-container mb-0">
              <div className="d-flex align-items-center justify-content-between">
                <div className="price-info">
                  <div className="current-price fw-bold text-primary"
                    style={{ fontSize: '1.1rem', color: '#e74c3c !important' }}>
                    {product.discount > 0
                      ? `${(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}đ`
                      : `${(product.price).toLocaleString('vi-VN')}đ`
                    }
                  </div>

                  {product.discount >= 0 && (
                    <div className="original-price text-muted text-decoration-line-through"
                      style={{ fontSize: '0.85rem' }}>
                      {product.price.toLocaleString('vi-VN')}đ
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="specifications py-0">
            {keys && keys.map((key) => {
              if (['model', '_id', 'price', 'createdAt', 'category', 'images', 'state'].includes(key)) return null
              
              const value = product[key]
              if (!value || typeof value === 'number') return null

              return (
                <div key={key} className="spec-item d-flex justify-content-between align-items-center py-1">
                  <span className="spec-label text-muted" style={{ fontSize: '0.75rem' }}>
                    {formatLabel(key)}:
                  </span>
                  <span className="spec-value fw-medium text-end"
                    style={{ fontSize: '0.75rem', color: '#495057', maxWidth: '60%' }}>
                    {key === "size" ? `${formatValue(value)}"` : formatValue(value)}
                    {value === true ? "Yes" : ""}
                    {value === false ? "No" : ""}
                  </span>
                </div>
              )
            })}
          </div>

          {/* {product?.stock !== undefined && (
            <div className="stock-status">
              <div
                className="d-flex align-items-center justify-content-between p-2 rounded"
                style={{ backgroundColor: '#f8f9fa' }}
              >
                <span className="small text-muted fw-medium">Status:</span>
                <div className="d-flex align-items-center">
                  <div
                    className={`status-dot me-2 rounded-circle ${product.stock > 10 ? 'bg-success' : product.stock > 1 ? 'bg-warning' : 'bg-danger'}`}
                    style={{ width: '6px', height: '6px' }}
                  />
                  <span
                    className={`small fw-semibold ${product.stock > 10 ? 'text-success' : product.stock > 1 ? 'text-warning' : 'text-danger'}`}
                  >
                    {product.stock > 10
                      ? 'In Stock'
                      : product.stock > 1
                        ? `Only ${product.stock} left`
                        : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          )} */}
        </Card.Body>
      </Card>
    </div>
  )
}