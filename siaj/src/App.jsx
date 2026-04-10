import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';

// Importação dos seus componentes
import AuxiliarRegistrationForm from './components/AuxiliarRegistrationForm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Um pequeno componente para mostrar o cabeçalho apenas onde faz sentido
const LayoutComCabecalho = ({ children }) => {
  const location = useLocation();
  // Oculta o botão de login se o usuário já estiver na tela de login ou no dashboard
  const esconderBotaoLogin = location.pathname === '/login' || location.pathname === '/dashboard';

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
            <Button 
              label="Acesso Restrito (Login)" 
              icon="pi pi-lock" 
              severity="secondary" 
              text 
              style={{ fontWeight: 'bold' }}
            />
          </Link>
        </header>
      )}

      {/* Área onde as páginas são carregadas */}
      <div style={{ padding: '2rem' }}>
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
          {/* Redirecionamento inicial */}
          <Route path="/" element={<Navigate to="/cadastro" />} />
          
          {/* Telas do SIAJ */}
          <Route path="/cadastro" element={<AuxiliarRegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </LayoutComCabecalho>
    </BrowserRouter>
  );
}

export default App;