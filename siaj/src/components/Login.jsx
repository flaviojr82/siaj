import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// import { useNavigate } from 'react-router-dom'; // Descomente quando configurar o react-router-dom
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // No projeto final, aqui haverá uma chamada POST para a API do Keycloak ou do seu Back-end
    console.log('Tentativa de login:', username);
    
    // Simulação do redirecionamento
    alert('Simulação de login bem-sucedida! O sistema direcionaria você para o Dashboard do SIAJ.');
    // navigate('/dashboard'); 
  };

  return (
    <div className="keycloak-container">
      <h1 className="keycloak-header">Tribunal de Justiça da Paraíba</h1>
      
      <div className="keycloak-card">
        <h2 className="keycloak-title">Entrar na sua conta</h2>
        
        <form onSubmit={handleLogin} className="keycloak-form">
          <div className="p-field">
            <label htmlFor="username">Nome de usuário ou e-mail</label>
            <InputText 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              autoComplete="username"
              required
            />
          </div>
          
          <div className="p-field">
            <label htmlFor="password">Senha</label>
            <InputText 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="current-password"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            label="Entrar" 
            className="keycloak-btn" 
          />
        </form>
      </div>
    </div>
  );
};

export default Login;