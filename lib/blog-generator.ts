/**
 * Blog Generator
 *
 * Core workflow for AI-powered blog generation.
 * Coordinates AI provider, topic selection, prompt generation,
 * and structured output parsing.
 *
 * Reference: AI Blog Generation System Plan - Step 5
 */

import { generateText } from 'ai';
import { getAIModel, getModelInfo } from './ai-provider';
import {
  getRandomTopicCategory,
  findTopicCategory,
  getRandomSubtopic,
  type TopicCategory,
  type BlogTag,
} from './blog-topics';
import {
  BLOG_GENERATION_SYSTEM_PROMPT,
  generateBlogUserPrompt,
  validateAIResponse,
  type BlogGenerationAIResponse,
} from './blog-prompts';

/**
 * Result of blog generation
 */
export interface BlogGenerationResult {
  // Blog content
  title: string;
  slug: string;
  excerpt: string;
  metaDescription: string;
  content: string;
  bibliography: string;

  // Instagram content
  instagramCaption: string;
  instagramCarouselSlides: string[];
  featuredImageSuggestion: string;

  // Metadata
  topicCategory: TopicCategory;
  tags: BlogTag[];
  generatedAt: string;
  modelInfo: { provider: string; model: string };
}

/**
 * Options for blog generation
 */
export interface BlogGenerationOptions {
  /** Topic category name or ID to use (random if not specified) */
  topicCategoryOverride?: string;

  /** Specific topic/subtopic to write about */
  specificTopic?: string;

  /** Model override (uses environment default if not specified) */
  modelOverride?: string;
}

/**
 * Generate a blog post using AI
 *
 * This is the main entry point for blog generation.
 * It handles topic selection, prompt generation, AI invocation,
 * and response parsing.
 *
 * @param options - Configuration options for generation
 * @returns BlogGenerationResult with all content and metadata
 */
export async function generateBlogPost(
  options: BlogGenerationOptions = {}
): Promise<BlogGenerationResult> {
  const generatedAt = new Date().toISOString();

  // Step 1: Select topic category
  console.log('[BlogGenerator] Selecting topic category...');
  let topicCategory: TopicCategory;

  if (options.topicCategoryOverride) {
    const foundCategory = findTopicCategory(options.topicCategoryOverride);
    if (!foundCategory) {
      throw new Error(
        `Topic category not found: "${options.topicCategoryOverride}". ` +
        `Valid categories: ${getAvailableCategoriesList()}`
      );
    }
    topicCategory = foundCategory;
  } else {
    topicCategory = getRandomTopicCategory();
  }

  console.log(`[BlogGenerator] Selected category: ${topicCategory.categoryName}`);

  // Step 2: Determine specific topic if not provided
  const specificTopic = options.specificTopic || getRandomSubtopic(topicCategory);
  console.log(`[BlogGenerator] Topic: ${specificTopic}`);

  // Step 3: Get AI model
  const model = getAIModel(options.modelOverride);
  const modelInfo = getModelInfo();
  console.log(`[BlogGenerator] Using model: ${modelInfo.provider}/${modelInfo.model}`);

  // Step 4: Generate blog content
  console.log('[BlogGenerator] Generating content...');
  const userPrompt = generateBlogUserPrompt(topicCategory, specificTopic);

  const { text: aiResponseText } = await generateText({
    model,
    system: BLOG_GENERATION_SYSTEM_PROMPT,
    prompt: userPrompt,
    temperature: 0.7,
  });

  // Step 5: Parse AI response
  console.log('[BlogGenerator] Parsing AI response...');
  const parsedResponse = parseAIResponse(aiResponseText);

  if (!validateAIResponse(parsedResponse)) {
    throw new Error(
      'AI response did not match expected format. ' +
      'Check that the model is returning valid JSON.'
    );
  }

  // Step 6: Build result
  const result: BlogGenerationResult = {
    // Blog content
    title: parsedResponse.title,
    slug: ensureValidSlug(parsedResponse.slug),
    excerpt: parsedResponse.excerpt,
    metaDescription: parsedResponse.metaDescription,
    content: parsedResponse.content,
    bibliography: parsedResponse.bibliography,

    // Instagram content
    instagramCaption: parsedResponse.instagramCaption,
    instagramCarouselSlides: parsedResponse.instagramCarouselSlides,
    featuredImageSuggestion: parsedResponse.featuredImageSuggestion,

    // Metadata
    topicCategory,
    tags: topicCategory.associatedTags,
    generatedAt,
    modelInfo,
  };

  console.log(`[BlogGenerator] Generated: "${result.title}"`);
  return result;
}

/**
 * Parse AI response text to extract JSON
 *
 * Handles cases where the AI might include text before/after the JSON
 */
function parseAIResponse(responseText: string): BlogGenerationAIResponse | null {
  // Try direct parse first
  try {
    return JSON.parse(responseText) as BlogGenerationAIResponse;
  } catch {
    // Continue to extraction methods
  }

  // Try to extract JSON from response
  // Look for JSON object pattern
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]) as BlogGenerationAIResponse;
    } catch {
      // Continue to next method
    }
  }

  // Try to find JSON between code fences
  const codeFenceMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeFenceMatch && codeFenceMatch[1]) {
    try {
      return JSON.parse(codeFenceMatch[1].trim()) as BlogGenerationAIResponse;
    } catch {
      // Continue
    }
  }

  console.error('[BlogGenerator] Failed to parse AI response:', responseText.slice(0, 500));
  return null;
}

/**
 * Ensure slug is URL-safe
 */
function ensureValidSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get list of available category names for error messages
 */
function getAvailableCategoriesList(): string {
  const categories = [
    'Comprehensive Eye Exams',
    'Contact Lenses',
    'Pediatrics',
    'Hot Topics',
    'Dry Eyes',
    'Eyeglasses & Vision Correction',
    'Myopia Management',
    'Disease',
    'Vision Therapy',
  ];
  return categories.join(', ');
}

/**
 * Format blog generation result for display
 *
 * Useful for CLI output or logging
 */
export function formatResultForDisplay(result: BlogGenerationResult): string {
  const lines = [
    '='.repeat(60),
    `BLOG POST GENERATED`,
    '='.repeat(60),
    '',
    `Title: ${result.title}`,
    `Slug: ${result.slug}`,
    `Category: ${result.topicCategory.categoryName}`,
    `Tags: ${result.tags.join(', ')}`,
    '',
    '-'.repeat(60),
    'EXCERPT',
    '-'.repeat(60),
    result.excerpt,
    '',
    '-'.repeat(60),
    'META DESCRIPTION',
    '-'.repeat(60),
    result.metaDescription,
    '',
    '-'.repeat(60),
    'CONTENT PREVIEW',
    '-'.repeat(60),
    result.content.slice(0, 500) + '...',
    '',
    '-'.repeat(60),
    'BIBLIOGRAPHY',
    '-'.repeat(60),
    result.bibliography,
    '',
    '-'.repeat(60),
    'INSTAGRAM CAPTION',
    '-'.repeat(60),
    result.instagramCaption,
    '',
    '-'.repeat(60),
    'INSTAGRAM CAROUSEL SLIDES',
    '-'.repeat(60),
    result.instagramCarouselSlides.map((slide, i) => `${i + 1}. ${slide}`).join('\n'),
    '',
    '-'.repeat(60),
    'FEATURED IMAGE SUGGESTION',
    '-'.repeat(60),
    result.featuredImageSuggestion,
    '',
    '='.repeat(60),
    `Generated at: ${result.generatedAt}`,
    `Model: ${result.modelInfo.provider}/${result.modelInfo.model}`,
    '='.repeat(60),
  ];

  return lines.join('\n');
}
