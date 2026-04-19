import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { contacts, getAllTypes } from '../data/contacts';

const ContactsScreen = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const types = getAllTypes();

  const filteredContacts = selectedType
    ? contacts.filter((c) => c.type === selectedType)
    : contacts;

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть телефон');
    });
  };

  const handleWebsite = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть сайт');
    });
  };

  const renderTypeButton = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        selectedType === item && styles.typeButtonActive,
      ]}
      onPress={() => setSelectedType(selectedType === item ? null : item)}
    >
      <Text
        style={[
          styles.typeButtonText,
          selectedType === item && styles.typeButtonTextActive,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderContact = ({ item }: any) => (
    <View style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactType}>{item.type}</Text>
      </View>

      <View style={styles.contactInfo}>
        {item.phone && (
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handleCall(item.phone)}
          >
            <Ionicons name="call" size={16} color="#1e40af" />
            <Text style={styles.infoText}>{item.phone}</Text>
          </TouchableOpacity>
        )}

        {item.address && (
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#1e40af" />
            <Text style={styles.infoText}>{item.address}</Text>
          </View>
        )}

        {item.hours && (
          <View style={styles.infoRow}>
            <Ionicons name="time" size={16} color="#1e40af" />
            <Text style={styles.infoText}>{item.hours}</Text>
          </View>
        )}

        {item.website && (
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handleWebsite(item.website!)}
          >
            <Ionicons name="globe" size={16} color="#1e40af" />
            <Text style={[styles.infoText, styles.link]}>{item.website}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Контакты</Text>
        <Text style={styles.subtitle}>Справочник государственных органов</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typesContainer}
      >
        <TouchableOpacity
          style={[
            styles.typeButton,
            selectedType === null && styles.typeButtonActive,
          ]}
          onPress={() => setSelectedType(null)}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedType === null && styles.typeButtonTextActive,
            ]}
          >
            Все
          </Text>
        </TouchableOpacity>

        {types.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType(selectedType === type ? null : type)}
          >
            <Text
              style={[
                styles.typeButtonText,
                selectedType === type && styles.typeButtonTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
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
  typesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  typeButtonActive: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  contactHeader: {
    marginBottom: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  contactType: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  contactInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
    lineHeight: 18,
  },
  link: {
    color: '#1e40af',
    textDecorationLine: 'underline',
  },
});

export default ContactsScreen;
