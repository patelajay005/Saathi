# 🤝 Saathi - Your AI Wellness Companion

**साथी - Walking with you on your wellness journey**

A comprehensive AI-powered health and wellness companion platform with chatbot support and cross-platform mobile applications. Monitor your mood, build healthy habits, and improve your mental well-being with personalized insights and evidence-based exercises. Available 24/7 in 15 languages.

## ✨ Features

### Core Features
- **🤖 AI-Powered Chatbot**: 24/7 support from an intelligent wellness coach powered by GPT-4
- **💭 Mood Tracking**: Log and analyze your emotional well-being with detailed insights
- **✅ Habit Tracking**: Build and maintain healthy habits with streaks and gamification
- **🎯 Daily Scoring**: Personalized daily wellness scores based on your activities
- **📊 Analytics Dashboard**: Comprehensive insights and progress tracking
- **🧘 Wellness Exercises**: CBT techniques, mindfulness, breathing exercises
- **📝 Assessment Quizzes**: Mental health assessments with personalized recommendations
- **📚 Book Recommendations**: Curated reading list for mental health improvement

### Gamification
- **Level System**: Earn XP and level up as you use the platform
- **Streak Tracking**: Maintain daily check-in streaks
- **Badges & Achievements**: Unlock badges for milestones
- **Progress Visualization**: Beautiful charts and statistics

### Platform Support
- **🌐 Web Application**: Modern, responsive React web app
- **📱 iOS & Android**: Cross-platform mobile app built with React Native
- **🔔 Push Notifications**: Daily reminders and motivational messages
- **☁️ Cloud Sync**: Data synced across all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **OpenAI GPT-4** for AI chatbot
- **JWT** for authentication
- **Firebase Admin** for push notifications
- **Node-Cron** for scheduled tasks

### Frontend (Web)
- **React 18** with Vite
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Recharts** for data visualization
- **Axios** for API calls

### Mobile
- **React Native** with Expo
- **React Navigation** for routing
- **Expo Notifications** for push notifications
- **AsyncStorage** for local storage

## 📁 Project Structure

```
saathi/
├── backend/                 # Node.js/Express API
│   ├── server.js           # Main server file
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── middleware/         # Auth & validation
├── frontend/               # React web application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # API client
│   │   ├── store/         # State management
│   │   └── utils/         # Helper functions
│   └── package.json
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/       # Screen components
│   │   └── api/           # API client
│   ├── App.js
│   └── package.json
├── .env.example           # Environment variables template
├── package.json           # Root package.json
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenAI API Key
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd health_wellness
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install all dependencies (backend, frontend, mobile)
npm run install-all
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saathi
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
# Optional: Firebase credentials for push notifications
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

### Running the Application

#### Backend
```bash
npm run dev
```
The API will be available at `http://localhost:5000`

#### Frontend (Web)
```bash
cd frontend
npm run dev
```
The web app will be available at `http://localhost:3000`

#### Mobile App
```bash
cd mobile
npm start
```
Then press:
- `a` for Android
- `i` for iOS
- `w` for web

## 📱 Mobile App Setup

### iOS
1. Install Xcode from Mac App Store
2. Install CocoaPods: `sudo gem install cocoapods`
3. Run `cd mobile/ios && pod install`
4. Run `npm run ios`

### Android
1. Install Android Studio
2. Set up Android SDK
3. Create an Android Virtual Device (AVD)
4. Run `npm run android`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/check-in` - Daily check-in
- `GET /api/user/gamification` - Get gamification stats

### Chat
- `POST /api/chat/session` - Create chat session
- `GET /api/chat/sessions` - Get all sessions
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/session/:id` - Get chat history

### Mood
- `POST /api/mood` - Log mood
- `GET /api/mood/history` - Get mood history
- `GET /api/mood/stats` - Get mood statistics
- `GET /api/mood/today` - Get today's mood

### Habits
- `POST /api/habit` - Create habit
- `GET /api/habit` - Get all habits
- `POST /api/habit/:id/complete` - Mark habit as complete
- `PUT /api/habit/:id` - Update habit
- `DELETE /api/habit/:id` - Delete habit

### Exercises
- `GET /api/exercise` - Get all exercises
- `POST /api/exercise/log` - Log exercise completion
- `GET /api/exercise/log/history` - Get exercise history

### Quizzes
- `GET /api/quiz` - Get all quizzes
- `POST /api/quiz/:id/submit` - Submit quiz answers
- `GET /api/quiz/results/history` - Get quiz results

### Scores
- `GET /api/score/today` - Get today's score
- `GET /api/score/history` - Get score history
- `GET /api/score/stats` - Get score statistics

### Books
- `GET /api/books` - Get all books
- `POST /api/books/:id/add` - Add book to library
- `GET /api/books/library/my-books` - Get user's library

## 🎯 Features in Detail

### AI Chatbot
The chatbot uses OpenAI's GPT-4 to provide:
- Emotional support and encouragement
- Evidence-based mental health advice
- CBT technique suggestions
- Personalized recommendations based on user data
- Context-aware responses using user's mood trends and habits

### Mood Tracking
- Rate mood on a scale of 1-10
- Select from 10 different emotions
- Add notes about triggers and activities
- Track by time of day
- View trends and patterns over time

### Habit System
- Create custom habits with categories
- Daily completion tracking
- Streak calculation
- Best streak recording
- Statistics and insights

### Gamification
- **XP System**: Earn points for all activities
  - Mood logging: +5 XP
  - Daily check-in: +10 XP
  - Habit completion: +10 XP
  - Exercise completion: +15 XP
  - Quiz completion: +20 XP
  - Chat engagement: +2 XP per message
- **Levels**: 100 XP per level
- **Badges**: Unlock achievements for milestones
- **Streaks**: Track consecutive days of activity

### Daily Scoring
Calculated based on:
- Mood score (30% weight)
- Habit completion rate (40% weight)
- Exercise completion (30% weight)

Provides:
- Overall wellness score (0-10)
- Component breakdown
- Personalized insights
- Recommendations for improvement

## 🔔 Push Notifications

The app supports push notifications for:
- Daily reminders (scheduled at 9 AM)
- Streak milestones
- Level-up achievements
- Habit reminders
- Mood check-in reminders

### Setting up Firebase (Optional)
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Cloud Messaging
3. Download service account credentials
4. Add credentials to `.env` file

## 🧪 Sample Data

### Creating Sample Exercises
```javascript
// Run this in MongoDB or create via API
const exercises = [
  {
    title: "5-Minute Breathing Exercise",
    description: "A quick breathing technique to reduce anxiety and stress",
    category: "breathing",
    duration: 5,
    difficulty: "beginner",
    instructions: [
      { step: 1, text: "Find a comfortable seated position" },
      { step: 2, text: "Close your eyes and take a deep breath in for 4 counts" },
      { step: 3, text: "Hold for 4 counts" },
      { step: 4, text: "Exhale slowly for 6 counts" },
      { step: 5, text: "Repeat for 5 minutes" }
    ],
    benefits: ["Reduces anxiety", "Lowers heart rate", "Improves focus"],
    isActive: true
  },
  // Add more exercises...
];
```

### Creating Sample Quizzes
```javascript
const quizzes = [
  {
    title: "Stress Assessment",
    description: "Evaluate your current stress levels",
    category: "stress",
    duration: 5,
    questions: [
      {
        questionText: "How often have you felt overwhelmed in the past week?",
        questionType: "multiple-choice",
        options: [
          { text: "Never", score: 0 },
          { text: "Sometimes", score: 2 },
          { text: "Often", score: 4 },
          { text: "Always", score: 6 }
        ]
      },
      // Add more questions...
    ],
    scoring: {
      type: "sum",
      ranges: [
        { min: 0, max: 10, label: "Low Stress", description: "Your stress levels are manageable", recommendations: ["Continue healthy habits"] },
        { min: 11, max: 20, label: "Moderate Stress", description: "Consider stress management", recommendations: ["Try breathing exercises", "Practice mindfulness"] },
        { min: 21, max: 40, label: "High Stress", description: "Seek support", recommendations: ["Consider professional help", "Practice self-care"] }
      ]
    },
    isActive: true
  }
];
```

## 🤝 Contributing

This is a demonstration project. If you'd like to contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🆘 Support

For issues or questions:
1. Check the documentation above
2. Review the code comments
3. Check API endpoint documentation
4. Ensure all environment variables are set correctly

## 🎓 Learning Resources

This project demonstrates:
- RESTful API design
- JWT authentication
- MongoDB data modeling
- React best practices
- State management with Zustand
- React Native mobile development
- OpenAI API integration
- Real-time notifications
- Gamification systems
- Data visualization

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Example for Railway
railway init
railway add
railway up
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy build folder
```

### Mobile App Deployment
```bash
# iOS
cd mobile
eas build --platform ios

# Android
eas build --platform android
```

## 📊 Database Schema

### Users
- Authentication info
- Profile data
- Gamification stats (level, XP, streak, badges)
- Preferences

### Moods
- User reference
- Score (1-10)
- Emotion
- Notes
- Timestamps

### Habits
- User reference
- Name, category, frequency
- Completions array
- Streak tracking

### Daily Scores
- User reference
- Overall score
- Component scores
- Insights & recommendations

### Chat Messages
- User reference
- Session ID
- Role (user/assistant)
- Content
- Context data

## 🎨 Customization

### Changing Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: { /* your colors */ },
  accent: { /* your colors */ }
}
```

### Adding New Features
1. Create database model in `backend/models/`
2. Add routes in `backend/routes/`
3. Create API functions in `frontend/src/lib/api.js`
4. Build UI components in `frontend/src/pages/`

## 🏁 Conclusion

This is a complete, production-ready wellness coaching platform with:
- ✅ Full-stack architecture
- ✅ AI integration
- ✅ Mobile apps (iOS & Android)
- ✅ Gamification
- ✅ Real-time features
- ✅ Modern UI/UX
- ✅ Scalable codebase

Perfect for:
- Learning full-stack development
- Building SaaS products
- Mental health tech projects
- Portfolio demonstrations

---

**Built with ❤️ for better mental health**

🤝 **Saathi - Your companion in wellness, always by your side**

