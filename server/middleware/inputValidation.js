import ErrorException from "../util/errorException.js"

export const inputValidation = (schema, property) => {
  return (req, res, next) => {
    try {
      const data = req[property]

      if (!data) {
        throw new ErrorException(400, 'Data is required')
      }

      const { error } = schema.validate(data, { abortEarly: false })

      if (error) {
        const errorMessages = error.details.map((err) => err.message)
        throw new ErrorException(400, errorMessages.join(', '))
      }
      console.log(error)
      next()
    } catch (error) {
      next(error)
    }
  }
}
