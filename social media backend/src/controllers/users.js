const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowCounts,
} = require("../models/follow");
const { getUserById, findUsersByName } = require("../models/user");
const logger = require("../utils/logger");

/**
 * Follow a user
 */
const follow = async (req, res) => {
  try {
    const userId = req.user.id;
    const { target_user_id } = req.body;

    if (userId === target_user_id) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const targetUser = await getUserById(target_user_id);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await followUser(userId, target_user_id);

    logger.verbose(`User ${userId} followed user ${target_user_id}`);

    res.json({ message: "User followed successfully" });
  } catch (error) {
    logger.critical("Follow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unfollow a user
 */
const unfollow = async (req, res) => {
  try {
    const userId = req.user.id;
    const { target_user_id } = req.body;

    await unfollowUser(userId, target_user_id);

    logger.verbose(`User ${userId} unfollowed user ${target_user_id}`);

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    logger.critical("Unfollow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get the list of users the current user is following
 */
const getMyFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await getFollowing(userId);

    res.json({ following });
  } catch (error) {
    logger.critical("Get following error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get the list of users that follow the current user
 */
const getMyFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await getFollowers(userId);

    res.json({ followers });
  } catch (error) {
    logger.critical("Get followers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get follow counts for a specific user
 */
const getFollowStats = async (req, res) => {
  try {
    const { user_id } = req.params;
    const counts = await getFollowCounts(user_id);

    res.json({ counts });
  } catch (error) {
    logger.critical("Get follow stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get current user's profile with follower/following counts
 */
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user data
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get follow counts
    const counts = await getFollowCounts(userId);

    // Remove sensitive information
    const { password_hash, ...userProfile } = user;

    res.json({
      message: "Profile retrieved successfully",
      user: userProfile,
      stats: counts
    });
  } catch (error) {
    logger.critical("Get my profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get user profile by ID
 */
const getUserProfileById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const currentUserId = req.user?.id; // Optional auth

    // Get user data
    const user = await getUserById(parseInt(user_id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get follow counts
    const counts = await getFollowCounts(parseInt(user_id));

    // Remove sensitive information
    const { password_hash, ...userProfile } = user;

    // Add follow status if user is authenticated
    let followStatus = null;
    if (currentUserId && currentUserId !== parseInt(user_id)) {
      // Check if current user is following this user
      const following = await getFollowing(currentUserId);
      const isFollowing = following.some(follow => follow.id === parseInt(user_id));
      followStatus = isFollowing;
    }

    res.json({
      message: "User profile retrieved successfully",
      user: userProfile,
      stats: counts,
      ...(followStatus !== null && { is_following: followStatus })
    });
  } catch (error) {
    logger.critical("Get user by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Search users by name
 */
const searchUsers = async (req, res) => {
  try {
    const { name } = req.query;
    const currentUserId = req.user?.id; // Optional auth
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Name parameter is required" });
    }

    // Search users by name
    const users = await findUsersByName(name.trim(), limit, offset);

    // Add follow status for each user if authenticated
    if (currentUserId) {
      const following = await getFollowing(currentUserId);
      const followingIds = following.map(follow => follow.id);

      users.forEach(user => {
        user.is_following = followingIds.includes(user.id);
      });
    }

    res.json({
      message: "Users found successfully",
      users,
      pagination: {
        limit,
        offset,
        total: users.length,
        hasMore: users.length === limit
      }
    });
  } catch (error) {
    logger.critical("Search users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowStats,
  getMyProfile,
  getUserProfileById,
  searchUsers,
};
