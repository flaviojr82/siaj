import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { InputMask } from 'primereact/inputmask';

const PreCadastro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    nome: '', email: '', senha: '', confSenha: '',
    cpf: '', dataNasc: '', nomeMae: '', termos: false
  });

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '450px', padding: '1rem', borderRadius: '12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#f59e0b', margin: 0 }}>Registrar-se</h2>
          <p style={{ color: '#002b5c', marginTop: '0.5rem' }}>Insira seus dados para se registrar</p>
        </div>

        {step === 1 && (
          <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <InputText name="nome" value={data.nome} onChange={handleChange} placeholder="Nome Completo" />
            <InputText name="email" value={data.email} onChange={handleChange} placeholder="E-mail" />
            <Password name="senha" value={data.senha} onChange={(e) => setData({...data, senha: e.target.value})} placeholder="Senha" toggleMask feedback={false} />
            <Password name="confSenha" value={data.confSenha} onChange={(e) => setData({...data, confSenha: e.target.value})} placeholder="Confirmar Senha" toggleMask feedback={false} />
            <Button label="Próximo" icon="pi pi-arrow-right" iconPos="right" style={{ backgroundColor: '#1a4480', borderColor: '#1a4480' }} onClick={() => setStep(2)} />
          </div>
        )}

        {step === 2 && (
          <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <InputMask name="cpf" value={data.cpf} onChange={handleChange} mask="999.999.999-99" placeholder="CPF" />
            <InputMask name="dataNasc" value={data.dataNasc} onChange={handleChange} mask="99/99/9999" placeholder="Data de Nascimento" />
            <InputText name="nomeMae" value={data.nomeMae} onChange={handleChange} placeholder="Nome da Mãe" />
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox inputId="termos" checked={data.termos} onChange={(e) => setData({...data, termos: e.checked})} />
              <label htmlFor="termos" style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>Eu concordo com os termos e condições</label>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button label="Voltar" severity="secondary" text onClick={() => setStep(1)} />
              <Button label="Concluir" disabled={!data.termos} style={{ backgroundColor: '#1a4480', borderColor: '#1a4480' }} onClick={() => setStep(3)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#f59e0b' }}>Registro realizado com sucesso!</h2>
            <h4 style={{ color: '#002b5c' }}>Obrigado!</h4>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.5', margin: '1.5rem 0' }}>
              Por favor, verifique seu e-mail para verificar a conta. Após verificar a conta, volte para a tela de login e acesse com seu CPF e senha.
            </p>
            <Button label="Voltar para o login" style={{ backgroundColor: '#1a4480', borderColor: '#1a4480', width: '100%' }} onClick={() => navigate('/login')} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PreCadastro;