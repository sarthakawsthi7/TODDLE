const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { validateRequest, likePostSchema } = require("../utils/validation");
const {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
} = require("../controllers/like");

const router = express.Router();

/**
 * Likes routes
 */

// Like a post (protected)
router.post("/", authenticateToken, validateRequest(likePostSchema), likePost);

// Unlike a post (protected)
router.delete("/:post_id", authenticateToken, unlikePost);

// Get likes for a specific post
router.get("/post/:post_id", getPostLikes);

// Get posts liked by a specific user
router.get("/user/:user_id", authenticateToken, getUserLikes);

module.exports = router;
