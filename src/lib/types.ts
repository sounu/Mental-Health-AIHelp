export type Goal = {
  id: string;
  text: string;
  completed: boolean;
};

export type JournalEntry = {
  id: string;
  date: string;
  content: string;
  mood: Mood;
};

export type Mood = 'Happy' | 'Calm' | 'Sad' | 'Anxious' | 'Neutral';

export type MoodEntry = {
  date: string;
  mood: Mood;
};

export type Meditation = {
  id: string;
  title: string;
  description: string;
  duration: string;
  imageId: string;
};

export type ConversationMessage = {
  role: 'user' | 'ai';
  content: string;
};
