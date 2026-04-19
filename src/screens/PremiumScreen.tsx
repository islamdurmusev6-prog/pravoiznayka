import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPremiumStatus, activatePremium, getRemainingConsultations } from '../services/premium';

const PremiumScreen = ({ navigation }: any) => {
  const [premiumStatus, setPremiumStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const status = await getPremiumStatus();
      setPremiumStatus(status);
      const rem = await getRemainingConsultations();
      setRemaining(rem);
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  };

  const handleActivatePremium = async (days: number) => {
    setLoading(true);
    try {
      // In a real app, you'd integrate with a payment system (Stripe, Apple Pay, etc.)
      Alert.alert(
        'Активация Premium',
        `Это демо. В реальном приложении здесь была бы интеграция с платежной системой.\n\nПодписка на ${days} дней`,
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Активировать (демо)',
            onPress: async () => {
              await activatePremium(days);
              await loadPremiumStatus();
              Alert.alert('Успех', 'Premium активирован!');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось активировать Premium');
    } finally {
      setLoading(false);
    }
  };

  if (!premiumStatus) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="star" size={48} color="#fbbf24" />
        <Text style={styles.title}>ПравоЗнайка Premium</Text>
        <Text style={styles.subtitle}>Неограниченные возможности</Text>
      </View>

      {premiumStatus.isPremium ? (
        <View style={styles.activeStatus}>
          <Ionicons name="checkmark-circle" size={32} color="#10b981" />
          <Text style={styles.activeText}>Premium активен</Text>
          {premiumStatus.expiresAt && (
            <Text style={styles.expiryText}>
              Истекает: {new Date(premiumStatus.expiresAt).toLocaleDateString('ru-RU')}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.freeStatus}>
          <Text style={styles.freeText}>Вы используете бесплатную версию</Text>
          <Text style={styles.consultationCount}>
            Осталось консультаций: {remaining}
          </Text>
        </View>
      )}

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Что включено в Premium:</Text>

        <View style={styles.featureItem}>
          <Ionicons name="infinite" size={24} color="#1e40af" />
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Неограниченные консультации</Text>
            <Text style={styles.featureDesc}>Задавайте столько вопросов, сколько нужно</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="document-text" size={24} color="#1e40af" />
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Шаблоны документов</Text>
            <Text style={styles.featureDesc}>Готовые заявления, жалобы, исковые</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="download" size={24} color="#1e40af" />
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Экспорт в PDF</Text>
            <Text style={styles.featureDesc}>Сохраняйте консультации в PDF</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="notifications" size={24} color="#1e40af" />
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Уведомления о законах</Text>
            <Text style={styles.featureDesc}>Будьте в курсе изменений</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="moon" size={24} color="#1e40af" />
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Тёмный режим</Text>
            <Text style={styles.featureDesc}>Удобно использовать вечером</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="wifi-off" size={24} color="#1e40af" />
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Оффлайн-режим</Text>
            <Text style={styles.featureDesc}>Доступ к данным без интернета</Text>
          </View>
        </View>
      </View>

      {!premiumStatus.isPremium && (
        <View style={styles.pricing}>
          <Text style={styles.pricingTitle}>Выберите план:</Text>

          <TouchableOpacity
            style={styles.planCard}
            onPress={() => handleActivatePremium(1)}
            disabled={loading}
          >
            <Text style={styles.planName}>1 месяц</Text>
            <Text style={styles.planPrice}>99 ₽</Text>
            <Text style={styles.planDesc}>Попробуйте Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planCard, styles.planCardPopular]}
            onPress={() => handleActivatePremium(12)}
            disabled={loading}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Популярно</Text>
            </View>
            <Text style={styles.planName}>12 месяцев</Text>
            <Text style={styles.planPrice}>999 ₽</Text>
            <Text style={styles.planDesc}>Экономия 17%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.planCard}
            onPress={() => handleActivatePremium(3)}
            disabled={loading}
          >
            <Text style={styles.planName}>3 месяца</Text>
            <Text style={styles.planPrice}>249 ₽</Text>
            <Text style={styles.planDesc}>Лучшее предложение</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          💡 Все платежи безопасны. Вы можете отменить подписку в любой момент.
        </Text>
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
    padding: 30,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#dbeafe',
    marginTop: 4,
  },
  activeStatus: {
    margin: 16,
    padding: 16,
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6ee7b7',
  },
  activeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    marginTop: 8,
  },
  expiryText: {
    fontSize: 12,
    color: '#047857',
    marginTop: 4,
  },
  freeStatus: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  freeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  consultationCount: {
    fontSize: 12,
    color: '#b45309',
    marginTop: 4,
  },
  features: {
    padding: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  featureText: {
    flex: 1,
  },
  featureName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  featureDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  pricing: {
    padding: 16,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  planCardPopular: {
    borderColor: '#1e40af',
    backgroundColor: '#eff6ff',
  },
  popularBadge: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 4,
  },
  planDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  disclaimer: {
    padding: 16,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default PremiumScreen;
