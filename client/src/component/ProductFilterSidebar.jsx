import React, { useState } from 'react'
import "../style/filterSidebar.css"

export default function ProductFilterSidebar({ keysFilter, handleCheckboxChange }) {
  const [priceRange, setPriceRange] = useState(0)
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') + ' ₫'
  }

  const priceKey = keysFilter?.find((key) => key.key === "price")
  const otherFilters = keysFilter?.filter((key) => key.key !== "price")

  return (
    <div className="filter-container text-start">
      {priceKey && (
        <div className="filter-section">
          <h6 className="mb-3 fw-medium" style={{ fontSize: '14px' }}>Giá</h6>
          <div className="price-range">
            <div className="price-display d-flex justify-content-between">
              <small className="text-muted">{formatPrice(priceKey.min)}</small>
              <small className="price-current text-primary fw-medium">{formatPrice(priceRange)}</small>
            </div>
            <input
              type="range"
              className="range-slider w-100"
              min={priceKey.min || 0}
              max={priceKey.max || 100000000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #0d6efd 0%, #0d6efd ${(priceRange / (priceKey.max || 1)) * 100}%, #e9ecef ${(priceRange / (priceKey.max || 1)) * 100}%, #e9ecef 100%)`
              }}
            />
          </div>
        </div>
      )}

      {otherFilters?.map((key, index) => (
        <div className="filter-section" key={index}>
          <div
            className={`filter-header d-flex justify-content-between ${!expandedSections[key.key] ? 'collapsed' : ''}`}
            onClick={() => toggleSection(key.key)}
            style={{ cursor: 'pointer' }}
          >
            <span>{key.label}</span>
            <i className={`bi ${expandedSections[key.key] ? 'bi-chevron-down' : 'bi-chevron-right'} collapse-icon`}></i>
          </div>

          {expandedSections[key.key] && (
            <div className="filter-options">
              {key?.values?.map((item, idx) => (
                <div key={idx} className="filter-item form-check mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${key.key}-${idx}`}
                    onChange={() => handleCheckboxChange(key.key, item)}
                  />
                  <label className="form-check-label" htmlFor={`${key.key}-${idx}`}>{item}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}