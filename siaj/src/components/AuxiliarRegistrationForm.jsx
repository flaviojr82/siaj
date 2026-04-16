import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import './SiajForm.css';

const estadoInicial = {
  nomeCivil: 'João da Silva',
  email: 'joao.silva@email.com',
  cpf: '111.111.111-11',
  dataNascimento: '15/05/1980',
  nomeMae: 'Maria da Silva',
  sexo: '', estadoCivil: '', 
  tipoDoc: '', numeroDoc: '', orgaoEmissor: '', ufEmissor: '', telefone: '',
  cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '', complemento: ''
};

const StepDadosBasicos = ({ data, updateData }) => {
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });
  const opcoesSexo = [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }];
  const opcoesEstadoCivil = [{ label: 'Solteiro(a)', value: 'Solteiro' }, { label: 'Casado(a)', value: 'Casado' }, { label: 'Divorciado(a)', value: 'Divorciado' }, { label: 'Viúvo(a)', value: 'Viuvo' }];
  const opcoesDoc = [{ label: 'RG', value: 'RG' }, { label: 'CIN', value: 'CIN' }, { label: 'CNH', value: 'CNH' }, { label: 'Passaporte', value: 'Passaporte' }, { label: 'CTPS', value: 'CTPS' }];

  return (
    <div className="p-fluid">
      <div className="siaj-grid">
        <div className="siaj-col-6"><label className="siaj-field-label">Nome Completo</label><InputText value={data.nomeCivil} disabled /></div>
        <div className="siaj-col-3"><label className="siaj-field-label">CPF</label><InputText value={data.cpf} disabled /></div>
        <div className="siaj-col-3"><label className="siaj-field-label">Data de Nascimento</label><InputText value={data.dataNascimento} disabled /></div>
        <div className="siaj-col-6"><label className="siaj-field-label">Nome da Mãe</label><InputText value={data.nomeMae} disabled /></div>
        
        <div className="siaj-col-3"><label className="siaj-field-label">Sexo *</label><Dropdown name="sexo" value={data.sexo} options={opcoesSexo} onChange={(e) => updateData({ sexo: e.value })} placeholder="Selecione..." /></div>
        <div className="siaj-col-3"><label className="siaj-field-label">Estado Civil *</label><Dropdown name="estadoCivil" value={data.estadoCivil} options={opcoesEstadoCivil} onChange={(e) => updateData({ estadoCivil: e.value })} placeholder="Selecione..." /></div>
        
        <div className="siaj-col-3"><label className="siaj-field-label">Tipo Doc. *</label><Dropdown name="tipoDoc" value={data.tipoDoc} options={opcoesDoc} onChange={(e) => updateData({ tipoDoc: e.value })} placeholder="Selecione..." /></div>
        <div className="siaj-col-4"><label className="siaj-field-label">Número *</label><InputText name="numeroDoc" value={data.numeroDoc} onChange={handleChange} /></div>
        <div className="siaj-col-3"><label className="siaj-field-label">Órgão Emissor *</label><InputText name="orgaoEmissor" value={data.orgaoEmissor} onChange={handleChange} /></div>
        <div className="siaj-col-2"><label className="siaj-field-label">UF *</label><InputText name="ufEmissor" value={data.ufEmissor} onChange={handleChange} maxLength={2} /></div>
        
        <div className="siaj-col-6">
          <label className="siaj-field-label">Telefone (Celular/WhatsApp) *</label>
          <InputMask name="telefone" value={data.telefone} onChange={handleChange} mask="(99) 99999-9999" placeholder="(00) 00000-0000" unmask={true} />
        </div>
      </div>
    </div>
  );
};

const StepAddress = ({ data, updateData }) => {
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });

  const buscarCEP = async (e) => {
    const cepNumeros = e.target.value.replace(/\D/g, '');
    if (cepNumeros.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        const result = await response.json();
        if (!result.erro) {
          updateData({
            logradouro: result.logradouro,
            bairro: result.bairro,
            cidade: result.localidade,
            uf: result.uf
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  return (
    <div className="p-fluid">
      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Digite o CEP para buscar o endereço automaticamente.</p>
      <div className="siaj-grid">
        <div className="siaj-col-3"><label className="siaj-field-label">CEP *</label><InputText name="cep" value={data.cep} onChange={handleChange} onBlur={buscarCEP} placeholder="Apenas números" maxLength={8} /></div>
        <div className="siaj-col-7"><label className="siaj-field-label">Logradouro *</label><InputText name="logradouro" value={data.logradouro} disabled /></div>
        <div className="siaj-col-2"><label className="siaj-field-label">Número *</label><InputText name="numero" value={data.numero} onChange={handleChange} /></div>
        <div className="siaj-col-4"><label className="siaj-field-label">Complemento</label><InputText name="complemento" value={data.complemento} onChange={handleChange} /></div>
        <div className="siaj-col-4"><label className="siaj-field-label">Bairro *</label><InputText name="bairro" value={data.bairro} disabled /></div>
        <div className="siaj-col-3"><label className="siaj-field-label">Cidade *</label><InputText name="cidade" value={data.cidade} disabled /></div>
        <div className="siaj-col-1"><label className="siaj-field-label">UF *</label><InputText name="uf" value={data.uf} disabled /></div>
      </div>
    </div>
  );
};

const StepCredenciais = ({ data, updateData }) => {
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });

  return (
    <div className="p-fluid">
      <div className="siaj-grid">
        <div className="siaj-col-12 md:siaj-col-6">
          <label className="siaj-field-label">E-mail *</label>
          <InputText name="email" value={data.email} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

export const AuxiliarRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(estadoInicial);
  const [currentStep, setCurrentStep] = useState(0);

  const items = [{ label: 'Dados Básicos' }, { label: 'Endereço' }, { label: 'Credenciais' }];

  const updateFormData = (fields) => setFormData(prev => ({ ...prev, ...fields }));
  
  const isStepValid = (step) => {
    if (step === 0) return !!(formData.sexo && formData.estadoCivil && formData.tipoDoc && formData.numeroDoc && formData.orgaoEmissor && formData.ufEmissor && formData.telefone);
    if (step === 1) return !!(formData.cep && formData.logradouro && formData.numero && formData.bairro && formData.cidade && formData.uf);
    if (step === 2) return !!(formData.email);
    return true;
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const handleSubmit = () => {
    alert('Dados salvos com sucesso!');
    navigate('/dashboard');
  };

  return (
    <div className="siaj-form-container">
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
          <h2 style={{ color: 'var(--siaj-blue)', margin: 0 }}>Editar Cadastro - Auxiliar da Justiça</h2>
          <Button icon="pi pi-times" rounded text severity="secondary" onClick={() => navigate('/dashboard')} />
        </div>
        
        <Steps model={items} activeIndex={currentStep} onSelect={(e) => isStepValid(currentStep) && setCurrentStep(e.index)} readOnly={true} className="mb-5" />

        <div style={{ marginTop: '2rem', minHeight: '350px' }}>
          {currentStep === 0 && <StepDadosBasicos data={formData} updateData={updateFormData} />}
          {currentStep === 1 && <StepAddress data={formData} updateData={updateFormData} />}
          {currentStep === 2 && <StepCredenciais data={formData} updateData={updateFormData} />}
        </div>

        <div className="siaj-footer-actions">
          <Button label="Voltar" icon="pi pi-angle-left" onClick={prevStep} disabled={currentStep === 0} severity="secondary" outlined />
          
          {currentStep < 2 ? (
            <Button 
              className="siaj-btn-primary"
              label="Avançar" 
              icon="pi pi-angle-right" 
              iconPos="right" 
              onClick={nextStep} 
              disabled={!isStepValid(currentStep)} 
            />
          ) : (
            <Button 
              className="siaj-btn-success"
              label="Salvar Dados" 
              icon="pi pi-save" 
              iconPos="right" 
              onClick={handleSubmit} 
              disabled={!isStepValid(currentStep)}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuxiliarRegistrationForm;