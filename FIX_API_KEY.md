# Fixing API Key Authentication Issue

## Problem
The backend is returning: `Error validating API key: cannot access local variable 'data' where it is not associated with a value`

This indicates that the API key is either:
1. Not being sent in the request header
2. Empty or null
3. Still set to a mock value in Google Secret Manager

## Solution

### Step 1: Verify Current Secret Value

Check what value is currently stored in Google Secret Manager:

```bash
gcloud secrets versions access latest --secret="soar-api-key" --project=YOUR_PROJECT_ID
```

If you see a value starting with `mock_soar_api_key_`, it's still a mock value and needs to be updated.

### Step 2: Update the API Key

**Option A: Using the update script (Recommended)**

```bash
./update-api-key.sh YOUR_PROJECT_ID sk_live_your_actual_api_key_here
```

Replace:
- `YOUR_PROJECT_ID` with your Google Cloud project ID (e.g., `fair-shoppe`)
- `sk_live_your_actual_api_key_here` with your actual API key from the backend

**Option B: Manual update**

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Update the secret
echo -n "sk_live_your_actual_api_key_here" | gcloud secrets versions add soar-api-key --data-file=-
```

### Step 3: Verify the Secret

Check that the secret was updated correctly:

```bash
gcloud secrets versions access latest --secret="soar-api-key" --project=YOUR_PROJECT_ID
```

You should see your actual API key (it should start with `sk_live_` or `sk_test_`).

### Step 4: Redeploy the Application

The secret change will take effect on the next deployment. Redeploy:

```bash
./deploy.sh
```

Or manually:

```bash
gcloud builds submit --config=react-frontend/cloudbuild.yaml
```

### Step 5: Verify in Cloud Run Logs

After redeployment, check the Cloud Run logs to verify the API key is being loaded:

```bash
gcloud run services logs read fair-shoppe-frontend --region=us-central1 --limit=50
```

Look for log entries showing:
- `API_KEY present: true`
- `API_KEY length: [some number > 0]`
- `API_KEY first 4 chars: sk_l...`

If you see `API_KEY present: false` or `API_KEY length: 0`, the secret is not being loaded correctly.

## Troubleshooting

### Secret Not Loading in Cloud Run

1. **Check Secret Manager permissions:**
   ```bash
   # Get your project number
   PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)')
   SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
   
   # Grant access (if needed)
   gcloud secrets add-iam-policy-binding soar-api-key \
     --member="serviceAccount:${SERVICE_ACCOUNT}" \
     --role="roles/secretmanager.secretAccessor"
   ```

2. **Verify secret is referenced in cloudbuild.yaml:**
   Check that `cloudbuild.yaml` includes:
   ```yaml
   - '--set-secrets'
   - 'SOAR_API_KEY=soar-api-key:latest,...'
   ```

3. **Check Cloud Run service configuration:**
   ```bash
   gcloud run services describe fair-shoppe-frontend --region=us-central1 --format="yaml(metadata.annotations,spec.template.spec.containers[0].env)"
   ```

### API Key Format

According to the API documentation, API keys should:
- Start with `sk_live_` for production
- Start with `sk_test_` for sandbox/testing

If your API key doesn't match this format, verify with the backend team.

## Testing Locally

To test with the real API key locally:

1. Add to `react-frontend/.env.local`:
   ```
   SOAR_API_KEY=sk_live_your_actual_api_key_here
   ```

2. Restart the dev server:
   ```bash
   cd react-frontend
   npm run dev
   ```

3. Check the console logs when making API calls - you should see the API key is present.

