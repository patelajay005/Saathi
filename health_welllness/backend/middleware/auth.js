const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'No authentication token provided',
          status: 401
        }
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'User not found',
          status: 401
        }
      });
    }
    
    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Invalid authentication token',
        status: 401
      }
    });
  }
};

module.exports = auth;

