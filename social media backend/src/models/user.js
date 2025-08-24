const bcrypt = require("bcrypt");
const { query } = require("../utils/database");

/**
 * Create a new user
 */
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name]
  );

  return result.rows[0];
};

/**
 * Get user by username (for login)
 */
const getUserByUsername = async (username) => {
  const result = await query(
    `SELECT id, username, email, full_name, password_hash
     FROM users
     WHERE username = $1`,
    [username]
  );
  return result.rows[0];
};

/**
 * Get user by ID
 */
const getUserById = async (id) => {
  const result = await query(
    `SELECT id, username, email, full_name, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

/**
 * Verify user password
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Search users by name (partial match)
 */
const findUsersByName = async (name, limit = 10, offset = 0) => {
  const result = await query(
    `SELECT id, username, full_name
     FROM users
     WHERE full_name ILIKE $1 OR username ILIKE $1
     ORDER BY full_name
     LIMIT $2 OFFSET $3`,
    [`%${name}%`, limit, offset]
  );
  return result.rows;
};

/**
 * Get user profile with follower/following counts
 */
const getUserProfile = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name, u.email, u.created_at,
            (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count,
            (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS followers_count
     FROM users u
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0];
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${idx}`);
    values.push(value);
    idx++;
  }

  if (fields.length === 0) return getUserById(userId);

  values.push(userId);
  const result = await query(
    `UPDATE users SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${idx}
     RETURNING id, username, email, full_name, created_at, updated_at`,
    values
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  findUsersByName,
  getUserProfile,
  updateUserProfile,
};
