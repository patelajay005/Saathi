# 🚀 Complete Setup Guide - Saathi

**साथी - Your Wellness Companion**

This guide will walk you through setting up the entire Saathi platform step-by-step.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] Node.js (v16 or higher) installed
- [ ] MongoDB installed (local) OR MongoDB Atlas account
- [ ] OpenAI API account with API key
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command line access

### Optional (for mobile development):
- [ ] Xcode (for iOS development - Mac only)
- [ ] Android Studio (for Android development)
- [ ] Expo CLI (`npm install -g expo-cli`)

## 🔧 Step 1: Initial Setup

### 1.1 Clone or Navigate to Project
```bash
cd C:\Code\SAAS\health_welllness
```

### 1.2 Install Root Dependencies
```bash
npm install
```

### 1.3 Install All Project Dependencies
```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..

# Mobile (if developing mobile app)
cd mobile
npm install
cd ..
```

## 🗄️ Step 2: Database Setup

### Option A: Local MongoDB

1. **Install MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Install with default settings
   - MongoDB Compass (GUI) will be installed automatically

2. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB

   # Mac/Linux
   mongod
   ```

3. **Verify MongoDB is running**
   ```bash
   # Try connecting
   mongosh
   # Should connect successfully
   ```

### Option B: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier
   - Select your region
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access"
   - Add new database user
   - Save username and password

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password

## 🔑 Step 3: Get OpenAI API Key

1. **Create OpenAI Account**
   - Go to: https://platform.openai.com
   - Sign up or login

2. **Get API Key**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it "Wellness Coach"
   - Copy the key (you won't see it again!)

3. **Add Credits** (if needed)
   - Go to Billing
   - Add payment method
   - You get $5 free credit for new accounts

## ⚙️ Step 4: Environment Configuration

### 4.1 Create .env File
```bash
# In project root
copy .env.example .env
```

### 4.2 Edit .env File
Open `.env` in your editor and fill in:

```env
# Server
PORT=5000
NODE_ENV=development

# Database - Choose one:
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/{databasename}
# OR MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/wellness_coach

# Security
JWT_SECRET=your_super_secret_key_change_this_in_production_12345

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional: Firebase (for push notifications)
# Leave empty if not using push notifications
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### 4.3 Frontend Environment (Optional)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4.4 Mobile Environment
Edit `mobile/src/api/api.js` line 4:
```javascript
const API_URL = 'http://YOUR_LOCAL_IP:5000/api'; // e.g., http://192.168.1.100:5000/api
```

To find your local IP:
```bash
# Windows
ipconfig
# Look for "IPv4 Address" under your network adapter

# Mac/Linux
ifconfig
# Look for "inet" under en0 or your network interface
```

## 🏃 Step 5: Running the Application

### 5.1 Start Backend
```bash
# In project root or backend directory
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📝 Environment: development
```

### 5.2 Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 5.3 Start Mobile App (New Terminal - Optional)
```bash
cd mobile
npm start
```

Follow the Expo instructions:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on your phone

## ✅ Step 6: Verify Installation

### 6.1 Test Backend
Open browser or use curl:
```bash
curl http://localhost:5000
```

Should return:
```json
{
  "message": "🌟 AI Wellness Coach API",
  "version": "1.0.0",
  "status": "running"
}
```

### 6.2 Test Frontend
Open browser:
```
http://localhost:3000
```

You should see the landing page with "Your Personal AI Wellness Coach"

### 6.3 Create Test Account
1. Click "Get Started Free"
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Create Account"
4. You should be redirected to the dashboard

## 📊 Step 7: Seed Sample Data (Optional)

### 7.1 Create Sample Exercises

Open MongoDB Compass and connect to your database, then run:

```javascript
// In MongoDB Compass > wellness_coach > exercises collection
[
  {
    title: "5-Minute Breathing Exercise",
    description: "A calming breathing technique to reduce stress and anxiety instantly.",
    category: "breathing",
    duration: 5,
    difficulty: "beginner",
    instructions: [
      { step: 1, text: "Find a quiet, comfortable place to sit or lie down", duration: 30 },
      { step: 2, text: "Close your eyes and relax your shoulders", duration: 20 },
      { step: 3, text: "Breathe in slowly through your nose for 4 counts", duration: 60 },
      { step: 4, text: "Hold your breath for 4 counts", duration: 60 },
      { step: 5, text: "Exhale slowly through your mouth for 6 counts", duration: 80 },
      { step: 6, text: "Repeat this cycle for 5 minutes", duration: 300 }
    ],
    benefits: [
      "Reduces anxiety and stress",
      "Lowers heart rate and blood pressure",
      "Improves focus and concentration",
      "Promotes relaxation"
    ],
    tags: ["stress", "anxiety", "quick", "beginner-friendly"],
    isActive: true
  },
  {
    title: "Gratitude Journaling",
    description: "Write down three things you're grateful for to boost positivity and well-being.",
    category: "journaling",
    duration: 10,
    difficulty: "beginner",
    instructions: [
      { step: 1, text: "Get your journal or open a notes app", duration: 30 },
      { step: 2, text: "Think about your day and recent experiences", duration: 120 },
      { step: 3, text: "Write down 3 specific things you're grateful for", duration: 300 },
      { step: 4, text: "Reflect on why each one is meaningful to you", duration: 180 }
    ],
    benefits: [
      "Increases positive emotions",
      "Improves mental health",
      "Enhances resilience",
      "Better sleep quality"
    ],
    tags: ["gratitude", "mindfulness", "writing", "daily-practice"],
    isActive: true
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Systematically tense and relax different muscle groups to reduce physical tension.",
    category: "progressive-relaxation",
    duration: 15,
    difficulty: "beginner",
    instructions: [
      { step: 1, text: "Lie down in a comfortable position", duration: 30 },
      { step: 2, text: "Starting with your feet, tense the muscles for 5 seconds", duration: 5 },
      { step: 3, text: "Release and notice the relaxation for 10 seconds", duration: 10 },
      { step: 4, text: "Move up to your calves and repeat", duration: 15 },
      { step: 5, text: "Continue with thighs, abdomen, chest, arms, and face", duration: 600 },
      { step: 6, text: "End with deep breathing and full body awareness", duration: 120 }
    ],
    benefits: [
      "Reduces muscle tension",
      "Decreases anxiety",
      "Improves sleep",
      "Enhances body awareness"
    ],
    tags: ["relaxation", "tension", "body-scan", "stress-relief"],
    isActive: true
  },
  {
    title: "Mindful Walking",
    description: "Practice mindfulness while walking to ground yourself and reduce stress.",
    category: "mindfulness",
    duration: 20,
    difficulty: "beginner",
    instructions: [
      { step: 1, text: "Find a quiet place to walk (indoor or outdoor)", duration: 60 },
      { step: 2, text: "Start walking at a comfortable pace", duration: 30 },
      { step: 3, text: "Focus on the sensation of your feet touching the ground", duration: 180 },
      { step: 4, text: "Notice your breathing and body movements", duration: 180 },
      { step: 5, text: "If your mind wanders, gently bring focus back to walking", duration: 300 },
      { step: 6, text: "Continue for 15-20 minutes", duration: 600 }
    ],
    benefits: [
      "Reduces stress and anxiety",
      "Improves focus",
      "Enhances mood",
      "Combines exercise with mindfulness"
    ],
    tags: ["mindfulness", "exercise", "outdoor", "meditation"],
    isActive: true
  },
  {
    title: "Cognitive Reframing (CBT)",
    description: "Challenge and reframe negative thoughts to improve mental well-being.",
    category: "CBT",
    duration: 15,
    difficulty: "intermediate",
    instructions: [
      { step: 1, text: "Identify a negative thought you've been having", duration: 120 },
      { step: 2, text: "Write down the thought exactly as it appears", duration: 120 },
      { step: 3, text: "Ask: What evidence supports this thought?", duration: 180 },
      { step: 4, text: "Ask: What evidence contradicts this thought?", duration: 180 },
      { step: 5, text: "Create a balanced, realistic alternative thought", duration: 180 },
      { step: 6, text: "Practice replacing the negative thought with the new one", duration: 120 }
    ],
    benefits: [
      "Reduces negative thinking patterns",
      "Improves emotional regulation",
      "Enhances problem-solving",
      "Builds resilience"
    ],
    tags: ["CBT", "cognitive", "therapy", "thought-work"],
    isActive: true
  }
]
```

### 7.2 Create Sample Quiz

```javascript
// In MongoDB Compass > wellness_coach > quizzes collection
{
  title: "Stress Level Assessment",
  description: "Evaluate your current stress levels and get personalized recommendations.",
  category: "stress",
  duration: 5,
  questions: [
    {
      questionText: "How often have you felt nervous or stressed in the past week?",
      questionType: "multiple-choice",
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 2 },
        { text: "More than half the days", score: 4 },
        { text: "Nearly every day", score: 6 }
      ],
      order: 1
    },
    {
      questionText: "How often have you felt unable to control important things in your life?",
      questionType: "multiple-choice",
      options: [
        { text: "Never", score: 0 },
        { text: "Almost never", score: 1 },
        { text: "Sometimes", score: 3 },
        { text: "Fairly often", score: 5 },
        { text: "Very often", score: 7 }
      ],
      order: 2
    },
    {
      questionText: "How often have you felt difficulties piling up so high you couldn't overcome them?",
      questionType: "multiple-choice",
      options: [
        { text: "Never", score: 0 },
        { text: "Almost never", score: 1 },
        { text: "Sometimes", score: 3 },
        { text: "Fairly often", score: 5 },
        { text: "Very often", score: 7 }
      ],
      order: 3
    },
    {
      questionText: "Rate your sleep quality in the past week",
      questionType: "scale",
      scaleMin: 1,
      scaleMax: 10,
      order: 4
    }
  ],
  scoring: {
    type: "sum",
    ranges: [
      {
        min: 0,
        max: 8,
        label: "Low Stress",
        description: "Your stress levels appear to be manageable. You're doing a great job maintaining your mental health!",
        recommendations: [
          "Continue your healthy habits",
          "Practice regular self-care",
          "Maintain work-life balance"
        ]
      },
      {
        min: 9,
        max: 16,
        label: "Moderate Stress",
        description: "You're experiencing moderate stress levels. This is common, but it's important to address it.",
        recommendations: [
          "Try daily breathing exercises",
          "Practice mindfulness meditation",
          "Ensure adequate sleep (7-9 hours)",
          "Exercise regularly",
          "Talk to friends or family about your feelings"
        ]
      },
      {
        min: 17,
        max: 40,
        label: "High Stress",
        description: "You're experiencing high stress levels. It's important to take action and seek support.",
        recommendations: [
          "Consider speaking with a mental health professional",
          "Practice daily stress-reduction techniques",
          "Prioritize self-care activities",
          "Reduce stressors where possible",
          "Build a strong support network",
          "Try CBT exercises in the app"
        ]
      }
    ]
  },
  isActive: true
}
```

### 7.3 Create Sample Books

```javascript
// In MongoDB Compass > wellness_coach > books collection
[
  {
    title: "Feeling Good: The New Mood Therapy",
    author: "David D. Burns",
    description: "A groundbreaking book on cognitive behavioral therapy that has helped millions overcome depression and anxiety.",
    category: "CBT",
    publicationYear: 1980,
    rating: 4.5,
    tags: ["CBT", "depression", "anxiety", "self-help", "classic"],
    keyTakeaways: [
      "Thoughts create feelings - change your thoughts to change your mood",
      "Identify and challenge cognitive distortions",
      "Use the triple-column technique to reframe negative thoughts",
      "Depression is not caused by events, but by your interpretation of them"
    ],
    recommendedFor: ["Anyone dealing with depression or anxiety", "Those interested in CBT", "Mental health professionals"],
    difficulty: "beginner",
    amazonLink: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336",
    isActive: true
  },
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    description: "A guide to spiritual enlightenment and living in the present moment.",
    category: "mindfulness",
    publicationYear: 1997,
    rating: 4.3,
    tags: ["mindfulness", "presence", "spirituality", "consciousness"],
    keyTakeaways: [
      "The present moment is all you ever have",
      "Stop identifying with your mind and thoughts",
      "Surrender to what is",
      "Find the gap between thoughts"
    ],
    recommendedFor: ["Those interested in mindfulness", "Spiritual seekers", "Anyone feeling overwhelmed"],
    difficulty: "intermediate",
    amazonLink: "https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808",
    isActive: true
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy and proven way to build good habits and break bad ones.",
    category: "habits",
    publicationYear: 2018,
    rating: 4.8,
    tags: ["habits", "productivity", "self-improvement", "behavior-change"],
    keyTakeaways: [
      "Small changes lead to remarkable results",
      "Focus on systems, not goals",
      "Make it obvious, attractive, easy, and satisfying",
      "The 1% improvement philosophy"
    ],
    recommendedFor: ["Anyone wanting to build better habits", "Those struggling with consistency", "Personal development enthusiasts"],
    difficulty: "beginner",
    amazonLink: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
    isActive: true
  },
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    description: "Brain, mind, and body in the healing of trauma.",
    category: "psychology",
    publicationYear: 2014,
    rating: 4.7,
    tags: ["trauma", "PTSD", "healing", "neuroscience", "therapy"],
    keyTakeaways: [
      "Trauma is stored in the body, not just the mind",
      "Traditional talk therapy isn't always enough",
      "Body-based therapies can be powerful for trauma healing",
      "Understanding the neuroscience of trauma"
    ],
    recommendedFor: ["Trauma survivors", "Mental health professionals", "Those interested in neuroscience"],
    difficulty: "advanced",
    amazonLink: "https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/0143127748",
    isActive: true
  },
  {
    title: "Mindfulness in Plain English",
    author: "Bhante Henepola Gunaratana",
    description: "A practical guide to meditation and mindfulness practice.",
    category: "meditation",
    publicationYear: 1992,
    rating: 4.6,
    tags: ["meditation", "mindfulness", "Buddhism", "practice"],
    keyTakeaways: [
      "Clear, practical instructions for meditation",
      "Understanding the purpose of mindfulness",
      "Common meditation obstacles and how to overcome them",
      "Integrating mindfulness into daily life"
    ],
    recommendedFor: ["Meditation beginners", "Those seeking clarity on practice", "Anyone interested in mindfulness"],
    difficulty: "beginner",
    amazonLink: "https://www.amazon.com/Mindfulness-Plain-English-Bhante-Gunaratana/dp/0861719069",
    isActive: true
  }
]
```

## 🧪 Step 8: Test All Features

### 8.1 Web Application Tests
1. ✅ Register a new account
2. ✅ Login with account
3. ✅ View dashboard
4. ✅ Log a mood entry
5. ✅ Create a habit
6. ✅ Complete a habit
7. ✅ Chat with AI coach
8. ✅ Complete an exercise
9. ✅ Take a quiz
10. ✅ Browse books
11. ✅ Add book to library
12. ✅ Daily check-in
13. ✅ View profile

### 8.2 Mobile App Tests
1. ✅ Login on mobile
2. ✅ View dashboard
3. ✅ Log mood
4. ✅ Complete habit
5. ✅ Chat with AI
6. ✅ View profile

## 🐛 Troubleshooting

### MongoDB Connection Issues
**Error**: `MongoServerError: Authentication failed`
- Check username/password in connection string
- Ensure database user has proper permissions
- Verify network access is configured

**Error**: `connect ECONNREFUSED`
- MongoDB service is not running
- Start MongoDB: `net start MongoDB` (Windows) or `mongod` (Mac/Linux)

### OpenAI API Issues
**Error**: `401 Unauthorized`
- Check API key is correct in `.env`
- Ensure you have credits in your OpenAI account
- Verify API key hasn't expired

**Error**: `429 Too Many Requests`
- You've hit rate limits
- Upgrade your OpenAI plan
- Wait before trying again

### Port Already in Use
**Error**: `EADDRINUSE :::5000`
- Another process is using port 5000
- Kill the process: `netstat -ano | findstr :5000` (Windows)
- Or change port in `.env` file

### Frontend Can't Connect to Backend
**Error**: Network request failed
- Ensure backend is running on correct port
- Check CORS configuration
- Verify API URL in frontend `.env`

### Mobile App Can't Connect
**Error**: Network request failed
- Use your local IP address, not localhost
- Ensure phone/emulator is on same network
- Check firewall isn't blocking connections

## 📱 Step 9: Mobile Development Setup

### iOS Setup (Mac Only)
1. Install Xcode from App Store
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```
4. Install pods:
   ```bash
   cd mobile/ios
   pod install
   cd ../..
   ```

### Android Setup
1. Install Android Studio
2. Install Android SDK (through Android Studio)
3. Create virtual device (AVD) in Android Studio
4. Add Android SDK to PATH:
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## 🎉 Success!

If you've made it this far, congratulations! Your AI Wellness Coach platform is now fully set up and running.

### What's Next?
- Explore all features
- Customize the platform
- Add your own exercises and quizzes
- Deploy to production
- Share with users

## 📞 Need Help?

If you encounter issues:
1. Check this guide again carefully
2. Review error messages
3. Check the main README.md
4. Verify all environment variables
5. Ensure all services are running

## 🎯 Quick Start Commands

```bash
# Start everything (run each in separate terminal)

# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Mobile (optional)
cd mobile && npm start
```

## ✅ Final Checklist

- [ ] MongoDB is running and connected
- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] You can register and login
- [ ] AI chatbot responds to messages
- [ ] Mood logging works
- [ ] Habit creation and completion works
- [ ] Daily score is calculated
- [ ] Mobile app connects (if using)

---

**🎊 You're all set! Enjoy building with Saathi - Your Wellness Companion!**

**🤝 साथी - Walking together towards better mental health**

