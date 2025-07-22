import { useEffect, useState } from 'react'
import axios from '../util/AxiosConfig'
import OrdersTable from '../component/OrdersTable'
import { getPrimitive, toReadAble } from '../util/DataClassify'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import "../style/Orders.css"
import { Search } from "lucide-react"


export default function Order() {
    const [orders, setOrders] = useState()
    const [keys, setKeys] = useState()
    const [searchTerm, setSearchTerm] = useState()
    const [filterStatus, setFilterStatus] = useState()
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`/orders`)
                setOrders(response.data)
                setKeys(getPrimitive(response.data[0]))
                console.log(response.data[0])
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrders()
    }, [])

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
    }, [sortConfig])

    // useEffect(() => {
    //     const handleFilterStatus = async () => {
    //         try {
    //             const response = await axios.get(`/orders/filter/${filterStatus}`)
    //             setOrders(response.data)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }

    //     handleFilterStatus()
    // }, [filterStatus])


    const visibleKeys = keys?.filter(key => ["_id", "orderStatus", "paymentStatus", "totalAmount", "createdAt"].includes(key))
    const uniqueStatuses = [
        "completed", "pending", "processing", "shipped", "cancelled"
    ]

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const filteredOrders = orders?.filter(order => {
        if (!searchTerm) return true
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
        return orderDate === searchTerm
    })

    return (
        <div style={{ width: "80%" }} className='mx-auto'>
            <div className="table-header">
                <div className="table-controls">
                    <InputGroup style={{ maxWidth: '300px' }}>
                        <Form.Control
                            type="date"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </InputGroup>
                    <Form.Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                        style={{ maxWidth: '200px' }}
                    >
                        <option value="all">All status</option>
                        {uniqueStatuses.slice(1).map(status => (
                            <option key={status} value={status}>
                                {toReadAble(status)}
                            </option>
                        ))}
                    </Form.Select>

                    <div className="table-stats">
                        {/* <strong>{sortedOrders?.length}</strong> / */}
                        {orders?.length} orders
                    </div>
                </div>
                <OrdersTable
                    orders={filteredOrders}
                    keys={visibleKeys}
                    handleSort={handleSort}
                    sortConfig={sortConfig}
                />            </div>
        </div>
    )
}