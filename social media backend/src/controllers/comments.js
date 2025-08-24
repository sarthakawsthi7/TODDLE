const {
  createComment: createCommentModel,
  updateComment: updateCommentModel,
  deleteComment: deleteCommentModel,
  getPostComments: getPostCommentsModel,
} = require("../models/comment");
const logger = require("../utils/logger");

/**
 * Create a new comment on a post
 */
const createComment = async (req, res) => {
  try {
    const { post_id, content } = req.validatedData;
    const user_id = req.user.id;

    // Check if comments are enabled on the post
    const { getPostById } = require("../models/post");
    const post = await getPostById(post_id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    if (!post.comments_enabled) {
      return res.status(403).json({ error: "Comments are disabled on this post" });
    }

    const comment = await createCommentModel({ post_id, user_id, content });

    logger.verbose(`User ${user_id} commented on post ${post_id}`);

    res.status(201).json({ message: "Comment created", comment });
  } catch (error) {
    logger.critical("Create comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update an existing comment by the user
 */
const updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { content } = req.validatedData;
    const user_id = req.user.id;

    const updated = await updateCommentModel(comment_id, user_id, content);
    if (!updated) {
      return res.status(403).json({ error: "Cannot edit this comment" });
    }

    logger.verbose(`User ${user_id} updated comment ${comment_id}`);

    res.json({ message: "Comment updated" });
  } catch (error) {
    logger.critical("Update comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete an existing comment by the user
 */
const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const user_id = req.user.id;

    const deleted = await deleteCommentModel(comment_id, user_id);
    if (!deleted) {
      return res.status(403).json({ error: "Cannot delete this comment" });
    }

    logger.verbose(`User ${user_id} deleted comment ${comment_id}`);

    res.json({ message: "Comment deleted" });
  } catch (error) {
    logger.critical("Delete comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all comments for a post
 */
const getPostComments = async (req, res) => {
  try {
    const { post_id, limit = 20, offset = 0 } = req.query;

    const comments = await getPostCommentsModel(post_id, parseInt(limit), parseInt(offset));

    res.json({ comments });
  } catch (error) {
    logger.critical("Get post comments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
};
