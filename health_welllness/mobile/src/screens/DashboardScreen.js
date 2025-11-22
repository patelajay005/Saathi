import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scoreAPI, userAPI } from '../api/api';

export default function DashboardScreen() {
  const [user, setUser] = useState(null);
  const [todayScore, setTodayScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));

      const [scoreRes] = await Promise.all([
        scoreAPI.getToday(),
      ]);
      setTodayScore(scoreRes.data.score);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {user?.name}! 👋</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#ef4444' }]}>
          <Ionicons name="flame" size={32} color="white" />
          <Text style={styles.statValue}>{user?.streak || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#8b5cf6' }]}>
          <Ionicons name="trophy" size={32} color="white" />
          <Text style={styles.statValue}>{user?.level || 1}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#0ea5e9' }]}>
          <Ionicons name="bar-chart" size={32} color="white" />
          <Text style={styles.statValue}>{todayScore ? todayScore.overallScore.toFixed(1) : '0'}/10</Text>
          <Text style={styles.statLabel}>Today's Score</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
          <Ionicons name="sparkles" size={32} color="white" />
          <Text style={styles.statValue}>{user?.xp || 0}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
      </View>

      {todayScore?.insights && todayScore.insights.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💡 Today's Insights</Text>
          {todayScore.insights.map((insight, i) => (
            <Text key={i} style={styles.insightText}>• {insight}</Text>
          ))}
        </View>
      )}

      {todayScore?.recommendations && todayScore.recommendations.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ Recommendations</Text>
          {todayScore.recommendations.map((rec, i) => (
            <Text key={i} style={styles.insightText}>• {rec}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
});

