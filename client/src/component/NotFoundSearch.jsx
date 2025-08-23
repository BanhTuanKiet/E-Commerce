import React from 'react'
import { Alert, Button } from 'react-bootstrap'

export default function NotFoundSearch({ type, onClear }) {
  return (
    <Alert variant="info" className="text-center mb-0 pt-0">
      <div className="fs-1 mb-2">🏷️</div>
      <h5>No {type} found</h5>
      <div className='d-flex justify-content-center'>
        <p className='my-auto'>Try changing your search filter or keywords</p>
        {onClear &&
          <Button
            variant="primary"
            size="sm"
            className="mt-2 ms-2"
            onClick={onClear}
          >
            Clear Filter
          </Button>
        }
      </div>
    </Alert>
  )
}
