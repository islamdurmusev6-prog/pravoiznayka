import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getConsultationHistory } from '../services/database';

const HistoryScreen = ({ navigation }: any) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getConsultationHistory();
      setHistory(data || []);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить историю');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: any) => {
    navigation.navigate('ConsultationDetail', {
      id: item.id,
      question: item.question,
      answer: item.answer,
      category: item.category,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  const renderHistoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemQuestion} numberOfLines={2}>
          {item.question}
        </Text>
        <Text style={styles.itemDate}>{formatDate(item.created_at)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>История</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#1e40af" />
        </View>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>История</Text>
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>История пуста</Text>
          <Text style={styles.emptySubtext}>
            Ваши консультации будут отображаться здесь
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>История</Text>
        <Text style={styles.subtitle}>
          {history.length} консультаций
        </Text>
      </View>

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemContent: {
    flex: 1,
  },
  itemCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  itemQuestion: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  itemDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HistoryScreen;
