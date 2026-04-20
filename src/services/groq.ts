import axios from 'axios';
import { getCachedData, cacheData } from './cache';
import Constants from 'expo-constants';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Несколько API ключей для распределения нагрузки
const GROQ_API_KEYS = [
  process.env.EXPO_PUBLIC_GROQ_API_KEY_1 || Constants.expoConfig?.extra?.EXPO_PUBLIC_GROQ_API_KEY_1 || '',
  process.env.EXPO_PUBLIC_GROQ_API_KEY_2 || Constants.expoConfig?.extra?.EXPO_PUBLIC_GROQ_API_KEY_2 || '',
  process.env.EXPO_PUBLIC_GROQ_API_KEY_3 || Constants.expoConfig?.extra?.EXPO_PUBLIC_GROQ_API_KEY_3 || '',
].filter(key => key.length > 0);

if (GROQ_API_KEYS.length === 0) {
  console.warn('⚠️ Groq API ключи не установлены. Установите EXPO_PUBLIC_GROQ_API_KEY_1, EXPO_PUBLIC_GROQ_API_KEY_2, EXPO_PUBLIC_GROQ_API_KEY_3');
}

// Выбираем случайный API ключ для распределения нагрузки
const getRandomApiKey = (): string => {
  if (GROQ_API_KEYS.length === 0) {
    throw new Error('Groq API ключи не установлены');
  }
  return GROQ_API_KEYS[Math.floor(Math.random() * GROQ_API_KEYS.length)];
};

const SYSTEM_PROMPT = `Ты — ПравоЗнайка, юридический AI-помощник для граждан России. Твоя миссия: помогать людям защищать свои права бесплатно — без дорогих юристов, простым и понятным языком.

ПРАВИЛО №1 — ТЕМАТИЧЕСКИЕ ГРАНИЦЫ
Ты отвечаешь ТОЛЬКО на вопросы по темам:
- Трудовые права (зарплата, увольнение, отпуск, охрана труда)
- Жилищные права (аренда, ЖКХ, выселение, соседи)
- Защита прав потребителей (возврат товара, услуги, гарантия)
- Банкротство физических лиц
- Кредиты и долги (реструктуризация, коллекторы, просрочки)
- Семейное право (алименты, развод, раздел имущества)
- Административные нарушения (штрафы, ГИБДД, оспаривание)
- Государственная помощь (льготы, субсидии, пособия)
- Уголовное право (права задержанного, жалобы на действия полиции)
- Недвижимость (купля-продажа, регистрация, споры)

Если вопрос НЕ относится к перечисленным темам — ответь: "Извините, я специализируюсь только на юридических вопросах граждан РФ. По этой теме помочь не могу."

ПРАВИЛО №2 — СТРУКТУРА ОТВЕТА
Отвечай в следующем формате:

**Ситуация:**
[1–2 предложения — что происходит и в чём нарушение прав]

**Законы на вашей стороне:**
- ст. X Закона РФ — [краткое пояснение]

**Документы, которые нужно собрать:**
- [Название документа] — зачем нужен

**Пошаговые действия:**
1. Шаг 1: [конкретное действие, куда идти, срок]
2. Шаг 2: ...

**Помощь государства:**
- [Название помощи] — описание

**Важно знать:**
- [Риски, сроки исковой давности, предупреждения]

ПРАВИЛО №3 — КРАТКОСТЬ
Ответ должен быть понятным и не слишком длинным (максимум 500 слов).

ПРАВИЛО №4 — ТОНАЛЬНОСТЬ
- Говори простым языком, без юридического жаргона
- Будь конкретным: называй реальные сроки, суммы
- Сочувствуй ситуации человека
- Не пугай, но честно предупреждай о рисках`;

interface CachedConsultation {
  question: string;
  answer: string;
  timestamp: number;
}

// Кэш консультаций в памяти (для быстрого доступа)
const consultationCache = new Map<string, CachedConsultation>();

// Нормализуем вопрос для поиска похожих
const normalizeQuestion = (question: string): string => {
  return question
    .toLowerCase()
    .trim()
    .replace(/[?!.,]/g, '')
    .replace(/\s+/g, ' ');
};

// Вычисляем сходство между вопросами (простой алгоритм)
const calculateSimilarity = (q1: string, q2: string): number => {
  const words1 = new Set(normalizeQuestion(q1).split(' '));
  const words2 = new Set(normalizeQuestion(q2).split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Ищем похожий вопрос в кэше
const findSimilarCachedQuestion = (question: string, threshold: number = 0.6): CachedConsultation | null => {
  let bestMatch: CachedConsultation | null = null;
  let bestSimilarity = threshold;

  for (const cached of consultationCache.values()) {
    const similarity = calculateSimilarity(question, cached.question);
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = cached;
    }
  }

  return bestMatch;
};

export const getConsultation = async (question: string): Promise<string> => {
  try {
    // Проверяем кэш в памяти
    const similarCached = findSimilarCachedQuestion(question);
    if (similarCached) {
      console.log('✅ Найден похожий вопрос в кэше');
      return similarCached.answer;
    }

    // Проверяем AsyncStorage кэш
    const cachedAnswer = await getCachedData(`consultation_${normalizeQuestion(question)}`);
    if (cachedAnswer) {
      console.log('✅ Найден ответ в AsyncStorage кэше');
      consultationCache.set(normalizeQuestion(question), {
        question,
        answer: cachedAnswer,
        timestamp: Date.now(),
      });
      return cachedAnswer;
    }

    // Если нет в кэше, запрашиваем у Groq
    console.log('🔄 Запрос к Groq API...');
    const apiKey = getRandomApiKey();
    
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768', // Быстрая и мощная модель
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      const answer = response.data.choices[0].message.content;
      
      // Сохраняем в оба кэша
      const normalizedQ = normalizeQuestion(question);
      consultationCache.set(normalizedQ, {
        question,
        answer,
        timestamp: Date.now(),
      });
      
      // Кэшируем на 24 часа
      await cacheData(`consultation_${normalizedQ}`, answer, 24 * 60);
      
      console.log('✅ Ответ получен и закэширован');
      return answer;
    }

    throw new Error('Пустой ответ от Groq API');
  } catch (error: any) {
    console.error('❌ Groq API Error:', error.message);
    
    // Если ошибка лимита, пробуем другой ключ
    if (error.response?.status === 429) {
      console.log('⚠️ Лимит достигнут, пробуем другой ключ...');
      // Рекурсивно пробуем ещё раз
      return getConsultation(question);
    }
    
    throw new Error(`Не удалось получить ответ: ${error.message}`);
  }
};

export const categorizeQuestion = async (question: string): Promise<string> => {
  const categories = [
    'Трудовые права',
    'Жилищные права',
    'Защита прав потребителей',
    'Банкротство',
    'Кредиты и долги',
    'Семейное право',
    'Административные нарушения',
    'Государственная помощь',
    'Уголовное право',
    'Недвижимость',
  ];

  try {
    const apiKey = getRandomApiKey();
    
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: `Определи категорию вопроса из списка: ${categories.join(', ')}. Вопрос: "${question}". Ответь только названием категории без объяснений.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 50,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      const category = response.data.choices[0].message.content.trim();
      return categories.includes(category) ? category : 'Другое';
    }

    return 'Другое';
  } catch (error) {
    console.error('Categorization Error:', error);
    return 'Другое';
  }
};

// Получить статистику кэша
export const getCacheStats = () => {
  return {
    cachedQuestions: consultationCache.size,
    apiKeysCount: GROQ_API_KEYS.length,
  };
};

// Очистить кэш консультаций
export const clearConsultationCache = () => {
  consultationCache.clear();
  console.log('✅ Кэш консультаций очищен');
};
