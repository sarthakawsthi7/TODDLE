const express = require("express");
const { authenticateToken, optionalAuth } = require("../middleware/auth");
const {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowStats,
  getMyProfile,
  getUserProfileById,
  searchUsers,
} = require("../controllers/users");
const router = express.Router();

/**
 * User-related routes
 */
// Get current user's profile with follower/following counts
router.get("/me", authenticateToken, getMyProfile);

// Search users by name (optional auth)
router.get("/search", optionalAuth, searchUsers);

// Follow a user
router.post("/follow", authenticateToken, follow);

// Unfollow a user
router.post("/unfollow", authenticateToken, unfollow);

// Get the list of users the current user is following
router.get("/following", authenticateToken, getMyFollowing);

// Get the list of users that follow the current user
router.get("/followers", authenticateToken, getMyFollowers);

// Get follow stats for a specific user
router.get("/stats/:user_id", authenticateToken, getFollowStats);

// Get user profile by ID (optional auth) - must be last to avoid conflicts
router.get("/:user_id", optionalAuth, getUserProfileById);

module.exports = router;