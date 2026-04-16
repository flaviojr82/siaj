import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '500px', textAlign: 'center', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <img src={logoSiaj} alt="Logo SIAJ" style={{ width: '400px', marginBottom: '1.5rem' }} />
        <h2 style={{ color: '#002b5c', marginBottom: '0.5rem' }}>Bem-vindo ao SIAJ</h2>
        <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Sistema de Auxiliares da Justiça do TJPB</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Botão Sou Servidor: Ajustado para ser branco com borda e texto em azul */}
          <Button 
            label="Sou Servidor" 
            icon="pi pi-desktop" 
            size="large" 
            outlined
            style={{ color: '#1a4480', borderColor: '#1a4480' }}
            onClick={() => navigate('/login')} 
          />
          
          <Button 
            label="Já sou Profissional" 
            icon="pi pi-sign-in" 
            size="large" 
            className="siaj-btn-primary" 
            onClick={() => navigate('/login')} 
          />
          
          <Button 
            label="Quero me Cadastrar" 
            icon="pi pi-user-plus" 
            size="large" 
            severity="success" 
            outlined 
            onClick={() => navigate('/pre-cadastro')} 
          />
        </div>
      </Card>
    </div>
  );
};

export default Welcome;