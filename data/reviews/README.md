# ZocDoc Reviews Extraction

## Summary

- **Total reviews on ZocDoc**: 49
- **Reviews extracted from HTML**: 49 (ALL reviews!)
- **Reviews with written text**: 23
- **Extraction date**: October 18, 2025
- **Source**: [Dr. Joanna Latek ZocDoc Profile](https://www.zocdoc.com/doctor/joanna-latek-od-640237)

## Files

- `zocdoc-reviews-extracted.json` - All 23 reviews extracted from the saved HTML
- `summary.json` - Summary statistics and rating distribution
- `redux-state-full.json` - Full Redux state from the ZocDoc page (for reference)

## Findings

### What We Extracted
Successfully extracted 23 unique patient reviews from the ZocDoc HTML file. All 23 reviews are 5-star ratings.

### Why Only 23 of 49 Reviews?
The ZocDoc page uses lazy loading/pagination for reviews. The HTML file saved only contained the first batch of reviews that were loaded when the page was saved. The remaining 26 reviews would need to be loaded by scrolling down or clicking "load more" on the actual ZocDoc page.

### Current Website Status
The website currently has 9 hardcoded reviews in `data/index.tsx`. With this extraction, we now have access to 23 unique ZocDoc reviews (more than double).

## Rating Distribution
- 5 stars: 23 reviews (100%)
- 4 stars: 0 reviews
- 3 stars: 0 reviews
- 2 stars: 0 reviews
- 1 star: 0 reviews

## Next Steps

1. **Get All 49 Reviews**: To extract all reviews, you would need to:
   - Visit the ZocDoc page
   - Scroll down or click "See all reviews" to load all 49 reviews
   - Save the HTML again with all reviews loaded
   - Re-run the extraction script

2. **Update Website**: Once satisfied with the number of reviews, update `data/index.tsx` with the new review data

3. **Format Conversion**: The extracted reviews need to match the existing Review interface:
   ```typescript
   {
     id: number,
     name: string,
     rating: number,
     date: string,
     service: string,
     review: string,
     initials: string,
     location: string
   }
   ```

## Extraction Method

Used Python HTMLParser to extract reviews from the DOM structure:
- Reviews are identified by `data-test="review"` attribute
- Rating extracted from `<meta itemprop="ratingValue">`
- Review text from `<div itemprop="reviewBody">`
- Unique review IDs from the `id` attribute

Script location: `scripts/extract-all-reviews.py`

---

## Regenerating Reviews for Website

To update the website with the latest ZocDoc reviews:

### Step 1: Run the Conversion Script

```bash
node scripts/convert-zocdoc-to-website-format.js
```

This script will:
- Read all 49 reviews from `data/reviews/zocdoc-reviews-all.json`
- Filter for reviews with written text (23 reviews)
- Transform them to match the website's Review interface
- Output a formatted TypeScript array ready to paste
- Save the output to `data/reviews/website-reviews.ts`

### Step 2: Update Review Data

1. Copy the TypeScript array from the script output
2. Open `data/index.tsx`
3. Replace the `reviews` array (lines 192-283) with the new array
4. Save the file

### Step 3: Update Average Rating

Update the average rating in **4 locations**:

1. **`app/components/reviews/index.tsx` line 251**
   - Change `"4.9"` to `"4.92"`

2. **`app/components/hero/hero.tsx` line 102**
   - Change `"4.9★"` to `"4.92★"`

3. **`app/api/og/route.tsx` line 159**
   - Change `"4.9★"` to `"4.92★"`

4. **`app/layout.tsx` line 32**
   - Change `"4.9★ Rating"` to `"4.92★ Rating"`

### Step 4: Test

```bash
npm run dev
```

Verify:
- All reviews display correctly
- Rating shows as 4.92 in all locations
- Carousel works with the new review count
- No TypeScript errors

---

## Data Files

- `zocdoc-reviews-all.json` - All 49 reviews from ZocDoc (23 with text, 26 rating-only)
- `zocdoc-reviews-extracted.json` - Initial extraction (partial data)
- `website-reviews.ts` - Generated TypeScript array (created by conversion script)
- `summary-complete.json` - Statistics for all 49 reviews
- `redux-state-full.json` - Full Redux state from ZocDoc page (reference)

## Extraction Scripts

- `scripts/extract-all-reviews.py` - Main extraction script (extracts all 49 reviews from HTML)
- `scripts/convert-zocdoc-to-website-format.js` - Conversion script (transforms to website format)
