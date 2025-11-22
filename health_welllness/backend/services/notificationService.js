const admin = require('firebase-admin');
const User = require('../models/User');
const aiService = require('./aiService');

// Initialize Firebase Admin (only if credentials are provided)
let firebaseInitialized = false;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized');
  } else {
    console.log('⚠️  Firebase credentials not provided. Push notifications disabled.');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
}

class NotificationService {
  async sendPushNotification(fcmToken, notification) {
    if (!firebaseInitialized) {
      console.log('Push notification skipped (Firebase not initialized)');
      return { success: false, reason: 'Firebase not initialized' };
    }

    try {
      const message = {
        token: fcmToken,
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            color: '#6366f1'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      const response = await admin.messaging().send(message);
      console.log('✅ Push notification sent:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
      return { success: false, error: error.message };
    }
  }

  async sendDailyReminders() {
    try {
      // Find users with notifications enabled
      const users = await User.find({
        'preferences.notificationsEnabled': true
      });

      console.log(`📱 Sending daily reminders to ${users.length} users...`);

      for (const user of users) {
        if (user.fcmToken) {
          // Generate personalized insight
          const insight = await aiService.generateDailyInsight(user._id);

          await this.sendPushNotification(user.fcmToken, {
            title: '🌅 Good Morning! Time for Your Check-In',
            body: insight,
            data: {
              type: 'daily_reminder',
              userId: user._id.toString()
            }
          });
        }
      }

      console.log('✅ Daily reminders sent successfully');
    } catch (error) {
      console.error('❌ Error sending daily reminders:', error);
    }
  }

  async sendStreakNotification(user, streak) {
    if (!user.fcmToken || !user.preferences.notificationsEnabled) return;

    const milestones = [7, 14, 21, 30, 60, 90, 180, 365];
    
    if (milestones.includes(streak)) {
      await this.sendPushNotification(user.fcmToken, {
        title: `🔥 ${streak}-Day Streak Achievement!`,
        body: `Amazing! You've maintained your wellness routine for ${streak} days. Keep going!`,
        data: {
          type: 'streak_milestone',
          streak: streak.toString()
        }
      });
    }
  }

  async sendLevelUpNotification(user, newLevel) {
    if (!user.fcmToken || !user.preferences.notificationsEnabled) return;

    await this.sendPushNotification(user.fcmToken, {
      title: `🎉 Level Up! You're now Level ${newLevel}`,
      body: `Congratulations! Your dedication to wellness has earned you a new level!`,
      data: {
        type: 'level_up',
        level: newLevel.toString()
      }
    });
  }

  async sendHabitReminder(user, habitName) {
    if (!user.fcmToken || !user.preferences.notificationsEnabled) return;

    await this.sendPushNotification(user.fcmToken, {
      title: '⏰ Habit Reminder',
      body: `Don't forget to complete: ${habitName}`,
      data: {
        type: 'habit_reminder',
        habitName
      }
    });
  }

  async sendMoodCheckInReminder(user) {
    if (!user.fcmToken || !user.preferences.notificationsEnabled) return;

    await this.sendPushNotification(user.fcmToken, {
      title: '💭 How are you feeling today?',
      body: 'Take a moment to check in with yourself and log your mood.',
      data: {
        type: 'mood_check_in'
      }
    });
  }
}

module.exports = new NotificationService();

