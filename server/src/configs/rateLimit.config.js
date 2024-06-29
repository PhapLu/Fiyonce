import rateLimit from 'express-rate-limit';

// In-memory store for tracking blocked IPs and their unblock times
const blockedIPs = new Map();
const BLOCK_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days

// Middleware to check if an IP is blocked
const blockChecker = (req, res, next) => {
  const ip = req.ip;
  const unblockTime = blockedIPs.get(ip);

  if (unblockTime && unblockTime > Date.now()) {
    return res.status(429).json({
      code: 429,
      message: 'Too many requests from this IP, please try again later.'
    });
  } else if (unblockTime && unblockTime <= Date.now()) {
    // Unblock the IP if the unblock time has passed
    blockedIPs.delete(ip);
  }

  next();
};

// Custom handler to block IPs for BLOCK_DURATION
const customHandler = (req, res, next) => {
  const ip = req.ip;
  // Block the IP for BLOCK_DURATION
  blockedIPs.set(ip, Date.now() + BLOCK_DURATION);
  res.status(429).json({
    code: 429,
    message: 'Too many requests from this IP, please try again later.'
  });
};

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 400, // Limit each IP to 400 requests per windowMs
  handler: customHandler
});

// Specific rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  handler: customHandler
});

// Specific rate limiter for file upload routes
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  handler: customHandler
});

export { globalLimiter, authLimiter, uploadLimiter, blockChecker };
