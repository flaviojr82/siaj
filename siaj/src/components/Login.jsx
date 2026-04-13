import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputMask } from 'primereact/inputmask';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png';
import './Login.css';

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Remove a pontuação para comparar apenas os números
    const cpfLimpo = cpf.replace(/\D/g, '');

    // Validação conforme regra solicitada
    if (cpfLimpo === '11111111111') {
      navigate('/', { state: { role: 'auxiliar' } });
    } else if (cpfLimpo === '99999999999' || cpfLimpo === '9999999999') {
      // Nota: o prompt citou "999.999.99-99", aceitaremos a variação de tamanho
      navigate('/', { state: { role: 'servidor' } });
    } else {
      alert('CPF não reconhecido para testes. Use 111.111.111-11 (Auxiliar) ou 999.999.999-99 (Servidor).');
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card className="login-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <img src={logoSiaj} alt="Logo SIAJ" style={{ width: '300px', marginBottom: '2rem' }} />
        
        <form onSubmit={handleLogin} className="p-fluid">
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label htmlFor="cpf" style={{ display: 'block', marginBottom: '0.5rem', color: '#002b5c', fontWeight: 'bold' }}>CPF</label>
            <InputMask id="cpf" value={cpf} onChange={(e) => setCpf(e.value)} mask="999.999.999-99" placeholder="000.000.000-00" required />
          </div>

          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <label htmlFor="senha" style={{ display: 'block', marginBottom: '0.5rem', color: '#002b5c', fontWeight: 'bold' }}>Senha</label>
            <Password id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" toggleMask feedback={false} required />
          </div>

          <Button label="Entrar" type="submit" className="siaj-btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem' }} />
        </form>

        <div style={{ marginTop: '1.5rem' }}>
          <Button label="Quero me cadastrar" text onClick={() => navigate('/pre-cadastro')} style={{ padding: 0 }} />
        </div>
      </Card>
    </div>
  );
};

export default Login;