# Social Media Backend API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 1. Authentication Endpoints

### 1.1 Register User
- **Method**: POST
- **URL**: `/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```
- **Response**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 1.2 Login User
- **Method**: POST
- **URL**: `/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "username": "john_doe",
  "password": "password123"
}
```
- **Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.3 Get Profile
- **Method**: GET
- **URL**: `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## 2. User Management Endpoints

### 2.1 Get My Profile
- **Method**: GET
- **URL**: `/api/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "stats": {
    "followers_count": 10,
    "following_count": 5
  }
}
```

### 2.2 Get User by ID
- **Method**: GET
- **URL**: `/api/users/:user_id`
- **Headers**: Optional `Authorization: Bearer <token>`
- **Response**:
```json
{
  "message": "User profile retrieved successfully",
  "user": {
    "id": 2,
    "username": "jane_doe",
    "full_name": "Jane Doe",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "stats": {
    "followers_count": 15,
    "following_count": 8
  },
  "is_following": true
}
```

### 2.3 Search Users
- **Method**: GET
- **URL**: `/api/users/search?name=john`
- **Headers**: Optional `Authorization: Bearer <token>`
- **Query Parameters**:
  - `name` (required): Search term
  - `limit` (optional): Number of results (default: 10)
  - `offset` (optional): Number to skip (default: 0)
- **Response**:
```json
{
  "message": "Users found successfully",
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "full_name": "John Doe",
      "is_following": false
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 1,
    "hasMore": false
  }
}
```

### 2.4 Follow User
- **Method**: POST
- **URL**: `/api/users/follow`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
```json
{
  "target_user_id": 2
}
```
- **Response**:
```json
{
  "message": "User followed successfully"
}
```

### 2.5 Unfollow User
- **Method**: POST
- **URL**: `/api/users/unfollow`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
```json
{
  "target_user_id": 2
}
```
- **Response**:
```json
{
  "message": "User unfollowed successfully"
}
```

### 2.6 Get Following List
- **Method**: GET
- **URL**: `/api/users/following`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "following": [
    {
      "id": 2,
      "username": "jane_doe",
      "full_name": "Jane Doe"
    }
  ]
}
```

### 2.7 Get Followers List
- **Method**: GET
- **URL**: `/api/users/followers`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "followers": [
    {
      "id": 3,
      "username": "bob_smith",
      "full_name": "Bob Smith"
    }
  ]
}
```

## 3. Posts Endpoints

### 3.1 Create Post
- **Method**: POST
- **URL**: `/api/posts`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
```json
{
  "content": "Hello world!",
  "media_url": "http://example.com/image.jpg",
  "comments_enabled": true
}
```
- **Response**:
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "user_id": 1,
    "content": "Hello world!",
    "media_url": "http://example.com/image.jpg",
    "comments_enabled": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3.2 Get Feed
- **Method**: GET
- **URL**: `/api/posts`
- **Headers**: Optional `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Posts per page (default: 20)
- **Response**:
```json
{
  "message": "Feed retrieved successfully",
  "posts": [
    {
      "id": 1,
      "user_id": 1,
      "content": "Hello world!",
      "media_url": "http://example.com/image.jpg",
      "comments_enabled": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "username": "john_doe",
      "full_name": "John Doe",
      "likes_count": 5,
      "comments_count": 2,
      "is_liked": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "hasMore": false
  }
}
```

### 3.3 Get My Posts
- **Method**: GET
- **URL**: `/api/posts/my`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Posts per page (default: 20)
- **Response**:
```json
{
  "posts": [
    {
      "id": 1,
      "user_id": 1,
      "content": "Hello world!",
      "media_url": "http://example.com/image.jpg",
      "comments_enabled": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "username": "john_doe",
      "full_name": "John Doe"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "hasMore": false
  }
}
```

### 3.4 Get User Posts
- **Method**: GET
- **URL**: `/api/posts/user/:user_id`
- **Headers**: Optional `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Posts per page (default: 20)
- **Response**:
```json
{
  "posts": [
    {
      "id": 2,
      "user_id": 2,
      "content": "Another post",
      "media_url": null,
      "comments_enabled": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "username": "jane_doe",
      "full_name": "Jane Doe"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "hasMore": false
  }
}
```

### 3.5 Get Post by ID
- **Method**: GET
- **URL**: `/api/posts/:post_id`
- **Headers**: Optional `Authorization: Bearer <token>`
- **Response**:
```json
{
  "post": {
    "id": 1,
    "user_id": 1,
    "content": "Hello world!",
    "media_url": "http://example.com/image.jpg",
    "comments_enabled": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "username": "john_doe",
    "full_name": "John Doe"
  }
}
```

### 3.6 Update Post
- **Method**: PUT
- **URL**: `/api/posts/:post_id`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
```json
{
  "content": "Updated content",
  "comments_enabled": false
}
```
- **Response**:
```json
{
  "message": "Post updated successfully"
}
```

### 3.7 Delete Post
- **Method**: DELETE
- **URL**: `/api/posts/:post_id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "message": "Post deleted successfully"
}
```

## 4. Comments Endpoints

### 4.1 Create Comment
- **Method**: POST
- **URL**: `/api/comments`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
```json
{
  "post_id": 1,
  "content": "Great post!"
}
```
- **Response**:
```json
{
  "message": "Comment created",
  "comment": {
    "id": 1,
    "post_id": 1,
    "user_id": 2,
    "content": "Great post!",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4.2 Get Post Comments
- **Method**: GET
- **URL**: `/api/comments/post/:post_id`
- **Query Parameters**:
  - `limit` (optional): Number of comments (default: 20)
  - `offset` (optional): Number to skip (default: 0)
- **Response**:
```json
{
  "comments": [
    {
      "id": 1,
      "post_id": 1,
      "user_id": 2,
      "content": "Great post!",
      "created_at": "2024-01-01T00:00:00.000Z",
      "username": "jane_doe",
      "full_name": "Jane Doe"
    }
  ]
}
```

### 4.3 Update Comment
- **Method**: PUT
- **URL**: `/api/comments/:comment_id`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
```json
{
  "content": "Updated comment"
}
```
- **Response**:
```json
{
  "message": "Comment updated"
}
```

### 4.4 Delete Comment
- **Method**: DELETE
- **URL**: `/api/comments/:comment_id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "message": "Comment deleted"
}
```

## 5. Likes Endpoints

### 5.1 Like Post
- **Method**: POST
- **URL**: `/api/likes`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
```json
{
  "post_id": 1
}
```
- **Response**:
```json
{
  "message": "Post liked"
}
```

### 5.2 Unlike Post
- **Method**: DELETE
- **URL**: `/api/likes/:post_id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "message": "Post unliked"
}
```

### 5.3 Get Post Likes
- **Method**: GET
- **URL**: `/api/likes/post/:post_id`
- **Response**:
```json
{
  "post_id": 1,
  "likes": [
    {
      "id": 2,
      "username": "jane_doe",
      "full_name": "Jane Doe"
    }
  ]
}
```

### 5.4 Get User Likes
- **Method**: GET
- **URL**: `/api/likes/user/:user_id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "user_id": 1,
  "likedPosts": [1, 2, 3]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": ["Content is required"]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Cannot edit this comment"
}
```

### 404 Not Found
```json
{
  "error": "Post not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Health Check

### Server Status
- **Method**: GET
- **URL**: `/serverRunning`
- **Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
