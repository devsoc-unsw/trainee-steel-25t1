# Drift - Productivity Application

Drift is a productivity app that helps users break down long-term goals into small steps, auto-schedule them into a personalized timetable, and stay on track with reminders and progress tracking.

## Tech Stack

- MongoDB with Mongoose (Database)
- Express.js with TypeScript (Backend)
- React with TypeScript (Frontend)
- Node.js (Runtime)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd drift
   ```

2. Setup the backend:
   ```
   cd server
   npm install
   ```

3. Setup the frontend:
   ```
   cd ../client
   npm install
   ```

4. Configure environment variables:
   Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/drift_app
   ```
   
   If using MongoDB Atlas, replace the MONGO_URI with your connection string.

### Running the Application

1. Start the backend:
   ```
   cd server
   npm run dev
   ```

2. Start the frontend:
   ```
   cd ../client
   npm start
   ```

3. Open your browser and visit `http://localhost:3000` to see the application.

## Features

- User authentication
- Create and manage long-term goals
- Break down goals into actionable steps
- Schedule steps into a personalized timetable
- Track progress
- Receive reminders

## Project Structure

```
drift/
├── client/             # React frontend (CRA + TypeScript)
├── server/             # Express backend (TypeScript)
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── controllers/    # Business logic
│   └── index.ts        # Entry point
├── .env                # Environment variables
├── .gitignore
└── README.md
``` 