import sanitizeHtml from 'sanitize-html'
import sanitize from 'mongo-sanitize'

const sanitizeObject = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]) // Recursively sanitize nested objects
    } else if (typeof obj[key] === 'string') {
      obj[key] = sanitizeHtml(sanitize(obj[key])) // Sanitize strings
    }
  }
}

const sanitizeInputs = (req, res, next) => {
  sanitizeObject(req.body)
  sanitizeObject(req.query)
  sanitizeObject(req.params)
  next()
}

export default sanitizeInputs
