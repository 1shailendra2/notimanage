#!/bin/bash
# Start backend
cd src
node server.js &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev -- --port 5173 &
FRONTEND_PID=$!

echo "Servers started. Backend: $BACKEND_PID, Frontend: $FRONTEND_PID"
wait $BACKEND_PID $FRONTEND_PID
