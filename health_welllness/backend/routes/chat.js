const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { ChatMessage, ChatSession } = require('../models/ChatMessage');
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new chat session
router.post('/session', auth, async (req, res) => {
  try {
    const sessionId = uuidv4();
    
    const session = new ChatSession({
      userId: req.userId,
      sessionId,
      title: 'New Conversation'
    });
    
    await session.save();
    
    res.json({
      message: 'Chat session created',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get all chat sessions
router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.userId })
      .sort({ lastMessageAt: -1 })
      .limit(50);
    
    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get chat history for a session
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const messages = await ChatMessage.find({
      userId: req.userId,
      sessionId
    }).sort({ timestamp: 1 });
    
    const session = await ChatSession.findOne({
      userId: req.userId,
      sessionId
    });
    
    res.json({
      session,
      messages
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Send message and get AI response
router.post('/message', auth, async (req, res) => {
  try {
    const { sessionId, message, language = 'en' } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({
        error: { message: 'Session ID and message are required' }
      });
    }
    
    // Save user message
    const userMessage = new ChatMessage({
      userId: req.userId,
      sessionId,
      role: 'user',
      content: message
    });
    await userMessage.save();
    
    // Get conversation history (last 10 messages for context)
    const history = await ChatMessage.find({
      userId: req.userId,
      sessionId
    })
      .sort({ timestamp: -1 })
      .limit(10);
    
    // Reverse to get chronological order
    const conversationHistory = history.reverse().map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Generate AI response
    const aiResponse = await aiService.generateResponse(conversationHistory, req.userId, language);
    
    // Save AI message
    const assistantMessage = new ChatMessage({
      userId: req.userId,
      sessionId,
      role: 'assistant',
      content: aiResponse.content,
      tokens: aiResponse.tokens,
      model: aiResponse.model
    });
    await assistantMessage.save();
    
    // Update session
    await ChatSession.findOneAndUpdate(
      { userId: req.userId, sessionId },
      {
        lastMessageAt: new Date(),
        $inc: { messageCount: 2 }
      }
    );
    
    // Award XP for engagement
    const user = await require('../models/User').findById(req.userId);
    user.addXP(2);
    await user.save();
    
    res.json({
      userMessage,
      assistantMessage,
      xpEarned: 2
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: { message: error.message || 'Failed to generate response' }
    });
  }
});

// Delete chat session
router.delete('/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await ChatMessage.deleteMany({ userId: req.userId, sessionId });
    await ChatSession.deleteOne({ userId: req.userId, sessionId });
    
    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get suggested exercises based on conversation
router.post('/suggest-exercises', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    const suggestions = await aiService.suggestExercises(req.userId, message);
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Suggest exercises error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

