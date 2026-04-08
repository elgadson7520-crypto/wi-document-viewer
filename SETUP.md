# SupplyOne Wisconsin Document Viewer - Setup Guide

## 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** > **New Project**
3. Name it something like "SupplyOne Document Viewer" and click **Create**
4. Once created, select the project

## 2. Enable Google Drive API

1. Go to **APIs & Services** > **Library**
2. Search for **Google Drive API**
3. Click on it and click **Enable**

## 3. Create a Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Name: `document-viewer` (or similar)
4. Click **Create and Continue**, skip the optional steps, click **Done**
5. Click on the newly created service account email
6. Go to the **Keys** tab
7. Click **Add Key** > **Create new key** > **JSON** > **Create**
8. A JSON file will download - keep it safe

## 4. Extract and Encode the Private Key

From the downloaded JSON file, you need two values:

- `client_email` - This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` - This needs to be base64-encoded for `GOOGLE_SERVICE_ACCOUNT_KEY`

To base64-encode the private key:

**On Mac/Linux:**
```bash
# Extract just the private key from the JSON and base64 encode it
cat your-key-file.json | python3 -c "import sys,json; print(json.load(sys.stdin)['private_key'])" | base64
```

**On Windows (PowerShell):**
```powershell
$json = Get-Content your-key-file.json | ConvertFrom-Json
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json.private_key))
```

## 5. Share Your Google Drive Folder

1. Open Google Drive in your browser
2. Right-click the folder you want to use as your document library
3. Click **Share**
4. Add the service account email (from step 4) as a **Viewer**
5. Click **Send** (uncheck "Notify people" if prompted)

## 6. Get the Folder ID

1. Open the shared folder in Google Drive
2. Look at the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
3. Copy the `FOLDER_ID_HERE` part - this is your `GOOGLE_DRIVE_FOLDER_ID`

## 7. Set Environment Variables

Create a `.env.local` file in the project root:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY=your-base64-encoded-private-key
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-from-step-6
```

## 8. Install and Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 9. Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts, then add environment variables:

```bash
vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
vercel env add GOOGLE_SERVICE_ACCOUNT_KEY
vercel env add GOOGLE_DRIVE_FOLDER_ID
```

Redeploy:

```bash
vercel --prod
```

### Option B: GitHub Integration

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and click **New Project**
3. Import your GitHub repo
4. Add the three environment variables in the Vercel dashboard
5. Click **Deploy**

## Troubleshooting

- **"No Google authentication method configured"**: Make sure your `.env.local` has the correct service account email and base64-encoded key
- **"No folder ID provided"**: Set `GOOGLE_DRIVE_FOLDER_ID` in your environment
- **Empty folder tree**: Ensure the Google Drive folder is shared with the service account email
- **403 errors**: The service account may not have access - reshare the folder
- **Files not loading**: Check that Google Drive API is enabled in your Cloud Console project
