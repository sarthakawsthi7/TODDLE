const { query } = require("../utils/database");

/**
 * Post model for database operations
 */

/**
 * Create a new post
 */
const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, created_at, is_deleted)
     VALUES ($1, $2, $3, $4, NOW(), false)
     RETURNING id, user_id, content, media_url, comments_enabled, created_at`,
    [user_id, content, media_url, comments_enabled]
  );

  return result.rows[0];
};

/**
 * Get post by ID
 */
const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 AND p.is_deleted = false`,
    [postId]
  );

  return result.rows[0] || null;
};

/**
 * Get posts by user ID
 */
const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1 AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
};

/**
 * Delete a post
 */
const deletePost = async (postId, userId) => {
  const result = await query(
    `UPDATE posts
     SET is_deleted = true, updated_at = NOW()
     WHERE id = $1 AND user_id = $2`,
    [postId, userId]
  );

  return result.rowCount > 0;
};

/**
 * Update a post
 */
const updatePost = async (postId, userId, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${idx}`);
    values.push(value);
    idx++;
  }

  if (fields.length === 0) return getPostById(postId);

  values.push(postId, userId);

  const result = await query(
    `UPDATE posts
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${idx} AND user_id = $${idx + 1}
     RETURNING *`,
    values
  );

  return result.rows[0];
};

/**
 * Get feed posts for a user
 * Returns posts by followed users and self
 */
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1
        OR p.user_id IN (SELECT following_id FROM follows WHERE follower_id = $1)
        AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
};

/**
 * Search posts by content text
 */
const searchPosts = async (queryText, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.content ILIKE $1 AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${queryText}%`, limit, offset]
  );

  return result.rows;
};

/**
 * Get recent posts from all users (for non-authenticated feed)
 */
const getRecentPosts = async (limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return result.rows;
};

/**
 * Get like count for a post
 */
const getPostLikeCount = async (postId) => {
  const result = await query(
    `SELECT COUNT(*) as count FROM likes WHERE post_id = $1`,
    [postId]
  );
  return parseInt(result.rows[0].count);
};

/**
 * Get comment count for a post
 */
const getPostCommentCount = async (postId) => {
  const result = await query(
    `SELECT COUNT(*) as count FROM comments WHERE post_id = $1`,
    [postId]
  );
  return parseInt(result.rows[0].count);
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  updatePost,
  getFeedPosts,
  searchPosts,
  getRecentPosts,
  getPostLikeCount,
  getPostCommentCount,
};
