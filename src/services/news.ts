/**
 * FinSuite OS - News Services
 * HackerNews, Dev.to, and general news APIs
 */

import axios from 'axios';

// ============================================
// HACKERNEWS API
// ============================================

const HN_BASE = 'https://hacker-news.firebaseio.com/v0';

export interface HNStory {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  time: number;
  descendants: number;
  type: string;
}

/**
 * Get top HackerNews stories
 */
export async function getHNTopStories(limit: number = 30): Promise<HNStory[]> {
  try {
    const idsResponse = await axios.get(`${HN_BASE}/topstories.json`);
    const ids = idsResponse.data.slice(0, limit);

    const stories = await Promise.all(
      ids.map(async (id: number) => {
        const storyResponse = await axios.get(`${HN_BASE}/item/${id}.json`);
        return storyResponse.data;
      })
    );

    return stories.filter((s: HNStory | null) => s && s.type === 'story');
  } catch (error) {
    console.error('HN Top Stories Error:', error);
    return [];
  }
}

/**
 * Get newest HackerNews stories
 */
export async function getHNNewStories(limit: number = 30): Promise<HNStory[]> {
  try {
    const idsResponse = await axios.get(`${HN_BASE}/newstories.json`);
    const ids = idsResponse.data.slice(0, limit);

    const stories = await Promise.all(
      ids.map(async (id: number) => {
        const storyResponse = await axios.get(`${HN_BASE}/item/${id}.json`);
        return storyResponse.data;
      })
    );

    return stories.filter((s: HNStory | null) => s && s.type === 'story');
  } catch (error) {
    console.error('HN New Stories Error:', error);
    return [];
  }
}

/**
 * Get best HackerNews stories
 */
export async function getHNBestStories(limit: number = 30): Promise<HNStory[]> {
  try {
    const idsResponse = await axios.get(`${HN_BASE}/beststories.json`);
    const ids = idsResponse.data.slice(0, limit);

    const stories = await Promise.all(
      ids.map(async (id: number) => {
        const storyResponse = await axios.get(`${HN_BASE}/item/${id}.json`);
        return storyResponse.data;
      })
    );

    return stories.filter((s: HNStory | null) => s && s.type === 'story');
  } catch (error) {
    console.error('HN Best Stories Error:', error);
    return [];
  }
}

// ============================================
// DEV.TO API
// ============================================

const DEVTO_BASE = 'https://dev.to/api';

export interface DevArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  social_image: string;
  readable_publish_date: string;
  published_timestamp: string;
  comments_count: number;
  positive_reactions_count: number;
  reading_time_minutes: number;
  tag_list: string[];
  user: {
    name: string;
    username: string;
    profile_image: string;
  };
}

/**
 * Get latest Dev.to articles
 */
export async function getDevArticles(
  page: number = 1,
  perPage: number = 20
): Promise<DevArticle[]> {
  try {
    const response = await axios.get(`${DEVTO_BASE}/articles`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error('Dev.to Error:', error);
    return [];
  }
}

/**
 * Get Dev.to articles by tag
 */
export async function getDevArticlesByTag(
  tag: string,
  page: number = 1,
  perPage: number = 20
): Promise<DevArticle[]> {
  try {
    const response = await axios.get(`${DEVTO_BASE}/articles`, {
      params: { tag, page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error('Dev.to Tag Error:', error);
    return [];
  }
}

/**
 * Search Dev.to articles
 */
export async function searchDevArticles(query: string, page: number = 1): Promise<DevArticle[]> {
  try {
    // Dev.to doesn't have a direct search API, so we filter locally
    const articles = await getDevArticles(page, 100);
    const lowerQuery = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.description?.toLowerCase().includes(lowerQuery) ||
        a.tag_list.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Dev.to Search Error:', error);
    return [];
  }
}

// ============================================
// WIKIPEDIA API
// ============================================

const WIKI_BASE = 'https://en.wikipedia.org/api/rest_v1';

export interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: { page: string };
    mobile: { page: string };
  };
}

/**
 * Get Wikipedia summary for a topic
 */
export async function getWikiSummary(topic: string): Promise<WikiSummary | null> {
  try {
    const encodedTopic = encodeURIComponent(topic.replace(/ /g, '_'));
    const response = await axios.get(`${WIKI_BASE}/page/summary/${encodedTopic}`);
    return response.data;
  } catch (error) {
    console.error('Wikipedia Error:', error);
    return null;
  }
}

/**
 * Search Wikipedia
 */
export async function searchWiki(
  query: string,
  limit: number = 10
): Promise<Array<{ title: string; snippet: string }>> {
  try {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: limit,
        format: 'json',
        origin: '*',
      },
    });
    return response.data.query?.search || [];
  } catch (error) {
    console.error('Wiki Search Error:', error);
    return [];
  }
}

// ============================================
// CRYPTO NEWS (from CoinGecko trending)
// ============================================

export interface CryptoNewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  timestamp: string;
}

/**
 * Get crypto-related news
 * Using CoinGecko trending as a proxy for crypto news
 */
export async function getCryptoNews(): Promise<CryptoNewsItem[]> {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
    const coins = response.data.coins || [];

    // Transform trending coins into news-like format
    return coins.map(
      (item: { item: { id: string; name: string; symbol: string; market_cap_rank: number } }) => ({
        id: item.item.id,
        title: `${item.item.name} (${item.item.symbol.toUpperCase()}) is trending`,
        description: `Ranked #${item.item.market_cap_rank} by market cap. Currently trending on CoinGecko.`,
        url: `https://www.coingecko.com/en/coins/${item.item.id}`,
        source: 'CoinGecko Trending',
        timestamp: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error('Crypto News Error:', error);
    return [];
  }
}

// ============================================
// AI NEWS (DEV.TO with AI tag)
// ============================================

/**
 * Get AI-related articles from Dev.to
 */
export async function getAINews(page: number = 1): Promise<DevArticle[]> {
  const aiTags = ['ai', 'machinelearning', 'artificialintelligence', 'deeplearning', 'llm'];
  const allArticles: DevArticle[] = [];

  try {
    // Fetch articles for each AI-related tag
    for (const tag of aiTags.slice(0, 2)) {
      // Limit to 2 tags to avoid rate limiting
      const articles = await getDevArticlesByTag(tag, page, 10);
      allArticles.push(...articles);
    }

    // Remove duplicates and sort by date
    const uniqueArticles = Array.from(new Map(allArticles.map((a) => [a.id, a])).values());

    return uniqueArticles.sort(
      (a, b) =>
        new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime()
    );
  } catch (error) {
    console.error('AI News Error:', error);
    return [];
  }
}
