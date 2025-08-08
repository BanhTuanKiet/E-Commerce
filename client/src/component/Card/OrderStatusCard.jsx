import React from 'react'
import { Card, Form, Button } from 'react-bootstrap'

export default function OrderStatusCard({ handleStatus, handleSaveStatus, status }) {
    return (
        <Card className="mb-4">
            <Card.Header>
                <Card.Title className="mb-0">Update status</Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <Form.Label className="small fw-medium">Order status</Form.Label>
                    <Form.Select name='orderStatus' value={status?.orderStatus} onChange={handleStatus}>
                        <option value="">Select status</option>
                        <option value="processing">Processing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </Form.Select>
                </div>
                <div className="mb-3">
                    <Form.Label className="small fw-medium">Payment status</Form.Label>
                    <Form.Select name='paymentStatus' value={status?.paymentStatus} onChange={handleStatus}>
                        <option value="">Select status</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                    </Form.Select>
                </div>

                <div className="d-flex justify-content-end w-100">
                    <Button variant="primary" className='w-100' onClick={handleSaveStatus}>
                        Lưu thay đổi
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}
