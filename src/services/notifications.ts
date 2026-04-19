import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';

export const initializeNotifications = async () => {
  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    return true;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
};

export const enableNotifications = async () => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'true');
  } catch (error) {
    console.error('Error enabling notifications:', error);
  }
};

export const disableNotifications = async () => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
  } catch (error) {
    console.error('Error disabling notifications:', error);
  }
};

export const areNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking notifications:', error);
    return false;
  }
};

export const sendNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  try {
    const enabled = await areNotificationsEnabled();
    if (!enabled) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const scheduleNotification = async (
  title: string,
  body: string,
  delaySeconds: number,
  data?: Record<string, any>
) => {
  try {
    const enabled = await areNotificationsEnabled();
    if (!enabled) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: {
        seconds: delaySeconds,
      },
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

// Law update notifications
export const notifyLawUpdate = async (lawName: string, description: string) => {
  await sendNotification(
    '⚖️ Изменение в законодательстве',
    `${lawName}: ${description}`,
    { type: 'law_update' }
  );
};

// Consultation reminder
export const notifyConsultationReminder = async () => {
  await sendNotification(
    '💡 Совет ПравоЗнайки',
    'Не забудьте сохранить важные консультации в избранное',
    { type: 'reminder' }
  );
};

// Premium expiration warning
export const notifyPremiumExpiring = async (daysLeft: number) => {
  await sendNotification(
    '⏰ Премиум истекает',
    `Ваша подписка Premium истекает через ${daysLeft} дней`,
    { type: 'premium_expiring' }
  );
};
