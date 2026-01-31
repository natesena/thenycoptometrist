/**
 * Blog Topic & Tag System
 *
 * Defines topic categories from Dr. Latek's content guidelines
 * and maps them to tags for performance tracking.
 *
 * Reference: AI Blog Generation System Plan - Step 3
 */

// All available tags for content performance tracking
// These match the tags field options in BlogPosts collection
export const BLOG_TAGS = [
  'eye-exams',
  'preventive-care',
  'early-detection',
  'contact-lenses',
  'lens-care',
  'specialty-lenses',
  'pediatrics',
  'children',
  'school-vision',
  'trending',
  'eye-health-tips',
  'dry-eyes',
  'treatments',
  'prevention',
  'eyeglasses',
  'vision-correction',
  'prescriptions',
  'myopia',
  'progression-control',
  'eye-disease',
  'glaucoma',
  'macular-degeneration',
  'cataracts',
  'vision-therapy',
  'exercises',
  'binocular-vision',
] as const;

export type BlogTag = typeof BLOG_TAGS[number];

// Topic categories with descriptions and associated tags
export interface TopicCategory {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  exampleSubtopics: string[];
  associatedTags: BlogTag[];
}

// Nine topic categories from Dr. Latek's content guidelines
// Reference: Google Doc content requirements
export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    categoryId: 'comprehensive-eye-exams',
    categoryName: 'Comprehensive Eye Exams',
    categoryDescription:
      'Importance of regular eye exams, what to expect during an exam, early detection of conditions',
    exampleSubtopics: [
      'Why annual eye exams matter',
      'What happens during a comprehensive eye exam',
      'Early detection of diabetes through eye exams',
      'Eye exams for different age groups',
      'Digital eye strain assessment',
    ],
    associatedTags: ['eye-exams', 'preventive-care', 'early-detection'],
  },
  {
    categoryId: 'contact-lenses',
    categoryName: 'Contact Lenses',
    categoryDescription:
      'Contact lens options, proper care, specialty lenses for unique needs',
    exampleSubtopics: [
      'Daily vs monthly contact lenses',
      'Contact lens care best practices',
      'Scleral lenses for keratoconus',
      'Multifocal contact lenses',
      'Swimming with contact lenses',
      'Colored contact lens safety',
    ],
    associatedTags: ['contact-lenses', 'lens-care', 'specialty-lenses'],
  },
  {
    categoryId: 'pediatrics',
    categoryName: 'Pediatrics',
    categoryDescription:
      'Children\'s eye health, school vision screenings, early intervention',
    exampleSubtopics: [
      'When should children have their first eye exam',
      'Signs your child needs glasses',
      'School vision screening limitations',
      'Screen time and children\'s eyes',
      'Learning difficulties and vision',
    ],
    associatedTags: ['pediatrics', 'children', 'school-vision'],
  },
  {
    categoryId: 'hot-topics',
    categoryName: 'Hot Topics',
    categoryDescription:
      'Current trends, seasonal topics, lifestyle eye care',
    exampleSubtopics: [
      'Blue light glasses: do they work?',
      'Eye care in the digital age',
      'Seasonal allergies and your eyes',
      'UV protection for eyes',
      'Eye-friendly nutrition',
      'Sleep and eye health',
    ],
    associatedTags: ['trending', 'eye-health-tips', 'prevention'],
  },
  {
    categoryId: 'dry-eyes',
    categoryName: 'Dry Eyes',
    categoryDescription:
      'Dry eye syndrome causes, symptoms, treatments, and management',
    exampleSubtopics: [
      'Understanding dry eye syndrome',
      'At-home remedies for dry eyes',
      'Medical treatments for chronic dry eye',
      'Meibomian gland dysfunction',
      'Screen use and dry eyes',
      'Dry eyes in contact lens wearers',
    ],
    associatedTags: ['dry-eyes', 'treatments', 'prevention'],
  },
  {
    categoryId: 'eyeglasses-vision-correction',
    categoryName: 'Eyeglasses & Vision Correction',
    categoryDescription:
      'Choosing glasses, understanding prescriptions, lens options',
    exampleSubtopics: [
      'Understanding your eyeglass prescription',
      'Progressive vs bifocal lenses',
      'Blue light filtering lenses',
      'Choosing frames for your face shape',
      'Anti-reflective coatings',
      'When to update your prescription',
    ],
    associatedTags: ['eyeglasses', 'vision-correction', 'prescriptions'],
  },
  {
    categoryId: 'myopia-management',
    categoryName: 'Myopia Management',
    categoryDescription:
      'Childhood myopia, progression control, treatment options',
    exampleSubtopics: [
      'What is myopia and why is it increasing',
      'Orthokeratology for myopia control',
      'Atropine eye drops for myopia',
      'Outdoor time and myopia prevention',
      'MiSight contact lenses',
      'Long-term risks of high myopia',
    ],
    associatedTags: ['myopia', 'children', 'progression-control'],
  },
  {
    categoryId: 'disease',
    categoryName: 'Disease',
    categoryDescription:
      'Eye diseases, symptoms, treatment options, and prevention',
    exampleSubtopics: [
      'Glaucoma: the silent thief of sight',
      'Age-related macular degeneration',
      'Diabetic retinopathy warning signs',
      'Cataracts: causes and treatment',
      'Conjunctivitis types and treatment',
      'Floaters and when to worry',
    ],
    associatedTags: ['eye-disease', 'glaucoma', 'macular-degeneration', 'cataracts'],
  },
  {
    categoryId: 'vision-therapy',
    categoryName: 'Vision Therapy',
    categoryDescription:
      'Vision exercises, binocular vision issues, rehabilitation',
    exampleSubtopics: [
      'What is vision therapy',
      'Convergence insufficiency treatment',
      'Vision therapy for reading difficulties',
      'Eye tracking exercises',
      'Post-concussion vision rehabilitation',
      'Amblyopia (lazy eye) treatment',
    ],
    associatedTags: ['vision-therapy', 'exercises', 'binocular-vision'],
  },
];

/**
 * Get a random topic category
 *
 * In the future, this could be weighted by content performance
 * data to favor high-performing topics.
 */
export function getRandomTopicCategory(): TopicCategory {
  const randomIndex = Math.floor(Math.random() * TOPIC_CATEGORIES.length);
  return TOPIC_CATEGORIES[randomIndex];
}

/**
 * Find a topic category by ID or name
 */
export function findTopicCategory(searchTerm: string): TopicCategory | null {
  const searchLower = searchTerm.toLowerCase().trim();

  // Try to find by exact ID match
  const byId = TOPIC_CATEGORIES.find(
    (category) => category.categoryId.toLowerCase() === searchLower
  );
  if (byId) return byId;

  // Try to find by name match (case-insensitive)
  const byName = TOPIC_CATEGORIES.find(
    (category) => category.categoryName.toLowerCase() === searchLower
  );
  if (byName) return byName;

  // Try partial name match
  const byPartialName = TOPIC_CATEGORIES.find(
    (category) => category.categoryName.toLowerCase().includes(searchLower) ||
      searchLower.includes(category.categoryName.toLowerCase())
  );
  if (byPartialName) return byPartialName;

  // Try matching keywords in description or subtopics
  const byKeyword = TOPIC_CATEGORIES.find(
    (category) =>
      category.categoryDescription.toLowerCase().includes(searchLower) ||
      category.exampleSubtopics.some((subtopic) =>
        subtopic.toLowerCase().includes(searchLower)
      )
  );
  if (byKeyword) return byKeyword;

  return null;
}

/**
 * Get all topic categories as a formatted list
 */
export function getTopicCategoriesList(): string {
  return TOPIC_CATEGORIES.map(
    (category) => `- ${category.categoryName}: ${category.categoryDescription}`
  ).join('\n');
}

/**
 * Get a random subtopic from a category
 */
export function getRandomSubtopic(category: TopicCategory): string {
  const randomIndex = Math.floor(Math.random() * category.exampleSubtopics.length);
  return category.exampleSubtopics[randomIndex];
}
