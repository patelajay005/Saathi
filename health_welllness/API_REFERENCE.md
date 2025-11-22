# 📚 API Reference - Saathi

**साथी - Your Wellness Companion API**

Complete API documentation for the Saathi platform.

**Base URL**: `http://localhost:5000/api`

**Authentication**: Bearer token in Authorization header
```
Authorization: Bearer <your_jwt_token>
```

## 🔐 Authentication

### Register
Create a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "level": 1,
    "xp": 0,
    "streak": 0
  }
}
```

### Login
Authenticate existing user.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "level": 5,
    "xp": 450,
    "streak": 7,
    "badges": [],
    "preferences": {
      "notificationsEnabled": true,
      "reminderTime": "09:00"
    }
  }
}
```

### Get Current User
Get authenticated user's profile.

**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "level": 5,
    "xp": 450,
    "streak": 7
  }
}
```

---

## 👤 User Management

### Get Profile
Get detailed user profile.

**Endpoint**: `GET /user/profile`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`

### Update Profile
Update user information.

**Endpoint**: `PUT /user/profile`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "John Smith",
  "profilePicture": "https://example.com/photo.jpg",
  "preferences": {
    "notificationsEnabled": true,
    "reminderTime": "08:00",
    "timezone": "America/New_York"
  }
}
```

**Response**: `200 OK`

### Daily Check-In
Perform daily check-in to maintain streak.

**Endpoint**: `POST /user/check-in`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "message": "Check-in successful!",
  "streak": 8,
  "xp": 460,
  "level": 5,
  "leveledUp": false,
  "newBadge": null
}
```

### Get Gamification Stats
Get user's gamification statistics.

**Endpoint**: `GET /user/gamification`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "level": 5,
  "xp": 450,
  "xpToNextLevel": 50,
  "streak": 7,
  "badges": [
    {
      "name": "7-Day Streak",
      "earnedAt": "2024-01-15T10:30:00Z",
      "icon": "🔥"
    }
  ],
  "lastCheckIn": "2024-01-20T09:15:00Z"
}
```

---

## 💬 Chat (AI Coach)

### Create Chat Session
Start a new conversation.

**Endpoint**: `POST /chat/session`

**Headers**: `Authorization: Bearer <token>`

**Response**: `201 Created`
```json
{
  "message": "Chat session created",
  "session": {
    "userId": "507f1f77bcf86cd799439011",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "New Conversation",
    "startedAt": "2024-01-20T10:00:00Z",
    "lastMessageAt": "2024-01-20T10:00:00Z",
    "messageCount": 0
  }
}
```

### Get All Sessions
Get user's chat sessions.

**Endpoint**: `GET /chat/sessions`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "sessions": [
    {
      "sessionId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Anxiety Discussion",
      "lastMessageAt": "2024-01-20T10:30:00Z",
      "messageCount": 12
    }
  ]
}
```

### Get Chat History
Get messages for a specific session.

**Endpoint**: `GET /chat/session/:sessionId`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "session": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Anxiety Discussion"
  },
  "messages": [
    {
      "role": "user",
      "content": "I'm feeling anxious today",
      "timestamp": "2024-01-20T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "I understand you're feeling anxious. Can you tell me more about what's causing these feelings?",
      "timestamp": "2024-01-20T10:00:05Z"
    }
  ]
}
```

### Send Message
Send a message and get AI response.

**Endpoint**: `POST /chat/message`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "I'm feeling stressed about work"
}
```

**Response**: `200 OK`
```json
{
  "userMessage": {
    "role": "user",
    "content": "I'm feeling stressed about work",
    "timestamp": "2024-01-20T10:05:00Z"
  },
  "assistantMessage": {
    "role": "assistant",
    "content": "I hear you - work stress is very common. Let's explore some strategies to help you manage this...",
    "timestamp": "2024-01-20T10:05:05Z"
  },
  "xpEarned": 2
}
```

---

## 💭 Mood Tracking

### Log Mood
Record a mood entry.

**Endpoint**: `POST /mood`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "score": 7,
  "emotion": "happy",
  "notes": "Had a great day at work!",
  "triggers": ["work success", "good sleep"],
  "activities": ["exercise", "meditation"],
  "timeOfDay": "evening",
  "sleepHours": 8
}
```

**Response**: `201 Created`
```json
{
  "message": "Mood logged successfully! +5 XP",
  "mood": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "score": 7,
    "emotion": "happy",
    "notes": "Had a great day at work!",
    "date": "2024-01-20T18:30:00Z"
  },
  "xpEarned": 5
}
```

### Get Mood History
Get past mood entries.

**Endpoint**: `GET /mood/history`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `limit` (optional): Number of entries (default: 30)

**Response**: `200 OK`
```json
{
  "moods": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "score": 7,
      "emotion": "happy",
      "notes": "Great day!",
      "date": "2024-01-20T18:30:00Z",
      "timeOfDay": "evening"
    }
  ]
}
```

### Get Mood Statistics
Get aggregated mood data.

**Endpoint**: `GET /mood/stats`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `period` (optional): Number of days (default: 7)

**Response**: `200 OK`
```json
{
  "averageScore": 7.2,
  "totalEntries": 15,
  "emotionBreakdown": {
    "happy": 8,
    "calm": 5,
    "anxious": 2
  },
  "trend": "improving",
  "period": 7
}
```

### Get Today's Mood
Check if user has logged mood today.

**Endpoint**: `GET /mood/today`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "moods": [],
  "hasLoggedToday": false
}
```

---

## ✅ Habits

### Create Habit
Create a new habit.

**Endpoint**: `POST /habit`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Morning Meditation",
  "description": "10 minutes of meditation each morning",
  "category": "meditation",
  "frequency": "daily",
  "targetDays": [0, 1, 2, 3, 4, 5, 6],
  "reminderTime": "07:00",
  "color": "#10b981",
  "icon": "🧘"
}
```

**Response**: `201 Created`

### Get All Habits
Get user's habits.

**Endpoint**: `GET /habit`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `isActive` (optional): true/false

**Response**: `200 OK`
```json
{
  "habits": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Morning Meditation",
      "description": "10 minutes of meditation",
      "category": "meditation",
      "streak": 7,
      "bestStreak": 14,
      "totalCompletions": 25,
      "icon": "🧘",
      "color": "#10b981"
    }
  ]
}
```

### Complete Habit
Mark habit as completed for today.

**Endpoint**: `POST /habit/:habitId/complete`

**Headers**: `Authorization: Bearer <token>`

**Request Body** (optional):
```json
{
  "notes": "Great session today!"
}
```

**Response**: `200 OK`
```json
{
  "message": "Habit completed! +10 XP 🎉 8 day streak!",
  "habit": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Morning Meditation",
    "streak": 8
  },
  "streak": 8,
  "xpEarned": 10,
  "leveledUp": false
}
```

### Update Habit
Modify habit details.

**Endpoint**: `PUT /habit/:habitId`

**Headers**: `Authorization: Bearer <token>`

**Request Body**: Same as create

### Delete Habit
Remove a habit.

**Endpoint**: `DELETE /habit/:habitId`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`

### Get Habit Statistics
Get detailed habit stats.

**Endpoint**: `GET /habit/:habitId/stats`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "stats": {
    "currentStreak": 8,
    "bestStreak": 14,
    "totalCompletions": 25,
    "completionRate": 83,
    "recentCompletions": 21,
    "createdDaysAgo": 30
  }
}
```

---

## 🧘 Exercises

### Get All Exercises
Get available wellness exercises.

**Endpoint**: `GET /exercise`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `category` (optional): CBT, mindfulness, breathing, etc.
- `difficulty` (optional): beginner, intermediate, advanced

**Response**: `200 OK`

### Log Exercise Completion
Record completed exercise.

**Endpoint**: `POST /exercise/log`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "exerciseId": "507f1f77bcf86cd799439011",
  "duration": 15,
  "rating": 5,
  "notes": "Very relaxing",
  "moodBefore": 5,
  "moodAfter": 8
}
```

**Response**: `201 Created`
```json
{
  "message": "Exercise completed! +15 XP 🎯",
  "log": {
    "_id": "507f1f77bcf86cd799439011",
    "exerciseId": "507f1f77bcf86cd799439011",
    "duration": 15,
    "completedAt": "2024-01-20T10:00:00Z"
  },
  "xpEarned": 15,
  "leveledUp": false
}
```

---

## 📝 Quizzes

### Get All Quizzes
Get available quizzes.

**Endpoint**: `GET /quiz`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `category` (optional): stress, anxiety, depression, etc.

**Response**: `200 OK`

### Submit Quiz
Submit quiz answers.

**Endpoint**: `POST /quiz/:quizId/submit`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439011",
      "answer": "Several days"
    },
    {
      "questionId": "507f1f77bcf86cd799439012",
      "answer": 7
    }
  ]
}
```

**Response**: `200 OK`
```json
{
  "message": "Quiz completed! +20 XP",
  "result": {
    "totalScore": 15,
    "result": {
      "label": "Moderate Stress",
      "description": "You're experiencing moderate stress...",
      "recommendations": [
        "Try daily breathing exercises",
        "Practice mindfulness"
      ]
    }
  },
  "xpEarned": 20
}
```

---

## 📊 Daily Scores

### Get Today's Score
Get today's wellness score.

**Endpoint**: `GET /score/today`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "score": {
    "date": "2024-01-20T00:00:00Z",
    "overallScore": 7.5,
    "components": {
      "moodScore": 7.0,
      "habitScore": 8.0,
      "exerciseScore": 7.5
    },
    "summary": {
      "habitsCompleted": 4,
      "totalHabits": 5,
      "exercisesCompleted": 2,
      "moodEntries": 1,
      "minutesSpentOnExercises": 25
    },
    "insights": [
      "Great mood today! Keep up the positive energy! 🌟",
      "Excellent habit completion! You're building strong routines! 💪"
    ],
    "recommendations": [
      "Try a 5-minute breathing exercise"
    ]
  }
}
```

### Get Score History
Get past daily scores.

**Endpoint**: `GET /score/history`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `startDate` (optional)
- `endDate` (optional)
- `limit` (optional, default: 30)

**Response**: `200 OK`

### Get Score Statistics
Get aggregated score data.

**Endpoint**: `GET /score/stats`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `period` (optional): Number of days (default: 30)

**Response**: `200 OK`
```json
{
  "averageScore": 7.3,
  "totalDays": 25,
  "trend": "improving",
  "bestDay": {
    "date": "2024-01-18T00:00:00Z",
    "score": 9.2
  },
  "componentAverages": {
    "moodScore": 7.1,
    "habitScore": 7.8,
    "exerciseScore": 7.0
  },
  "period": 30
}
```

---

## 📚 Books

### Get All Books
Get book recommendations.

**Endpoint**: `GET /books`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `category` (optional)
- `difficulty` (optional)

**Response**: `200 OK`

### Add Book to Library
Add book to personal library.

**Endpoint**: `POST /books/:bookId/add`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "want-to-read"
}
```

**Response**: `201 Created`

### Get My Library
Get user's book library.

**Endpoint**: `GET /books/library/my-books`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `status` (optional): want-to-read, reading, completed

**Response**: `200 OK`

---

## 🔔 Notifications

### Update Notification Preferences
Change notification settings.

**Endpoint**: `PUT /notification/preferences`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "notificationsEnabled": true,
  "reminderTime": "08:00",
  "timezone": "America/New_York"
}
```

**Response**: `200 OK`

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

### Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## 💡 XP Awards Summary

| Action | XP Earned |
|--------|-----------|
| Daily Check-in | +10 XP |
| Log Mood | +5 XP |
| Complete Habit | +10 XP |
| Complete Exercise | +15 XP |
| Complete Quiz | +20 XP |
| Send Chat Message | +2 XP |
| Complete Onboarding | +50 XP |

**Level System**: 100 XP per level

---

## 🔄 Rate Limits

Currently no rate limits are enforced, but recommended:
- 100 requests per minute per user
- 1000 requests per day per user

---

**Last Updated**: January 2024
**API Version**: 1.0.0
**App Name**: Saathi (साथी - Companion)

