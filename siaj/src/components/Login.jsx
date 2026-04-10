import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erroLogin, setErroLogin] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Remove pontos e traços do que o usuário digitou
    const cpfLimpo = username.replace(/[^\d]+/g, '');

    // Verifica qual CPF foi digitado e direciona para o painel correto
    if (cpfLimpo === '11111111111') {
      localStorage.setItem('siaj_user_role', 'auxiliar');
      navigate('/dashboard');
    } 
    else if (cpfLimpo === '99999999999') {
      localStorage.setItem('siaj_user_role', 'servidor');
      navigate('/dashboard');
    } 
    else {
      setErroLogin('Credenciais inválidas. Verifique o CPF digitado.');
    }
  };

  return (
    <div className="keycloak-container">
      <h1 className="keycloak-header">Tribunal de Justiça da Paraíba</h1>
      
      <div className="keycloak-card">
        <h2 className="keycloak-title">Entrar na sua conta</h2>
        
        <form onSubmit={handleLogin} className="keycloak-form">
          <div className="p-field">
            <label htmlFor="username">CPF</label>
            <InputText 
              id="username" 
              value={username} 
              onChange={(e) => { setUsername(e.target.value); setErroLogin(''); }} 
              placeholder="Digite apenas números"
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
              required
            />
          </div>

          {erroLogin && (
            <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
              {erroLogin}
            </div>
          )}
          
          <Button type="submit" label="Entrar" className="keycloak-btn" />
        </form>

        {/* Dica para você (pode remover antes de apresentar se quiser) */}
        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
          <p><strong>Credenciais para teste:</strong></p>
          <p>Auxiliar: 111.111.111-11</p>
          <p>Servidor: 999.999.999-99</p>
          <p>Senha: (qualquer uma)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;