import { createContext, useState } from "react"

const ValideFormContext = createContext()

const ValideFormProvider = ({ children }) => {
  const [formErrors, setFormErrors] = useState({})
  // Hàm xóa lỗi của một trường cụ thể
  const clearFieldError = (fieldName) => {
    if (formErrors[fieldName]) {
      const updatedErrors = { ...formErrors }
      delete updatedErrors[fieldName]
      setFormErrors(updatedErrors)
    }
  }

  const validateField = (fieldName, value) => {
    if (value && value.toString().trim() !== '') {
      clearFieldError(fieldName)
      return true
    }
    return false
  }

  const validateForm = (formData, type) => {
    const errors = {}
    console.log(formData)
    const fieldNames = {
      name: "name",
      phoneNumber: "phone number",
      email: "email",
      gender: "gender",
      password: "password",
      passwordConfirmed: "password confirmed",
      address: "address",
      ward: "ward",
      city: "city"
    }

    let requiredFields = []

    if (type === "signin") {
      requiredFields = ["email", "password"]
    } else {
      requiredFields = Object.keys(formData)
    }

    Object.keys(formData).forEach((key) => {
      if (!requiredFields.includes(key)) return

      const value = formData[key]?.toString().trim()

      if (typeof key === "object") {
        Object.keys(formData[key]).forEach((childKey) => {
          const childValue = formData[key][childKey]?.toString().trim()
          if (!childValue) {
            errors[childKey] = `Please enter ${fieldNames[childKey]}`
          }
        })
      } else if (!value) {
        if (key === "gender") {
          errors[key] = `Please select ${fieldNames[key]}`
        } else {
          errors[key] = `Please enter ${fieldNames[key]}`
        }
      }
    })

    if (requiredFields.includes("email") && formData.email && !errors.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
      if (!emailRegex.test(formData.email)) {
        errors.email = "Email is not in the correct format"
      }
    }

    if (requiredFields.includes("phoneNumber") && formData.phoneNumber && !errors.phoneNumber) {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
        errors.phoneNumber = "Phone number must be 10-11 digits"
      }
    }

    if (requiredFields.includes("password") && formData.password && !errors.password) {
      const password = formData.password
      const passwordErrors = []

      if (password.length < 6) passwordErrors.push("at least 6 characters")
      if (!/[0-9]/.test(password)) passwordErrors.push("at least 1 digit")
      if (!/[a-z]/.test(password)) passwordErrors.push("at least 1 lowercase letter")
      if (!/[A-Z]/.test(password)) passwordErrors.push("at least 1 uppercase letter")
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) passwordErrors.push("at least 1 special character")

      if (passwordErrors.length > 0) {
        errors.password = `Password must be ${passwordErrors.join(", ")}`
      }
    }

    if (requiredFields.includes("passwordConfirmed") && formData.passwordConfirmed && !errors.passwordConfirmed) {
      if (formData.password !== formData.passwordConfirmed) {
        errors.passwordConfirmed = "Mật khẩu xác nhận không khớp với mật khẩu đã nhập"
      }
    }

    setFormErrors(errors)
    console.log(errors)
    return Object.keys(errors).length
  }

  return (
    <ValideFormContext.Provider value={{ validateForm, formErrors, setFormErrors, clearFieldError, validateField }}>
      {children}
    </ValideFormContext.Provider>
  )
}

export { ValideFormContext, ValideFormProvider }