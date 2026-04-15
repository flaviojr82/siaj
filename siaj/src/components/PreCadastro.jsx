import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { InputMask } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png';

const PreCadastro = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    nome: '', email: '', senha: '', confSenha: '',
    cpf: '', dataNasc: '', nomeMae: '', termos: false
  });

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleVerificarCpf = () => {
    const cpfLimpo = data.cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
      toast.current.show({ 
        severity: 'warn', // Laranja para aviso de preenchimento
        summary: 'Atenção', 
        detail: 'Por favor, informe um CPF válido com 11 dígitos.', 
        life: 3000 
      });
      return;
    }
    
    // Simulação Keycloak TJPB
    if (cpfLimpo === '11111111111' || cpfLimpo === '99999999999') {
      toast.current.show({ 
        severity: 'error', // Vermelho indicando bloqueio/erro no fluxo
        summary: 'Cadastro Encontrado', 
        detail: 'Este CPF já possui cadastro no sistema do TJPB. Você será redirecionado para a tela de login.', 
        life: 3500 
      });
      
      // Aguarda 3.5 segundos para o usuário ler o Toast antes de redirecionar
      setTimeout(() => {
        navigate('/login');
      }, 3500);
    } else {
      setStep(2);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      {/* Componente Toast do PrimeReact para as mensagens flutuantes */}
      <Toast ref={toast} />

      <Card style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '2rem', 
        textAlign: 'center', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
      }}>
        {/* Logo SIAJ para manter o padrão visual */}
        <img src={logoSiaj} alt="Logo SIAJ" style={{ width: '300px', marginBottom: '2rem' }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#f59e0b', margin: 0 }}>Registrar-se</h2>
          <p style={{ color: '#002b5c', marginTop: '0.5rem' }}>
            {step === 1 ? 'Validação de CPF' : 'Insira seus dados para se registrar'}
          </p>
        </div>

        {/* ETAPA 1: Validação do CPF no padrão SIAJ */}
        {step === 1 && (
          <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <label htmlFor="cpf" style={{ display: 'block', marginBottom: '0.5rem', color: '#002b5c', fontWeight: 'bold' }}>CPF</label>
              <InputMask id="cpf" name="cpf" value={data.cpf} onChange={handleChange} mask="999.999.999-99" placeholder="000.000.000-00" />
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Informe seu CPF para verificarmos se você já possui cadastro no Keycloak do TJPB.
            </p>
            <Button label="Verificar CPF" icon="pi pi-check" className="siaj-btn-primary" onClick={handleVerificarCpf} />
          </div>
        )}

        {/* ETAPA 2: Cadastro Básico */}
        {step === 2 && (
          <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <InputText name="nome" value={data.nome} onChange={handleChange} placeholder="Nome Completo" />
            <InputText name="email" value={data.email} onChange={handleChange} placeholder="E-mail" />
            <Password name="senha" value={data.senha} onChange={(e) => setData({...data, senha: e.target.value})} placeholder="Senha" toggleMask feedback={false} />
            <Password name="confSenha" value={data.confSenha} onChange={(e) => setData({...data, confSenha: e.target.value})} placeholder="Confirmar Senha" toggleMask feedback={false} />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button label="Voltar" severity="secondary" text onClick={() => setStep(1)} />
              <Button label="Próximo" icon="pi pi-arrow-right" iconPos="right" className="siaj-btn-primary" onClick={() => setStep(3)} />
            </div>
          </div>
        )}

        {/* ETAPA 3: Dados Complementares */}
        {step === 3 && (
          <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <InputMask name="cpf" value={data.cpf} disabled mask="999.999.999-99" placeholder="CPF" />
            <InputMask name="dataNasc" value={data.dataNasc} onChange={handleChange} mask="99/99/9999" placeholder="Data de Nascimento" />
            <InputText name="nomeMae" value={data.nomeMae} onChange={handleChange} placeholder="Nome da Mãe" />
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox inputId="termos" checked={data.termos} onChange={(e) => setData({...data, termos: e.checked})} />
              <label htmlFor="termos" style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>Eu concordo com os termos e condições</label>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button label="Voltar" severity="secondary" text onClick={() => setStep(2)} />
              <Button label="Concluir" disabled={!data.termos} className="siaj-btn-primary" onClick={() => setStep(4)} />
            </div>
          </div>
        )}

        {/* ETAPA 4: Sucesso */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#f59e0b' }}>Registro realizado com sucesso!</h2>
            <h4 style={{ color: '#002b5c' }}>Obrigado!</h4>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.5', margin: '1.5rem 0' }}>
              Por favor, verifique seu e-mail para verificar a conta. Após verificar a conta, volte para a tela de login e acesse com seu CPF e senha.
            </p>
            <Button label="Voltar para o login" className="siaj-btn-primary" style={{ width: '100%' }} onClick={() => navigate('/login')} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PreCadastro;