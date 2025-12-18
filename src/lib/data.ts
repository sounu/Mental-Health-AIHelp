import type { Goal, JournalEntry, Meditation, MoodEntry } from './types';

export const goals: Goal[] = [
  { id: '1', text: 'Practice mindfulness for 10 minutes daily', completed: false },
  { id: '2', text: 'Write in my journal three times this week', completed: true },
  { id: '3', text: 'Go for a 30-minute walk every day', completed: false },
];

export const journalEntries: JournalEntry[] = [
  { id: '1', date: '2024-07-28', content: 'Felt a bit anxious today about the upcoming project deadline, but I managed to calm myself down with a breathing exercise. It helped a lot.', mood: 'Anxious' },
  { id: '2', date: '2024-07-27', content: 'Had a wonderful day with friends. Felt happy and connected.', mood: 'Happy' },
];

export const moodHistory: MoodEntry[] = [
  { date: 'Jul 22', mood: 'Happy' },
  { date: 'Jul 23', mood: 'Neutral' },
  { date: 'Jul 24', mood: 'Anxious' },
  { date: 'Jul 25', mood: 'Calm' },
  { date: 'Jul 26', mood: 'Sad' },
  { date: 'Jul 27', mood: 'Happy' },
  { date: 'Jul 28', mood: 'Anxious' },
];

export const meditations: Meditation[] = [
  {
    id: '1',
    title: 'Morning Gratitude',
    description: 'Start your day with a positive mindset by focusing on what you\'re grateful for.',
    duration: '10 min',
    imageId: 'meditation1',
  },
  {
    id: '2',
    title: 'Stress Relief Breathing',
    description: 'A simple but powerful breathing technique to calm your nervous system.',
    duration: '5 min',
    imageId: 'meditation2',
  },
  {
    id: '3',
    title: 'Mindful Body Scan',
    description: 'Connect with your body and release tension from head to toe.',
    duration: '15 min',
    imageId: 'meditation3',
  },
  {
    id: '4',
    title: 'Deep Sleep Relaxation',
    description: 'Drift off to a peaceful sleep with this guided relaxation.',
    duration: '20 min',
    imageId: 'meditation4',
  },
];
