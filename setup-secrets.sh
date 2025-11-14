#!/bin/bash

# Script to set up Google Cloud secrets with mock values
# Usage: ./setup-secrets.sh [project-id]

set -e

PROJECT_ID=${1:-${GOOGLE_CLOUD_PROJECT}}

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Project ID required"
    echo "Usage: ./setup-secrets.sh [project-id]"
    echo "Or set GOOGLE_CLOUD_PROJECT environment variable"
    exit 1
fi

echo "Setting up secrets for project: $PROJECT_ID"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

# Generate a secure NextAuth secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Mock values
SOAR_API_KEY="mock_soar_api_key_$(openssl rand -hex 16)"
GOOGLE_CLIENT_ID="mock_google_client_id_$(openssl rand -hex 16)"
GOOGLE_CLIENT_SECRET="mock_google_client_secret_$(openssl rand -hex 16)"

echo "Creating secrets with mock values..."

# Create secrets (or update if they exist)
echo -n "$SOAR_API_KEY" | gcloud secrets create soar-api-key --data-file=- 2>/dev/null || \
  echo -n "$SOAR_API_KEY" | gcloud secrets versions add soar-api-key --data-file=-

echo -n "$NEXTAUTH_SECRET" | gcloud secrets create nextauth-secret --data-file=- 2>/dev/null || \
  echo -n "$NEXTAUTH_SECRET" | gcloud secrets versions add nextauth-secret --data-file=-

echo -n "$GOOGLE_CLIENT_ID" | gcloud secrets create google-client-id --data-file=- 2>/dev/null || \
  echo -n "$GOOGLE_CLIENT_ID" | gcloud secrets versions add google-client-id --data-file=-

echo -n "$GOOGLE_CLIENT_SECRET" | gcloud secrets create google-client-secret --data-file=- 2>/dev/null || \
  echo -n "$GOOGLE_CLIENT_SECRET" | gcloud secrets versions add google-client-secret --data-file=-

echo ""
echo "Secrets created/updated successfully!"
echo ""

# Get project number for service account
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "Granting Cloud Run access to secrets..."

# Grant Cloud Run access to secrets
for secret in soar-api-key nextauth-secret google-client-id google-client-secret; do
  echo "  - Granting access to $secret..."
  gcloud secrets add-iam-policy-binding $secret \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet 2>/dev/null || echo "    (Access already granted)"
done

echo ""
echo "✅ All secrets are set up with mock values!"
echo ""
echo "Secret values (for reference):"
echo "  SOAR_API_KEY: $SOAR_API_KEY"
echo "  NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo "  GOOGLE_CLIENT_ID: $GOOGLE_CLIENT_ID"
echo "  GOOGLE_CLIENT_SECRET: $GOOGLE_CLIENT_SECRET"
echo ""
echo "⚠️  Remember to replace these with real values before going to production!"
echo ""
echo "To update a secret later:"
echo "  echo -n 'your-real-value' | gcloud secrets versions add SECRET_NAME --data-file=-"


