import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function ThemedToaster() {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isDark ? 'rgba(20,10,46,0.95)' : 'rgba(255,255,255,0.96)',
          color: isDark ? '#f3eeff' : '#151024',
          border: isDark ? '1px solid rgba(157,124,255,0.3)' : '1px solid rgba(109,40,217,0.16)',
          backdropFilter: 'blur(20px)',
          boxShadow: isDark
            ? '0 18px 50px -24px rgba(0,0,0,0.7)'
            : '0 18px 50px -24px rgba(76,29,149,0.28)',
        },
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <AuthProvider>
            <App />
            <ThemedToaster />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
