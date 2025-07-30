import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@glyph_notes';

export type Note = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  updatedAt: number;
};

export const saveNotes = async (notes: Note[]) => {
  try {
    const sorted = notes.sort((a, b) => b.updatedAt - a.updatedAt); // más reciente arriba
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  } catch (e) {
    console.error('Error saving notes:', e);
  }
};

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error loading notes:', e);
    return [];
  }
};
