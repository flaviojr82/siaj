import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { InputMask } from 'primereact/inputmask';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png';

const PreCadastro = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [step, setStep] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [naoSeiCep, setNaoSeiCep] = useState(false);

  const [data, setData] = useState({
    nome: '', email: '', senha: '', confSenha: '',
    cpf: '', dataNasc: '', nomeMae: '', termos: false,
    nomeSocial: '', sexo: null, estadoCivil: null, nacionalidade: '', profissao: '',
    tipoDoc: null, numeroDoc: '', orgaoEmissor: '', ufDoc: null, telefone: '',
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: ''
  });

  const ufs = [
    { label: 'Acre', value: 'AC' }, { label: 'Alagoas', value: 'AL' }, { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' }, { label: 'Bahia', value: 'BA' }, { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' }, { label: 'Espírito Santo', value: 'ES' }, { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' }, { label: 'Mato Grosso', value: 'MT' }, { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' }, { label: 'Pará', value: 'PA' }, { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' }, { label: 'Pernambuco', value: 'PE' }, { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' }, { label: 'Rio Grande do Norte', value: 'RN' }, { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' }, { label: 'Roraima', value: 'RR' }, { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' }, { label: 'Sergipe', value: 'SE' }, { label: 'Tocantins', value: 'TO' }
  ];

  const sexos = [
    { label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }, { label: 'Outro', value: 'O' }
  ];

  const estadosCivis = [
    { label: 'Solteiro(a)', value: 'S' }, { label: 'Casado(a)', value: 'C' },
    { label: 'Divorciado(a)', value: 'D' }, { label: 'Viúvo(a)', value: 'V' }, { label: 'União Estável', value: 'U' }
  ];

  const tiposDoc = [
    { label: 'RG', value: 'RG' }, { label: 'CIN', value: 'CIN' }, { label: 'CNH', value: 'CNH' },
    { label: 'Passaporte', value: 'PAS' }, { label: 'CTPS', value: 'CTPS' },
    { label: 'Carteira Funcional', value: 'FUNC' }, { label: 'Identidade Militar', value: 'MIL' }
  ];

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleVerificarCpf = () => {
    const cpfLimpo = data.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Informe um CPF válido.', life: 3000 });
      return;
    }
    if (cpfLimpo === '11111111111' || cpfLimpo === '99999999999') {
      toast.current.show({ severity: 'error', summary: 'Cadastro Encontrado', detail: 'CPF já cadastrado no TJPB. Redirecionando...', life: 3000 });
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setStep(2);
    }
  };

  const buscarCep = async (cepLimpo) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const resultado = await response.json();
      if (!resultado.erro) {
        setData(prev => ({
          ...prev,
          logradouro: resultado.logradouro || prev.logradouro,
          bairro: resultado.bairro || prev.bairro,
          cidade: resultado.localidade || prev.cidade,
          uf: resultado.uf || prev.uf
        }));
        toast.current.show({ severity: 'success', summary: 'CEP Encontrado', detail: 'Endereço preenchido automaticamente.', life: 3000 });
      } else {
        toast.current.show({ severity: 'error', summary: 'Erro', detail: 'CEP não encontrado na base de dados.', life: 3000 });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar o CEP.', life: 3000 });
    }
  };

  const handleCepChange = (e) => {
    const val = e.target.value;
    setData({ ...data, cep: val });
    
    const cepLimpo = val.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      buscarCep(cepLimpo);
    }
  };

  const isEnderecoValid = () => {
    const cepValido = naoSeiCep || (data.cep && data.cep.replace(/\D/g, '').length === 8);
    return cepValido && data.logradouro && data.numero && data.bairro && data.cidade && data.uf;
  };

  const tabHeaderTemplate = (options, num, title) => {
    return (
      <div className={options.className} onClick={options.onClick} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', cursor: 'pointer' }}>
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '50%',
          backgroundColor: options.selected ? '#1a4480' : '#e2e8f0',
          color: options.selected ? '#ffffff' : '#64748b',
          fontWeight: 'bold', fontSize: '0.9rem'
        }}>
          {num}
        </span>
        <span style={{ fontWeight: 'bold', color: options.selected ? '#1a4480' : '#64748b', fontSize: '1.05rem' }}>
          {title}
        </span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
      <Toast ref={toast} />

      <Card style={{ 
        width: '100%', 
        maxWidth: step === 2 ? '900px' : '450px', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src={logoSiaj} alt="Logo SIAJ" style={{ width: step === 2 ? '200px' : '300px', marginBottom: '1rem' }} />
          
          {/* Títulos dinâmicos com base na Etapa */}
          {step === 1 && (
            <>
              <h2 style={{ color: '#f59e0b', margin: 0 }}>Verificação de CPF</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', marginBottom: 0 }}>
                Informe seu CPF para verificarmos seu cadastro
              </p>
            </>
          )}
          {step === 2 && <h2 style={{ color: '#f59e0b', margin: 0 }}>Registrar-se</h2>}
        </div>

        {/* PASSO 1: Verificação de CPF */}
        {step === 1 && (
          <div className="p-fluid">
            <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>CPF</label>
            <InputMask name="cpf" value={data.cpf} onChange={handleChange} mask="999.999.999-99" placeholder="000.000.000-00" />
            
            <Button label="Continuar" className="siaj-btn-primary mt-4" onClick={handleVerificarCpf} />
            
            {/* Opção para redirecionar ao Login */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <a 
                href="#/login" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }} 
                style={{ color: '#1a4480', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
              >
                Já sou profissional
              </a>
            </div>
          </div>
        )}

        {/* PASSO 2: Formulário Completo */}
        {step === 2 && (
          <div className="p-fluid">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
              
              <TabPanel headerTemplate={(options) => tabHeaderTemplate(options, "1", "Dados Pessoais")}>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  
                  <div className="col-12" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ color: '#002b5c', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1 - Dados Básicos</h3>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Nome Completo *</label>
                    <InputText name="nome" value={data.nome} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>CPF</label>
                    <InputMask value={data.cpf} disabled mask="999.999.999-99" />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Data de Nascimento *</label>
                    <InputMask name="dataNasc" value={data.dataNasc} onChange={handleChange} mask="99/99/9999" placeholder="DD/MM/AAAA" />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Nome da Mãe *</label>
                    <InputText name="nomeMae" value={data.nomeMae} onChange={handleChange} />
                  </div>

                  <div className="col-12" style={{ gridColumn: 'span 2', marginTop: '1.5rem' }}>
                    <h3 style={{ color: '#002b5c', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2 - Dados Complementares</h3>
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Nome Social</label>
                    <InputText name="nomeSocial" value={data.nomeSocial} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Sexo *</label>
                    <Dropdown name="sexo" value={data.sexo} options={sexos} onChange={handleChange} placeholder="Selecione" />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Estado Civil *</label>
                    <Dropdown name="estadoCivil" value={data.estadoCivil} options={estadosCivis} onChange={handleChange} placeholder="Selecione" />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Nacionalidade *</label>
                    <InputText name="nacionalidade" value={data.nacionalidade} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Profissão *</label>
                    <InputText name="profissao" value={data.profissao} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Telefone (Celular/WhatsApp) *</label>
                    <InputMask name="telefone" value={data.telefone} onChange={handleChange} mask="(99) 99999-9999" placeholder="(00) 00000-0000" />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Tipo Doc *</label>
                    <Dropdown name="tipoDoc" value={data.tipoDoc} options={tiposDoc} onChange={handleChange} placeholder="Selecione" />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Número *</label>
                    <InputText name="numeroDoc" value={data.numeroDoc} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Órgão Emissor *</label>
                    <InputText name="orgaoEmissor" value={data.orgaoEmissor} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>UF *</label>
                    <Dropdown name="ufDoc" value={data.ufDoc} options={ufs} onChange={handleChange} placeholder="Selecione" />
                  </div>
                </div>
              </TabPanel>

              <TabPanel headerTemplate={(options) => tabHeaderTemplate(options, "2", "Endereço")}>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>CEP {naoSeiCep ? '' : '*'}</label>
                    <InputMask name="cep" value={data.cep} mask="99999-999" onChange={handleCepChange} disabled={naoSeiCep} placeholder="00000-000" />
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.75rem' }}>
                      <Checkbox inputId="naoSeiCep" checked={naoSeiCep} onChange={(e) => { 
                        setNaoSeiCep(e.checked); 
                        if(e.checked) setData({...data, cep: ''}); 
                      }} />
                      <label htmlFor="naoSeiCep" style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>Não sei meu CEP</label>
                    </div>
                  </div>
                  <div></div> 

                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Logradouro *</label>
                    <InputText name="logradouro" value={data.logradouro} onChange={handleChange} />
                  </div>
                  
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Número *</label>
                    <InputText name="numero" value={data.numero} onChange={handleChange} />
                  </div>

                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Complemento</label>
                    <InputText name="complemento" value={data.complemento} onChange={handleChange} placeholder="Apto, Bloco, etc." />
                  </div>

                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Bairro *</label>
                    <InputText name="bairro" value={data.bairro} onChange={handleChange} />
                  </div>
                  
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Cidade *</label>
                    <InputText name="cidade" value={data.cidade} onChange={handleChange} />
                  </div>
                  
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>UF *</label>
                    <Dropdown name="uf" value={data.uf} options={ufs} onChange={handleChange} placeholder="Selecione" />
                  </div>

                </div>
              </TabPanel>

              {/* NOVA ABA: CREDENCIAIS */}
              <TabPanel headerTemplate={(options) => tabHeaderTemplate(options, "3", "Credenciais")}>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>E-mail *</label>
                    <InputText name="email" value={data.email} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Senha *</label>
                    <Password name="senha" value={data.senha} onChange={handleChange} toggleMask feedback={false} />
                  </div>
                  <div>
                    <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Confirmar Senha *</label>
                    <Password name="confSenha" value={data.confSenha} onChange={handleChange} toggleMask feedback={false} />
                  </div>
                </div>
              </TabPanel>
            </TabView>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #dee2e6', paddingTop: '1.5rem' }}>
              {activeIndex === 2 && (
                <div className="flex align-items-center mb-4">
                  <Checkbox inputId="termos" checked={data.termos} onChange={(e) => setData({...data, termos: e.checked})} />
                  <label htmlFor="termos" className="ml-2" style={{ fontSize: '0.875rem' }}>Eu concordo com os termos e condições</label>
                </div>
              )}
              <div className="flex justify-content-end gap-2">
                <Button label="Voltar" severity="secondary" text onClick={() => activeIndex === 0 ? setStep(1) : setActiveIndex(activeIndex - 1)} />
                {activeIndex < 2 ? (
                  <Button label="Avançar" icon="pi pi-arrow-right" iconPos="right" className="siaj-btn-primary" onClick={() => setActiveIndex(activeIndex + 1)} />
                ) : (
                  <Button 
                    label="Concluir Registro" 
                    icon="pi pi-check" 
                    disabled={!data.termos || !isEnderecoValid()} 
                    className="siaj-btn-primary" 
                    onClick={() => setStep(3)} 
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <i className="pi pi-check-circle" style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1.5rem' }}></i>
            <h2 style={{ color: '#f59e0b', margin: 0 }}>Registro realizado!</h2>
            <p style={{ color: '#4b5563', lineHeight: '1.6', marginTop: '1.5rem', marginBottom: '2rem' }}>
              Por favor, acesse seu e-mail para validar a conta. Caso a mensagem não esteja na caixa de entrada, confira o spam ou lixo eletrônico. Se ainda assim não a encontrar, tente fazer o login para solicitar o reenvio.
              <br /><br />
              Após a confirmação, retorne à tela inicial e acesse com seu CPF e senha.
            </p>
            <Button label="Ir para o Login" className="siaj-btn-primary w-full" onClick={() => navigate('/login')} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PreCadastro;