import { Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { formatLabel, formatValue } from '../../util/DataClassify'

export default function PhoneCard({ product, keys }) {
  const { category } = useParams()
  const navigate = useNavigate()

  return (
    <div className="p-2 pt-1 py-3">
      <Card
        className="border-0 h-100 position-relative overflow-hidden w-100 shadow-sm"
        style={{
          maxWidth: '14rem',
          borderRadius: '20px',
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer'
        }}
        onClick={() => navigate(`/${category}/${product?._id}`)}
      >
        <div className="position-absolute top-0 start-0 badge rounded text-white m-2 px-2 py-1 z-3 rounded-pill bg-primary">
          New
        </div>

        {product.discount > 0 && (
          <div
            className="position-absolute top-0 end-0 badge text-white m-2 px-2 py-1 z-3 rounded-pill bg-danger"
          >
            Discount {product.discount}%
          </div>
        )}

        <div
          className="position-relative overflow-hidden"
          style={{
            borderRadius: '20px 20px 0 0',
            background: 'transparent',
            paddingTop: '30px'
          }}
        >
          <Card.Img
            variant="top"
            src={product.images[0] || ""}
            alt={product?.model}
            className='object-fit-fill p-1'
            style={{
              height: '200px',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          />
        </div>

        {product?.price && (
          <div className="px-3 py-2 ">
            <div className="d-flex justify-content-between align-items-center gap-2">
              <div
                className="fw-bold text-primary text-danger"
                style={{ fontSize: '1.1rem' }}
              >
                {
                  product.discount > 0
                  ? `${(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}đ`
                  : `${(product.price).toLocaleString('vi-VN')}đ`
                }
              </div>

              {product.discount > 0 && (
                <div
                  className='text-muted text-decoration-line-through'
                  style={{ fontSize: '0.9rem' }}
                >
                  {product.price.toLocaleString('vi-VN')}đ
                </div>
              )}
            </div>
          </div>
        )}

        <Card.Body className="p-3 pt-2">
          <Card.Title
            className="fs-6 text-start fw-bold mb-3 text-truncate"
            title={product?.model}
            style={{
              color: '#2c3e50',
              lineHeight: '1.3'
            }}
          >
            {product?.model}
          </Card.Title>

          <div className="mb-0">
            {keys && keys.map((key) => {
              if (['model', '_id', 'price', 'discount', 'stock', 'category'].includes(key)) return null;

              const value = product[key];
              return (
                <div
                  key={key}
                  className="d-flex justify-content-between align-items-center py-1 mb-1 border-bottom"
                  style={{ fontSize: '0.8rem' }}
                >
                  <span
                    className="text-muted fw-medium"
                    style={{ color: '#6c757d' }}
                  >
                    {formatLabel(key)}
                  </span>
                  <span
                    className="fw-semibold text-end text-truncate"
                    style={{
                      color: '#495057',
                      maxWidth: '60%',
                      fontSize: '0.8rem'
                    }}
                  >
                    {key === "size" ? `${formatValue(value)} inch` : formatValue(value)}
                    {value === true ? "Yes" : ""}
                    {value === false ? "No" : ""}
                  </span>
                </div>
              );
            })}
          </div>

          {product?.stock !== undefined && (
            <div className="mt-2 pt-2">
              <div className="d-flex align-items-center justify-content-between">
                <span className="small text-muted">Tình trạng:</span>
                <span
                  className={`small fw-semibold 
                    ${product.stock > 10
                      ? 'text-success'
                      : product.stock > 1
                        ? 'text-warning'
                        : 'text-danger'
                    }`}
                >
                  {
                    product.stock > 10
                      ? 'In stock'
                      : product.stock > 1
                        ? `${product.stock} products left`
                        : 'Out of stock'
                  }
                </span>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}