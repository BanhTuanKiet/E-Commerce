import { Card } from 'react-bootstrap'
import { formatStateLabel } from '../../util/DataClassify'

export default function StateProductCard({ handleFilter, type, label, value, icon, color, description, isActive }) {
  const state = {
    product: "state",
    order: "orderStatus",
    voucher: "isActive"
  }

  const cardClass = `h-100 cursor-pointer border ${isActive ? 'border-primary bg-light shadow-sm' : 'border-light'}`

  return (
    <Card className={cardClass} onClick={() => handleFilter(state[type], label)}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title className="text-muted">{formatStateLabel(label)}</Card.Title>
            <h2 className={`fw-bold ${color}`}>{value}</h2>
          </div>
          <i className={`${icon} ${color}`} style={{ fontSize: '2rem' }}></i>
        </div>
        <small className="text-muted">{description}</small>
      </Card.Body>
    </Card>
  )
}
