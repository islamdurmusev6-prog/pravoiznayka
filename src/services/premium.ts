import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PremiumStatus {
  isPremium: boolean;
  expiresAt: number | null;
  consultationsUsed: number;
  consultationsLimit: number;
}

const STORAGE_KEY = 'premium_status';
const FREE_CONSULTATIONS_LIMIT = 5;
const PREMIUM_CONSULTATIONS_LIMIT = 999999;

export const getPremiumStatus = async (): Promise<PremiumStatus> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const status = JSON.parse(stored);
      // Check if premium expired
      if (status.isPremium && status.expiresAt && status.expiresAt < Date.now()) {
        status.isPremium = false;
        status.expiresAt = null;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(status));
      }
      return status;
    }
    return {
      isPremium: false,
      expiresAt: null,
      consultationsUsed: 0,
      consultationsLimit: FREE_CONSULTATIONS_LIMIT,
    };
  } catch (error) {
    console.error('Error getting premium status:', error);
    return {
      isPremium: false,
      expiresAt: null,
      consultationsUsed: 0,
      consultationsLimit: FREE_CONSULTATIONS_LIMIT,
    };
  }
};

export const activatePremium = async (durationDays: number = 30) => {
  try {
    const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
    const status: PremiumStatus = {
      isPremium: true,
      expiresAt,
      consultationsUsed: 0,
      consultationsLimit: PREMIUM_CONSULTATIONS_LIMIT,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(status));
    return status;
  } catch (error) {
    console.error('Error activating premium:', error);
    throw error;
  }
};

export const incrementConsultationCount = async () => {
  try {
    const status = await getPremiumStatus();
    status.consultationsUsed += 1;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(status));
    return status;
  } catch (error) {
    console.error('Error incrementing consultation count:', error);
    throw error;
  }
};

export const canMakeConsultation = async (): Promise<boolean> => {
  try {
    const status = await getPremiumStatus();
    return status.consultationsUsed < status.consultationsLimit;
  } catch (error) {
    console.error('Error checking consultation limit:', error);
    return false;
  }
};

export const getRemainingConsultations = async (): Promise<number> => {
  try {
    const status = await getPremiumStatus();
    return status.consultationsLimit - status.consultationsUsed;
  } catch (error) {
    console.error('Error getting remaining consultations:', error);
    return 0;
  }
};
