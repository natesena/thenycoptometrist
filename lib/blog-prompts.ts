/**
 * Blog Prompt Templates
 *
 * System prompts and user prompts for AI blog generation.
 * Follows Dr. Latek's content guidelines for educational,
 * authoritative eye care content.
 *
 * Reference: AI Blog Generation System Plan - Step 4
 */

import type { TopicCategory } from './blog-topics';

/**
 * System prompt establishing Dr. Latek's persona and content guidelines
 *
 * Key requirements:
 * - Educational, authoritative tone
 * - Citations from peer-reviewed or government sources
 * - SEO optimization
 * - MLA bibliography format (no access dates)
 */
export const BLOG_GENERATION_SYSTEM_PROMPT = `You are a content writer for Dr. Joanna Latek, a licensed optometrist practicing in New York City. You write educational blog posts about eye health and vision care.

## Writing Style Guidelines

### Tone
- Professional yet approachable
- Educational and informative
- Empathetic to patient concerns
- Authoritative without being condescending
- Use "we" when referring to the practice, "you" when addressing readers

### Voice
- Clear, concise explanations
- Avoid jargon; explain medical terms when used
- Use active voice
- Include practical, actionable advice
- Balance scientific accuracy with accessibility

## Content Requirements

### Citations
- ONLY cite peer-reviewed medical journals or government health websites published within the LAST 5 YEARS (2021-2026)
- Acceptable sources: NIH, CDC, AAO (American Academy of Ophthalmology), AOA (American Optometric Association), PubMed, peer-reviewed journals
- Include 3-5 citations minimum per post
- All citations MUST be from 2021 or later - do not use older sources
- Format inline citations as (Author, Year) or (Organization, Year)

### SEO Optimization
- Title: 50-60 characters, include primary keyword
- Meta description: 150-160 characters, compelling and keyword-rich
- Use H2 and H3 headings to structure content
- Include primary keyword in first paragraph
- Natural keyword distribution throughout
- Include internal link suggestions to relevant services

### Structure
- Opening hook that addresses reader's concern or question
- Clear problem/solution format
- Organized sections with descriptive headings
- Practical takeaways
- Call-to-action mentioning scheduling an eye exam with Dr. Latek

## Output Format

You must output a JSON object with the following structure:

{
  "title": "SEO-optimized title (50-60 chars)",
  "slug": "url-friendly-slug-from-title",
  "excerpt": "1-2 sentence summary for blog listing (max 200 chars)",
  "metaDescription": "SEO meta description (150-160 chars)",
  "content": "Full blog post content in Markdown format with citations",
  "bibliography": "MLA format bibliography (no access dates)",
  "instagramCaption": "Engaging Instagram caption (max 300 chars) with relevant hashtags",
  "instagramCarouselSlides": ["Slide 1 content", "Slide 2 content", "Slide 3 content", "Slide 4 content", "Slide 5 content"],
  "featuredImageSuggestion": "Description of ideal featured image for the post"
}

## Bibliography Format (MLA, no access dates)

Example format:
- Author Last, First. "Article Title." Journal Name, vol. X, no. X, Year, pp. XX-XX.
- Organization. "Article Title." Website Name, Day Month Year, URL.

Do not include "Accessed [date]" in citations.`;

/**
 * Generate the user prompt for a specific topic
 */
export function generateBlogUserPrompt(
  topicCategory: TopicCategory,
  specificTopic?: string
): string {
  const topicInstruction = specificTopic
    ? `Write a blog post about "${specificTopic}" within the ${topicCategory.categoryName} category.`
    : `Write a blog post about one of these topics in the ${topicCategory.categoryName} category:\n${topicCategory.exampleSubtopics.map((subtopic) => `- ${subtopic}`).join('\n')}\n\nChoose the most engaging and timely topic.`;

  return `${topicInstruction}

## Category Context
${topicCategory.categoryDescription}

## Requirements
1. Write an engaging, educational blog post (800-1200 words)
2. Include at least 3 peer-reviewed or government source citations
3. Structure with clear H2/H3 headings
4. Include practical advice readers can use
5. End with a call-to-action to schedule an exam with Dr. Latek at The NYC Optometrist
6. Create Instagram content (caption + 5-7 carousel slides)
7. Suggest an appropriate featured image

## Location Context
Dr. Latek serves patients in all five NYC boroughs from her Manhattan practice. Mention NYC when relevant but keep content broadly applicable.

## Output
Respond ONLY with the JSON object as specified in the system prompt. No additional text.`;
}

/**
 * Generate a prompt for regenerating specific sections
 */
export function generateRegenerationPrompt(
  originalContent: string,
  sectionToRegenerate: 'title' | 'instagram' | 'excerpt' | 'bibliography'
): string {
  const sectionInstructions = {
    title:
      'Generate 3 alternative SEO-optimized titles for this blog post. Each should be 50-60 characters and include the primary keyword.',
    instagram:
      'Generate a new Instagram caption (max 300 chars with hashtags) and 5 new carousel slide ideas for this blog post.',
    excerpt:
      'Generate 3 alternative excerpt options for this blog post. Each should be 1-2 sentences (max 200 chars) that entice readers.',
    bibliography:
      'Review and improve the bibliography. Ensure all citations are in proper MLA format without access dates.',
  };

  return `Based on this blog post content:

${originalContent}

${sectionInstructions[sectionToRegenerate]}

Output your response as a JSON object with the regenerated content.`;
}

/**
 * Expected JSON structure from the AI model
 */
export interface BlogGenerationAIResponse {
  title: string;
  slug: string;
  excerpt: string;
  metaDescription: string;
  content: string;
  bibliography: string;
  instagramCaption: string;
  instagramCarouselSlides: string[];
  featuredImageSuggestion: string;
}

/**
 * Validate AI response has all required fields
 */
export function validateAIResponse(
  response: unknown
): response is BlogGenerationAIResponse {
  if (typeof response !== 'object' || response === null) {
    return false;
  }

  const requiredFields = [
    'title',
    'slug',
    'excerpt',
    'metaDescription',
    'content',
    'bibliography',
    'instagramCaption',
    'instagramCarouselSlides',
    'featuredImageSuggestion',
  ];

  for (const field of requiredFields) {
    if (!(field in response)) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  const typedResponse = response as BlogGenerationAIResponse;

  // Validate types
  if (typeof typedResponse.title !== 'string') return false;
  if (typeof typedResponse.slug !== 'string') return false;
  if (typeof typedResponse.excerpt !== 'string') return false;
  if (typeof typedResponse.metaDescription !== 'string') return false;
  if (typeof typedResponse.content !== 'string') return false;
  if (typeof typedResponse.bibliography !== 'string') return false;
  if (typeof typedResponse.instagramCaption !== 'string') return false;
  if (!Array.isArray(typedResponse.instagramCarouselSlides)) return false;
  if (typeof typedResponse.featuredImageSuggestion !== 'string') return false;

  return true;
}
