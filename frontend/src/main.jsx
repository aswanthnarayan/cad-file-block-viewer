import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@material-tailwind/react";
import { FileProvider } from './context/fileContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
        <FileProvider>
            <App />
        </FileProvider>
    </ThemeProvider>
  </StrictMode>,
)
