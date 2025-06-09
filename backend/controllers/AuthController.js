import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// In-memory store for user sessions (in production, use Redis or database)
const userSessions = new Map();

// Generate a secure session ID for user authentication
const generateSessionId = (userId) => {
  const sessionId = crypto.randomBytes(32).toString('hex');
  userSessions.set(sessionId, { 
    userId, 
    createdAt: new Date(),
    lastAccessed: new Date()
  });
  return sessionId;
};

// Validate user session
export const validateSession = (sessionId) => {
  const sessionData = userSessions.get(sessionId);
  if (!sessionData) return null;
  
  // Check if session is expired (24 hours from last access)
  const timeSinceLastAccess = Date.now() - sessionData.lastAccessed.getTime();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  if (timeSinceLastAccess > maxAge) {
    userSessions.delete(sessionId);
    return null;
  }
  
  // Update last accessed time
  sessionData.lastAccessed = new Date();
  
  return sessionData.userId;
};

// Remove user session
export const removeSession = (sessionId) => {
  userSessions.delete(sessionId);
};

// Get all sessions for a user (useful for logout from all devices)
export const getUserSessions = (userId) => {
  const sessions = [];
  for (const [sessionId, sessionData] of userSessions) {
    if (sessionData.userId === userId) {
      sessions.push(sessionId);
    }
  }
  return sessions;
};

// Remove all sessions for a user
export const removeAllUserSessions = (userId) => {
  const sessionsToRemove = getUserSessions(userId);
  sessionsToRemove.forEach(sessionId => userSessions.delete(sessionId));
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExist = await User.findOne({ where: { email } });
    if (userExist)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    // Generate session ID for the new user
    const sessionId = generateSessionId(newUser.id);

    res.status(201).json({ 
      message: "User registered successfully",
      sessionId,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    // Generate session ID for user
    const sessionId = generateSessionId(user.id);

    res.json({
      loggedIn: true,
      sessionId,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  const sessionId = req.headers['authorization']?.replace('Bearer ', '');
  
  if (sessionId) {
    removeSession(sessionId);
  }
  
  res.json({ message: "Logged out successfully" });
};

export const logoutAll = async (req, res) => {
  try {
    const userId = req.user.id; // From middleware
    removeAllUserSessions(userId);
    res.json({ message: "Logged out from all devices successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  const sessionId = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!sessionId) {
    return res.json({ loggedIn: false });
  }
  
  const userId = validateSession(sessionId);
  if (!userId) {
    return res.json({ loggedIn: false });
  }
  
  try {
    const user = await User.findByPk(userId, { 
      attributes: { exclude: ["password"] } 
    });
    
    if (!user) {
      removeSession(sessionId);
      return res.json({ loggedIn: false });
    }
    
    res.json({ 
      loggedIn: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get session info (for debugging)
export const getSessionInfo = (req, res) => {
  const sessionId = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!sessionId) {
    return res.status(400).json({ message: "Session ID required" });
  }
  
  const sessionData = userSessions.get(sessionId);
  if (!sessionData) {
    return res.status(404).json({ message: "Session not found" });
  }
  
  res.json({
    sessionId,
    userId: sessionData.userId,
    createdAt: sessionData.createdAt,
    lastAccessed: sessionData.lastAccessed,
    isValid: true
  });
};