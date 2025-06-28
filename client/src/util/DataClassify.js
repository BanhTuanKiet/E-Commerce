export const getPrimitive = (data) => {
    const keys = []

    Object.entries(data).forEach(([key, value]) => {
        const isPrimitive = typeof value !== 'object' || value === null || value instanceof Date

        if (isPrimitive) {
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
