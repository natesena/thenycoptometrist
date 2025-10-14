# OG Image (Social Share Card) Guide

## 📸 Viewing Your OG Image

Your dynamic OG image has been created! It displays:
- ✅ Dr. Joanna Latek's name
- ✅ "The NYC Optometrist" tagline
- ✅ **4.9★ rating** with gold stars
- ✅ Professional gradient background

### To View It:

1. **Start your Next.js dev server:**
   ```bash
   cd /Users/MAC/Documents/projects/work/frontend/thenycoptometrist
   npm run dev
   ```

2. **Visit the OG image URL:**
   ```
   http://localhost:3000/api/og
   ```

3. **It will display as a 1200x630px image** (perfect for social sharing)

## 💾 Downloading the OG Image

### Option 1: Screenshot from Browser
1. Visit http://localhost:3000/api/og
2. Right-click on the image
3. Select "Save image as..."
4. Save as `og-image.png` or `og-image.jpg`

### Option 2: Using curl
```bash
cd /Users/MAC/Documents/projects/work/frontend/thenycoptometrist/public
curl http://localhost:3000/api/og > og-image.png
```

## 🖼️ Adding Dr. Latek's Profile Photo to OG Image

To add the actual profile photo to the OG image:

1. **Save the profile photo:**
   - Place `Image from Photoroom.png` as `/public/dr-latek-og.png`

2. **Update the OG image route** (`/app/api/og/route.tsx`):

Replace the placeholder emoji section with this code:

```tsx
// Instead of the emoji, use this:
<img
  src={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dr-latek-og.png`}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }}
/>
```

## ☁️ Uploading to Google Cloud Storage (Optional)

If you want to host the image separately on Google Cloud:

### Setup:

1. **Install Google Cloud SDK:**
   ```bash
   brew install google-cloud-sdk
   ```

2. **Authenticate:**
   ```bash
   gcloud auth login
   ```

3. **Create a bucket:**
   ```bash
   gcloud storage buckets create gs://thenycoptometrist-assets \
     --location=us-east1 \
     --public-access-prevention
   ```

4. **Upload the image:**
   ```bash
   # First, download the OG image from your localhost
   cd ~/Downloads
   
   # Upload to Google Cloud Storage
   gcloud storage cp og-image.png gs://thenycoptometrist-assets/og-image.png
   
   # Make it publicly accessible
   gcloud storage objects update gs://thenycoptometrist-assets/og-image.png --add-acl-grant=entity=allUsers,role=READER
   ```

5. **Get the public URL:**
   ```
   https://storage.googleapis.com/thenycoptometrist-assets/og-image.png
   ```

6. **Update your metadata** in `/app/layout.tsx`:
   ```typescript
   images: [{
     url: 'https://storage.googleapis.com/thenycoptometrist-assets/og-image.png',
     width: 1200,
     height: 630,
     alt: 'The NYC Optometrist - Dr. Joanna Latek - 4.9★ Rating'
   }]
   ```

## 🧪 Testing Your OG Image

### Test on Social Media Debuggers:

1. **Facebook Sharing Debugger:**
   - Visit: https://developers.facebook.com/tools/debug/
   - Enter: https://www.thenycoptometrist.com
   - Click "Scrape Again" to see the OG image

2. **Twitter Card Validator:**
   - Visit: https://cards-dev.twitter.com/validator
   - Enter your URL to preview

3. **LinkedIn Post Inspector:**
   - Visit: https://www.linkedin.com/post-inspector/
   - Enter your URL

4. **Open Graph Preview:**
   - Visit: https://www.opengraph.xyz
   - Enter your URL for a universal preview

## 📊 Current OG Image Specs

- **Dimensions:** 1200 x 630 pixels ✓
- **Format:** PNG (dynamic generation)
- **File Size:** ~50-100KB (estimated)
- **Aspect Ratio:** 1.91:1 (Facebook recommended)
- **Content:**
  - Background: Charcoal gradient (#36465F)
  - Text: White, bold, readable
  - Rating: 4.9★ with gold stars
  - Professional medical branding

## 🎨 Customizing the OG Image

Edit `/app/api/og/route.tsx` to customize:

- **Colors:** Change background gradient colors
- **Text:** Update title, tagline, or rating
- **Layout:** Adjust spacing and positioning
- **Add elements:** Logo, additional badges, etc.

After making changes:
1. Restart your dev server
2. Clear browser cache
3. Visit http://localhost:3000/api/og to see updates

## 🚀 Production Deployment

When you deploy to production (e.g., Vercel):

1. The OG image will automatically be available at:
   ```
   https://www.thenycoptometrist.com/api/og
   ```

2. Social platforms will fetch it automatically when someone shares your URL

3. No additional configuration needed!

## ✨ Benefits of Dynamic OG Images

✅ **Always up-to-date** - Changes reflect immediately
✅ **No manual updates** - Generated on-the-fly
✅ **Blog support** - Can create unique OG images per blog post
✅ **Performance** - Cached by social platforms after first load
✅ **Maintenance-free** - Works with Next.js deployment

## 📝 Notes

- The current image uses a placeholder emoji (👁️) instead of the actual profile photo
- For the best result, add Dr. Latek's actual photo following the instructions above
- The image is generated on-demand, so it's always fresh
- First load might be slightly slower, but then it's cached

---

**Need help?** Check `PROJECT_UPDATES.md` for the complete list of changes made to your project.



