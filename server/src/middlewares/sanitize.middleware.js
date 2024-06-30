import sanitizeHtml from 'sanitize-html';
import sanitize from 'mongo-sanitize';

// Define allowed HTML tags and attributes for sanitization
const sanitizeHtmlOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'div', 'span'],
  allowedAttributes: {
    'a': ['href'],
    'div': [],
    'span': []
  },
  allowedSchemes: ['http', 'https']
};

// Function to recursively sanitize nested objects
const sanitizeObject = (obj) => {
  if (Array.isArray(obj)) {
    // If obj is an array, recursively sanitize each item
    return obj.map(item => sanitizeObject(item));
  } else if (obj && typeof obj === 'object') {
    // If obj is an object, iterate through its keys
    const sanitizedObject = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.startsWith('$')) {
          // If key starts with '$', skip it to prevent MongoDB operator injection
          continue;
        }
        sanitizedObject[key] = sanitizeObject(obj[key]); // Recursively sanitize nested objects
      }
    }
    return sanitizedObject;
  } else if (typeof obj === 'string') {
    // If obj is a string, sanitize HTML and remove potential MongoDB injection
    return sanitizeHtml(sanitize(obj), sanitizeHtmlOptions);
  } else {
    // Convert other types to string to ensure uniform handling
    return String(obj);
  }
};

// Middleware function to sanitize req.body, req.query, and req.params
const sanitizeInputs = (req, res, next) => {
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  next();
};

export default sanitizeInputs;
