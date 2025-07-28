import React from 'react'
import { Card } from 'react-bootstrap'
import { formatStateLabel } from '../../util/DataClassify'

export default function StateProductCard({ handleFilter, label, value, icon, color }) {
    return (
        <Card className="h-100" onClick={() => handleFilter("state", label)}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title className="text-muted">{formatStateLabel(label)}</Card.Title>
                        <h2 className={`fw-bold ${color}`}>{value}</h2>
                    </div>
                    <i className={`${icon} ${color}`} style={{ fontSize: '2rem' }}></i>
                </div>
            </Card.Body>
        </Card>
    )
}
