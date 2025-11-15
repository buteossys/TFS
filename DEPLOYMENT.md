# Google Cloud Run Deployment Guide

This guide will walk you through deploying the Fair Shoppe ecommerce application to Google Cloud Run.

## Prerequisites

- Google Cloud Project created
- `gcloud` CLI installed and authenticated
- Docker installed (for local testing)
- Access to your SOAR Commerce API key

## Step 1: Enable Required Google Cloud APIs

Run these commands to enable the necessary APIs:

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

## Step 2: Set Up Google Cloud Secrets

### Option A: Quick Setup with Mock Values (Recommended for initial setup)

Use the provided script to set up all secrets with mock values:

```bash
./setup-secrets.sh your-project-id
```

This script will:
- Create all required secrets with mock values
- Grant Cloud Run access to the secrets
- Generate a secure NextAuth secret automatically

### Option B: Manual Setup

Store your sensitive environment variables in Google Secret Manager:

```bash
# Generate a secure NextAuth secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Create secrets
echo -n "your-actual-soar-api-key" | gcloud secrets create soar-api-key --data-file=-
echo -n "$NEXTAUTH_SECRET" | gcloud secrets create nextauth-secret --data-file=-
echo -n "your-google-client-id" | gcloud secrets create google-client-id --data-file=-
echo -n "your-google-client-secret" | gcloud secrets create google-client-secret --data-file=-

# Grant Cloud Run access to secrets
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

for secret in soar-api-key nextauth-secret google-client-id google-client-secret; do
  gcloud secrets add-iam-policy-binding $secret \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
done
```

**Note:** Replace the placeholder values with your actual secrets:
- `your-actual-soar-api-key`: Your SOAR Commerce API key
- `your-google-client-id`: Your Google OAuth Client ID (if using Google login)
- `your-google-client-secret`: Your Google OAuth Client Secret (if using Google login)

## Step 3: Configure IAM Permissions

Grant Cloud Build permission to deploy to Cloud Run:

```bash
# Get the Cloud Build service account
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant Cloud Run Admin role
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant Service Account User role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${CLOUDBUILD_SA}" \
    --role="roles/iam.serviceAccountUser"
```

## Step 4: Build and Deploy

### Option A: Using Cloud Build (Recommended for CI/CD)

1. **Connect your repository** (if using GitHub/GitLab):
   ```bash
   gcloud builds triggers create github \
     --repo-name=your-repo \
     --repo-owner=your-username \
     --branch-pattern="^main$" \
     --build-config=react-frontend/cloudbuild.yaml
   ```

2. **Or trigger a manual build** (run from project root):
   ```bash
   # Make sure you're in the TFS directory (project root)
   gcloud builds submit --config=react-frontend/cloudbuild.yaml
   ```

### Option B: Manual Deployment

1. **Build the Docker image**:
   ```bash
   cd react-frontend
   docker build -t gcr.io/$PROJECT_ID/fair-shoppe-frontend:latest .
   ```

2. **Push to Container Registry**:
   ```bash
   docker push gcr.io/$PROJECT_ID/fair-shoppe-frontend:latest
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy fair-shoppe-frontend \
     --image gcr.io/$PROJECT_ID/fair-shoppe-frontend:latest \
     --region us-central1 \
     --platform managed \
     --allow-unauthenticated \
     --set-env-vars NEXT_PUBLIC_API_URL=https://soar-api-2pmz2r36bq-uc.a.run.app/api/v1,NEXT_PUBLIC_BASE_URL=https://your-domain.com,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key,NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-key \
     --set-secrets SOAR_API_KEY=soar-api-key:latest,NEXTAUTH_SECRET=nextauth-secret:latest,GOOGLE_CLIENT_ID=google-client-id:latest,GOOGLE_CLIENT_SECRET=google-client-secret:latest \
     --memory 2Gi \
     --cpu 2 \
     --min-instances 0 \
     --max-instances 10 \
     --timeout 300
   ```

## Step 5: Configure Custom Domain (Optional)

1. **Map a custom domain**:
   ```bash
   gcloud run domain-mappings create \
     --service fair-shoppe-frontend \
     --domain yourdomain.com \
     --region us-central1
   ```

2. **Follow the DNS instructions** provided by the command output.

## Step 6: Update Environment Variables

After deployment, you can update environment variables:

```bash
gcloud run services update fair-shoppe-frontend \
  --region us-central1 \
  --update-env-vars NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Environment Variables Reference

### Required Secrets (stored in Secret Manager):
- `SOAR_API_KEY`: Your SOAR Commerce API key
- `NEXTAUTH_SECRET`: Secret for NextAuth session encryption
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID (if using Google login)
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret (if using Google login)

### Public Environment Variables:
- `NEXT_PUBLIC_API_URL`: Headless backend URL (default: `https://soar-api-2pmz2r36bq-uc.a.run.app/api/v1`)
- `NEXT_PUBLIC_BASE_URL`: Your application's public URL (e.g., `https://yourdomain.com`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (for payment processing)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: ReCAPTCHA site key (if using ReCAPTCHA)

## Monitoring and Logs

View logs:
```bash
gcloud run services logs read fair-shoppe-frontend --region us-central1
```

View in Cloud Console:
- Go to Cloud Run → fair-shoppe-frontend → Logs

## Troubleshooting

### Build fails
- Check that all dependencies are in `package.json`
- Verify Dockerfile syntax
- Check Cloud Build logs: `gcloud builds list`

### Deployment fails
- Verify secrets exist: `gcloud secrets list`
- Check IAM permissions
- Review Cloud Run logs

### Application errors
- Check Cloud Run logs
- Verify environment variables are set correctly
- Ensure API key has proper permissions

## Cost Optimization

- **Min instances**: Set to 0 to scale to zero when not in use
- **Max instances**: Adjust based on traffic
- **CPU/Memory**: Start with 1 CPU and 512Mi memory, scale up as needed
- **Timeout**: Default 300s is usually sufficient

## Security Best Practices

1. ✅ Secrets stored in Secret Manager (not environment variables)
2. ✅ API key only accessible server-side
3. ✅ HTTPS enforced by Cloud Run
4. ✅ Consider enabling Cloud Armor for DDoS protection
5. ✅ Set up Cloud Monitoring alerts

## Next Steps

1. Set up Cloud Monitoring alerts
2. Configure Cloud CDN for static assets (if needed)
3. Set up custom domain with SSL
4. Configure backup and disaster recovery
5. Set up CI/CD pipeline for automated deployments

