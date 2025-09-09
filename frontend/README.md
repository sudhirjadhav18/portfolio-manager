# Frontend - Portfolio Manager

React frontend for the Portfolio Manager application.

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **ESLint** - Code linting

## 🚀 Development

### Prerequisites
- Node.js 20+
- Backend server running on `http://localhost:4000`

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev  # http://localhost:5173
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📁 Project Structure

```
src/
├── api/              # API client configuration
│   └── axios.ts
├── auth/             # Authentication
│   ├── AuthContext.ts    # Context definition
│   ├── AuthProvider.tsx  # Auth provider component
│   ├── ProtectedRoute.tsx # Route protection
│   └── useAuth.ts         # Auth hook
├── App.tsx           # Main app component
├── Dashboard.tsx     # Dashboard page
├── Login.tsx         # Login page
└── main.tsx          # App entry point
```

## 🔐 Authentication

The app uses JWT-based authentication with HTTP-only cookies:

- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Logout**: `POST /api/auth/logout`
- **Current User**: `GET /api/auth/me`

### Auth Context Usage
```tsx
import { useAuth } from './auth/useAuth';

function MyComponent() {
  const { user, login, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Login />;
  
  return <div>Welcome, {user.name}!</div>;
}
```

## 🎨 Styling

Currently using basic CSS. Consider adding:
- Tailwind CSS
- Styled Components
- CSS Modules
- Material-UI

## 🔧 Configuration

### Environment Variables
Create `.env.local` for local development:
```env
VITE_API_URL=http://localhost:4000
```

### Vite Configuration
See `vite.config.ts` for build configuration.

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

The built files will be in the `dist/` directory.

## 🧪 Testing

Testing setup not yet configured. Consider adding:
- Vitest (unit testing)
- React Testing Library
- Cypress (E2E testing)

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure backend is running on `http://localhost:4000`
- Check backend CORS configuration

**Build Errors**
- Run `npm run lint` to check for code issues
- Ensure all TypeScript types are properly defined

**Hot Reload Not Working**
- Check if file exports only components (React Fast Refresh requirement)
- Separate hooks and utilities into different files