import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI assistant powered by Gemma 3 27B. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {      // Use environment variable for API URL or fallback to localhost
      const API_URL = process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_URL || 'https://webdemo55.onrender.com'
        : 'http://localhost:5000';
        
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the server. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="App">
      <header className="main-header">
        <h1>🤖 Gemma 3 27B Chatbot</h1>
        <p>Powered by Google's Gemma 3 27B - Your AI Assistant!</p>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h2>AI Assistant Demo</h2>
          <p>Chat with Gemma 3 27B, one of Google's most advanced language models.</p>
          
          <div className="feature-cards">
            <div className="card">
              <h3>💬 Live Chat</h3>
              <p>Real-time conversations with Gemma 3 27B AI model</p>
            </div>
            <div className="card">
              <h3>🎯 Smart Responses</h3>
              <p>Intelligent and contextual replies powered by advanced AI</p>
            </div>
            <div className="card">
              <h3>🚀 Production Ready</h3>
              <p>Deployed on Render with secure API integration</p>
            </div>
          </div>
        </section>

        <section className="chatbot-section">
          <div className="chat-container">
            <h3>💬 Chat with Gemma 3 27B</h3>
            <div className="chat-window">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}
                >
                  {message.text}
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message bot-message loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  Gemma is thinking...
                </div>
              )}
            </div>
            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Ask Gemma 3 anything..." 
                className="chat-input"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={isLoading || inputValue.trim() === ''}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <p>© 2025 Gemma 3 27B Chatbot - Powered by Google AI</p>
      </footer>
    </div>
  );
}

export default App;
