import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function CompareBar({ products, setProductsCompare, onClear }) {
    const [comparePath, setComparePath] = useState("")
    const onRemove = (product) => {
        setProductsCompare(products.filter(p => p._id !== product._id))
    }

    const filledSlots = products.filter(p => p).length
    const totalSlots = products.length

    useEffect(() => {
        const setCompareUrl = () => {
            const slugs = products.map(p => p._id).join("vs")

            setComparePath(slugs)
        }

        setCompareUrl()
    }, [products])

    return (
        <div
            className="position-fixed bottom-0 start-50 translate-middle-x bg-white border-top shadow-lg w-50"
            style={{ zIndex: 1000 }}
        >
            <div className="bg-light border-bottom px-2 py-1">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-arrow-left-right text-primary me-2"></i>
                        <span className="fw-semibold text-dark">So sánh sản phẩm</span>
                        <span className="badge bg-primary ms-2">{filledSlots}/{totalSlots}</span>
                    </div>
                    <button
                        onClick={onClear}
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                        disabled={filledSlots === 0}
                    >
                        <i className="bi bi-trash me-1"></i>
                        Xóa tất cả
                    </button>
                </div>
            </div>

            <div className="p-2">
                <div className="row g-2">
                    <div className="col-12 col-lg-8">
                        <div className="d-flex flex-nowrap overflow-auto pb-1" style={{ gap: '8px' }}>
                            {[0, 1, 2].map((i) => {
                                const product = products[i]
                                if (product) {
                                    return (
                                        <div
                                            key={i}
                                            className="card position-relative flex-shrink-0 shadow-sm border-0"
                                            style={{ width: '130px', minHeight: '120px' }}
                                        >
                                            <div className="card-body p-2 d-flex flex-column align-items-center text-center">
                                                <div className="position-relative mb-1">
                                                    <img
                                                        src={product.images?.[0] || '/placeholder-image.jpg'}
                                                        alt={product.model || 'Product'}
                                                        className="rounded border"
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        onClick={() => onRemove(product)}
                                                        className="btn btn-sm btn-danger position-absolute rounded-circle p-0 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            top: '-6px',
                                                            right: '-6px',
                                                            fontSize: '9px'
                                                        }}
                                                        title="Xóa sản phẩm"
                                                    >
                                                        <i className="bi bi-x"></i>
                                                    </button>
                                                </div>
                                                <h6 className="card-title small mb-1 text-truncate w-100" title={product.model}>
                                                    {product.model || 'Sản phẩm'}
                                                </h6>
                                                {product.price && (
                                                    <span className="badge bg-success small">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            key={i}
                                            className="card border-dashed flex-shrink-0 d-flex align-items-center justify-content-center text-muted bg-light"
                                            style={{
                                                width: '130px',
                                                minHeight: '120px',
                                                borderStyle: 'dashed',
                                                borderWidth: '2px',
                                                borderColor: '#dee2e6'
                                            }}
                                        >
                                            <div className="text-center">
                                                <div
                                                    className="rounded-circle bg-white border d-flex align-items-center justify-content-center mx-auto mb-1"
                                                    style={{ width: '36px', height: '36px' }}
                                                >
                                                    <i className="bi bi-plus-lg text-primary"></i>
                                                </div>
                                                <small className="text-muted">Thêm sản phẩm</small>
                                            </div>
                                        </div>
                                    );
                                }
                            })}

                        </div>
                    </div>

                    <div className="col-12 col-lg-4 d-flex align-items-center justify-content-lg-end">
                        <div className="d-flex flex-column flex-lg-row gap-2 w-100 w-lg-auto">
                            <Link
                                to={`/compare/${comparePath}`}
                                className={`btn btn-primary d-flex align-items-center justify-content-center px-3 py-1 ${filledSlots < 2 ? 'disabled' : ''
                                    }`}
                                style={{ minWidth: '120px', fontSize: '14px' }}
                            >
                                <i className="bi bi-arrow-left-right me-2"></i>
                                So sánh ngay
                                {filledSlots >= 2 && (
                                    <span className="badge bg-light text-primary ms-2">{filledSlots}</span>
                                )}
                            </Link>

                            {filledSlots > 0 && (
                                <div className="text-center text-lg-start">
                                    <small className="text-muted">
                                        {filledSlots < 2 ?
                                            `Cần thêm ${2 - filledSlots} sản phẩm để so sánh` :
                                            'Sẵn sàng so sánh'
                                        }
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {filledSlots > 0 && filledSlots < totalSlots && (
                <div className="progress" style={{ height: '2px' }}>
                    <div
                        className="progress-bar bg-primary"
                        style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
                    ></div>
                </div>
            )}
        </div>
    )

}