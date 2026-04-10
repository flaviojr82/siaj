import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';

import AuxiliarRegistrationForm from './components/AuxiliarRegistrationForm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const LayoutComCabecalho = ({ children }) => {
  const location = useLocation();
  const esconderBotaoLogin = location.pathname === '/login' || location.pathname === '/dashboard';
  // Retira o padding se estiver no Dashboard para a Sidebar encostar na borda
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      {!esconderBotaoLogin && (
        <header style={{
          backgroundColor: '#ffffff',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button label="Acesso Restrito (Login)" icon="pi pi-lock" severity="secondary" text style={{ fontWeight: 'bold' }} />
          </Link>
        </header>
      )}

      {/* Se for o Dashboard, renderiza sem bordas (0 padding). Senão, usa 2rem */}
      <div style={{ padding: isDashboard ? '0' : '2rem', height: isDashboard ? '100vh' : 'auto' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LayoutComCabecalho>
        <Routes>
          <Route path="/" element={<Navigate to="/cadastro" />} />
          <Route path="/cadastro" element={<AuxiliarRegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </LayoutComCabecalho>
    </BrowserRouter>
  );
}

export default App;