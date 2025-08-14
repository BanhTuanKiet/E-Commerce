import { Card } from 'react-bootstrap'
import { formatStateLabel } from '../../util/DataClassify'
import { itemStatusIcons } from '../../util/StatusIcon'

export default function StatusItemCard({ handleFilter, type, label, value, isActive }) {
  const statusIcons = itemStatusIcons[type]
  const icon = statusIcons[label]?.icon || "bi bi-box"
  const color = statusIcons[label]?.color || "text-muted"
  const description = statusIcons[label]?.description || ""

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
