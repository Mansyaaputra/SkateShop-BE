import User from "../models/User.js";
import { validateSession } from "../controllers/AuthController.js";

export const verifySession = async (req, res, next) => {
  // Get session ID from Authorization header
  const authHeader = req.headers['authorization'];
  const sessionId = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  if (!sessionId) {
    return res.status(401).json({ message: "Session ID required" });
  }
  
  try {
    // Validate session and get user ID
    const userId = validateSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }
    
    // Get user from database to ensure user still exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Add user to request object
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Keep the old function name for backward compatibility
export const verifyUserToken = verifySession;