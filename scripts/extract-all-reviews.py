#!/usr/bin/env python3
import re
import json
from pathlib import Path
from html import unescape

# Read the HTML file
html_path = Path.home() / 'Downloads' / 'Dr. Joanna Latek, OD, New York, NY _ Optometrist _ Get Virtual Care.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Find all review blocks using regex
# Each review has id="re_..." pattern
review_pattern = r'<div[^>]*id="(re_[^"]+)"[^>]*data-test="review"[^>]*>.*?</div>\s*</div>\s*</div>'

reviews = []
review_count = 0

# Find all review IDs first
review_ids = re.findall(r'id="(re_[^"]+)"', html)
print(f"Found {len(review_ids)} review IDs in HTML")

# For each review ID, extract the review data
for review_id in review_ids:
    review_count += 1

    # Find the review block for this ID
    # Look for rating
    rating_match = re.search(
        rf'id="{review_id}".*?<meta content="(\d+)" itemprop="ratingValue"',
        html,
        re.DOTALL
    )
    rating = int(rating_match.group(1)) if rating_match else 5

    # Look for review text
    review_text_match = re.search(
        rf'id="{review_id}".*?itemprop="reviewBody".*?<span>(.*?)</span>',
        html,
        re.DOTALL
    )
    review_text = unescape(review_text_match.group(1).strip()) if review_text_match else ""

    # Look for date
    date_match = re.search(
        rf'id="{review_id}".*?data-test="review-dateRange"[^>]*>(.*?)</span>',
        html,
        re.DOTALL
    )
    date = unescape(date_match.group(1).strip()) if date_match else ""

    # Look for author name
    author_match = re.search(
        rf'id="{review_id}".*?data-test="review-author".*?<span itemprop="name">(.*?)</span>',
        html,
        re.DOTALL
    )
    author = unescape(author_match.group(1).strip()) if author_match else ""

    review = {
        "id": review_id,
        "rating": rating,
        "review": review_text,
        "name": author,
        "date": date
    }

    reviews.append(review)

print(f"\nSuccessfully extracted {len(reviews)} reviews")

# Show stats
reviews_with_text = sum(1 for r in reviews if r['review'])
reviews_with_names = sum(1 for r in reviews if r['name'] and r['name'] != 'Initials hidden')
reviews_with_dates = sum(1 for r in reviews if r['date'])

print(f"  - Reviews with text: {reviews_with_text}")
print(f"  - Reviews with names: {reviews_with_names}")
print(f"  - Reviews with dates: {reviews_with_dates}")

# Show first few reviews
print("\nFirst 5 reviews:")
for i, review in enumerate(reviews[:5]):
    print(f"\n{i+1}. {review['name'] or '[No name]'} - {review['rating']} stars")
    if review['date']:
        print(f"   Date: {review['date']}")
    if review['review']:
        print(f"   Review: {review['review'][:100]}...")
    else:
        print(f"   Review: [Rating only - no text]")

# Save to file
output_dir = Path(__file__).parent.parent / 'data' / 'reviews'
output_dir.mkdir(parents=True, exist_ok=True)

output_path = output_dir / 'zocdoc-reviews-all.json'
with open(output_path, 'w') as f:
    json.dump(reviews, f, indent=2)
print(f"\n✓ Saved all {len(reviews)} reviews to {output_path}")

# Create updated summary
summary = {
    "total_reviews": len(reviews),
    "reviews_with_text": reviews_with_text,
    "reviews_rating_only": len(reviews) - reviews_with_text,
    "provider": "Dr. Joanna Latek, OD",
    "extraction_date": "2025-10-18",
    "source": "ZocDoc HTML profile (complete extraction)",
    "rating_distribution": {
        "5_stars": sum(1 for r in reviews if r['rating'] == 5),
        "4_stars": sum(1 for r in reviews if r['rating'] == 4),
        "3_stars": sum(1 for r in reviews if r['rating'] == 3),
        "2_stars": sum(1 for r in reviews if r['rating'] == 2),
        "1_star": sum(1 for r in reviews if r['rating'] == 1),
    }
}

with open(output_dir / 'summary-complete.json', 'w') as f:
    json.dump(summary, f, indent=2)
print(f"✓ Created summary file")

print(f"\nRating distribution:")
for rating, count in sorted(summary['rating_distribution'].items(), reverse=True):
    if count > 0:
        print(f"  {rating}: {count} reviews")
