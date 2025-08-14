import { Badge } from "react-bootstrap"
import { formatLabel, toReadAble } from "./DataClassify"
import { AlertCircle, CheckCircle, Clock, Star, Truck } from "lucide-react"

export const getStatusBadge = (stock) => {
  if (stock === 0) {
    return <span className="badge bg-danger">Out of stock: {stock}</span>
  }
  if (stock <= 5) {
    return <span className="badge bg-warning">Almost out of stock: {stock}</span>
  }
  return <span className="badge bg-success">In stock: {stock}</span>
}

export const getProductState = (status) => {
  const statusConfig = {
    sale: { variant: "danger" },
    new: { variant: "primary" },
    default: { variant: "success" }
  }

  const config = statusConfig[status] || statusConfig.default
  return <Badge bg={config.variant}>{toReadAble(status)}</Badge>
}

export const getOrderStatusBadge = (status) => {
  const statusConfig = {
    processing: { variant: "warning", icon: Clock },
    confirmed: { variant: "info", icon: CheckCircle },
    shipping: { variant: "primary", icon: Truck },
    delivered: { variant: "success", icon: CheckCircle },
    cancelled: { variant: "danger", icon: AlertCircle },
  }

  const config = statusConfig[status] || statusConfig.processing
  const IconComponent = config.icon
  return (
    <Badge bg={config.variant} className="d-flex align-items-center gap-1">
      <IconComponent size={12} />
      {formatLabel(status)}
    </Badge>
  )
}


export const getPaymentStatusBadge = (status) => {
  const statusConfig = {
    unpaid: { variant: "secondary" },
    paid: { variant: "success" },
    failed: { variant: "danger" },
  }

  const config = statusConfig[status] || statusConfig.unpaid
  return <Badge bg={config.variant}>{formatLabel(status)}</Badge>
}

export const getPaymentMethodBadge = (method) => {
  const methodConfig = {
    COD: { label: "COD", variant: "warning" },
    VNPay: { label: "VNPay", variant: "primary" },
    Momo: { label: "Momo", variant: "danger" },
  }

  const config = methodConfig[method] || methodConfig.COD
  return <Badge bg={config.variant} pill>{config.label}</Badge>
}


export const renderStars = (rating) => {
  if (rating === 0) {
    return (
      <Badge bg={"secondary"}>{"No reivew "}</Badge>
    )
  }
  return (
    <div className="d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? "text-warning fill-warning" : "text-secondary"}
          fill={star <= rating ? "#facc15" : "none"}
        />
      ))}
    </div>
  )
}

export const getVoucherStatus = (voucher) => {
  const now = new Date()
  const startDate = new Date(voucher.startDate)
  const endDate = new Date(voucher.endDate)

  if (!voucher.isActive) {
    return <Badge bg="secondary">Pause</Badge>
  }

  if (now < startDate) {
    return <Badge bg="info">Upcoming</Badge>
  }

  if (now > endDate) {
    return <Badge bg="danger">Expired</Badge>
  }

  if (voucher.usedCount >= voucher.quantity) {
    return <Badge bg="danger">Unavailable</Badge>
  }

  return <Badge bg="success">Available</Badge>
};