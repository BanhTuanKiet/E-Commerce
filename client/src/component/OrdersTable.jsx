import { Table } from 'react-bootstrap'
import { toReadAble, formatDate } from '../util/DataClassify'
import { useNavigate } from 'react-router-dom'

export default function OrdersTable({ orders, keys, handleSort, sortConfig }) {
  const navigate = useNavigate()

  const orderStatusMap = {
    delivered: { color: '#28a745', bgColor: '#d4edda' },
    pending: { color: '#856404', bgColor: '#fff3cd' },
    processing: { color: '#004085', bgColor: '#cce5ff' },
    cancelled: { color: '#721c24', bgColor: '#f8d7da' },
    shipping: { color: '#0c5460', bgColor: '#d1ecf1' },
  }

  const paymentStatusMap = {
    paid: { color: '#155724', bgColor: '#d4edda' },
    unpaid: { color: '#856404', bgColor: '#fff3cd' },
    failed: { color: '#721c24', bgColor: '#f8d7da' }
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="modern-orders-table">
      <Table responsive className="clean-table">
        <thead>
          <tr>
            {keys?.map((key, i) => (
              <th
                key={i}
                onClick={() => handleSort(key)}
              >
                {toReadAble(key)}
                <span className="sort-indicator">
                  {
                    key === "totalAmount" || key === "createdAt"
                      ? getSortIcon(key)
                      : ""
                  }
                </span>
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order, rowIndex) => (
            <tr key={rowIndex} >
              {keys.map((key, colIndex) => {
                const value = order[key]
                if (key === 'paymentStatus') {
                  const statusInfo = paymentStatusMap[value] || {
                    variant: 'secondary',
                    color: '#6c757d',
                    bgColor: '#e2e3e5'
                  }

                  return (
                    <td key={colIndex}>
                      <span
                        className="status-badge"
                        style={{
                          color: statusInfo.color,
                          backgroundColor: statusInfo.bgColor,
                        }}
                      >
                        {toReadAble(value)}
                      </span>
                    </td>
                  )
                }

                if (key === 'orderStatus') {
                  const statusInfo = orderStatusMap[value] || {
                    variant: 'secondary',
                    color: '#6c757d',
                    bgColor: '#e2e3e5'
                  }

                  return (
                    <td key={colIndex}>
                      <span
                        className="status-badge"
                        style={{
                          color: statusInfo.color,
                          backgroundColor: statusInfo.bgColor,
                        }}
                      >
                        {toReadAble(value)}
                      </span>
                    </td>
                  )
                }

                if (key === 'createdAt' || key.toLowerCase().includes('date')) {
                  return (
                    <td key={colIndex}>
                      <span className="order-date">
                        {value ? formatDate(value) : ''}
                      </span>
                    </td>
                  )
                }

                if (key === "totalAmount") {
                  return (
                    <td key={colIndex}>
                      <span className="order-date text-primary fw-bold">
                        {value?.toLocaleString('vi-VN')}
                      </span>
                    </td>
                  )
                }

                return (
                  <td key={colIndex}>
                    {value ?? ''}
                  </td>
                )
              })}

              <td>
                <div className="action-buttons">
                  <button className="btn-action btn-view" onClick={() => navigate(`/order/${order?._id}`)}>
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {orders?.length === 0 && (
        <div className="empty-state">
          <h5>Không tìm thấy đơn hàng nào</h5>
          <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
        </div>
      )}
    </div>
  )
}