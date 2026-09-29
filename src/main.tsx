// Safeguard against iframe/sandbox environments where window.fetch has only a getter
try {
  if (typeof window !== 'undefined') {
    const rawFetch = window.fetch;
    let currentFetch = rawFetch ? function (input: RequestInfo | URL, init?: RequestInit) {
      return rawFetch.call(window, input, init);
    } : undefined;

    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || !desc.set || !desc.writable) {
      Object.defineProperty(window, 'fetch', {
        get() {
          return currentFetch;
        },
        set(fn) {
          currentFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    }
  }
} catch {
  // Ignore
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
