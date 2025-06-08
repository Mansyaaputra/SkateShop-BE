import User from "../models/User.js";

export const verifySession = async (req, res, next) => {
  // Check if user is logged in via session
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  
  try {
    // Get user from database to ensure user still exists
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      req.session.destroy();
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