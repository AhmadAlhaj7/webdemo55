# Gemma 3 27B Full-Stack Chatbot

A complete full-stack chatbot application powered by Google's Gemma 3 27B model.

## 🏗️ Project Structure

```
webdemo55/
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express backend
│   ├── index.js
│   ├── .env
│   └── package.json
└── package.json     # Root package.json
```

## 🚀 Features

- **🤖 Gemma 3 27B Integration**: Powered by Google's latest AI model
- **⚛️ React Frontend**: Modern, responsive chat interface
- **🚀 Express Backend**: Fast and reliable API server
- **🔒 Secure**: Environment variables for API keys
- **📱 Mobile Friendly**: Responsive design works on all devices
- **⚡ Production Ready**: Optimized for cloud deployment

## 🛠️ Local Development

### Quick Start (All Services)
```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev
```

### Individual Services
```bash
# Frontend only (runs on http://localhost:3000)
npm run dev:client

# Backend only (runs on http://localhost:5000)
npm run dev:server
```

## 🌐 API Endpoints

- `GET /` - Server status and info
- `GET /api/health` - Health check
- `POST /api/chat` - Chat with Gemma 3
- `GET /api/test` - Test API connection

## 🔧 Environment Setup

### Server (.env in server folder)
```env
GEMMA_API_KEY=your_google_ai_studio_api_key
GEMMA_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemma-2-27b-it:generateContent
NODE_ENV=development
```

### Client (optional .env.local in client folder)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Backend (Render)
1. Push to GitHub
2. Connect Render to your repo
3. Set environment variables in Render dashboard
4. Deploy as Web Service

### Frontend (Netlify/Vercel)
1. Build: `npm run build:client`
2. Deploy `client/build` folder
3. Set `REACT_APP_API_URL` to your backend URL

## 📱 Chat Request Format

```json
POST /api/chat
{
  "message": "Your message here"
}
```

## 🤖 Response Format

```json
{
  "response": "AI response from Gemma 3",
  "timestamp": "2025-06-19T...",
  "model": "gemma-3-27b"
}
```

## 🔧 Scripts

- `npm run install:all` - Install all dependencies
- `npm run dev` - Run both frontend and backend
- `npm run dev:client` - Run frontend only
- `npm run dev:server` - Run backend only  
- `npm run build:client` - Build frontend for production

## 👨‍💻 Author

Ahmad Alhaj (@ahmadalhaj7)

## 📄 License

MIT
