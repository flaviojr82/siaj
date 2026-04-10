import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import AuxiliarRegistrationForm from './components/AuxiliarRegistrationForm';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      {/* Container principal com fundo cinza claro */}
      <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
        
        {/* Cabecalho Simples com Botão de Acesso */}
        <header style={{
          backgroundColor: '#ffffff',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          {/* O Link do react-router-dom permite navegar sem recarregar a página inteira */}
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

        {/* Área onde os componentes das rotas serão renderizados */}
        <div style={{ padding: '2rem' }}>
          <Routes>
            {/* Rota padrão redireciona para o cadastro */}
            <Route path="/" element={<Navigate to="/cadastro" />} />
            
            {/* Rota do Formulário de Cadastro */}
            <Route path="/cadastro" element={<AuxiliarRegistrationForm />} />
            
            {/* Rota da Tela de Login (SSO Keycloak) */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;