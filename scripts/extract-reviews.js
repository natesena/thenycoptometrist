const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlPath = path.join(process.env.HOME, 'Downloads', 'Dr. Joanna Latek, OD, New York, NY _ Optometrist _ Get Virtual Care.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// Extract the JSON data from the script tag
const reduxStateMatch = html.match(/window\.__REDUX_STATE__\s*=\s*JSON\.parse\("(.+?)"\);/);

if (!reduxStateMatch) {
  console.error('Could not find REDUX_STATE in HTML');
  process.exit(1);
}

// Unescape the JSON string
let jsonString = reduxStateMatch[1];
jsonString = jsonString
  .replace(/\\"/g, '"')
  .replace(/\\\\/g, '\\')
  .replace(/\\n/g, '\n')
  .replace(/\\t/g, '\t');

// Parse the JSON
let data;
try {
  data = JSON.parse(jsonString);
} catch (e) {
  console.error('Failed to parse JSON:', e);
  process.exit(1);
}

// Navigate to the reviews data
// The structure is complex, so we need to find where reviews are stored
const profileData = data?.profile?.data;

if (!profileData) {
  console.error('Could not find profile data');
  console.log('Available keys:', Object.keys(data));
  process.exit(1);
}

// Look for reviews in the provider object
const provider = profileData.provider;

console.log('Provider found:', provider?.approvedFullName);
console.log('Average rating:', provider?.averageRating);
console.log('Highly recommend percentage:', provider?.highlyRecommendPercentage);

// Reviews might be in a separate part of the state
// Let's search for review-like data
const findReviews = (obj, depth = 0) => {
  if (depth > 10) return null;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item && typeof item === 'object') {
        // Check if this looks like a review
        if (item.rating && item.review && item.name) {
          return obj;
        }
        const found = findReviews(item, depth + 1);
        if (found) return found;
      }
    }
  } else if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.toLowerCase().includes('review')) {
        if (Array.isArray(obj[key])) {
          return obj[key];
        }
      }
      const found = findReviews(obj[key], depth + 1);
      if (found) return found;
    }
  }

  return null;
};

const reviews = findReviews(data);

if (reviews) {
  console.log(`Found ${reviews.length} reviews`);

  // Save to file
  const outputPath = path.join(__dirname, '..', 'data', 'reviews', 'zocdoc-reviews-raw.json');
  fs.writeFileSync(outputPath, JSON.stringify(reviews, null, 2));
  console.log(`Saved to ${outputPath}`);
} else {
  console.log('Could not find reviews array. Saving full data structure for manual inspection...');
  const outputPath = path.join(__dirname, '..', 'data', 'reviews', 'redux-state.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Saved full state to ${outputPath}`);
}
