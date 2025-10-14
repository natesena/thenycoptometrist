# Google Cloud Storage Setup Guide

## Step 1: Create Google Cloud Account

1. **Go to:** https://console.cloud.google.com
2. **Sign in** with your Google account
3. **Accept** terms and conditions
4. You get **$300 free credits** for 90 days (more than enough for hosting images!)

## Step 2: Create a New Project

1. Click the **project dropdown** at the top (next to "Google Cloud")
2. Click **"New Project"**
3. **Project name:** `thenycoptometrist` (or whatever you prefer)
4. Click **"Create"**
5. Wait for the project to be created (takes ~30 seconds)
6. Select your new project from the dropdown

## Step 3: Enable Cloud Storage API

1. In the search bar at the top, type: **"Cloud Storage"**
2. Click on **"Cloud Storage"**
3. Click **"Enable"** if prompted
4. Or go to: https://console.cloud.google.com/storage/browser

## Step 4: Create a Storage Bucket

1. Click **"Create Bucket"** button
2. **Bucket name:** `thenycoptometrist-assets` (must be globally unique)
   - If taken, try: `thenycoptometrist-cdn`, `thenycoptometrist-images`, etc.
3. **Location type:** Select "Region"
4. **Location:** Choose `us-east1` (or closest to your users)
5. **Storage class:** Standard
6. **Access control:** Fine-grained (recommended)
7. **Protection tools:** Leave defaults
8. Click **"Create"**

## Step 5: Upload Your OG Image

### First, Get the OG Image from Your Site:

1. **Start your Next.js dev server:**
   ```bash
   npm run dev
   ```

2. **Visit:** http://localhost:3000/api/og

3. **Right-click on the image** → **"Save Image As..."**

4. **Save as:** `og-image.png` to your Downloads folder

### Upload to Google Cloud:

1. In Google Cloud Console, click on your bucket name
2. Click **"Upload Files"** button
3. Select your `og-image.png` file
4. Click **"Open"**
5. Wait for upload to complete

## Step 6: Make the Image Publicly Accessible

### Option A: Make Individual File Public (Recommended)

1. Find your uploaded `og-image.png` in the bucket
2. Click the **three dots** (⋮) on the right
3. Click **"Edit permissions"**
4. Click **"+ Add Entry"**
5. Fill in:
   - **Entity:** Public
   - **Name:** allUsers
   - **Access:** Reader
6. Click **"Save"**
7. Click **"Allow Public Access"** in the confirmation dialog

### Option B: Make Entire Bucket Public

1. Go to bucket **Permissions** tab
2. Click **"Grant Access"**
3. **New principals:** `allUsers`
4. **Role:** Storage Object Viewer
5. Click **"Save"**
6. Confirm public access

## Step 7: Get Your Image URL

After making the image public, you'll see a **Public URL** like:

```
https://storage.googleapis.com/thenycoptometrist-assets/og-image.png
```

**Copy this URL!** You'll need it in the next step.

## Step 8: Update Your Next.js Metadata

I'll update your `app/layout.tsx` file to use this URL instead of the dynamic image.

**Your URL format will be:**
```
https://storage.googleapis.com/YOUR-BUCKET-NAME/og-image.png
```

## Alternative: Using Custom Domain (Optional)

If you want a cleaner URL like `https://cdn.thenycoptometrist.com/og-image.png`:

1. **Set up Cloud CDN** (more advanced)
2. **Configure DNS** to point subdomain to your bucket
3. **Add SSL certificate**

This is optional and can be done later!

---

## Pricing Information

**Good news:** Image hosting is **extremely cheap**!

- **Storage:** $0.020 per GB/month
- **Network egress:** First 1 GB free, then ~$0.12/GB
- Your OG image (~50-100KB) will cost **less than $0.01/month**
- With $300 free credits, you can host images for **years** for free!

---

## Quick Command Line Method (Alternative)

If you prefer using the terminal:

### 1. Install Google Cloud SDK:
```bash
brew install google-cloud-sdk
```

### 2. Authenticate:
```bash
gcloud auth login
```

### 3. Create bucket:
```bash
gcloud storage buckets create gs://thenycoptometrist-assets \
  --location=us-east1 \
  --uniform-bucket-level-access
```

### 4. Upload image:
```bash
# First, save the OG image
cd ~/Downloads

# Upload to bucket
gcloud storage cp og-image.png gs://thenycoptometrist-assets/

# Make it public
gcloud storage objects update gs://thenycoptometrist-assets/og-image.png \
  --add-acl-grant=entity=allUsers,role=READER
```

### 5. Get the URL:
```bash
echo "https://storage.googleapis.com/thenycoptometrist-assets/og-image.png"
```

---

## Next Steps

Once you have your public URL, let me know and I'll:
1. Update your `app/layout.tsx` to use it
2. Test that it works on social media platforms
3. Show you how to test it with Facebook/Twitter debuggers

---

## Troubleshooting

### Image not showing?
- Check permissions (must be public)
- Verify URL is correct
- Clear cache and try again

### Bucket name already exists?
- Try a different name
- Bucket names must be globally unique across all Google Cloud users

### Need help?
- Google Cloud Support: https://cloud.google.com/support
- Or just ask me! 😊

---

**Ready?** Follow the steps above and let me know your public image URL when you're done!



