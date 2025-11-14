# Quick Deployment Checklist

## Pre-Deployment Checklist

- [ ] Google Cloud Project created
- [ ] `gcloud` CLI installed and authenticated
- [ ] All required APIs enabled
- [ ] Secrets created in Secret Manager
- [ ] IAM permissions configured

## Step-by-Step Deployment

### 1. Enable APIs (One-time setup)
```bash
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### 2. Create Secrets

**Quick setup with mock values:**
```bash
./setup-secrets.sh your-project-id
```

**Or manually (replace with your actual values):**
```bash
# Generate a secure NextAuth secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Create secrets
echo -n "your-soar-api-key" | gcloud secrets create soar-api-key --data-file=-
echo -n "$NEXTAUTH_SECRET" | gcloud secrets create nextauth-secret --data-file=-
echo -n "your-google-client-id" | gcloud secrets create google-client-id --data-file=-
echo -n "your-google-client-secret" | gcloud secrets create google-client-secret --data-file=-

# Grant access
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

for secret in soar-api-key nextauth-secret google-client-id google-client-secret; do
  gcloud secrets add-iam-policy-binding $secret \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
done
```

### 3. Set IAM Permissions
```bash
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${CLOUDBUILD_SA}" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${CLOUDBUILD_SA}" \
    --role="roles/iam.serviceAccountUser"
```

### 4. Deploy
```bash
cd react-frontend
gcloud builds submit --config=cloudbuild.yaml
```

Or use the quick script:
```bash
./deploy.sh your-project-id us-central1
```

### 5. Update Public Environment Variables
After first deployment, update with your actual domain:
```bash
gcloud run services update fair-shoppe-frontend \
  --region us-central1 \
  --update-env-vars NEXT_PUBLIC_BASE_URL=https://your-actual-domain.com
```

## Required Values

Before deploying, make sure you have:
- ✅ SOAR API Key
- ✅ NextAuth Secret (generate with `openssl rand -base64 32`)
- ✅ Google OAuth credentials (if using Google login)
- ✅ Stripe Publishable Key (if using Stripe)
- ✅ ReCAPTCHA Site Key (if using ReCAPTCHA)
- ✅ Your production domain URL

## Verify Deployment

1. Get the service URL:
   ```bash
   gcloud run services describe fair-shoppe-frontend \
     --region us-central1 \
     --format='value(status.url)'
   ```

2. Visit the URL in your browser
3. Check logs for any errors:
   ```bash
   gcloud run services logs read fair-shoppe-frontend --region us-central1
   ```

## Common Issues

**Build fails**: Check Cloud Build logs
**Deployment fails**: Verify secrets exist and IAM permissions
**App errors**: Check Cloud Run logs and environment variables

