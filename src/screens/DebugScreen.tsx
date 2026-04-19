import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCacheStats, clearConsultationCache } from '../services/groq';
import { clearCache } from '../services/cache';
import { getPremiumStatus } from '../services/premium';

const DebugScreen = () => {
  const [stats, setStats] = useState<any>(null);
  const [premiumStatus, setPremiumStatus] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const cacheStats = getCacheStats();
    const premium = await getPremiumStatus();
    setStats(cacheStats);
    setPremiumStatus(premium);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Очистить кэш',
      'Это удалит все кэшированные консультации',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: () => {
            clearConsultationCache();
            Alert.alert('Успех', 'Кэш консультаций очищен');
            loadStats();
          },
        },
      ]
    );
  };

  const handleClearAllCache = () => {
    Alert.alert(
      'Очистить весь кэш',
      'Это удалит все сохранённые данные',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            await clearCache();
            Alert.alert('Успех', 'Весь кэш очищен');
            loadStats();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Отладка</Text>
        <Text style={styles.subtitle}>Информация о приложении</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Статистика кэша</Text>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Кэшировано консультаций:</Text>
          <Text style={styles.statValue}>{stats?.cachedQuestions || 0}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>API ключей Groq:</Text>
          <Text style={styles.statValue}>{stats?.apiKeysCount || 0}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Максимум запросов/мин:</Text>
          <Text style={styles.statValue}>
            {(stats?.apiKeysCount || 0) * 30}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Premium статус</Text>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Premium активен:</Text>
          <Text style={[styles.statValue, premiumStatus?.isPremium ? styles.success : styles.warning]}>
            {premiumStatus?.isPremium ? 'Да' : 'Нет'}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Консультаций использовано:</Text>
          <Text style={styles.statValue}>
            {premiumStatus?.consultationsUsed} / {premiumStatus?.consultationsLimit}
          </Text>
        </View>

        {premiumStatus?.expiresAt && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Истекает:</Text>
            <Text style={styles.statValue}>
              {new Date(premiumStatus.expiresAt).toLocaleDateString('ru-RU')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Действия</Text>

        <TouchableOpacity style={styles.actionButton} onPress={handleClearCache}>
          <Ionicons name="trash" size={20} color="#ef4444" />
          <Text style={styles.actionButtonText}>Очистить кэш консультаций</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClearAllCache}>
          <Ionicons name="warning" size={20} color="#ef4444" />
          <Text style={styles.actionButtonText}>Очистить весь кэш</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Информация</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Groq API</Text>
          <Text style={styles.infoText}>
            • Используется для генерации консультаций{'\n'}
            • Бесплатный план: 30 запросов/мин на ключ{'\n'}
            • Несколько ключей для распределения нагрузки{'\n'}
            • Автоматическое кэширование ответов
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Кэширование</Text>
          <Text style={styles.infoText}>
            • Похожие вопросы ищут готовые ответы{'\n'}
            • Кэш в памяти для быстрого доступа{'\n'}
            • AsyncStorage для сохранения между сеансами{'\n'}
            • Кэш хранится 24 часа
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Поддерживаемые пользователи</Text>
          <Text style={styles.infoText}>
            • С 1 ключом: ~30 одновременно{'\n'}
            • С 3 ключами: ~90-150 одновременно{'\n'}
            • С кэшированием: +50% пользователей{'\n'}
            • Платный план: 500+ одновременно
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ПравоЗнайка v1.0.0</Text>
        <Text style={styles.footerSubtext}>Powered by Groq API</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#dbeafe',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  statItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  success: {
    color: '#10b981',
  },
  warning: {
    color: '#f59e0b',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1e40af',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
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

export default DebugScreen;
