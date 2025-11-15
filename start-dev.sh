#!/bin/bash

# Start React frontend (using headless backend)
echo "Starting React frontend with headless backend..."

# Start React frontend
cd react-frontend
echo "Starting React frontend on port 3000..."
echo "Using headless backend at: ${NEXT_PUBLIC_API_URL:-https://soar-api-2pmz2r36bq-uc.a.run.app/api/v1}"
npm run dev