const {
  likePost: likePostModel,
  unlikePost: unlikePostModel,
  getPostLikes: getPostLikesModel,
  getUserLikes: getUserLikesModel,
} = require("../models/like");
const logger = require("../utils/logger");

/**
 * Like a post
 */
const likePost = async (req, res) => {
  try {
    const { post_id } = req.validatedData;
    const user_id = req.user.id;

    const liked = await likePostModel(post_id, user_id);

    if (!liked) {
      return res.status(400).json({ error: "You have already liked this post" });
    }

    logger.verbose(`User ${user_id} liked post ${post_id}`);

    res.status(201).json({ message: "Post liked" });
  } catch (error) {
    logger.critical("Like post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unlike a post
 */
const unlikePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const user_id = req.user.id;

    const unliked = await unlikePostModel(post_id, user_id);

    if (!unliked) {
      return res.status(400).json({ error: "You have not liked this post" });
    }

    logger.verbose(`User ${user_id} unliked post ${post_id}`);

    res.json({ message: "Post unliked" });
  } catch (error) {
    logger.critical("Unlike post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all likes for a post
 */
const getPostLikes = async (req, res) => {
  try {
    const { post_id } = req.params;

    const likes = await getPostLikesModel(post_id);

    res.json({ post_id, likes });
  } catch (error) {
    logger.critical("Get post likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts liked by the user
 */
const getUserLikes = async (req, res) => {
  try {
    const { user_id } = req.params;
    const current_user_id = req.user.id;

    // Users can only see their own liked posts
    if (parseInt(user_id) !== current_user_id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const likedPosts = await getUserLikesModel(user_id);

    res.json({ user_id, likedPosts });
  } catch (error) {
    logger.critical("Get user likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
};
