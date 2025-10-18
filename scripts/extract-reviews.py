#!/usr/bin/env python3
import json
import re
import os
from pathlib import Path

# Read the HTML file
html_path = Path.home() / 'Downloads' / 'Dr. Joanna Latek, OD, New York, NY _ Optometrist _ Get Virtual Care.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Find the REDUX_STATE JSON
pattern = r'window\.__REDUX_STATE__\s*=\s*JSON\.parse\("(.+?)"\);'
match = re.search(pattern, html, re.DOTALL)

if not match:
    print('Could not find REDUX_STATE in HTML')
    exit(1)

json_string = match.group(1)

# Unescape the JSON string - this is tricky!
# The JSON is double-encoded (escaped for embedding in HTML)
json_string = json_string.encode().decode('unicode_escape')

try:
    data = json.loads(json_string)
except json.JSONDecodeError as e:
    print(f'Failed to parse JSON: {e}')
    # Try to save what we have for inspection
    output_dir = Path(__dirname__).parent / 'data' / 'reviews'
    output_dir.mkdir(parents=True, exist_ok=True)
    with open(output_dir / 'raw-json-string.txt', 'w') as f:
        f.write(json_string[:10000])  # Save first 10k chars
    print('Saved partial JSON string for inspection')
    exit(1)

print('Successfully parsed JSON!')

# Navigate to find reviews
profile_data = data.get('profile', {}).get('data', {})
provider = profile_data.get('provider', {})

print(f"Provider: {provider.get('approvedFullName')}")
print(f"Average rating: {provider.get('averageRating')}")
print(f"Total reviews: Looking...")

# Search for reviews recursively
def find_reviews(obj, depth=0, path=""):
    if depth > 15:
        return None

    if isinstance(obj, list):
        for i, item in enumerate(obj):
            if isinstance(item, dict):
                # Check if this looks like a review
                if 'rating' in item and 'review' in item and 'name' in item:
                    return obj
            result = find_reviews(item, depth + 1, f"{path}[{i}]")
            if result:
                return result
    elif isinstance(obj, dict):
        for key, value in obj.items():
            if 'review' in key.lower() and isinstance(value, list):
                # Check if it contains review objects
                if value and isinstance(value[0], dict) and 'rating' in value[0]:
                    return value
            result = find_reviews(value, depth + 1, f"{path}.{key}")
            if result:
                return result

    return None

reviews = find_reviews(data)

output_dir = Path(__file__).parent.parent / 'data' / 'reviews'
output_dir.mkdir(parents=True, exist_ok=True)

if reviews:
    print(f"Found {len(reviews)} reviews!")

    # Save raw reviews
    output_path = output_dir / 'zocdoc-reviews-raw.json'
    with open(output_path, 'w') as f:
        json.dump(reviews, f, indent=2)
    print(f"Saved to {output_path}")

    # Create summary
    summary = {
        "total_reviews": len(reviews),
        "provider": provider.get('approvedFullName'),
        "average_rating": provider.get('averageRating'),
        "extraction_date": "2025-10-18"
    }

    with open(output_dir / 'summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    print(f"Created summary file")

else:
    print('Could not find reviews in the expected format')
    print('Saving full data structure for manual inspection...')

    # Save the full parsed data
    output_path = output_dir / 'redux-state-full.json'
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Saved full state to {output_path}")

    # Also save just the keys at the top level
    print("\nTop-level keys in data:")
    for key in data.keys():
        print(f"  - {key}")
