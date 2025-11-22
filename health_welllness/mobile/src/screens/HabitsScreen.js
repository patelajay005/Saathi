import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { habitAPI } from '../api/api';

export default function HabitsScreen() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    setLoading(true);
    try {
      const response = await habitAPI.getAll({ isActive: true });
      setHabits(response.data.habits);
    } catch (error) {
      Alert.alert('Error', 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const handleComplete = async (habitId, habitName) => {
    try {
      const response = await habitAPI.complete(habitId);
      Alert.alert('Success', response.data.message);
      loadHabits();
    } catch (error) {
      Alert.alert('Info', error.response?.data?.error?.message || 'Failed to complete habit');
    }
  };

  const renderHabit = ({ item }) => (
    <View style={styles.habitCard}>
      <View style={styles.habitInfo}>
        <Text style={styles.habitIcon}>{item.icon}</Text>
        <View style={styles.habitDetails}>
          <Text style={styles.habitName}>{item.name}</Text>
          <View style={styles.habitStats}>
            <Text style={styles.habitStat}>🔥 {item.streak} days</Text>
            <Text style={styles.habitStat}>✅ {item.totalCompletions}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => handleComplete(item._id, item.name)}
      >
        <Ionicons name="checkmark" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Habits</Text>
        <Text style={styles.subtitle}>Build healthy routines</Text>
      </View>

      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>Create habits on the web app</Text>
          </View>
        }
      />
    </View>
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
  list: {
    padding: 16,
  },
  habitCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  habitIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitStats: {
    flexDirection: 'row',
    gap: 12,
  },
  habitStat: {
    fontSize: 12,
    color: '#666',
  },
  completeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});

