import React from 'react'
import ReactDOM from 'react-dom/client'
import AdminRoute from './AdminRoute'
import './AdminApp.css'
import './Login.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminRoute />
  </React.StrictMode>,
)

