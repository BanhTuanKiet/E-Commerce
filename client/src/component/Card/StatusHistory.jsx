import { Clock } from 'lucide-react'
import React from 'react'
import { Card } from 'react-bootstrap'
import { getOrderStatusBadge } from '../../util/BadgeUtil'

export default function StatusHistory({ statusHistory }) {
    const statusList = ['processing', 'confirmed', 'shipping', 'delivered', 'cancelled']

    return (
        <Card>
            <Card.Header>
                <Card.Title className="d-flex align-items-center gap-2 mb-0">
                    <Clock size={20} />
                    Order status history
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {statusList.map((statusKey, index) => {
                    const statusData = statusHistory?.[statusKey]
                    if (!statusData?.createdAt) return null

                    const createdAt = new Date(statusData.createdAt)
                    const updatedAt = new Date(statusData.updatedAt)
                    const isUpdated = updatedAt.getTime() !== createdAt.getTime()

                    return (
                        <div key={statusKey} className="d-flex gap-3 mb-3">
                            <div className="d-flex flex-column align-items-center">
                                <div
                                    className="rounded-circle bg-primary"
                                    style={{ width: "12px", height: "12px" }}
                                ></div>
                                {index < statusList.length - 1 && (
                                    <div
                                        className="bg-secondary"
                                        style={{ width: "1px", height: "32px", marginTop: "8px" }}
                                    ></div>
                                )}
                            </div>
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    {getOrderStatusBadge(statusKey)}
                                    <small className="text-muted">
                                        {createdAt.toLocaleString("vi-VN")}
                                    </small>
                                </div>
                                {isUpdated && (
                                    <div className="ms-4">
                                        <small className="text-muted fst-italic">
                                            Cập nhật lúc: {updatedAt.toLocaleString("vi-VN")}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </Card.Body>
        </Card>
    )
}
