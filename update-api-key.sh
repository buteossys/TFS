#!/bin/bash

# Script to update the SOAR API key in Google Secret Manager
# Usage: ./update-api-key.sh [project-id] [api-key]

set -e

PROJECT_ID=${1:-${GOOGLE_CLOUD_PROJECT}}
API_KEY=${2}

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Project ID required"
    echo "Usage: ./update-api-key.sh [project-id] [api-key]"
    echo "Or set GOOGLE_CLOUD_PROJECT environment variable"
    exit 1
fi

if [ -z "$API_KEY" ]; then
    echo "Error: API Key required"
    echo "Usage: ./update-api-key.sh [project-id] [api-key]"
    echo ""
    echo "Example:"
    echo "  ./update-api-key.sh fair-shoppe sk_sandbox_9BQooLmG0ojM1NQBdvSivIfBtXtFiIID"
    exit 1
fi

echo "Updating SOAR API key for project: $PROJECT_ID"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

# Check if secret exists
if ! gcloud secrets describe soar-api-key --project=$PROJECT_ID &>/dev/null; then
    echo "Secret 'soar-api-key' does not exist. Creating it..."
    echo -n "$API_KEY" | gcloud secrets create soar-api-key --data-file=-
else
    echo "Updating existing secret 'soar-api-key'..."
    echo -n "$API_KEY" | gcloud secrets versions add soar-api-key --data-file=-
fi

echo ""
echo "✅ API key updated successfully!"
echo ""
echo "The new API key will be used on the next Cloud Run deployment."
echo ""
echo "To deploy with the new key, run:"
echo "  ./deploy.sh"
echo ""
echo "Or manually trigger a new deployment:"
echo "  gcloud builds submit --config=react-frontend/cloudbuild.yaml"

