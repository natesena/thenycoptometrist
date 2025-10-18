const fs = require('fs');
const path = require('path');

// Read the ZocDoc reviews JSON
const reviewsPath = path.join(__dirname, '..', 'data', 'reviews', 'zocdoc-reviews-all.json');
const zocdocReviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));

// Filter for reviews with text and 5-star rating
const reviewsWithText = zocdocReviews.filter(r => r.review && r.review.trim() !== '' && r.rating === 5);

console.log(`Found ${reviewsWithText.length} reviews with text and 5-star ratings\n`);

// Helper function to extract initials from name
function getInitials(name) {
  if (!name) return 'AP'; // Anonymous Patient

  // Handle cases like "Initials hidden"
  if (name.toLowerCase().includes('initials hidden') || name.toLowerCase().includes('anonymous')) {
    return 'AP';
  }

  // Handle formats like "Alison V." or "FERNANDO S."
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    // Single part like "AL" or "OA" - use as-is if 2-3 chars, otherwise take first 2
    return parts[0].length <= 3 ? parts[0].toUpperCase() : parts[0].substring(0, 2).toUpperCase();
  }

  // Multiple parts like "Alison V." or "Victoria M."
  const firstInitial = parts[0][0].toUpperCase();
  const lastInitial = parts[parts.length - 1][0].toUpperCase();

  return firstInitial + lastInitial;
}

// Transform to website format
const websiteReviews = reviewsWithText.map((review, index) => ({
  id: index + 1,
  name: review.name || 'Anonymous Patient',
  rating: review.rating,
  date: review.date || 'Recently',
  review: review.review,
  initials: getInitials(review.name),
  location: 'Eye & Health',
  // Note: service field is optional and omitted
}));

// Generate TypeScript array string
let output = 'const reviews = [\n';

websiteReviews.forEach((review, index) => {
  output += '  {\n';
  output += `    id: ${review.id},\n`;
  output += `    name: "${review.name}",\n`;
  output += `    rating: ${review.rating},\n`;
  output += `    date: "${review.date}",\n`;
  output += `    review: "${review.review.replace(/"/g, '\\"').replace(/\n/g, ' ')}",\n`;
  output += `    initials: "${review.initials}",\n`;
  output += `    location: "${review.location}"\n`;
  output += `  }${index < websiteReviews.length - 1 ? ',' : ''}\n`;
});

output += '] as Review[];\n';

// Output to console
console.log('='.repeat(80));
console.log('TYPESCRIPT REVIEWS ARRAY - Copy and paste into data/index.tsx');
console.log('='.repeat(80));
console.log('\n');
console.log(output);
console.log('\n');
console.log('='.repeat(80));
console.log(`Total reviews: ${websiteReviews.length}`);
console.log(`Average rating: ${(websiteReviews.reduce((sum, r) => sum + r.rating, 0) / websiteReviews.length).toFixed(2)}`);
console.log('='.repeat(80));

// Also save to a file for reference
const outputPath = path.join(__dirname, '..', 'data', 'reviews', 'website-reviews.ts');
fs.writeFileSync(outputPath, output);
console.log(`\nAlso saved to: ${outputPath}`);
