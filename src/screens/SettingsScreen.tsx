import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme, setTheme } from '../services/theme';
import { areNotificationsEnabled, enableNotifications, disableNotifications } from '../services/notifications';
import { clearCache } from '../services/cache';

const SettingsScreen = ({ navigation }: any) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const currentTheme = await getTheme();
    setThemeState(currentTheme);

    const notifEnabled = await areNotificationsEnabled();
    setNotificationsEnabledState(notifEnabled);
  };

  const handleThemeChange = async (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setThemeState(newTheme);
    await setTheme(newTheme);
  };

  const handleNotificationsChange = async (value: boolean) => {
    setNotificationsEnabledState(value);
    if (value) {
      await enableNotifications();
    } else {
      await disableNotifications();
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Очистить кэш',
      'Это удалит все сохранённые данные для оффлайн-режима',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            await clearCache();
            Alert.alert('Успех', 'Кэш очищен');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'О приложении',
      'ПравоЗнайка v1.0.0\n\nБесплатный юридический помощник для граждан России\n\n© 2025 ПравоЗнайка'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Настройки</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Внешний вид</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="moon" size={20} color="#1e40af" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Тёмный режим</Text>
              <Text style={styles.settingDesc}>Удобно использовать вечером</Text>
            </View>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={handleThemeChange}
            trackColor={{ false: '#d1d5db', true: '#1e40af' }}
            thumbColor={theme === 'dark' ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Уведомления</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="notifications" size={20} color="#1e40af" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Уведомления</Text>
              <Text style={styles.settingDesc}>Об изменениях в законах</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsChange}
            trackColor={{ false: '#d1d5db', true: '#1e40af' }}
            thumbColor={notificationsEnabled ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Данные</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
          <View style={styles.settingContent}>
            <Ionicons name="trash" size={20} color="#ef4444" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Очистить кэш</Text>
              <Text style={styles.settingDesc}>Удалить сохранённые данные</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Информация</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
          <View style={styles.settingContent}>
            <Ionicons name="information-circle" size={20} color="#1e40af" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>О приложении</Text>
              <Text style={styles.settingDesc}>Версия и информация</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="document-text" size={20} color="#1e40af" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Условия использования</Text>
              <Text style={styles.settingDesc}>Прочитать условия</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="shield-checkmark" size={20} color="#1e40af" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Политика конфиденциальности</Text>
              <Text style={styles.settingDesc}>Как мы защищаем ваши данные</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ПравоЗнайка v1.0.0</Text>
        <Text style={styles.footerSubtext}>Бесплатный юридический помощник</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#1e40af',
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});

export default SettingsScreen;
