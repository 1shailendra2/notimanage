# Notification Management System

A full-stack notification and group management system built with React, Node.js, and MongoDB.

## 🚀 Getting Started (Quick Start with Docker)

The easiest way to run the entire application (Frontend, Backend, and MongoDB) is using Docker Compose.

### 1. Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Startup
Run the following command in the root directory:
```bash
docker-compose up -d --build
```

### 3. Initialize Data (Seed)
Once the containers are running, you **must** seed the database to create the root "Godawari College" group:
```bash
docker-compose exec backend node src/seed.js
```

### 4. Access the App
- **Frontend (UI)**: [http://localhost](http://localhost)
- **Backend (API)**: [http://localhost:5000](http://localhost:5000)

---

## 🛠 Manual Development Setup

If you want to run the services without Docker for active development:

### Backend Setup
1. Navigate to the root folder.
2. Install dependencies: `npm install`
3. Create a `.env` file in `src/` with:
   ```env
   MONGO_URL=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server: `npm start` (or `node src/server.js`)

### Frontend Setup
1. Navigate to the `frontend/` folder.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Access at: [http://localhost:5173](http://localhost:5173)

---

## 🌐 CI/CD & Deployment

This project is configured with GitHub Actions for automatic deployment to an Azure VM.

- **Workflow**: `.github/workflows/deploy.yml`
- **Requirements**:
  - Azure VM with Node.js and PM2 installed.
  - GitHub Secrets: `AZURE_VM_IP`, `AZURE_SSH_USER`, `AZURE_SSH_KEY`, `MONGO_URL`, `JWT_SECRET`.

---

## 📂 Project Structure
- `/src`: Express backend source code.
- `/frontend`: React frontend source code (Vite).
- `docker-compose.yml`: Orchestration for local/production containers.
- `Dockerfile`: Backend container definition.
- `frontend/Dockerfile`: Frontend container definition (Nginx).
