import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token
 */
export function verifyToken(req, res, next) {
  try {
    const authHeader = req.header('Authorization');

    // Check if token exists and follows 'Bearer <token>' format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info (id, role, etc.) to request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * Middleware to restrict access to specific roles
 * @param {...string} roles - allowed roles (e.g. 'admin', 'manager')
 */
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient privileges.' });
    }
    next();
  };
}
