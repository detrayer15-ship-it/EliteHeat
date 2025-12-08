# EliteHeat Backend

Production-ready backend for EliteHeat educational platform with real-time chat and admin panel.

## Features

✅ **Authentication**
- JWT-based authentication
- Password hashing with bcrypt
- IP tracking on login
- Rate limiting for security

✅ **Role-Based Access Control**
- Student role (limited access)
- Admin role (full control)
- Middleware protection

✅ **Real-Time Chat**
- Socket.io WebSocket connections
- Online/offline status
- Typing indicators
- Message persistence
- Unread message tracking

✅ **Admin Panel**
- View all users and admins
- Ban/unban users
- Delete users
- Edit user information
- View IP history
- Change user roles

✅ **Security**
- Helmet.js for HTTP headers
- CORS protection
- Rate limiting
- MongoDB injection protection
- Input validation

## Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create .env file:**
```bash
cp .env.example .env
```

3. **Configure environment variables:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/eliteheat
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

4. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

5. **Run the server:**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/messages/:userId` - Get messages with user
- `POST /api/chat/messages` - Send message
- `PUT /api/chat/messages/:id/read` - Mark as read
- `GET /api/chat/unread` - Get unread count

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/admins` - Get all admins
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/users/:id/ip` - Get IP history
- `PUT /api/admin/users/:id/role` - Change role

## Socket.io Events

### Client → Server
- `send-message` - Send a message
- `typing` - User is typing
- `stop-typing` - User stopped typing

### Server → Client
- `new-message` - New message received
- `message-sent` - Message sent confirmation
- `user-online` - User came online
- `user-offline` - User went offline
- `user-typing` - Someone is typing
- `user-stop-typing` - Stopped typing

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── socket.js         # Socket.io setup
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   └── chat.controller.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── admin.js          # Admin role check
│   │   ├── ipTracker.js      # IP tracking
│   │   └── rateLimiter.js    # Rate limiting
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Conversation.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   └── chat.routes.js
│   ├── utils/
│   │   └── jwt.js            # JWT utilities
│   └── server.js             # Main entry point
├── .env.example
├── .gitignore
└── package.json
```

## Deployment

### Railway (Recommended)

1. Push code to GitHub
2. Connect Railway to your repo
3. Add environment variables
4. Deploy!

### MongoDB Atlas

1. Create cluster at mongodb.com/atlas
2. Get connection string
3. Add to MONGODB_URI in .env

## Default Admin Account

After first run, create an admin account:

```javascript
// Use MongoDB Compass or mongo shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## License

ISC
