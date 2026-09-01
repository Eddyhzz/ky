#!/bin/sh

PORT="${PORT:-5173}"
PIDS=$(lsof -ti "tcp:${PORT}" 2>/dev/null || true)

if [ -n "$PIDS" ]; then
  echo "Stopping existing process on port ${PORT}: ${PIDS}"
  kill $PIDS 2>/dev/null || true
  sleep 0.3
fi

exec vite --host 127.0.0.1 --port "$PORT" "$@"
