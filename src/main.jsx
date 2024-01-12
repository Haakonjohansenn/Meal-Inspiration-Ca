import React from 'react'
import router from './root.js'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
