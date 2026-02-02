/**
 * FinSuite OS - Utility Services
 * Weather, IP, Datamuse, and other utility APIs
 */

import axios from 'axios';

// ============================================
// OPEN-METEO API (Weather)
// ============================================

const METEO_BASE = 'https://api.open-meteo.com/v1';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  timezone: string;
  hourly: {
    time: string[];
    temperature: number[];
    humidity: number[];
  };
  daily: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    weatherCode: number[];
  };
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

/**
 * Get weather forecast for a location
 */
export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const response = await axios.get(`${METEO_BASE}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
        hourly: 'temperature_2m,relative_humidity_2m',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code',
        timezone: 'auto',
      },
    });

    const data = response.data;
    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      timezone: data.timezone,
      hourly: {
        time: data.hourly.time,
        temperature: data.hourly.temperature_2m,
        humidity: data.hourly.relative_humidity_2m,
      },
      daily: {
        time: data.daily.time,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
        weatherCode: data.daily.weather_code,
      },
    };
  } catch (error) {
    console.error('Weather Error:', error);
    return null;
  }
}

/**
 * Geocode a city name to coordinates
 */
export async function geocodeCity(
  city: string
): Promise<GeoLocation | null> {
  try {
    const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: city, count: 1 },
    });

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        city: result.name,
        country: result.country,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocode Error:', error);
    return null;
  }
}

/**
 * Get weather description from code
 */
export function getWeatherDescription(code: number): string {
  const codes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail',
  };
  return codes[code] || 'Unknown';
}

/**
 * Get weather icon from code
 */
export function getWeatherIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 3) return isDay ? '⛅' : '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌧️';
  if (code <= 65) return '🌧️';
  if (code <= 75) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

// ============================================
// IP-API (Geolocation)
// ============================================

export interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  isp: string;
  org: string;
  as: string;
  lat: number;
  lon: number;
  timezone: string;
  zip: string;
}

/**
 * Get IP information and geolocation
 */
export async function getIPInfo(): Promise<IPInfo | null> {
  try {
    const response = await axios.get('http://ip-api.com/json/', {
      params: {
        fields: 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query',
      },
    });

    if (response.data.status === 'success') {
      return {
        ip: response.data.query,
        city: response.data.city,
        region: response.data.regionName,
        country: response.data.country,
        countryCode: response.data.countryCode,
        isp: response.data.isp,
        org: response.data.org,
        as: response.data.as,
        lat: response.data.lat,
        lon: response.data.lon,
        timezone: response.data.timezone,
        zip: response.data.zip,
      };
    }
    return null;
  } catch (error) {
    console.error('IP API Error:', error);
    return null;
  }
}

// ============================================
// DATAMUSE API (Words & Synonyms)
// ============================================

const DATAMUSE_BASE = 'https://api.datamuse.com';

export interface WordResult {
  word: string;
  score: number;
  tags?: string[];
  defs?: string[];
}

/**
 * Get synonyms for a word
 */
export async function getSynonyms(word: string, limit: number = 20): Promise<WordResult[]> {
  try {
    const response = await axios.get(`${DATAMUSE_BASE}/words`, {
      params: { rel_syn: word, max: limit, md: 'd' },
    });
    return response.data;
  } catch (error) {
    console.error('Datamuse Synonym Error:', error);
    return [];
  }
}

/**
 * Get rhyming words
 */
export async function getRhymes(word: string, limit: number = 20): Promise<WordResult[]> {
  try {
    const response = await axios.get(`${DATAMUSE_BASE}/words`, {
      params: { rel_rhy: word, max: limit },
    });
    return response.data;
  } catch (error) {
    console.error('Datamuse Rhyme Error:', error);
    return [];
  }
}

/**
 * Get words that sound like the given word
 */
export async function getSoundsLike(word: string, limit: number = 20): Promise<WordResult[]> {
  try {
    const response = await axios.get(`${DATAMUSE_BASE}/words`, {
      params: { sl: word, max: limit },
    });
    return response.data;
  } catch (error) {
    console.error('Datamuse SoundsLike Error:', error);
    return [];
  }
}

/**
 * Get words that mean like the given word
 */
export async function getMeansLike(word: string, limit: number = 20): Promise<WordResult[]> {
  try {
    const response = await axios.get(`${DATAMUSE_BASE}/words`, {
      params: { ml: word, max: limit, md: 'd' },
    });
    return response.data;
  } catch (error) {
    console.error('Datamuse MeansLike Error:', error);
    return [];
  }
}

/**
 * Autocomplete words
 */
export async function autocompleteWord(prefix: string, limit: number = 10): Promise<WordResult[]> {
  try {
    const response = await axios.get(`${DATAMUSE_BASE}/sug`, {
      params: { s: prefix, max: limit },
    });
    return response.data;
  } catch (error) {
    console.error('Datamuse Autocomplete Error:', error);
    return [];
  }
}

// ============================================
// PASSWORD GENERATOR
// ============================================

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

/**
 * Generate a secure password
 */
export function generatePassword(options: PasswordOptions): string {
  const { length, uppercase, lowercase, numbers, symbols } = options;

  let chars = '';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
}

/**
 * Calculate password strength
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: 'Weak', color: '#FF3B30' };
  if (score <= 4) return { score, label: 'Fair', color: '#FF9500' };
  if (score <= 5) return { score, label: 'Good', color: '#FFCC00' };
  return { score, label: 'Strong', color: '#34C759' };
}

// ============================================
// SPEED TEST (Simulated)
// ============================================

export interface SpeedTestResult {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
}

/**
 * Simulate a speed test
 * In production, use a real speed test service
 */
export async function runSpeedTest(): Promise<SpeedTestResult> {
  // Simulated test - in production, use actual network requests
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    downloadMbps: Math.round((50 + Math.random() * 100) * 10) / 10,
    uploadMbps: Math.round((20 + Math.random() * 50) * 10) / 10,
    pingMs: Math.round(10 + Math.random() * 40),
    jitterMs: Math.round(1 + Math.random() * 5),
  };
}

// ============================================
// QR CODE GENERATION
// ============================================

/**
 * Generate QR code URL using a public API
 */
export function generateQRCode(
  data: string,
  size: number = 200
): string {
  const encodedData = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}`;
}

// ============================================
// FAVICON GRABBER
// ============================================

/**
 * Get favicon URL for a website
 */
export function getFaviconUrl(domain: string): string {
  // Using Google's favicon service
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
