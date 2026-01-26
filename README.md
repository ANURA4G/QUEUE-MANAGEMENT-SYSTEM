# Hybrid Queue Management System

A modern, accessible queue management system designed for government services like Life Certificate verification. Built with React (TypeScript) frontend and Flask (Python) backend.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 🌟 Features

- **Priority Queue System** - Senior citizens (80+) get automatic priority
- **Hybrid Verification** - Support for both in-person and online verification modes
- **Real-time Updates** - Live queue status with automatic polling
- **Bilingual Support** - English and Hindi language options
- **Accessibility First** - WCAG compliant, screen reader friendly
- **Admin Dashboard** - Manage queue, view statistics, and analytics
- **Mobile Responsive** - Works on all device sizes
- **Offline Support** - Basic functionality available offline

## 🏗️ Project Structure

```
├── backend/                 # Flask API Server
│   ├── app.py              # Application entry point
│   ├── config.py           # Configuration management
│   ├── requirements.txt    # Python dependencies
│   ├── vercel.json         # Vercel deployment config
│   ├── queue_system/       # Core queue logic
│   │   ├── manager.py      # Queue manager with heap-based priority
│   │   ├── models.py       # Data models
│   │   └── utils.py        # Utility functions
│   └── routes/             # API routes
│       └── queue_routes.py # Queue endpoints
│
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/           # API client and endpoints
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── vercel.json        # Vercel deployment config
│
├── .gitignore             # Git ignore rules
├── README.md              # This file
└── CONTRIBUTING.md        # Contribution guidelines
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.9
- **npm** or **yarn**

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and configure
cp .env.example .env

# Run development server
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## ⚙️ Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Environment mode | `development` |
| `SECRET_KEY` | Flask secret key | - |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `5000` |
| `DEBUG` | Enable debug mode | `true` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `*` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `10000` |
| `VITE_APP_NAME` | Application name | `Life Certificate Queue Management System` |
| `VITE_ENABLE_ADMIN` | Enable admin features | `true` |
| `VITE_DEFAULT_LANGUAGE` | Default language | `en` |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/queue` | Get full queue state |
| `POST` | `/queue/enqueue` | Add person to queue |
| `POST` | `/queue/dequeue` | Serve next person |
| `GET` | `/queue/entry/:certNo` | Get person's queue position |
| `DELETE` | `/queue/entry/:certNo` | Remove person from queue |
| `GET` | `/queue/stats` | Get queue statistics |
| `POST` | `/queue/clear` | Clear entire queue |

## 🚢 Deployment

### Deploy to Vercel

#### Backend

1. Import your repository in Vercel
2. Set root directory to `backend`
3. Configure environment variables in Vercel dashboard
4. Deploy

#### Frontend

1. Import your repository in Vercel
2. Set root directory to `frontend`
3. Set `VITE_API_BASE_URL` to your backend URL
4. Deploy

### Environment Variables on Vercel

Set these in your Vercel project settings:

**Backend:**
```
FLASK_ENV=production
SECRET_KEY=your-production-secret-key
CORS_ORIGINS=https://your-frontend-domain.vercel.app
DEBUG=false
```

**Frontend:**
```
VITE_API_BASE_URL=https://your-backend-domain.vercel.app
VITE_ENABLE_ADMIN=true
```

## 🧪 Testing

### Backend

```bash
cd backend
python -m pytest tests/
```

### Frontend

```bash
cd frontend
npm run test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 🙏 Acknowledgments

- Designed with accessibility guidelines from WCAG 2.1
- Government of India design standards compliance
- Built for pensioners and senior citizens

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for public service
