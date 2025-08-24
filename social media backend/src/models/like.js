const { query } = require("../utils/database");

/**
 * Like a post
 * @param {number} userId
 * @param {number} postId
 * @returns {Promise<boolean>} True if like was added, false if already liked
 */
const likePost = async (userId, postId) => {
	const result = await query(
		`INSERT INTO likes (user_id, post_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
		[userId, postId]
	);
	return result.rowCount > 0;
};

/**
 * Unlike a post
 * @param {number} userId
 * @param {number} postId
 * @returns {Promise<boolean>} True if unlike was successful, false if not liked
 */
const unlikePost = async (userId, postId) => {
	const result = await query(
		`DELETE FROM likes
         WHERE user_id = $1 AND post_id = $2`,
		[userId, postId]
	);
	return result.rowCount > 0;
};

/**
 * Get all likes for a post
 * @param {number} postId
 * @returns {Promise<Array>} List of users who liked the post
 */
const getPostLikes = async (postId) => {
	const result = await query(
		`SELECT u.id, u.username, u.full_name
         FROM likes l
         JOIN users u ON l.user_id = u.id
         WHERE l.post_id = $1`,
		[postId]
	);
	return result.rows;
};

/**
 * Get all posts liked by a user
 * @param {number} userId
 * @returns {Promise<Array>} List of post IDs
 */
const getUserLikes = async (userId) => {
	const result = await query(
		`SELECT post_id
         FROM likes
         WHERE user_id = $1`,
		[userId]
	);
	return result.rows.map(row => row.post_id);
};

/**
 * Check if a user has liked a specific post
 * @param {number} userId
 * @param {number} postId
 * @returns {Promise<boolean>}
 */
const hasUserLikedPost = async (userId, postId) => {
	const result = await query(
		`SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
		[userId, postId]
	);
	return result.rowCount > 0;
};

module.exports = {
	likePost,
	unlikePost,
	getPostLikes,
	getUserLikes,
	hasUserLikedPost,
};
