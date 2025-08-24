const Joi = require("joi");

/**
 * Validation schemas for API endpoints
 */

// User registration schema
const userRegistrationSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).trim().required(),
	email: Joi.string().email().trim().required(),
	password: Joi.string().min(6).required(),
	full_name: Joi.string().min(1).max(100).trim().required(),
});

// User login schema
const userLoginSchema = Joi.object({
	username: Joi.string().trim().required(),
	password: Joi.string().required(),
});

// Create post schema
const createPostSchema = Joi.object({
	content: Joi.string().min(1).max(1000).trim().required(),
	media_url: Joi.string().uri().optional(),
	comments_enabled: Joi.boolean().default(true),
});

// Update post schema
const updatePostSchema = Joi.object({
	content: Joi.string().min(1).max(1000).trim().optional(),
	media_url: Joi.string().uri().optional(),
	comments_enabled: Joi.boolean().optional(),
});

// Like post schema
const likePostSchema = Joi.object({
	post_id: Joi.number().integer().positive().required(),
});

// Comment creation schema
const createCommentSchema = Joi.object({
	post_id: Joi.number().integer().positive().required(),
	content: Joi.string().min(1).max(500).trim().required(),
});

// Comment update schema
const updateCommentSchema = Joi.object({
	content: Joi.string().min(1).max(500).trim().required(),
});

/**
 * Middleware to validate request body against schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {Object} options - Joi validation options (default allows unknown fields and strips them)
 * @returns {Function} Express middleware function
 */
const validateRequest = (
	schema,
	options = { allowUnknown: true, stripUnknown: true }
) => {
	return (req, res, next) => {
		const { error, value } = schema.validate(req.body, options);

		if (error) {
			return res.status(400).json({
				error: "Validation failed",
				details: error.details.map((detail) => detail.message),
			});
		}

		req.validatedData = value;
		next();
	};
};

module.exports = {
	userRegistrationSchema,
	userLoginSchema,
	createPostSchema,
	updatePostSchema,
	likePostSchema,
	createCommentSchema,
	updateCommentSchema,
	validateRequest,
};
