import { Copy, Phone, User } from 'lucide-react'
import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'

export default function CustomerCard({ customer }) {
    return (
        <Card className="mb-4">
            <Card.Header>
                <Card.Title className="d-flex align-items-center gap-2 mb-0">
                    <User size={20} />
                    Customer
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="mb-3 d-flex justify-content-between">
                    <Form.Label className="small fw-medium mb-0">Name:</Form.Label>
                    <span className="fw-normal">{customer?.name}</span>
                </div>

                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <Form.Label className="small fw-medium mb-0">Email:</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                        <span className="small text-truncate" style={{ maxWidth: 200 }}>{customer?.email}</span>
                        <Button variant="link" size="sm" className="p-1">
                            <Copy size={16} />
                        </Button>
                    </div>
                </div>

                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <Form.Label className="small fw-medium mb-0">Phone:</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                        <span>{customer?.phoneNumber}</span>
                        <Button variant="link" size="sm" className="p-1">
                            <Phone size={16} />
                        </Button>
                    </div>
                </div>

                <div className="d-flex justify-content-between">
                    <Form.Label className="small fw-medium mb-0">Địa chỉ:</Form.Label>
                    <span className="text-end small text-wrap" style={{ maxWidth: 250 }}>
                        {customer?.location?.address}, {customer?.location?.ward}, {customer?.location?.city}
                    </span>
                </div>
            </Card.Body>
        </Card>
    )
}
