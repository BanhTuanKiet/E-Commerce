export const calculatePasswordStrength = (password) => {
  if (!password) return 0
  let strength = 0

  if (password.length >= 8) strength += 20
  if (/[a-z]/.test(password)) strength += 20
  if (/[A-Z]/.test(password)) strength += 20
  if (/[0-9]/.test(password)) strength += 20
  if (/[^A-Za-z0-9]/.test(password)) strength += 20

  return strength
}

export const getStrengthColor = (strength) => {
  switch (strength) {
    case 20: return 'danger'   // yếu
    case 40: return 'warning'  // trung bình
    case 60: return 'info'     // khá
    case 80: return 'primary'  // tốt
    case 100: return 'success' // mạnh
    default: return 'secondary'
  }
}

export const getStrengthText = (strength) => {
  switch (strength) {
    case 20: return 'Very Weak'
    case 40: return 'Weak'
    case 60: return 'Fair'
    case 80: return 'Good'
    case 100: return 'Strong'
    default: return ''
  }
}
