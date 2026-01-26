# Life Certificate Queue Management System - Frontend

A modern, accessible, and secure React frontend for the Life Certificate Queue Management System. This application provides a user-friendly interface for booking appointments, checking queue status, and managing the queue for Life Certificate verification.

## 🏛️ Government of India - Ministry of Social Justice and Empowerment

### Features

- **📅 Appointment Booking**: Book appointments for Life Certificate verification with priority for senior citizens (80+)
- **📊 Real-time Queue Status**: View live queue updates with 30-second polling
- **🔍 Status Check**: Check appointment status using Life Certificate number
- **📱 QR Code Verification**: Generate QR codes for appointment verification
- **📄 PDF Appointment Slips**: Download printable appointment slips
- **🌐 Multi-language Support**: English and Hindi translations
- **♿ WCAG 2.1 AA Compliant**: Full accessibility support with keyboard navigation
- **🔒 Admin Dashboard**: Secure queue management for authorized personnel

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **React Hook Form + Zod** for form validation
- **Axios** for API communication
- **Framer Motion** for animations
- **i18next** for internationalization
- **jsPDF** for PDF generation
- **qrcode.react** for QR codes
- **react-hot-toast** for notifications

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:5000`

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE=Life Certificate Queue Management System
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/
│   └── locales/          # Translation files
│       ├── en.json       # English translations
│       └── hi.json       # Hindi translations
├── src/
│   ├── api/              # API layer
│   │   ├── client.ts     # Axios instance
│   │   └── queue.ts      # Queue API functions
│   ├── components/
│   │   ├── common/       # Shared UI components
│   │   ├── forms/        # Form components
│   │   └── queue/        # Queue display components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app with routing
│   └── main.tsx          # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#003D82` | Main brand color, buttons, links |
| Accent | `#FF9933` | Highlights, badges, important info |
| Success | `#138808` | Success states, confirmations |
| Background | `#F0F4F8` | Page background |
| White | `#FFFFFF` | Cards, content areas |

### Typography

- **Headings**: Noto Sans (600 weight)
- **Body**: Inter (400/500 weight)
- **Hindi Text**: Noto Sans Devanagari

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero, stats, and quick actions |
| Booking | `/booking` | Appointment booking form |
| Queue Status | `/queue-status` | Real-time queue display |
| Check Status | `/check-status` | Individual status lookup |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin` | Queue management |
| About | `/about` | About the system |
| Help | `/help` | User guides and contact |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms of service |
| Sitemap | `/sitemap` | Site navigation |

## 🔌 API Integration

The frontend connects to a Flask REST API backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/enqueue` | POST | Add to queue |
| `/api/queue` | GET | Get all entries |
| `/api/queue/<id>` | GET | Get single entry |
| `/api/dequeue` | POST | Serve next |
| `/api/queue/<id>` | DELETE | Remove entry |
| `/api/stats` | GET | Queue statistics |
| `/api/health` | GET | Health check |

## ♿ Accessibility Features

- Skip to main content link
- Keyboard navigation support
- ARIA labels and roles
- Color contrast compliance
- Focus indicators
- Screen reader support
- Reduced motion support
- Font size controls

## 🔐 Admin Access

Demo credentials (for development only):
- **Username**: `admin`
- **Password**: `admin123`

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript check |

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🚢 Deployment

### Vercel

```bash
npm run build
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📄 License

© 2024 Government of India. All rights reserved.

## 🤝 Contributing

This is an official government project. For contributions, please contact the Ministry of Social Justice and Empowerment.

---

**Made with ❤️ for the citizens of India**
