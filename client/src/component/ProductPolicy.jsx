import { Truck, Shield, Clock, Award, RefreshCw, Headphones } from 'lucide-react'
import { Badge, Card } from 'react-bootstrap'

const ProductPolicy = ({ category }) => {
    const policies = {
        phones: {
            warranty: '12 tháng',
            delivery: '1-2 ngày',
            return: '7 ngày',
            support: '24/7'
        },
        laptops: {
            warranty: '24 tháng',
            delivery: '2-3 ngày',
            return: '14 ngày',
            support: '24/7'
        },
        accessories: {
            warranty: '6 tháng',
            delivery: '1 ngày',
            return: '3 ngày',
            support: '8h-22h'
        }
    }

    const currentPolicy = policies[category] || policies.phones

    const policyItems = [
        {
            icon: <Truck className="text-primary" size={24} />,
            title: "Giao hàng nhanh",
            description: `Giao hàng trong ${currentPolicy.delivery} làm việc`,
            details: [
                "Miễn phí giao hàng nội thành",
                "Giao hàng tận nơi",
                "Kiểm tra hàng trước khi nhận"
            ],
            badge: "Miễn phí"
        },
        {
            icon: <Shield className="text-success" size={24} />,
            title: "Bảo hành chính hãng",
            description: `Bảo hành ${currentPolicy.warranty} tại các trung tâm`,
            details: [
                "Bảo hành 1 đổi 1 trong 30 ngày đầu",
                "Sửa chữa miễn phí",
                "Linh kiện chính hãng"
            ],
            badge: `${currentPolicy.warranty}`
        },
        {
            icon: <RefreshCw className="text-warning" size={24} />,
            title: "Đổi trả dễ dàng",
            description: `Đổi trả trong ${currentPolicy.return} nếu không hài lòng`,
            details: [
                "Hoàn tiền 100%",
                "Không cần lý do",
                "Quy trình đơn giản"
            ],
            badge: `${currentPolicy.return}`
        },
        {
            icon: <Headphones className="text-info" size={24} />,
            title: "Hỗ trợ khách hàng",
            description: `Tư vấn ${currentPolicy.support} qua hotline`,
            details: [
                "Hotline: 1900 0000",
                "Chat trực tuyến",
                "Email hỗ trợ"
            ],
            badge: currentPolicy.support
        }
    ]

    return (
        <div className="h-100">
            <div className="d-flex flex-column gap-3">
                {policyItems.map((item, index) => (
                    <Card key={index} className="border-0 shadow-sm h-100">
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-start justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    {item.icon}
                                    <h6 className="fw-semibold mb-0 ms-2 text-dark">{item.title}</h6>
                                </div>
                                <Badge
                                    bg={index === 0 ? 'primary' : index === 1 ? 'success' : index === 2 ? 'warning' : 'info'}
                                    className="text-white"
                                    style={{ fontSize: '0.7rem' }}
                                >
                                    {item.badge}
                                </Badge>
                            </div>

                            <p className="text-muted mb-2 small">{item.description}</p>

                            <div className="border-top pt-2">
                                {item.details.map((detail, detailIndex) => (
                                    <div key={detailIndex} className="d-flex align-items-center mb-1">
                                        <div
                                            className="rounded-circle me-2"
                                            style={{
                                                width: '4px',
                                                height: '4px',
                                                backgroundColor: index === 0 ? '#0d6efd' : index === 1 ? '#198754' : index === 2 ? '#ffc107' : '#0dcaf0'
                                            }}
                                        ></div>
                                        <small className="text-muted">{detail}</small>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default ProductPolicy