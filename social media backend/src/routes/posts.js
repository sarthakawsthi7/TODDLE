const express = require("express");
const { validateRequest, createPostSchema, updatePostSchema } = require("../utils/validation");
const {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,       // make sure this controller is implemented
  updatePost     // make sure this controller is implemented
} = require("../controllers/posts");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * Posts routes
 */

// POST /api/posts - Create a new post
router.post("/", authenticateToken, validateRequest(createPostSchema), create);

// GET /api/posts - Get all posts (optional auth)
router.get("/", optionalAuth, getFeed);

// GET /api/posts/my - Get current user's posts
router.get("/my", authenticateToken, getMyPosts);

// GET /api/posts/user/:user_id - Get posts by a specific user
router.get("/user/:user_id", optionalAuth, getUserPosts);

// GET /api/posts/feed - Get posts from followed users
router.get("/feed", authenticateToken, getFeed);

// GET /api/posts/:post_id - Get a single post by ID (must be last to avoid conflicts)
router.get("/:post_id", optionalAuth, getById);

// PUT /api/posts/:post_id - Update a post
router.put("/:post_id", authenticateToken, validateRequest(updatePostSchema), updatePost);

// DELETE /api/posts/:post_id - Delete a post
router.delete("/:post_id", authenticateToken, remove);

module.exports = router;
