const { query } = require("../utils/database");

/**
 * Follow a user
 * @param {number} followerId - User who wants to follow
 * @param {number} followingId - User to be followed
 */
const followUser = async (followerId, followingId) => {
	await query(
		`INSERT INTO follows (follower_id, following_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
		[followerId, followingId]
	);
};

/**
 * Unfollow a user
 * @param {number} followerId
 * @param {number} followingId
 */
const unfollowUser = async (followerId, followingId) => {
	await query(
		`DELETE FROM follows
         WHERE follower_id = $1 AND following_id = $2`,
		[followerId, followingId]
	);
};

/**
 * Get list of users a user is following
 * @param {number} userId
 * @returns {Promise<Array>} List of following users
 */
const getFollowing = async (userId) => {
	const result = await query(
		`SELECT u.id, u.username, u.full_name
         FROM follows f
         JOIN users u ON f.following_id = u.id
         WHERE f.follower_id = $1`,
		[userId]
	);
	return result.rows;
};

/**
 * Get list of followers of a user
 * @param {number} userId
 * @returns {Promise<Array>} List of followers
 */
const getFollowers = async (userId) => {
	const result = await query(
		`SELECT u.id, u.username, u.full_name
         FROM follows f
         JOIN users u ON f.follower_id = u.id
         WHERE f.following_id = $1`,
		[userId]
	);
	return result.rows;
};

/**
 * Get follower and following counts of a user
 * @param {number} userId
 * @returns {Promise<Object>} Counts { followers, following }
 */
const getFollowCounts = async (userId) => {
	const result = await query(
		`SELECT 
            (SELECT COUNT(*) FROM follows WHERE following_id = $1) AS followers,
            (SELECT COUNT(*) FROM follows WHERE follower_id = $1) AS following`,
		[userId]
	);
	return result.rows[0];
};

module.exports = {
	followUser,
	unfollowUser,
	getFollowing,
	getFollowers,
	getFollowCounts,
};
