/**
 * AI Provider Setup
 *
 * Provider-agnostic AI client using Vercel AI SDK.
 * Supports z.ai, OpenAI, Anthropic, and OpenRouter through
 * OpenAI-compatible interface.
 *
 * Reference: AI Blog Generation System Plan
 */

import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import type { LanguageModel } from 'ai';

// Supported AI providers
export type AIProviderName = 'zai' | 'openai' | 'anthropic' | 'openrouter';

// Provider configuration interface
interface ProviderConfig {
  name: string;
  baseURL: string;
  apiKeyEnvVar: string;
  defaultModel: string;
}

// Provider configurations
// Reference: AI Blog Generation System Plan - Provider setup
const PROVIDER_CONFIGS: Record<AIProviderName, ProviderConfig> = {
  zai: {
    name: 'z.ai',
    // Z.AI Coding Plan endpoint (GLM-4.7)
    // Reference: https://docs.z.ai/guides/develop/http/introduction
    baseURL: 'https://api.z.ai/api/coding/paas/v4',
    apiKeyEnvVar: 'Z_AI_API_KEY',
    defaultModel: 'glm-4.7',
  },
  openai: {
    name: 'openai',
    baseURL: 'https://api.openai.com/v1',
    apiKeyEnvVar: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4o',
  },
  anthropic: {
    name: 'anthropic',
    baseURL: 'https://api.anthropic.com/v1',
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
    defaultModel: 'claude-sonnet-4-20250514',
  },
  openrouter: {
    name: 'openrouter',
    baseURL: 'https://openrouter.ai/api/v1',
    apiKeyEnvVar: 'OPENROUTER_API_KEY',
    defaultModel: 'anthropic/claude-sonnet-4-20250514',
  },
};

/**
 * Get the current AI provider name from environment
 */
export function getProviderName(): AIProviderName {
  const providerEnvValue = process.env.AI_PROVIDER || 'zai';

  // Validate provider name
  if (!Object.keys(PROVIDER_CONFIGS).includes(providerEnvValue)) {
    console.warn(
      `Unknown AI_PROVIDER "${providerEnvValue}", falling back to "zai"`
    );
    return 'zai';
  }

  return providerEnvValue as AIProviderName;
}

/**
 * Get API key for a provider
 */
function getApiKey(providerName: AIProviderName): string {
  const providerConfig = PROVIDER_CONFIGS[providerName];
  const apiKey = process.env[providerConfig.apiKeyEnvVar];

  if (!apiKey) {
    throw new Error(
      `${providerConfig.apiKeyEnvVar} is not configured. ` +
      `Please set it in your environment variables.`
    );
  }

  return apiKey;
}

/**
 * Create an AI provider client
 *
 * Uses OpenAI-compatible interface for all providers since z.ai,
 * OpenRouter, and OpenAI all follow the same API structure.
 */
export function createAIProvider(providerName?: AIProviderName) {
  const activeProviderName = providerName || getProviderName();
  const providerConfig = PROVIDER_CONFIGS[activeProviderName];
  const apiKey = getApiKey(activeProviderName);

  const provider = createOpenAICompatible({
    name: providerConfig.name,
    baseURL: providerConfig.baseURL,
    apiKey,
  });

  return provider;
}

/**
 * Get the AI model to use
 *
 * Returns a LanguageModelV1 instance configured with the
 * active provider and model.
 */
export function getAIModel(modelOverride?: string): LanguageModel {
  const providerName = getProviderName();
  const providerConfig = PROVIDER_CONFIGS[providerName];
  const provider = createAIProvider(providerName);

  // Use override, env var, or default model
  const modelId = modelOverride || process.env.AI_MODEL || providerConfig.defaultModel;

  return provider(modelId);
}

/**
 * Get model info for logging/debugging
 */
export function getModelInfo(): { provider: string; model: string } {
  const providerName = getProviderName();
  const providerConfig = PROVIDER_CONFIGS[providerName];
  const modelId = process.env.AI_MODEL || providerConfig.defaultModel;

  return {
    provider: providerConfig.name,
    model: modelId,
  };
}
