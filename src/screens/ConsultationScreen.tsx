import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getConsultation, categorizeQuestion } from '../services/api';
import { saveConsultation } from '../services/database';

const ConsultationScreen = ({ navigation }: any) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите вопрос');
      return;
    }

    setLoading(true);
    try {
      const answer = await getConsultation(question);
      const category = await categorizeQuestion(question);
      const consultationId = await saveConsultation(question, answer, category);

      navigation.navigate('ConsultationDetail', {
        id: consultationId,
        question,
        answer,
        category,
      });

      setQuestion('');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось получить ответ. Проверьте подключение к интернету и API ключ.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Задайте вопрос</Text>
        <Text style={styles.subtitle}>
          Получите бесплатную юридическую консультацию
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Опишите вашу ситуацию..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={6}
          value={question}
          onChangeText={setQuestion}
          editable={!loading}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAsk}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.buttonText}>Получить консультацию</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>💡 Советы для лучшего ответа:</Text>
        <Text style={styles.tipItem}>• Опишите ситуацию подробно</Text>
        <Text style={styles.tipItem}>• Укажите сроки и даты</Text>
        <Text style={styles.tipItem}>• Упомяните все попытки решения</Text>
        <Text style={styles.tipItem}>• Будьте конкретны в деталях</Text>
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
  inputContainer: {
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1e40af',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tips: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1e40af',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  tipItem: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default ConsultationScreen;
