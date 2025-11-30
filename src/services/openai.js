/**
 * OpenAI API Service for AI Topic Generation
 * Handles secure API calls to ChatGPT for generating work topics
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Cache keys
const TOPIC_CACHE_PREFIX = 'ai_topics_';
const CACHE_EXPIRY_HOURS = 24;

class OpenAIService {
  constructor() {
    // Get API key from environment variables only
    this.apiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY || null;
    this.baseUrl = 'https://api.openai.com/v1';
    this.model = 'gpt-4o-mini';
    
    // Rate limiting
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000; // 1 second between requests
    
    // Warning if no API key
    if (!this.apiKey) {
      console.warn('⚠️ OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.');
    }
  }

  /**
   * Log connection status and API interactions
   */
  logConnection(message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data) : null,
    };
    
    console.log(`[OpenAI Service] ${timestamp}: ${message}`);
    if (data) {
      console.log(`[OpenAI Service] Data:`, data);
    }

    // Store logs locally for debugging
    this.storeLog(logEntry);
  }

  /**
   * Store logs locally for debugging
   */
  async storeLog(logEntry) {
    try {
      const existingLogs = await AsyncStorage.getItem('openai_logs') || '[]';
      const logs = JSON.parse(existingLogs);
      logs.push(logEntry);
      
      // Keep only last 50 log entries
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }
      
      await AsyncStorage.setItem('openai_logs', JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to store log:', error);
    }
  }

  /**
   * Get cached topics for a field+role combination
   */
  async getCachedTopics(field, role) {
    try {
      const cacheKey = `${TOPIC_CACHE_PREFIX}${field}_${role}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (cached) {
        const { topics, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        const maxAge = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
        
        if (age < maxAge) {
          this.logConnection(`Using cached topics for ${field}/${role}`, { topics });
          return topics;
        } else {
          // Cache expired, remove it
          await AsyncStorage.removeItem(cacheKey);
          this.logConnection(`Cache expired for ${field}/${role}, removed`);
        }
      }
    } catch (error) {
      this.logConnection('Cache retrieval failed', { error: error.message });
    }
    
    return null;
  }

  /**
   * Cache topics for a field+role combination
   */
  async cacheTopics(field, role, topics) {
    try {
      const cacheKey = `${TOPIC_CACHE_PREFIX}${field}_${role}`;
      const cacheData = {
        topics,
        timestamp: Date.now(),
      };
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      this.logConnection(`Cached topics for ${field}/${role}`, { topics });
    } catch (error) {
      this.logConnection('Cache storage failed', { error: error.message });
    }
  }

  /**
   * Generate AI-recommended work topics based on field and role
   */
  async generateTopics(field, role) {
    this.logConnection(`Starting topic generation for ${field}/${role}`);
    
    try {
      // Rate limiting check
      const now = Date.now();
      if (now - this.lastRequestTime < this.minRequestInterval) {
        const waitTime = this.minRequestInterval - (now - this.lastRequestTime);
        this.logConnection(`Rate limiting: waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      // Check cache first
      const cachedTopics = await this.getCachedTopics(field, role);
      if (cachedTopics) {
        return cachedTopics;
      }

      // Validate API key
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured. Please check your environment variables.');
      }

      this.logConnection('Making API request to OpenAI');
      this.lastRequestTime = Date.now();

      // Create prompt for topic generation
      const prompt = this.createTopicPrompt(field, role);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a creative assistant that generates relevant work topics for professionals. Generate 5-7 specific, actionable topic ideas that are relevant to the field and role. Each topic should be concise (max 60 characters) and practical.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      this.logConnection('API response received', { status: response.status });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const topics = this.parseTopicsFromResponse(data);
      
      this.logConnection(`Successfully generated ${topics.length} topics`, { topics });
      
      // Cache the results
      await this.cacheTopics(field, role, topics);
      
      return topics;

    } catch (error) {
      this.logConnection('Topic generation failed', { 
        error: error.message,
        field,
        role 
      });
      
      // Return fallback topics on error
      return this.getFallbackTopics(field, role);
    }
  }

  /**
   * Create prompt for topic generation based on field and role
   */
  createTopicPrompt(field, role) {
    return `Generate 5-7 relevant work topics for a ${role} working in ${field}. 

Field: ${field}
Role: ${role}

The topics should be:
- Specific and actionable
- Relevant to current industry trends
- Practical for daily work
- Concise ( max 60 characters each)

Please provide the topics as a numbered list, each on a new line.`;
  }

  /**
   * Parse topics from OpenAI response
   */
  parseTopicsFromResponse(data) {
    try {
      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in API response');
      }

      // Parse numbered list or bullet points
      const lines = content.split('\n').filter(line => line.trim());
      const topics = lines
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim())
        .filter(topic => topic.length > 0 && topic.length <= 100)
        .slice(0, 7); // Limit to 7 topics

      return topics.length > 0 ? topics : this.getFallbackTopics();
    } catch (error) {
      this.logConnection('Failed to parse API response', { error: error.message });
      return this.getFallbackTopics();
    }
  }

  /**
   * Get fallback topics when API fails
   */
  getFallbackTopics(field = null, role = null) {
    const fallbackTopics = [
      '최신 트렌드 분석',
      '경쟁사 리서치',
      '타겟 고객 분석',
      '성공 사례 연구',
      '문제 해결 방안',
      '혁신적인 아이디어',
      '비용 효율화',
    ];

    this.logConnection('Using fallback topics', { field, role });
    return fallbackTopics;
  }

  /**
   * Get connection logs for debugging
   */
  async getLogs() {
    try {
      const logs = await AsyncStorage.getItem('openai_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      this.logConnection('Failed to retrieve logs', { error: error.message });
      return [];
    }
  }

  /**
   * Clear all logs and cache
   */
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const openaiKeys = keys.filter(key => 
        key.startsWith(TOPIC_CACHE_PREFIX) || key === 'openai_logs'
      );
      await AsyncStorage.multiRemove(openaiKeys);
      this.logConnection('Cache and logs cleared');
    } catch (error) {
      this.logConnection('Failed to clear cache', { error: error.message });
    }
  }
}

export default new OpenAIService();
