const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { validateRequest, createCommentSchema, updateCommentSchema } = require("../utils/validation");
const {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
} = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 */

// Create a comment on a post (protected)
router.post("/", authenticateToken, validateRequest(createCommentSchema), createComment);

// Update a comment by ID (protected)
router.put("/:comment_id", authenticateToken, validateRequest(updateCommentSchema), updateComment);

// Delete a comment by ID (protected)
router.delete("/:comment_id", authenticateToken, deleteComment);

// Get comments for a specific post
router.get("/post/:post_id", getPostComments);

module.exports = router;
