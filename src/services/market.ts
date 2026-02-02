/**
 * FinSuite OS - Market Services
 * CoinGecko, Frankfurter, WallStreetBets APIs
 */

import axios from 'axios';

// ============================================
// COINGECKO API (Crypto)
// ============================================

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  sparkline_in_7d?: { price: number[] };
}

export interface CryptoDetails {
  id: string;
  symbol: string;
  name: string;
  description: { en: string };
  image: { large: string };
  market_data: {
    current_price: { usd: number; inr: number };
    market_cap: { usd: number; inr: number };
    total_volume: { usd: number; inr: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    ath: { usd: number; inr: number };
    atl: { usd: number; inr: number };
  };
}

/**
 * Get top cryptocurrencies by market cap
 */
export async function getTopCryptos(
  limit: number = 50,
  currency: string = 'inr'
): Promise<CryptoPrice[]> {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
      },
    });
    return response.data;
  } catch (error) {
    console.error('CoinGecko Error:', error);
    return [];
  }
}

/**
 * Get detailed info for a specific coin
 */
export async function getCryptoDetails(coinId: string): Promise<CryptoDetails | null> {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('CoinGecko Detail Error:', error);
    return null;
  }
}

/**
 * Get price history for charts
 */
export async function getCryptoPriceHistory(
  coinId: string,
  days: number = 30,
  currency: string = 'inr'
): Promise<{ prices: [number, number][] }> {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
        days: days,
      },
    });
    return response.data;
  } catch (error) {
    console.error('CoinGecko History Error:', error);
    return { prices: [] };
  }
}

/**
 * Search cryptocurrencies
 */
export async function searchCrypto(query: string): Promise<Array<{ id: string; name: string; symbol: string }>> {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/search`, {
      params: { query },
    });
    return response.data.coins || [];
  } catch (error) {
    console.error('CoinGecko Search Error:', error);
    return [];
  }
}

/**
 * Get Bitcoin price for Satoshi converter
 */
export async function getBitcoinPrice(currency: string = 'inr'): Promise<number> {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/simple/price`, {
      params: {
        ids: 'bitcoin',
        vs_currencies: currency,
      },
    });
    return response.data.bitcoin[currency] || 0;
  } catch (error) {
    console.error('Bitcoin Price Error:', error);
    return 0;
  }
}

// ============================================
// FRANKFURTER API (Currency Exchange)
// ============================================

const FRANKFURTER_BASE = 'https://api.frankfurter.app';

export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

/**
 * Get latest exchange rates
 */
export async function getExchangeRates(baseCurrency: string = 'INR'): Promise<ExchangeRates> {
  try {
    const response = await axios.get(`${FRANKFURTER_BASE}/latest`, {
      params: { from: baseCurrency },
    });
    return response.data;
  } catch (error) {
    console.error('Frankfurter Error:', error);
    return { base: baseCurrency, date: '', rates: {} };
  }
}

/**
 * Convert currency
 */
export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  try {
    const response = await axios.get(`${FRANKFURTER_BASE}/latest`, {
      params: { amount, from, to },
    });
    return response.data.rates[to] || 0;
  } catch (error) {
    console.error('Currency Conversion Error:', error);
    return 0;
  }
}

/**
 * Get available currencies
 */
export async function getAvailableCurrencies(): Promise<Record<string, string>> {
  try {
    const response = await axios.get(`${FRANKFURTER_BASE}/currencies`);
    return response.data;
  } catch (error) {
    console.error('Currencies Error:', error);
    return {};
  }
}

/**
 * Get historical exchange rates
 */
export async function getHistoricalRates(
  startDate: string,
  endDate: string,
  base: string = 'INR',
  symbols: string = 'USD,EUR,GBP'
): Promise<{ rates: Record<string, Record<string, number>> }> {
  try {
    const response = await axios.get(`${FRANKFURTER_BASE}/${startDate}..${endDate}`, {
      params: { from: base, to: symbols },
    });
    return response.data;
  } catch (error) {
    console.error('Historical Rates Error:', error);
    return { rates: {} };
  }
}

// ============================================
// WALLSTREETBETS / REDDIT API (Sentiment)
// ============================================

const WSB_API = 'https://tradestie.com/api/v1/apps/reddit';

export interface StockSentiment {
  ticker: string;
  no_of_comments: number;
  sentiment: 'Bullish' | 'Bearish';
  sentiment_score: number;
}

/**
 * Get WallStreetBets trending stocks
 */
export async function getWSBSentiment(): Promise<StockSentiment[]> {
  try {
    const response = await axios.get(WSB_API);
    return response.data || [];
  } catch (error) {
    console.error('WSB API Error:', error);
    return [];
  }
}

// ============================================
// GOLD PRICE (via proxy - simplified)
// ============================================

export interface GoldPrice {
  price_per_gram: number;
  price_per_10g: number;
  price_per_oz: number;
  currency: string;
  timestamp: string;
}

/**
 * Get current gold price (simulated for demo)
 * In production, use a real gold price API
 */
export async function getGoldPrice(): Promise<GoldPrice> {
  // Simulated gold price - in production, use real API
  const basePrice = 6500; // Approximate INR per gram
  const variation = Math.random() * 100 - 50;
  const pricePerGram = basePrice + variation;

  return {
    price_per_gram: Math.round(pricePerGram),
    price_per_10g: Math.round(pricePerGram * 10),
    price_per_oz: Math.round(pricePerGram * 31.1035),
    currency: 'INR',
    timestamp: new Date().toISOString(),
  };
}
