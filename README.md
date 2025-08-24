# Social Media Backend API

A robust Node.js/Express backend API for a social media platform, optimized for Vercel serverless deployment.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Vercel account

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
npm run setup:db

# Start development server
npm run dev
```

### Vercel Deployment

#### 1. Environment Setup
Create a `.env` file with the following variables:
```env
# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Environment
NODE_ENV=production
```

#### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Or use the deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Check API and database status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (protected)

### Posts
- `POST /api/posts` - Create post (protected)
- `GET /api/posts/feed` - Get feed posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/user/:user_id` - Get user's posts
- `DELETE /api/posts/:id` - Delete post (protected)

### Comments
- `POST /api/comments` - Create comment (protected)
- `GET /api/comments/post/:post_id` - Get post comments
- `DELETE /api/comments/:id` - Delete comment (protected)

### Likes
- `POST /api/likes` - Like/unlike post (protected)
- `GET /api/likes/post/:post_id` - Get post likes

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "src/app.js"
    }
  ],
  "functions": {
    "src/app.js": {
      "maxDuration": 30
    }
  }
}
```

## 🐛 Troubleshooting

### Common Vercel Errors

#### FUNCTION_INVOCATION_FAILED (500)
- **Cause**: Unhandled errors in your code
- **Fix**: Ensure all async functions have proper try/catch blocks
- **Check**: Look at Vercel function logs for specific error details

#### FUNCTION_PAYLOAD_TOO_LARGE (413)
- **Cause**: Request body exceeds 1MB limit
- **Fix**: Reduce payload size or use external storage (S3, etc.)
- **Note**: Serverless functions have strict payload limits

#### FUNCTION_INVOCATION_TIMEOUT (504)
- **Cause**: Function takes too long to respond (>30s)
- **Fix**: Optimize database queries, use batch operations
- **Check**: Database connection pooling and query performance

#### BODY_NOT_A_STRING_FROM_FUNCTION
- **Cause**: Function returns non-JSON response
- **Fix**: Always use `res.json()` or `res.send()` with proper data types
- **Example**: 
  ```javascript
  // ✅ Correct
  res.json({ message: "Success" });
  
  // ❌ Wrong
  res.send(Buffer.from("data"));
  ```

### Database Connection Issues

#### Connection Timeouts
- **Cause**: Database connection takes too long
- **Fix**: 
  - Increase `connectionTimeoutMillis` in database config
  - Use connection pooling
  - Check database server performance

#### SSL Issues
- **Cause**: SSL configuration mismatch
- **Fix**: Add SSL configuration for production:
  ```javascript
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
  ```

### Performance Optimization

#### Database Queries
- Use batch operations instead of N+1 queries
- Implement proper indexing
- Use connection pooling
- Cache frequently accessed data

#### Response Optimization
- Limit response payload size
- Use pagination for large datasets
- Implement proper error handling
- Add request/response logging

## 📊 Monitoring

### Health Check Endpoint
Monitor your API health at `/api/health`:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "connected",
  "uptime": 3600
}
```

### Vercel Analytics
- Check Vercel dashboard for function performance
- Monitor error rates and response times
- Set up alerts for critical errors

## 🔒 Security

### Environment Variables
- Never commit `.env` files
- Use Vercel environment variables for production
- Rotate JWT secrets regularly
- Use strong database passwords

### API Security
- Implement rate limiting
- Use HTTPS in production
- Validate all input data
- Implement proper authentication

## 📝 Development

### Scripts
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run setup:db     # Setup development database
npm run setup:prod-db # Setup production database
npm run deploy       # Deploy to Vercel
```

### Code Style
- Use ES6+ features
- Implement proper error handling
- Add JSDoc comments
- Follow REST API conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
