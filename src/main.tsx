import React, { StrictMode } from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState;
  props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error ID:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff4d4d', backgroundColor: '#111', minHeight: '100vh', fontFamily: 'monospace', overflow: 'auto' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Oops! Something went wrong while running the app.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#222', padding: '15px', borderRadius: '4px', border: '1px solid #444', color: '#f8f8f8' }}>
            {this.state.error?.stack || this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global uncaught error listener to display startup failures before React runs
window.addEventListener('error', (event) => {
  console.error("Global uncaught error:", event.error);
  const root = document.getElementById('root');
  if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
    root.innerHTML = `
      <div style="padding: 20px; color: #ff4d4d; background-color: #111; min-height: 100vh; font-family: monospace; overflow: auto; box-sizing: border-box;">
        <h2 style="font-size: 20px; margin-bottom: 10px;">Oops! A global uncaught runtime error occurred:</h2>
        <pre style="white-space: pre-wrap; word-break: break-all; background-color: #222; padding: 15px; border-radius: 4px; border: 1px solid #444; color: #f8f8f8;">${event.error?.stack || event.error?.message || event.message}</pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background-color: #fff; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          Reload App
        </button>
      </div>
    `;
  }
});

// Global unhandled promise rejection listener
window.addEventListener('unhandledrejection', (event) => {
  console.error("Global unhandled rejection:", event.reason);
  const root = document.getElementById('root');
  if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
    root.innerHTML = `
      <div style="padding: 20px; color: #ff4d4d; background-color: #111; min-height: 100vh; font-family: monospace; overflow: auto; box-sizing: border-box;">
        <h2 style="font-size: 20px; margin-bottom: 10px;">Oops! An unhandled Promise Rejection occurred:</h2>
        <pre style="white-space: pre-wrap; word-break: break-all; background-color: #222; padding: 15px; border-radius: 4px; border: 1px solid #444; color: #f8f8f8;">${event.reason?.stack || event.reason?.message || event.reason}</pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background-color: #fff; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          Reload App
        </button>
      </div>
    `;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>,
);

// Register Service Worker for PWA installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}
