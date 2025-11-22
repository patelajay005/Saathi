const express = require('express');
const { Quiz, QuizResult } = require('../models/Quiz');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all quizzes
router.get('/', auth, async (req, res) => {
  try {
    const { category } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    
    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
    
    res.json({ quizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get single quiz
router.get('/:quizId', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    
    if (!quiz) {
      return res.status(404).json({
        error: { message: 'Quiz not found' }
      });
    }
    
    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Submit quiz answers
router.post('/:quizId/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    
    const quiz = await Quiz.findById(req.params.quizId);
    
    if (!quiz) {
      return res.status(404).json({
        error: { message: 'Quiz not found' }
      });
    }
    
    // Calculate score
    let totalScore = 0;
    const processedAnswers = answers.map(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      let score = 0;
      
      if (question) {
        if (question.questionType === 'multiple-choice') {
          const option = question.options.find(o => o.text === answer.answer);
          score = option ? option.score : 0;
        } else if (question.questionType === 'scale') {
          score = answer.answer;
        } else if (question.questionType === 'yes-no') {
          score = answer.answer === 'yes' ? 1 : 0;
        }
      }
      
      totalScore += score;
      
      return {
        questionId: answer.questionId,
        answer: answer.answer,
        score
      };
    });
    
    // Determine result based on scoring ranges
    let result = {
      label: 'Results',
      description: 'Thank you for completing the quiz.',
      recommendations: []
    };
    
    if (quiz.scoring.ranges && quiz.scoring.ranges.length > 0) {
      const range = quiz.scoring.ranges.find(r => 
        totalScore >= r.min && totalScore <= r.max
      );
      
      if (range) {
        result = {
          label: range.label,
          description: range.description,
          recommendations: range.recommendations
        };
      }
    }
    
    // Save result
    const quizResult = new QuizResult({
      userId: req.userId,
      quizId: req.params.quizId,
      answers: processedAnswers,
      totalScore,
      result
    });
    
    await quizResult.save();
    
    // Award XP
    const user = await User.findById(req.userId);
    const xpEarned = 20;
    user.addXP(xpEarned);
    await user.save();
    
    res.json({
      message: `Quiz completed! +${xpEarned} XP`,
      result: quizResult,
      xpEarned
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get user's quiz history
router.get('/results/history', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.userId })
      .populate('quizId')
      .sort({ completedAt: -1 })
      .limit(50);
    
    res.json({ results });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get quiz result by ID
router.get('/results/:resultId', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      _id: req.params.resultId,
      userId: req.userId
    }).populate('quizId');
    
    if (!result) {
      return res.status(404).json({
        error: { message: 'Quiz result not found' }
      });
    }
    
    res.json({ result });
  } catch (error) {
    console.error('Get quiz result error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

