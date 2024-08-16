import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';
import 'dotenv/config';

async function bootstrap() {
  const App = (await import('./app')).default;

  const rootElement = document.getElementById('root') as HTMLElement;
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <MemoryRouter>
        <App />
        <Toaster />
      </MemoryRouter>
    </React.StrictMode>,
  );
}

void bootstrap();

console.log('Hello from Figma Plugin!');
