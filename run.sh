#!/usr/bin/env bash

# CAMPUS-NEXUS: Unified Local Full-Stack Runner
# Starts both Backend (FastAPI on :8000) and Frontend (Next.js on :3000) simultaneously

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "================================================================="
echo "   🚀 CAMPUS-NEXUS: Starting Full-Stack Local Environment"
echo "================================================================="

# Cleanup on exit (Ctrl+C)
cleanup() {
  echo ""
  echo "🛑 Shutting down Campus-Nexus servers..."
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend (FastAPI on Port 8000)
echo "📦 [1/2] Starting Backend API (FastAPI) on http://localhost:8000..."
cd "$DIR/backend"
if [ -d ".venv" ]; then
  source .venv/bin/activate 2>/dev/null || true
fi
PYTHONPATH=. python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 2. Start Frontend (Next.js on Port 3000)
echo "💻 [2/2] Starting Frontend App (Next.js) on http://localhost:3000..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

cd "$DIR"

# Wait a few seconds for servers to initialize
sleep 3

echo ""
echo "================================================================="
echo "   ✅ CAMPUS-NEXUS FULL-STACK RUNNING LOCALLY!"
echo "================================================================="
echo "   🌐 Frontend UI:           http://localhost:3000"
echo "   🔌 Backend Swagger Docs:  http://localhost:8000/docs"
echo "   ◫  Side-by-Side View:     http://localhost:3000/split"
echo "================================================================="
echo "   Press Ctrl+C anytime to stop both servers."
echo "================================================================="

# Automatically open the Unified Split View in default browser
if command -v open >/dev/null 2>&1; then
  open "http://localhost:3000/split" 2>/dev/null || open "http://localhost:3000" 2>/dev/null || true
fi

# Keep script running and wait for background jobs
wait $FRONTEND_PID $BACKEND_PID
