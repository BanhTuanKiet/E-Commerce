import React, { useState } from 'react'
import { getStrengthColor, getStrengthText } from '../util/PasswordUtil'

export default function PasswordStrength({ passwordStrength }) {
  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <small className="text-muted">Password Strength:</small>
        <small className={`fw-semibold text-${getStrengthColor(passwordStrength)}`}>
          {getStrengthText(passwordStrength)}
        </small>
      </div>
      <div className="progress" style={{ height: '4px' }}>
        <div
          className={`progress-bar bg-${getStrengthColor(passwordStrength)}`}
          style={{ width: `${passwordStrength}%` }}
        />
      </div>
    </div>
  )
}
