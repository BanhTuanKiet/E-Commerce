export const getKey = (data) => {
  const keys = []

  Object.entries(data).map(key => (
    keys.push(key)
  ))

  return keys
}

export const getPrimitive = (data) => {
  const keys = []

  Object.entries(data).forEach(([key, value]) => {
    const isPrimitive = typeof value !== 'object' || value === null || value instanceof Date

    if (key !== 'state' && isPrimitive) {
      keys.push(key)
    }
  })

  return keys
}

export const getArray = (data) => {
  const keys = []

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      keys.push(key)
    }
  })

  return keys
}

export const getObject = (data) => {
  const keys = []

  Object.entries(data).forEach(([key, value]) => {
    const isObject = typeof value === 'object' && value !== null && !Array.isArray(value)

    if (isObject) {
      keys.push(key)
    }
  })

  return keys
}

export const toReadAble = (key) => {
  if (typeof key !== 'string') return
  if (key === '_id') {
    return "Id"
  }
  if (key.includes('_')) {
    return key.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
  }

  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

export const formatLabel = (key) => {
  if (typeof key !== 'string') return ''
  return key.charAt(0).toUpperCase() + key.slice(1)
}

export const formatValue = (value) => {
  if (value == null || value === '') return 'N/A'
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'string' && value.length > 15) {
    return value.substring(0, 15) + '...'
  }
  return value
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const formatStateLabel = (state) => {
  if (!state) return 'N/A'

  return state
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // thêm dấu cách giữa chữ thường và hoa
    .replace(/^./, str => str.toUpperCase())  // viết hoa chữ cái đầu
}

export const createEmptyFormData = (product) => {
  const formData = {};

  for (const key in product) {
    const value = product[key];

    if (['_id', 'reviews', 'avgScore', 'discount', 'sold', 'createdAt'].includes(key)) {
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      // Trường là object con
      formData[key] = {}
      for (const subKey in value) {
        formData[key][subKey] = ''
      }
    } else if (Array.isArray(value)) {
      // Trường là array (ví dụ: images)
      formData[key] = []
    } else {
      // Trường primitive (string, number)
      formData[key] = typeof value === 'number' ? 0 : ''
    }
  }

  return formData;
};
