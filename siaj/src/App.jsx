import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Welcome from './components/Welcome';
import PreCadastro from './components/PreCadastro';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuxiliarRegistrationForm from './components/AuxiliarRegistrationForm';

const LayoutGeral = ({ children }) => {
  const location = useLocation();
  // Se for a tela de Dashboard, removemos o padding global para a Sidebar ocupar 100% da altura
  const isDashboard = location.pathname === '/';

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <div style={{ padding: isDashboard ? '0' : '2rem', height: isDashboard ? '100vh' : 'auto' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LayoutGeral>
        <Routes>
          {/* Dashboard volta a ser a página inicial */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/pre-cadastro" element={<PreCadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/completar-cadastro" element={<AuxiliarRegistrationForm />} />
        </Routes>
      </LayoutGeral>
    </BrowserRouter>
  );
}

export default App;