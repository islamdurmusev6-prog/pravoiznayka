import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { templates } from '../data/templates';
import { getPremiumStatus } from '../services/premium';

const TemplatesScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  React.useEffect(() => {
    checkPremium();
  }, []);

  const checkPremium = async () => {
    const status = await getPremiumStatus();
    setIsPremium(status.isPremium);
  };

  const categories = Array.from(new Set(templates.map((t) => t.category)));
  const filteredTemplates = selectedCategory
    ? templates.filter((t) => t.category === selectedCategory)
    : templates;

  const handleTemplatePress = (template: any) => {
    if (!isPremium) {
      Alert.alert(
        'Premium функция',
        'Шаблоны документов доступны только в Premium версии',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Перейти в Premium', onPress: () => navigation.navigate('Premium') },
        ]
      );
      return;
    }

    navigation.navigate('TemplateEditor', { template });
  };

  const renderTemplate = ({ item }: any) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => handleTemplatePress(item)}
    >
      <View style={styles.templateHeader}>
        <Text style={styles.templateName}>{item.name}</Text>
        {!isPremium && <Ionicons name="lock" size={16} color="#ef4444" />}
      </View>
      <Text style={styles.templateDescription}>{item.description}</Text>
      <Text style={styles.templateFields}>
        Полей: {item.fields.length}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Шаблоны документов</Text>
        <Text style={styles.subtitle}>Готовые к заполнению документы</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === null && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === null && styles.categoryButtonTextActive,
            ]}
          >
            Все
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat && styles.categoryButtonTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
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
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryButtonActive: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  templateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  templateDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  templateFields: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default TemplatesScreen;
