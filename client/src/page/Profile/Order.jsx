import { useEffect, useState } from 'react'
import axios from '../../config/AxiosConfig'
import OrdersTable from '../../component/OrdersTable'
import { getPrimitive, toReadAble } from '../../util/DataClassify'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import "../../style/Orders.css"
import OrderStatusBar from '../../component/OrderStatusBar'
import PaginationProducts from '../../component/Pagination'
import NotFoundSearch from '../../component/NotFoundSearch'

export default function Order() {
  const [order, setOrder] = useState()
  const [orders, setOrders] = useState()
  const [keys, setKeys] = useState()
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(2)
  const [filterSelections, setFilterSelections] = useState({})

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/orders/present`)
        setOrder(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrder()
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log(filterSelections)
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/orders/filter?options=${options}`)
        setOrders(response.data)
        setKeys(getPrimitive(response.data[0]))
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrders()
  }, [filterSelections])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/orders/filter?options=${options}&page=${currentPage}`)
        setOrders(response.data)
        console.log(response.data)
        setKeys(getPrimitive(response.data[0]))
      } catch (error) {
        console.log(error)
      }
    }

    // fetchOrders()
  }, [currentPage])

  useEffect(() => {
    if (!orders || !sortConfig.key) return

    const sortedOrders = [...orders].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      return sortConfig.direction === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1)
    })

    setOrders(sortedOrders)
  }, [sortConfig, orders])

  const visibleKeys = keys?.filter(key => ["_id", "orderStatus", "paymentStatus", "totalAmount", "createdAt"].includes(key))
  const uniqueStatuses = [
    "pending", "processing", "shipping", "delivered", "cancelled"
  ]

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleChange = (e) => {
    setFilterSelections(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!orders?.length) {
    return (
      <NotFoundSearch type={'order'} />
    )
  }

  return (
    <div>
      <OrderStatusBar order={order} />

      <div className="table-header">
        <div className="table-controls">
          <InputGroup style={{ maxWidth: '300px' }}>
            <Form.Control
              name='start'
              type="date"
              value={filterSelections?.start ?? ""}
              onChange={(e) => handleChange(e)}
              className="search-input"
            />
            <Form.Control
              name='end'
              type="date"
              value={filterSelections?.end ?? ""}
              onChange={(e) => handleChange(e)}
              className="search-input"
            />
          </InputGroup>
          <Form.Select
            name='orderStatus'
            value={filterSelections?.orderStatus ?? ""}
            onChange={(e) => handleChange(e)}
            className="filter-select"
            style={{ maxWidth: '200px' }}
          >
            <option value="">All status</option>
            {uniqueStatuses.slice(1).map(status => (
              <option key={status} value={status}>
                {toReadAble(status)}
              </option>
            ))}
          </Form.Select>

          <div className="table-stats">
            {orders?.length} orders
          </div>
        </div>
        <OrdersTable orders={orders} keys={visibleKeys} handleSort={handleSort} sortConfig={sortConfig} />
        <PaginationProducts totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  )
}