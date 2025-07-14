const debounce = (func, delay = 300) => {
  let timerId

  return (...args) => {
    if (timerId) clearTimeout(timerId)

    timerId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export default debounce