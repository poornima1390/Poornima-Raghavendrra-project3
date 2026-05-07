# Fullstack Sudoku Application

A Complete Puzzle Gaming Platform with User Authentication, Persistent Game Storage, and Competitive Leaderboards

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Bonus Features](#bonus-features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)

---

## Overview

This is a full-stack Sudoku application that allows users to create accounts, solve Sudoku puzzles of varying difficulties, track their high scores, and compete with others on a global leaderboard. The application features persistent game storage, user authentication, and a fully responsive design that works seamlessly on both desktop and mobile devices.

Built as a capstone project demonstrating proficiency in modern web development, this application showcases full-stack development skills including RESTful API design, database management, authentication, and interactive frontend development.

---

## Key Features

### User Authentication
- Secure Registration: Create an account with username and password (passwords encrypted with bcrypt)
- Session Management: JWT-based authentication with HTTP-only cookies
- Persistent Login: Stay logged in across browser sessions
- Logout Functionality: Secure session termination

### Game Features
- Two Difficulty Levels: Easy (6x6 grid) and Normal (9x9 grid)
- Dynamic Puzzle Generation: Unique puzzles generated using backtracking algorithm
- Validation System: Real-time validation highlighting invalid moves in red
- Timer: Track how long each puzzle takes to solve
- Visual Feedback: Selected cell highlighting, hover effects, win celebrations
- Game Persistence: Saved games persist in database; resume anytime
- Completed Game Display: Previously solved games show the solution

### Competitive Features
- Global High Scores: Leaderboard showing users ranked by total wins
- Game Creation Tracking: Every game tracks its creator and completion history
- Win Tracking: User profiles track total puzzles solved

### Responsive Design
- Mobile-First Approach: Optimized for iPhone 12 Pro and all device sizes
- Adaptive Grid: Sudoku grids scale appropriately on all screens
- Touch-Friendly Controls: Buttons and inputs sized for touch interaction

### User Interface
- Clean, professional design with gradient accents
- Intuitive navigation with responsive navbar
- Visual feedback for all user actions
- Accessibility-focused color contrast

---

## Live Demo

[View Live Application](https://poornima-raghavendrra-project3.onrender.com)

Test Credentials:
- Username: demouser
- Password: demo123

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | UI component library |
| React Router v7 | Client-side routing |
| Vite | Build tool and dev server |
| Axios | HTTP client for API requests |
| CSS3 | Custom styling with responsive design |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework for REST APIs |
| MongoDB | NoSQL database |
| Mongoose | ODM for database modeling |
| JSON Web Tokens | Authentication tokens |
| bcrypt | Password hashing |

### Authentication and Security

| Technology | Purpose |
|------------|---------|
| HTTP-only Cookies | Secure token storage |
| bcrypt | Password encryption (10 salt rounds) |
| JSON Web Tokens | Stateless authentication |

### DevOps

| Technology | Purpose |
|------------|---------|
| Git | Version control |
| GitHub | Code repository |
| Render | Cloud hosting and deployment |

---

## Architecture

Client-Server Architecture with RESTful API Design

Client Browser (React SPA on port 5173) communicates via HTTP/HTTPS with Express Server (Node.js on port 5000). The server handles three main API categories:

- `/api/user` - Authentication routes
- `/api/sudoku` - Game management routes  
- `/api/highscore` - Leaderboard routes

All data is persisted in MongoDB Atlas with two collections: Users and Games. High scores are derived through aggregation queries on the existing collections.

### Data Flow

User Authentication Flow:
1. User registers or logs in
2. Password is hashed using bcrypt
3. User is saved to database or verified
4. JWT is created and set as HTTP-only cookie
5. Subsequent requests validate cookie for authentication

Game Creation Flow:
1. Authenticated user requests new game with difficulty parameter
2. Backtracking algorithm generates a valid puzzle
3. Game is saved to database with unique ID and generated name
4. Game ID is returned to client
5. User is redirected to the game page

Game Solving Flow:
1. User interacts with the Sudoku grid
2. Frontend performs real-time validation
3. On puzzle completion, PUT request updates backend
4. User's win count is incremented
5. Game is marked as completed for that user

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| POST | `/api/user/register` | Create new user account | No |
| POST | `/api/user/login` | Authenticate and set cookie | No |
| GET | `/api/user/isLoggedIn` | Check login status | No |
| POST | `/api/user/logout` | Clear authentication cookie | Yes |

### Game Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| GET | `/api/sudoku` | List all games | No |
| POST | `/api/sudoku` | Create new game | Yes |
| GET | `/api/sudoku/:gameId` | Retrieve specific game | No |
| PUT | `/api/sudoku/:gameId` | Update game state or mark as won | Yes |
| DELETE | `/api/sudoku/:gameId` | Delete game (creator only) | Yes |

### High Score Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| GET | `/api/highscore` | Retrieve global leaderboard | No |

---

## Setup Instructions

### Prerequisites
- Node.js version 18 or higher
- MongoDB Atlas account (free tier available)
- Git

### Step 1: Clone the Repository
```bash
git clone (https://github.com/poornima1390/Fullstack-Sudoku-Application.git)
cd Fullstack-Sudoku-Application
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/sudoku_db
JWT_SECRET=your_super_secret_key_change_this
CLIENT_URL=http://localhost:5173
```

### Step 4: Set Up MongoDB Atlas
1. Create a free cluster at MongoDB Atlas
2. Whitelist your IP address (0.0.0.0/0 for development)
3. Create a database user with read and write permissions
4. Copy your connection string to the .env file

### Step 5: Run the Application

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### Step 6: Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/test

---

## Environment Variables

| Variable | Description | Required | Default Value |
|----------|-------------|----------|---------------|
| PORT | Server port | Yes | 5000 |
| MONGODB_URI | MongoDB connection string | Yes | - |
| JWT_SECRET | Secret key for JWT signing | Yes | - |
| CLIENT_URL | Frontend URL for CORS configuration | Yes | http://localhost:5173 |

---

## Database Schema

### User Collection

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| username | String | Required, Unique | User's display name |
| password | String | Required | Hashed password (bcrypt) |
| wins | Number | Default: 0 | Total puzzles solved |
| gamesCompleted | Array | Reference to Game | IDs of completed games |
| createdAt | Date | Default: Date.now | Account creation timestamp |

### Game Collection

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| gameId | String | Required, Unique | UUID for URL routing |
| name | String | Required, Unique | Randomly generated three-word name |
| difficulty | String | Required | 'easy' or 'normal' |
| board | Array | Required | 2D array representing current puzzle state |
| solution | Array | Required | 2D array representing complete solution |
| createdBy | String | Required | Username of game creator |
| createdAt | Date | Required | Game creation timestamp |
| completedBy | Array | Optional | Users who have solved this game |

---

## Bonus Features

### Backtracking Puzzle Generation 
The algorithm generates complete solved boards using recursive backtracking, then selectively removes cells while verifying that the puzzle remains uniquely solvable. This ensures every generated puzzle has exactly one valid solution.

Code Location: `backend/utils/sudokuGenerator.js`

### Password Encryption 
User passwords are hashed using bcrypt with 10 salt rounds before storage. Plain text passwords are never persisted in the database.

### Delete Game 
Game creators have the ability to delete their own games. The system automatically updates affected users' win counts by decrementing wins for any user who had completed the deleted game.

Implementation: DELETE `/api/sudoku/:gameId`

---

## Testing

### Manual Testing Commands

Register a new user:
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123","verifyPassword":"123"}'
```

Login to receive authentication cookie:
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123"}' \
  -c cookies.txt
```

Create a new game:
```bash
curl -X POST http://localhost:5000/api/sudoku \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"difficulty":"normal"}'
```

Retrieve all games:
```bash
curl -X GET http://localhost:5000/api/sudoku
```

---

## Deployment

### Deploy to Render

1. Push all code to a GitHub repository
2. Log into Render.com and select "New Web Service"
3. Connect your GitHub repository
4. Configure the service with the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `node server.js`
5. Add all environment variables from your .env file
6. Click "Create Web Service"

The application will be live at `https://your-app.onrender.com`

---

## Future Enhancements

- Custom Game Creation: Users can design and share their own puzzles
- Hint System: AI-powered hints to assist stuck players
- Social Features: Friend lists and challenge invitations
- Dark Mode: Theme toggle for reduced eye strain during extended play
- Daily Challenges: New puzzles each day with separate leaderboards
- Export and Import: Share puzzle URLs or export game states as JSON
- Statistics Dashboard: Visual analytics for solving patterns and improvement metrics

---

## Contributors

Poornima Raghavendrra - Full Stack Developer
- GitHub: https://github.com/poornima1390
- LinkedIn: https://www.linkedin.com/in/poornima-raghavendrra/
- Email: raghavendrra.p@northeastern.edu
