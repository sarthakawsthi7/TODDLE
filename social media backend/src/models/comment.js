const { query } = require("../utils/database");
/** * Comment model for managing post comments * TODO: Implement this model for the comment functionality */

/**
 * Create a new comment
 * @param {Object} param0
 * @param {number} param0.post_id - ID of the post
 * @param {number} param0.user_id - ID of the user
 * @param {string} param0.content - Comment content
 * @returns {Promise<Object>} Created comment
 */
const createComment = async ({ post_id, user_id, content }) => {
	const result = await query(
		`INSERT INTO comments (post_id, user_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
		[post_id, user_id, content]
	);
	return result.rows[0];
};

/**
 * Update a comment
 * @param {number} commentId - ID of the comment
 * @param {number} userId - ID of the user (for authorization)
 * @param {string} content - New comment content
 * @returns {Promise<Object>} Updated comment
 */
const updateComment = async (commentId, userId, content) => {
	const result = await query(
		`UPDATE comments
         SET content = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
		[content, commentId, userId]
	);
	return result.rows[0];
};

/**
 * Delete a comment
 * @param {number} commentId - ID of the comment
 * @param {number} userId - ID of the user (for authorization)
 * @returns {Promise<boolean>} Success status
 */
const deleteComment = async (commentId, userId) => {
	const result = await query(
		`UPDATE comments
         SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2`,
		[commentId, userId]
	);
	return result.rowCount > 0;
};

/**
 * Get comments for a post
 * @param {number} postId - ID of the post
 * @param {number} limit - Number of comments to return
 * @param {number} offset - Number of comments to skip
 * @returns {Promise<Array>} List of comments
 */
const getPostComments = async (postId, limit = 20, offset = 0) => {
	const result = await query(
		`SELECT c.*, u.username, u.full_name
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.post_id = $1 AND c.is_deleted = FALSE
         ORDER BY c.created_at ASC
         LIMIT $2 OFFSET $3`,
		[postId, limit, offset]
	);
	return result.rows;
};

/**
 // TODO: Implement getCommentById function
 * @param {number} commentId
 * @returns {Promise<Object>} Comment object
 */
const getCommentById = async (commentId) => {
	const result = await query(
		`SELECT * FROM comments WHERE id = $1 AND is_deleted = FALSE`,
		[commentId]
	);
	return result.rows[0];
};

module.exports = {
	createComment,
	updateComment,
	deleteComment,
	getPostComments,
	getCommentById,
};
