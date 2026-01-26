import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner';
import App from './App.jsx'
import { ThemeProvider } from "@material-tailwind/react";

// Ponto de entrada da aplicação React.
// Envolve a App com Providers globais (Theme, Toaster).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster richColors expand={false} position="bottom-right" />
    </ThemeProvider>
  </StrictMode>,
)
