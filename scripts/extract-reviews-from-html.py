#!/usr/bin/env python3
import re
import json
from pathlib import Path
from html.parser import HTMLParser

class ReviewExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reviews = []
        self.current_review = None
        self.in_review = False
        self.in_review_body = False
        self.in_author = False
        self.in_date = False
        self.current_rating = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        # Start of a review
        if tag == 'div' and attrs_dict.get('data-test') == 'review':
            self.in_review = True
            self.current_review = {
                'id': attrs_dict.get('id', ''),
                'rating': 5,  # Default, will be overridden
                'review': '',
                'name': '',
                'date': ''
            }

        # Rating value
        if self.in_review and tag == 'meta' and attrs_dict.get('itemprop') == 'ratingValue':
            self.current_review['rating'] = int(attrs_dict.get('content', '5'))

        # Review body
        if self.in_review and tag == 'div' and attrs_dict.get('itemprop') == 'reviewBody':
            self.in_review_body = True

        # Date published
        if self.in_review and tag == 'span' and attrs_dict.get('data-test') == 'review-dateRange':
            self.in_date = True

        # Author
        if self.in_review and tag == 'span' and attrs_dict.get('data-test') == 'review-author':
            self.in_author = True

    def handle_data(self, data):
        data = data.strip()
        if not data:
            return

        if self.in_review_body and self.current_review is not None:
            self.current_review['review'] += data

        if self.in_date and self.current_review is not None:
            self.current_review['date'] = data

        if self.in_author and self.current_review is not None and not self.current_review['name']:
            self.current_review['name'] = data

    def handle_endtag(self, tag):
        if tag == 'div' and self.in_review_body:
            self.in_review_body = False

        if tag == 'span' and self.in_date:
            self.in_date = False

        if tag == 'span' and self.in_author:
            self.in_author = False

        # End of review - don't check here, we'll clean up after parsing

# Read the HTML file
html_path = Path.home() / 'Downloads' / 'Dr. Joanna Latek, OD, New York, NY _ Optometrist _ Get Virtual Care.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Extract reviews
parser = ReviewExtractor()
parser.feed(html)

reviews = parser.reviews
print(f"Found {len(reviews)} reviews")

# Clean up reviews and deduplicate
seen_reviews = set()
unique_reviews = []

for review in reviews:
    # Clean up review text
    review['review'] = review['review'].strip()

    # Create a unique key based on content
    review_key = (review['name'], review['review'][:50], review['rating'])

    if review_key not in seen_reviews and review['review']:
        seen_reviews.add(review_key)
        unique_reviews.append(review)

print(f"Unique reviews: {len(unique_reviews)}")

# Show first few reviews for verification
print("\nFirst 3 reviews:")
for i, review in enumerate(unique_reviews[:3]):
    print(f"\n{i+1}. {review['name']} - {review['rating']} stars - {review['date']}")
    print(f"   {review['review'][:100]}...")

# Save to file
output_dir = Path(__file__).parent.parent / 'data' / 'reviews'
output_dir.mkdir(parents=True, exist_ok=True)

# Save all reviews
output_path = output_dir / 'zocdoc-reviews-extracted.json'
with open(output_path, 'w') as f:
    json.dump(unique_reviews, f, indent=2)
print(f"\n✓ Saved {len(unique_reviews)} reviews to {output_path}")

# Create summary
summary = {
    "total_reviews": len(unique_reviews),
    "provider": "Dr. Joanna Latek, OD",
    "extraction_date": "2025-10-18",
    "source": "ZocDoc HTML profile",
    "rating_distribution": {
        "5_stars": sum(1 for r in unique_reviews if r['rating'] == 5),
        "4_stars": sum(1 for r in unique_reviews if r['rating'] == 4),
        "3_stars": sum(1 for r in unique_reviews if r['rating'] == 3),
        "2_stars": sum(1 for r in unique_reviews if r['rating'] == 2),
        "1_star": sum(1 for r in unique_reviews if r['rating'] == 1),
    }
}

with open(output_dir / 'summary.json', 'w') as f:
    json.dump(summary, f, indent=2)
print(f"✓ Created summary file with rating distribution")
print(f"\nRating distribution:")
for rating, count in sorted(summary['rating_distribution'].items(), reverse=True):
    if count > 0:
        print(f"  {rating}: {count} reviews")
