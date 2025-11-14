#!/bin/bash

# Quick deployment script for Google Cloud Run
# Usage: ./deploy.sh [project-id] [region]

set -e

PROJECT_ID=${1:-${GOOGLE_CLOUD_PROJECT}}
REGION=${2:-us-central1}

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Project ID required"
    echo "Usage: ./deploy.sh [project-id] [region]"
    echo "Or set GOOGLE_CLOUD_PROJECT environment variable"
    exit 1
fi

echo "Deploying to project: $PROJECT_ID"
echo "Region: $REGION"

# Set the project
gcloud config set project $PROJECT_ID

# Build and deploy (run from project root)
echo "Building and deploying..."
gcloud builds submit --config=react-frontend/cloudbuild.yaml --project=$PROJECT_ID

echo "Deployment complete!"
echo "Your service should be available at:"
gcloud run services describe fair-shoppe-frontend --region=$REGION --format='value(status.url)' 2>/dev/null || echo "Check Cloud Run console for the URL"

