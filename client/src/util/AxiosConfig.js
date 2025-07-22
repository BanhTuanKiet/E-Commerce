import axios from "axios"
import { success, warning, danger } from "./NotifyUtil"

const instance = axios.create({
    baseURL: "http://127.0.0.1:2908",
    withCredentials: true,
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(function (response) {
// Any status code that lie within the range of 2xx cause this function to trigger
// Do something with response data
  if (response.status === 200 && response.data.message) {
    const message = response.data.message
    success(message)
  }

  return response.data
}, function (error) {
// Any status codes that falls outside the range of 2xx cause this function to trigger
// Do something with response error
  if (error && error.response && error.response.data) {
    console.log(error)
    const errorMessage = error.response.data.message
    const statusCode = error.response.status

    // if (statusCode === 401 && error.response.data?.RetryRequest && !error.config.retry) {
    //   console.log(error.config)
    //   console.log(error.config.retry)

    //   error.config.retry = true
    //   return instance(error.config)
    // }
    // console.log(errorMessage)
    switch (statusCode) {
      case 400:
      case 404:
      case 403:
        warning(errorMessage)
        break
      case 500:
        danger(errorMessage)
        break
      case 401:
        const currentPath = window.location.pathname + window.location.search
        localStorage.setItem("prevPage", currentPath)
        warning(errorMessage)
  
        setTimeout(() => {
          window.location.href = "/signin"
        }, 1700)
        break
      default:
        danger(errorMessage)
    } 
  }

  return Promise.reject(error)
})

export default instance