import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png'; 
import './SiajForm.css';

const estadoInicial = {
  cpf: '', 
  atuacoes: [], // Agora é um Array para múltipla escolha
  nomeCivil: '', nomeSocial: '', dataNascimento: '', sexo: '', estadoCivil: '', nomeMae: '', nacionalidade: '', profissao: '',
  tipoDoc: '', numeroDoc: '', orgaoEmissor: '', ufEmissor: '',
  email: '', telefone: '',
  cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '', complemento: '',
  anexos: {}
};

const documentRequirements = {
  'Perito': ['Diploma de Graduação', 'Registro no Conselho de Classe', 'Certidão de Regularidade'],
  'Leiloeiro': ['Registro na Junta Comercial (JUCEG)', 'Certidão Negativa Cível e Criminal'],
  'Tradutor': ['Inscrição na Junta Comercial', 'Certificado de Proficiência'],
  'Administrador Judicial': ['Registro Profissional (OAB/CRC/CRA/Corecon)', 'Certidão do Tribunal de Justiça'],
  'Entrevistador Forense': ['Diploma em Psicologia/Serviço Social', 'Certificado de Curso Específico'],
  'Mediador/Conciliador': ['Certificado de Capacitação em Mediação (Res. 125/CNJ)'],
  'Instrutor de Mediador/Conciliador': ['Certificado de Instrutor do CNJ', 'Comprovante de Docência']
};

/**
 * Etapa 1: Validação de CPF e Seleção Múltipla de Atuação
 */
const StepRole = ({ data, updateData }) => {
  const [cpfInput, setCpfInput] = useState(data.cpf);
  const [cpfStatus, setCpfStatus] = useState(data.cpf ? 'valid' : 'idle');

  const checkCpf = () => {
    if (!cpfInput) return;
    
    // MOCK DE DADOS PARA TESTE
    const CPFS_CADASTRADOS_MOCK = ['111.111.111-11', '123.456.789-00'];
    
    if (CPFS_CADASTRADOS_MOCK.includes(cpfInput)) {
      setCpfStatus('duplicate');
      updateData({ cpf: '', atuacoes: [] });
    } else {
      setCpfStatus('valid');
      updateData({ cpf: cpfInput });
    }
  };

  const listaAtuacoes = [
    { label: 'Perito', value: 'Perito' }, { label: 'Leiloeiro', value: 'Leiloeiro' },
    { label: 'Tradutor', value: 'Tradutor' }, { label: 'Administrador Judicial', value: 'Administrador Judicial' },
    { label: 'Entrevistador Forense', value: 'Entrevistador Forense' }, { label: 'Mediador/Conciliador', value: 'Mediador/Conciliador' },
    { label: 'Instrutor de Mediador/Conciliador', value: 'Instrutor de Mediador/Conciliador' }
  ];

  return (
    <div className="p-fluid siaj-grid">
      <div className="siaj-col-12 md:siaj-col-6">
        <label className="siaj-field-label">Informe seu CPF para validação inicial *</label>
        <div className="p-inputgroup">
          <InputText 
            value={cpfInput} 
            onChange={(e) => { setCpfInput(e.target.value); setCpfStatus('idle'); }} 
            placeholder="Apenas números ou com pontuação" 
          />
          <Button label="Validar" onClick={checkCpf} className="siaj-btn-primary" />
        </div>
        {cpfStatus === 'duplicate' && <small style={{ color: '#dc2626', fontWeight: 'bold', display: 'block', marginTop: '0.5rem' }}>Este CPF já possui cadastro como Auxiliar da Justiça no sistema.</small>}
        {cpfStatus === 'valid' && <small style={{ color: '#16a34a', fontWeight: 'bold', display: 'block', marginTop: '0.5rem' }}>CPF liberado. Prossiga com o cadastro.</small>}
      </div>

      {cpfStatus === 'valid' && (
        <div className="siaj-col-12" style={{ marginTop: '1rem' }}>
          <label className="siaj-field-label">Qualificação Pretendida (Selecione uma ou mais) *</label>
          <MultiSelect 
            value={data.atuacoes} 
            options={listaAtuacoes} 
            onChange={(e) => updateData({ atuacoes: e.value })} 
            placeholder="Selecione as áreas de atuação..." 
            display="chip"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Etapa 2: Qualificação Física e Documental (+ Contatos)
 */
const StepPersonal = ({ data, updateData }) => {
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });
  const opcoesSexo = [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }];
  const opcoesEstadoCivil = [{ label: 'Solteiro(a)', value: 'Solteiro' }, { label: 'Casado(a)', value: 'Casado' }, { label: 'Divorciado(a)', value: 'Divorciado' }, { label: 'Viúvo(a)', value: 'Viuvo' }];
  const opcoesDoc = [{ label: 'RG', value: 'RG' }, { label: 'CIN', value: 'CIN' }, { label: 'CNH', value: 'CNH' }, { label: 'Passaporte', value: 'Passaporte' }];

  return (
    <div className="p-fluid">
      <h3 style={{ color: 'var(--siaj-blue)', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Dados Pessoais</h3>
      <div className="siaj-grid">
        <div className="siaj-col-6"><label className="siaj-field-label">Nome Civil *</label><InputText name="nomeCivil" value={data.nomeCivil} onChange={handleChange} /></div>
        <div className="siaj-col-6"><label className="siaj-field-label">Nome Social</label><InputText name="nomeSocial" value={data.nomeSocial} onChange={handleChange} placeholder="Opcional" /></div>
        
        <div className="siaj-col-3"><label className="siaj-field-label">Data de Nasc. *</label><InputText type="date" name="dataNascimento" value={data.dataNascimento} onChange={handleChange} /></div>
        <div className="siaj-col-3"><label className="siaj-field-label">Sexo *</label><Dropdown name="sexo" value={data.sexo} options={opcoesSexo} onChange={(e) => updateData({ sexo: e.value })} placeholder="Selecione..." /></div>
        <div className="siaj-col-3"><label className="siaj-field-label">Estado Civil *</label><Dropdown name="estadoCivil" value={data.estadoCivil} options={opcoesEstadoCivil} onChange={(e) => updateData({ estadoCivil: e.value })} placeholder="Selecione..." /></div>
        <div className="siaj-col-3"><label className="siaj-field-label">Nacionalidade *</label><InputText name="nacionalidade" value={data.nacionalidade} onChange={handleChange} /></div>
        
        <div className="siaj-col-8"><label className="siaj-field-label">Nome da Mãe *</label><InputText name="nomeMae" value={data.nomeMae} onChange={handleChange} /></div>
        <div className="siaj-col-4"><label className="siaj-field-label">Profissão *</label><InputText name="profissao" value={data.profissao} onChange={handleChange} /></div>
      </div>

      <h3 style={{ color: 'var(--siaj-blue)', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginTop: '2rem' }}>Documento de Identificação</h3>
      <div className="siaj-grid">
        <div className="siaj-col-3"><label className="siaj-field-label">Tipo Doc. *</label><Dropdown name="tipoDoc" value={data.tipoDoc} options={opcoesDoc} onChange={(e) => updateData({ tipoDoc: e.value })} placeholder="Selecione..." /></div>
        <div className="siaj-col-5"><label className="siaj-field-label">Número *</label><InputText name="numeroDoc" value={data.numeroDoc} onChange={handleChange} /></div>
        <div className="siaj-col-2"><label className="siaj-field-label">Órgão Emissor *</label><InputText name="orgaoEmissor" value={data.orgaoEmissor} onChange={handleChange} /></div>
        <div className="siaj-col-2"><label className="siaj-field-label">UF *</label><InputText name="ufEmissor" value={data.ufEmissor} onChange={handleChange} maxLength={2} /></div>
      </div>

      <h3 style={{ color: 'var(--siaj-blue)', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginTop: '2rem' }}>Contatos</h3>
      <div className="siaj-grid">
        <div className="siaj-col-6"><label className="siaj-field-label">E-mail Profissional *</label><InputText name="email" value={data.email} onChange={handleChange} /></div>
        <div className="siaj-col-6"><label className="siaj-field-label">Telefone (Celular/WhatsApp) *</label><InputText name="telefone" value={data.telefone} onChange={handleChange} /></div>
      </div>
    </div>
  );
};

/**
 * Etapa 3: Endereço (com API ViaCEP)
 */
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
        <div className="siaj-col-3">
          <label className="siaj-field-label">CEP *</label>
          <InputText name="cep" value={data.cep} onChange={handleChange} onBlur={buscarCEP} placeholder="Apenas números" maxLength={8} />
        </div>
        <div className="siaj-col-7"><label className="siaj-field-label">Logradouro *</label><InputText name="logradouro" value={data.logradouro} disabled /></div>
        <div className="siaj-col-2"><label className="siaj-field-label">Número *</label><InputText name="numero" value={data.numero} onChange={handleChange} /></div>
        
        <div className="siaj-col-4"><label className="siaj-field-label">Complemento *</label><InputText name="complemento" value={data.complemento} onChange={handleChange} /></div>
        <div className="siaj-col-4"><label className="siaj-field-label">Bairro *</label><InputText name="bairro" value={data.bairro} disabled /></div>
        <div className="siaj-col-3"><label className="siaj-field-label">Cidade *</label><InputText name="cidade" value={data.cidade} disabled /></div>
        <div className="siaj-col-1"><label className="siaj-field-label">UF *</label><InputText name="uf" value={data.uf} disabled /></div>
      </div>
    </div>
  );
};

/**
 * Etapa 4: Anexos (Agrupados por múltiplas atuações)
 */
const StepDocs = ({ data, updateData }) => {
  // Utiliza FlatMap para juntar as arrays e Set para remover itens duplicados
  const requiredDocs = Array.from(new Set(
    data.atuacoes.flatMap(atuacao => documentRequirements[atuacao] || [])
  ));

  return (
    <div>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Com base nas atuações selecionadas (<strong>{data.atuacoes.join(' e ')}</strong>), anexe os documentos exigidos.
      </p>
      {requiredDocs.map(doc => (
        <div key={doc} className="siaj-doc-row">
          <span className="siaj-field-label" style={{ marginBottom: 0 }}>{doc} *</span>
          <input 
            type="file" accept=".pdf" className="p-inputtext p-component" style={{ padding: '0.5rem', fontSize: '0.875rem' }}
            onChange={(e) => updateData({ anexos: { ...data.anexos, [doc]: e.target.files ? e.target.files[0] : null } })}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Controlador Principal
 */
export const AuxiliarRegistrationForm = () => {
  const [formData, setFormData] = useState(estadoInicial);
  const [currentStep, setCurrentStep] = useState(0);

  const items = [{ label: 'Qualificação' }, { label: 'Dados Pessoais' }, { label: 'Endereço' }, { label: 'Documentação' }];

  const updateFormData = (fields) => setFormData(prev => ({ ...prev, ...fields }));
  
  // Validação estrita
  const isStepValid = (step) => {
    if (step === 0) return !!formData.cpf && formData.atuacoes.length > 0;
    // Removido a obrigatoriedade de Nome Social e do CPF (que agora é validado no step 0)
    if (step === 1) return !!(formData.nomeCivil && formData.dataNascimento && formData.sexo && formData.estadoCivil && formData.nacionalidade && formData.nomeMae && formData.profissao && formData.tipoDoc && formData.numeroDoc && formData.orgaoEmissor && formData.ufEmissor && formData.email && formData.telefone);
    if (step === 2) return !!(formData.cep && formData.logradouro && formData.numero && formData.complemento && formData.bairro && formData.cidade && formData.uf);
    if (step === 3) {
      const required = Array.from(new Set(formData.atuacoes.flatMap(a => documentRequirements[a] || [])));
      return required.every(doc => formData.anexos[doc] !== null && formData.anexos[doc] !== undefined);
    }
    return true;
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const handleSubmit = () => alert('Cadastro submetido com sucesso. Verifique o console.');

  return (
    <div className="siaj-form-container">
      <Card>
        <div className="siaj-header-container">
          <img src={logoSiaj} alt="Logo SIAJ" className="siaj-logo-img" />
          <h2 className="siaj-header-title">Tribunal de Justiça da Paraíba</h2>
          <h2 className="siaj-header-title">Solicitação de Cadastro de Pessoa Física</h2>
        </div>
        
        <Steps model={items} activeIndex={currentStep} onSelect={(e) => isStepValid(currentStep) && setCurrentStep(e.index)} readOnly={true} className="mb-5" />

        <div style={{ marginTop: '2rem', minHeight: '350px' }}>
          {currentStep === 0 && <StepRole data={formData} updateData={updateFormData} />}
          {currentStep === 1 && <StepPersonal data={formData} updateData={updateFormData} />}
          {currentStep === 2 && <StepAddress data={formData} updateData={updateFormData} />}
          {currentStep === 3 && <StepDocs data={formData} updateData={updateFormData} />}
        </div>

        <div className="siaj-footer-actions">
          <Button label="Voltar" icon="pi pi-angle-left" onClick={prevStep} disabled={currentStep === 0} severity="secondary" outlined />
          
          {currentStep < 3 ? (
            <Button 
              className="siaj-btn-primary"
              label="Avançar" 
              icon="pi pi-angle-right" 
              iconPos="right" 
              onClick={nextStep} 
              disabled={!isStepValid(currentStep)} 
              tooltip={!isStepValid(currentStep) ? "Preencha todos os campos obrigatórios (*) para avançar" : ""}
              tooltipOptions={{ position: 'top' }}
            />
          ) : (
            <Button 
              className="siaj-btn-success"
              label="Concluir Cadastro" 
              icon="pi pi-check" 
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