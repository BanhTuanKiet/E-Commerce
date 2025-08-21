import React from 'react'

export default function Sort({ sortOrder, setSortOrder }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <label htmlFor="sortSelect" className="text-muted small mb-0">
        Arrange:
      </label>
      <select
        id="sortSelect"
        className="form-select form-select-sm w-auto shadow-sm border rounded"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="default">Default</option>
        <option value="sale">Sale</option>
        <option value="asc">Price Ascending</option>
        <option value="desc">Price Descending</option>
      </select>
    </div>
  )
}
