import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'cache_';
const CACHE_EXPIRY_PREFIX = 'cache_expiry_';

export const cacheData = async (
  key: string,
  data: any,
  expiryMinutes: number = 60
) => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const expiryKey = `${CACHE_EXPIRY_PREFIX}${key}`;
    
    const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
    
    await AsyncStorage.multiSet([
      [cacheKey, JSON.stringify(data)],
      [expiryKey, expiryTime.toString()],
    ]);
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async (key: string): Promise<any | null> => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const expiryKey = `${CACHE_EXPIRY_PREFIX}${key}`;
    
    const [cachedData, expiryTime] = await AsyncStorage.multiGet([
      cacheKey,
      expiryKey,
    ]);

    if (!cachedData[1] || !expiryTime[1]) {
      return null;
    }

    // Check if cache expired
    if (Date.now() > parseInt(expiryTime[1])) {
      await AsyncStorage.multiRemove([cacheKey, expiryKey]);
      return null;
    }

    return JSON.parse(cachedData[1]);
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

export const clearCache = async (key?: string) => {
  try {
    if (key) {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const expiryKey = `${CACHE_EXPIRY_PREFIX}${key}`;
      await AsyncStorage.multiRemove([cacheKey, expiryKey]);
    } else {
      // Clear all cache
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(
        (k) => k.startsWith(CACHE_PREFIX) || k.startsWith(CACHE_EXPIRY_PREFIX)
      );
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Offline mode - cache frequently used data
export const cacheFrequentlyUsedData = async () => {
  try {
    // Cache categories
    const categories = require('../data/categories').categories;
    await cacheData('categories', categories, 24 * 60); // 24 hours

    // Cache contacts
    const contacts = require('../data/contacts').contacts;
    await cacheData('contacts', contacts, 24 * 60); // 24 hours

    // Cache templates
    const templates = require('../data/templates').templates;
    await cacheData('templates', templates, 24 * 60); // 24 hours
  } catch (error) {
    console.error('Error caching frequently used data:', error);
  }
};

export const getOfflineData = async () => {
  try {
    const categories = await getCachedData('categories');
    const contacts = await getCachedData('contacts');
    const templates = await getCachedData('templates');

    return {
      categories: categories || [],
      contacts: contacts || [],
      templates: templates || [],
    };
  } catch (error) {
    console.error('Error getting offline data:', error);
    return {
      categories: [],
      contacts: [],
      templates: [],
    };
  }
};
