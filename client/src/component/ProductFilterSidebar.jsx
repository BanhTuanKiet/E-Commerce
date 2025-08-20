import { useEffect, useMemo, useState } from 'react'
import debounce from '../util/Debounce'
import "../style/filterSidebar.css"
import { toReadAble } from '../util/DataClassify'

export default function ProductFilterSidebar({ keysFilter, handleCheckboxChange }) {
  const [priceRange, setPriceRange] = useState(0)
  const [expandedSections, setExpandedSections] = useState({})

  useEffect(() => {
    if (keysFilter === undefined) return
    setPriceRange(keysFilter[0]?.max)
  }, [keysFilter])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const debouncedPriceFilter = useMemo(() => debounce((key, value) => {
    handleCheckboxChange(key.key, { min: key.min, max: value })
  }, 300), [handleCheckboxChange])

  const handlePriceChange = (e, key) => {
    const value = parseInt(e.target.value)
    setPriceRange(value)
    debouncedPriceFilter(key, value)
  }

  return (
    <div className="filter-container text-start">
      {keysFilter?.map((key, index) => {
        if (key.key === "price") {
          return (
            <div className="filter-section" key={index}>
              <h6 className="mb-3 fw-medium" style={{ fontSize: '14px' }}>{toReadAble(key.key)}</h6>
              <div className="price-range">
                <div className="price-display d-flex justify-content-between">
                  <small className="text-muted">{key.min.toLocaleString('vi-VN')}</small>
                  <small className="price-current text-primary fw-medium">{priceRange.toLocaleString('vi-VN') + ' ₫'}</small>
                </div>
                <input
                  type={key.type}
                  className="range-slider w-100"
                  min={key.min}
                  max={key.max}
                  step={key.step}
                  value={priceRange}
                  onChange={(e) => handlePriceChange(e, key)}
                  style={{
                    background: `linear-gradient(to right, #0d6efd 0%, #0d6efd ${(priceRange / (key.max || 1)) * 100}%, #e9ecef ${(priceRange / (key.max || 1)) * 100}%, #e9ecef 100%)`
                  }}
                />
              </div>
            </div>
          )
        } else {
          return (
            <div className="filter-section" key={index}>
              <div
                className={`filter-header d-flex justify-content-between ${!expandedSections[key.key] ? 'collapsed' : ''}`}
                onClick={() => toggleSection(key.key)}
                style={{ cursor: 'pointer' }}
              >
                <span>{toReadAble(key.key)}</span>
                <i className={`bi ${expandedSections[key.key] ? 'bi-chevron-down' : 'bi-chevron-right'} collapse-icon`}></i>
              </div>

              {expandedSections[key.key] && (
                <div className="filter-options">
                  {key?.values?.map((item, idx) => (
                    <div key={idx} className="filter-item form-check mb-1">
                      <input
                        type={key.type}
                        name={key.key}
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
          )
        }
      })}
    </div>
  )
}