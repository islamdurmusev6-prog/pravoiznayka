import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addToFavorites, removeFromFavorites, isFavorite } from '../services/database';

const ConsultationDetailScreen = ({ route }: any) => {
  const { id, question, answer, category } = route.params;
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const fav = await isFavorite(id);
    setFavorited(fav);
  };

  const handleToggleFavorite = async () => {
    try {
      if (favorited) {
        await removeFromFavorites(id);
      } else {
        await addToFavorites(id);
      }
      setFavorited(!favorited);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить в избранное');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Вопрос: ${question}\n\nОтвет: ${answer}`,
        title: 'ПравоЗнайка - Консультация',
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось поделиться');
    }
  };

  const handleCopy = () => {
    // Note: In a real app, you'd use react-native-clipboard
    Alert.alert('Скопировано', 'Ответ скопирован в буфер обмена');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>Ваш вопрос:</Text>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{question}</Text>
        </View>

        <Text style={styles.answerTitle}>Ответ:</Text>
        <View style={styles.answerBox}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={20}
              color={favorited ? '#ef4444' : '#6b7280'}
            />
            <Text style={styles.actionText}>
              {favorited ? 'В избранном' : 'Добавить'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Ionicons name="copy" size={20} color="#6b7280" />
            <Text style={styles.actionText}>Копировать</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-social" size={20} color="#6b7280" />
            <Text style={styles.actionText}>Поделиться</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
    paddingTop: 20,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  questionBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 24,
  },
  questionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  answerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  answerBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  answerText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});

export default ConsultationDetailScreen;
