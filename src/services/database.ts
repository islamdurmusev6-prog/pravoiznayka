import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('pravoiznayka.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultation_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (consultation_id) REFERENCES consultations(id)
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

export const saveConsultation = async (
  question: string,
  answer: string,
  category: string
) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO consultations (question, answer, category) VALUES (?, ?, ?)',
      [question, answer, category]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error saving consultation:', error);
    throw error;
  }
};

export const getConsultationHistory = async () => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM consultations ORDER BY created_at DESC'
    );
    return result;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

export const getConsultationById = async (id: number) => {
  try {
    const result = await db.getFirstAsync(
      'SELECT * FROM consultations WHERE id = ?',
      [id]
    );
    return result;
  } catch (error) {
    console.error('Error fetching consultation:', error);
    throw error;
  }
};

export const addToFavorites = async (consultationId: number) => {
  try {
    await db.runAsync(
      'INSERT INTO favorites (consultation_id) VALUES (?)',
      [consultationId]
    );
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (consultationId: number) => {
  try {
    await db.runAsync(
      'DELETE FROM favorites WHERE consultation_id = ?',
      [consultationId]
    );
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const isFavorite = async (consultationId: number) => {
  try {
    const result = await db.getFirstAsync(
      'SELECT id FROM favorites WHERE consultation_id = ?',
      [consultationId]
    );
    return !!result;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};
