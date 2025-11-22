const OpenAI = require('openai');
const User = require('../models/User');
const Mood = require('../models/Mood');
const Habit = require('../models/Habit');
const DailyScore = require('../models/DailyScore');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIService {
  constructor() {
    this.systemPrompt = `You are a compassionate and knowledgeable AI wellness coach. Your role is to:
- Provide emotional support and encouragement
- Offer evidence-based mental health advice and coping strategies
- Suggest specific CBT techniques, mindfulness exercises, and breathing techniques
- Help users build healthy habits with practical steps
- Provide personalized recommendations based on their mood and progress
- Be empathetic, non-judgmental, and supportive
- Use emojis appropriately to make conversations warm and engaging
- Ask follow-up questions to understand their situation better
- Give actionable advice they can use immediately

IMPORTANT: You ARE able to help and support users. Engage actively with their concerns.
- For low mood: Suggest activities, exercises, or perspective shifts
- For stress/anxiety: Offer breathing exercises, grounding techniques
- For motivation: Provide encouragement and break down goals into small steps

Only if a user expresses thoughts of self-harm or severe crisis, then encourage professional help.
Otherwise, provide helpful, practical wellness coaching.

Keep responses warm, supportive, and actionable (2-4 paragraphs). Focus on practical advice and positive reinforcement.`;
  }

  async getUserContext(userId) {
    try {
      const user = await User.findById(userId);
      
      // Get recent moods (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentMoods = await Mood.find({
        userId,
        date: { $gte: sevenDaysAgo }
      }).sort({ date: -1 }).limit(7);
      
      // Get active habits
      const habits = await Habit.find({ userId, isActive: true }).limit(5);
      
      // Get latest daily score
      const latestScore = await DailyScore.findOne({ userId })
        .sort({ date: -1 })
        .limit(1);
      
      const avgMood = recentMoods.length > 0
        ? (recentMoods.reduce((sum, m) => sum + m.score, 0) / recentMoods.length).toFixed(1)
        : 'N/A';
      
      return {
        level: user.gamification.level,
        xp: user.gamification.xp,
        streak: user.gamification.streak,
        averageMood: avgMood,
        recentMoodTrend: this.getMoodTrend(recentMoods),
        activeHabits: habits.map(h => ({
          name: h.name,
          streak: h.streak,
          category: h.category
        })),
        latestScore: latestScore ? latestScore.overallScore : 'N/A'
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return {};
    }
  }

  getMoodTrend(moods) {
    if (moods.length < 2) return 'stable';
    
    const recent = moods.slice(0, 3);
    const older = moods.slice(3, 6);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, m) => sum + m.score, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.score, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 1) return 'improving';
    if (diff < -1) return 'declining';
    return 'stable';
  }

  async generateResponse(messages, userId, language = 'en') {
    try {
      // Get user context
      const context = await this.getUserContext(userId);
      
      // Language-specific instructions
      const languageInstructions = {
        en: 'Respond in English.',
        es: 'Responde en español (Spanish).',
        fr: 'Répondez en français (French).',
        de: 'Antworte auf Deutsch (German).',
        it: 'Rispondi in italiano (Italian).',
        pt: 'Responda em português (Portuguese).',
        zh: 'Please respond in Chinese (中文).',
        ja: 'Please respond in Japanese (日本語).',
        ko: 'Please respond in Korean (한국어).',
        ar: 'Please respond in Arabic (العربية).',
        hi: 'Please respond in Hindi (हिन्दी).',
        ru: 'Отвечай на русском языке (Russian).',
        nl: 'Antwoord in het Nederlands (Dutch).',
        pl: 'Odpowiedz po polsku (Polish).',
        tr: 'Türkçe cevap ver (Turkish).'
      };
      
      const langInstruction = languageInstructions[language] || languageInstructions.en;
      
      // Create context message
      const contextMessage = {
        role: 'system',
        content: `${this.systemPrompt}

${langInstruction}

Current user context:
- Level: ${context.level}
- Current Streak: ${context.streak} days
- Average Mood (7 days): ${context.averageMood}/10
- Mood Trend: ${context.recentMoodTrend}
- Latest Overall Score: ${context.latestScore}/10
- Active Habits: ${context.activeHabits.map(h => h.name).join(', ') || 'None'}

Use this context to personalize your responses and provide relevant encouragement.`
      };
      
      // Combine system message with conversation history
      const allMessages = [contextMessage, ...messages];
      
      // Generate response
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 500
      });
      
      return {
        content: response.choices[0].message.content,
        tokens: response.usage.total_tokens,
        model: response.model
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  async generateDailyInsight(userId) {
    try {
      const context = await this.getUserContext(userId);
      
      const prompt = `Based on the user's wellness data:
- Streak: ${context.streak} days
- Average Mood: ${context.averageMood}/10
- Mood Trend: ${context.recentMoodTrend}
- Overall Score: ${context.latestScore}/10

Generate a brief, encouraging daily insight (2-3 sentences) with one actionable tip for today. Include an emoji.`;
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 150
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating daily insight:', error);
      return "Keep up the great work! Remember, small steps lead to big changes. 🌟";
    }
  }

  async suggestExercises(userId, userMessage) {
    try {
      const context = await this.getUserContext(userId);
      
      const prompt = `The user said: "${userMessage}"
      
User context:
- Mood Trend: ${context.recentMoodTrend}
- Average Mood: ${context.averageMood}/10

Suggest 2-3 specific wellness exercises (CBT techniques, mindfulness, breathing exercises, etc.) that would be helpful. Be brief and specific.`;
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error suggesting exercises:', error);
      return "Try a 5-minute breathing exercise or a short mindfulness meditation.";
    }
  }
}

module.exports = new AIService();

