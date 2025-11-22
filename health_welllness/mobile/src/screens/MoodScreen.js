import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { moodAPI } from '../api/api';

const emotions = [
  { value: 'happy', emoji: '😊' },
  { value: 'sad', emoji: '😢' },
  { value: 'anxious', emoji: '😰' },
  { value: 'calm', emoji: '😌' },
  { value: 'excited', emoji: '🤩' },
  { value: 'tired', emoji: '😴' },
];

export default function MoodScreen() {
  const [score, setScore] = useState(5);
  const [emotion, setEmotion] = useState('calm');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await moodAPI.logMood({
        score,
        emotion,
        notes,
        timeOfDay: getTimeOfDay()
      });

      Alert.alert('Success', 'Mood logged successfully! +5 XP');
      setScore(5);
      setEmotion('calm');
      setNotes('');
    } catch (error) {
      Alert.alert('Error', 'Failed to log mood');
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.subtitle}>Track your emotional well-being</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Score: {score}/10</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Very Low</Text>
            <Text style={styles.sliderLabel}>Very High</Text>
          </View>
          {/* Simplified: you would use a proper slider component */}
          <View style={styles.scoreButtons}>
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <TouchableOpacity
                key={num}
                style={[styles.scoreButton, score === num && styles.scoreButtonActive]}
                onPress={() => setScore(num)}
              >
                <Text style={[styles.scoreButtonText, score === num && styles.scoreButtonTextActive]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Emotion</Text>
          <View style={styles.emotionsGrid}>
            {emotions.map(e => (
              <TouchableOpacity
                key={e.value}
                style={[styles.emotionButton, emotion === e.value && styles.emotionButtonActive]}
                onPress={() => setEmotion(e.value)}
              >
                <Text style={styles.emotionEmoji}>{e.emoji}</Text>
                <Text style={styles.emotionLabel}>{e.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="What's on your mind?"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Saving...' : 'Save Mood'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
  },
  scoreButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scoreButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreButtonActive: {
    borderColor: '#0ea5e9',
    backgroundColor: '#0ea5e9',
  },
  scoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  scoreButtonTextActive: {
    color: 'white',
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emotionButton: {
    width: '30%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  emotionButtonActive: {
    borderColor: '#0ea5e9',
    backgroundColor: '#eff6ff',
  },
  emotionEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emotionLabel: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

