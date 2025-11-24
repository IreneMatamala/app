// Este es el PUNTO DE ENTRADA de tu aplicación React
// Es el primer archivo que se ejecuta cuando alguien visita tu web
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
