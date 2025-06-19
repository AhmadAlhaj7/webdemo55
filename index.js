const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com', 'https://your-frontend-domain.netlify.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// System prompt for strict, concise responses
const SYSTEM_PROMPT = `You are a helpful AI assistant. You must:
- Give concise, direct answers (max 2-3 sentences)
- Be strictly professional and factual
- Avoid long explanations unless specifically asked
- If you don't know something, say "I don't know" clearly
- Stay focused on the user's exact question
- Do not ask follow-up questions unless necessary`;

// Google AI Studio implementation for Gemma 3 27B
async function callGemma3API(message) {
  try {
    console.log('🤖 Calling Gemma 3 27B API...');
    
    const response = await axios.post(
      `${process.env.GEMMA_API_URL}?key=${process.env.GEMMA_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`
          }]
        }],
        generationConfig: {
          temperature: 0.2,          // Low temperature for more focused responses
          maxOutputTokens: 150,      // Limit response length
          topP: 0.8,                 // Focus on most likely tokens
          topK: 20,                  // Consider top 20 tokens
          stopSequences: ["\n\n"],   // Stop at double newlines
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    if (response.data.candidates && response.data.candidates.length > 0) {
      const generatedText = response.data.candidates[0].content.parts[0].text.trim();
      console.log('✅ Gemma 3 response received');
      return generatedText;
    } else {
      throw new Error('No response generated from Gemma 3');
    }
    
  } catch (error) {
    console.error('❌ Gemma 3 API Error:', error.response?.data || error.message);
    
    // Handle specific error types
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.response?.status === 403) {
      throw new Error('API key authentication failed.');
    } else if (error.response?.status >= 500) {
      throw new Error('Gemma 3 service is temporarily unavailable.');
    } else {
      throw new Error('Failed to get response from Gemma 3. Please try again.');
    }
  }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (message.trim().length > 1000) {
      return res.status(400).json({ error: 'Message too long. Please keep it under 1000 characters.' });
    }

    console.log('📝 User message:', message);
    
    // Call Gemma 3 API
    const botResponse = await callGemma3API(message.trim());
    
    console.log('🤖 Bot response:', botResponse);
    
    res.json({ 
      response: botResponse,
      timestamp: new Date().toISOString(),
      model: 'gemma-3-27b'
    });
    
  } catch (error) {
    console.error('💥 Chat endpoint error:', error);
    
    res.status(500).json({ 
      error: error.message || 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Gemma 3 27B Chatbot Server is running',
    timestamp: new Date().toISOString(),
    model: 'gemma-3-27b',
    apiConfigured: !!(process.env.GEMMA_API_KEY && process.env.GEMMA_API_URL)
  });
});

// Root endpoint for Render deployment verification
app.get('/', (req, res) => {
  res.json({
    message: 'Gemma 3 27B Chatbot API Server',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat (POST)',
      test: '/api/test'
    },
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to verify API connection
app.get('/api/test', async (req, res) => {
  try {
    const testResponse = await callGemma3API('Hello, are you working?');
    res.json({
      status: 'API connection successful',
      testResponse: testResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'API connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Gemma 3 27B Chatbot Server running on port ${PORT}`);
  console.log(`🔑 API Key: ${process.env.GEMMA_API_KEY ? '✅ Configured' : '❌ NOT CONFIGURED'}`);
  console.log(`🌐 API URL: ${process.env.GEMMA_API_URL ? '✅ Configured' : '❌ NOT CONFIGURED'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log('---');
  console.log('Ready to chat with Gemma 3 27B! 🤖');
});
