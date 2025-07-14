# Drift - Productivity Application

Drift is a productivity app that helps users break down long-term goals into small steps, auto-schedule them into a personalized timetable, and stay on track with reminders and progress tracking.

## Tech Stack

### Frontend
- **Framework:** React (with TypeScript)
- **UI:** Tailwind CSS (or your preferred CSS framework)
- **Routing:** React Router
- **State Management:** React Hooks (useState, useEffect, etc.)

### Backend
- **Framework:** Node.js with Express
- **Language:** TypeScript
- **AI Integration:** HuggingFace Inference API (`@huggingface/inference`)
- **RAG (Retrieval Augmented Generation):** LangChain (`@langchain/qdrant`, `@langchain/community`)
- **Vector Store:** Qdrant (Dockerized)
- **Environment Variables:** dotenv

### Database
- **Vector Database:** Qdrant (runs in Docker, stores document embeddings for RAG)
- **MongoDB** for user accounts

### Other
- **Authentication:** JWT (JSON Web Token)
- **Image Assets:** Stored in `/client/src/assets/`
- **Environment Variables:** `.env` file in `/server`

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd trainee-steel-25t1/drift
```

---

### 2. Start Qdrant (Vector Database)

You must have Docker installed.

```sh
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

---

### 3. Backend Setup

```sh
cd server
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
JWT_SECRET=your_jwt_secret
HUGGINGFACEHUB_API_KEY=your_huggingface_api_key
```

#### Start the Backend

```sh
npm run dev
```
or
```sh
npm start
```
(depending on your setup)

---

### 4. Frontend Setup

```sh
cd ../client
npm install
npm start
```

This will start the React app, usually on [http://localhost:3000](http://localhost:3000).

---

### 5. Usage Sequence

1. **Start Qdrant** (Docker)
2. **Start the backend server**
3. **Start the frontend client**
