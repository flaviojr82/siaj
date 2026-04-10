import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask'; // Novo import para a máscara de telefone
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png'; 
import './SiajForm.css';

// ============================================================================
// FUNÇÕES DE VALIDAÇÃO DO SIAJ (Adicionadas para a RN001 e API)
// ============================================================================

// Função para validar o Dígito Verificador do CPF - Atende à RN001
function validarEstruturaCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Função que simula a integração com a Receita Federal
async function consultarSituacaoReceitaFederal(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock: Considera CPFs que terminam em '0' como IRREGULARES
            const situacao = cpf.endsWith('0') ? 'IRREGULAR' : 'REGULAR'; 
            resolve({
                status: 200,
                dados: {
                    cpf: cpf,
                    nome: "NOME DO AUXILIAR DE TESTE",
                    situacao_cadastral: situacao
                }
            });
        }, 1500);
    });
}

// ============================================================================
// CÓDIGO EXISTENTE
// ============================================================================

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

  // Função checkCpf atualizada com as validações de estrutura e de API
  const checkCpf = async () => {
    if (!cpfInput) return;
    
    // Passo 1: Validação Matemática (Dígito Verificador)
    if (!validarEstruturaCPF(cpfInput)) {
        setCpfStatus('invalid');
        updateData({ cpf: '', atuacoes: [] });
        return;
    }

    // Define o status de carregamento para a API simulada
    setCpfStatus('loading');

    // Passo 2: Consulta à Receita Federal (Mock)
    try {
        const respostaDaApi = await consultarSituacaoReceitaFederal(cpfInput);
        
        if (respostaDaApi.dados.situacao_cadastral !== 'REGULAR') {
            setCpfStatus('irregular');
            updateData({ cpf: '', atuacoes: [] });
            return;
        }
    } catch (error) {
        setCpfStatus('error_api');
        updateData({ cpf: '', atuacoes: [] });
        return;
    }

    // Passo 3: O seu mock original de CPFs já cadastrados no BD do SIAJ
    const CPFS_CADASTRADOS_MOCK = ['111.111.111-11', '11111111111', '123.456.789-00', '12345678900'];
    
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
            placeholder="(ex: 123.456.789-00 ou 12345678900)" 
            disabled={cpfStatus === 'loading'}
          />
          <Button label="Validar" onClick={checkCpf} className="siaj-btn-primary" loading={cpfStatus === 'loading'} />
        </div>
        
        {/* Mensagens de Feedback para o usuário baseadas no novo Status */}
        {cpfStatus === 'invalid' && <small style={{ color: '#dc2626', fontWeight: 'bold', display: 'block', marginTop: '0.5rem' }}>CPF inválido. Verifique os números digitados.</small>}
        {cpfStatus === 'loading' && <small style={{ color: '#0056b3', fontWeight: 'bold', display: 'block', marginTop: '0.5rem' }}>Consultando base de dados da Receita Federal...</small>}
        {cpfStatus === 'irregular' && <small style={{ color: '#dc2626', fontWeight: 'bold', display: 'block', marginTop: '0.5rem' }}>Atenção: CPF com situação irregular na Receita Federal.</small>}
        {cpfStatus === 'error_api' && <small style={{ color: '#dc2626', fontWeight: 'bold', display: 'block', marginTop: '0.5rem' }}>Erro de comunicação com o servidor de validação.</small>}
        {cpfStatus === 'duplicate' && <small style={{ color: '#dc2626', fontWeight: 'bold', display: 'block', marginTop: '0.5rem' }}>Este CPF já possui cadastro como Auxiliar da Justiça no sistema.</small>}
        {cpfStatus === 'valid' && <small style={{ color: '#16a34a', fontWeight: 'bold', display: 'block', marginTop: '0.5rem' }}>CPF validado e regular. Prossiga com o cadastro.</small>}
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
        <div className="siaj-col-6">
          <label className="siaj-field-label">Telefone (Celular/WhatsApp) *</label>
          {/* Adicionada máscara de telefone: (00) 00000-0000 */}
          <InputMask 
            name="telefone" 
            value={data.telefone} 
            onChange={handleChange} 
            mask="(99) 99999-9999" 
            placeholder="(00) 00000-0000"
            unmask={true} // Salva no estado apenas os números
          />
        </div>
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
        
        {/* Campo Complemento agora não possui '*' visual */}
        <div className="siaj-col-4"><label className="siaj-field-label">Complemento</label><InputText name="complemento" value={data.complemento} onChange={handleChange} /></div>
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
    
    if (step === 1) return !!(formData.nomeCivil && formData.dataNascimento && formData.sexo && formData.estadoCivil && formData.nacionalidade && formData.nomeMae && formData.profissao && formData.tipoDoc && formData.numeroDoc && formData.orgaoEmissor && formData.ufEmissor && formData.email && formData.telefone);
    
    // Removido formData.complemento da validação obrigatória do Step 2
    if (step === 2) return !!(formData.cep && formData.logradouro && formData.numero && formData.bairro && formData.cidade && formData.uf);
    
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