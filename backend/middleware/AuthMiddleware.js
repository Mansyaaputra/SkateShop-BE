import User from "../models/User.js";
import { validateSession } from "../controllers/AuthController.js";

export const verifySession = async (req, res, next) => {
  // Get session ID from Authorization header
  const authHeader = req.headers['authorization'];
  console.log('🔗 Auth header received:', authHeader);
  
  const sessionId = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
    
  console.log('🎫 Extracted sessionId:', sessionId);
  
  if (!sessionId) {
    console.log('❌ No session ID provided');
    return res.status(401).json({ message: "Session ID required" });
  }
  
  try {
    // Validate session and get user ID
    const userId = validateSession(sessionId);
    console.log('👤 validateSession returned userId:', userId);
    
    if (!userId) {
      console.log('❌ Session validation failed');
      return res.status(401).json({ message: "Invalid or expired session" });
    }
    
    // Get user from database to ensure user still exists
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ message: "User not found" });
    }
    
    console.log('✅ User authenticated:', user.username);
    
    // Add user to request object
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    next();
  } catch (error) {
    console.log('💥 Error in verifySession:', error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Keep the old function name for backward compatibility
export const verifyUserToken = verifySession;