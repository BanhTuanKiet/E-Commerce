export const getPrimitive = (data) => {
    const keys = []

    Object.entries(data).forEach(([key, value]) => {
        const isPrimitive = typeof value !== 'object' || value === null || value instanceof Date

        if (key !== 'state' && isPrimitive) {
            keys.push(key);
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
    return key.charAt(0).toUpperCase() + key.slice(1)
}

export const formatValue = (value) => {
    if (value == null || value === '') return 'N/A'
    if (typeof value === 'number') return value.toLocaleString()
    if (typeof value === 'string' && value.length > 20) {
        return value.substring(0, 17) + '...'
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