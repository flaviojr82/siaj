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
import { MultiSelect } from 'primereact/multiselect';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png';

export default function AuxiliarRegistrationForm() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [naoSeiCep, setNaoSeiCep] = useState(false);

  // Dados pré-preenchidos (Adicionado array vazio para areasAtuacao)
  const [data, setData] = useState({
    nome: 'Aparecido Filho', 
    email: 'teste@e-mail.com', 
    senha: 'senha-simulada', 
    confSenha: 'senha-simulada',
    cpf: '111.111.111-11', 
    dataNasc: '15/05/1980', 
    nomeMae: 'Maria da Silva', 
    termos: true,
    nomeSocial: '', 
    sexo: 'M', 
    estadoCivil: 'C', 
    nacionalidade: 'Brasileira', 
    profissao: 'Engenheiro Civil',
    tipoDoc: 'RG', 
    numeroDoc: '1234567', 
    orgaoEmissor: 'SSP', 
    ufDoc: 'PB', 
    telefone: '(83) 99999-9999',
    cep: '58000-000', 
    logradouro: 'Avenida Epaminondas', 
    numero: '123', 
    complemento: 'Apto 402', 
    bairro: 'Centro', 
    cidade: 'João Pessoa', 
    uf: 'PB',
    areasAtuacao: [] // Novo campo para Aba 3
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

  // Matriz de Documentos por Área
  const areasOptions = [
    { label: 'Perito', value: 'Perito' },
    { label: 'Leiloeiro', value: 'Leiloeiro' },
    { label: 'Tradutor', value: 'Tradutor' },
    { label: 'Administrador Judicial', value: 'Administrador Judicial' },
    { label: 'Entrevistador Forense', value: 'Entrevistador Forense' },
    { label: 'Mediador/Conciliador', value: 'Mediador/Conciliador' },
    { label: 'Instrutor de Mediador/Conciliador', value: 'Instrutor de Mediador/Conciliador' }
  ];

  const docsPorArea = {
    'Perito': ['Diploma de Graduação', 'Registro no Conselho de Classe', 'Certidão de Regularidade'],
    'Leiloeiro': ['Registro na Junta Comercial (JUCEG)', 'Certidão Negativa Cível e Criminal'],
    'Tradutor': ['Inscrição na Junta Comercial', 'Certificado de Proficiência'],
    'Administrador Judicial': ['Registro Profissional (OAB/CRC/CRA/Corecon)', 'Certidão do Tribunal de Justiça'],
    'Entrevistador Forense': ['Diploma em Psicologia/Serviço Social', 'Certificado de Curso Específico'],
    'Mediador/Conciliador': ['Certificado de Capacitação em Mediação (Res. 125/CNJ)'],
    'Instrutor de Mediador/Conciliador': ['Certificado de Instrutor do CNJ', 'Comprovante de Docência']
  };

  const getRequiredDocs = () => {
    if (!data.areasAtuacao || data.areasAtuacao.length === 0) return [];
    let docs = new Set();
    data.areasAtuacao.forEach(area => {
      if (docsPorArea[area]) {
        docsPorArea[area].forEach(doc => docs.add(doc));
      }
    });
    return Array.from(docs);
  };

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleCepChange = (e) => {
    const val = e.target.value;
    setData({ ...data, cep: val });
  };

  const isEnderecoValid = () => {
    const cepValido = naoSeiCep || (data.cep && data.cep.replace(/\D/g, '').length === 8);
    return cepValido && data.logradouro && data.numero && data.bairro && data.cidade && data.uf;
  };

  // Função genérica de salvamento para os dois botões finais
  const handleSave = (mensagem) => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: mensagem, life: 3000 });
    setTimeout(() => navigate('/'), 2000);
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
        maxWidth: '900px', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src={logoSiaj} alt="Logo SIAJ" style={{ width: '200px', marginBottom: '1rem' }} />
          <h2 style={{ color: '#f59e0b', margin: 0 }}>Editar Cadastro - Auxiliar da Justiça</h2>
        </div>

        <div className="p-fluid">
          <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            
            {/* ABA 1 - DADOS PESSOAIS (Inalterada) */}
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

            {/* ABA 2 - ENDEREÇO (Inalterada) */}
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

            {/* ABA 3 - DOCUMENTAÇÃO (Nova Lógica e Nome) */}
            <TabPanel headerTemplate={(options) => tabHeaderTemplate(options, "3", "Documentação")}>
              <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1rem' }}>
                <div>
                  <label className="font-bold block mb-2" style={{ color: '#002b5c' }}>Área(s) de Atuação Pretendida(s) *</label>
                  <MultiSelect 
                    name="areasAtuacao" 
                    value={data.areasAtuacao} 
                    options={areasOptions} 
                    onChange={(e) => setData({ ...data, areasAtuacao: e.value })} 
                    placeholder="Selecione uma ou mais áreas" 
                    display="chip" 
                    style={{ width: '100%' }} 
                  />
                  <small style={{ color: '#64748b', display: 'block', marginTop: '0.5rem' }}>
                    Ao selecionar a área, os documentos exigidos aparecerão abaixo para anexo.
                  </small>
                </div>

                {/* Renderização Dinâmica dos Anexos Baseada na Seleção */}
                {data.areasAtuacao && data.areasAtuacao.length > 0 && (
                  <div>
                    <h4 style={{ color: '#002b5c', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: 0 }}>
                      Documentação Exigida
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {getRequiredDocs().map((doc, idx) => (
                        <div key={idx} style={{ padding: '1rem', border: '1px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                          <label className="font-bold block mb-2" style={{ color: '#334155', fontSize: '0.85rem' }}>{doc} *</label>
                          <FileUpload mode="basic" chooseLabel="Anexar Arquivo" accept="image/*,application/pdf" maxFileSize={10000000} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
            
            {/* Ajuste de Botões na Aba 3 para Salvar e Submeter */}
            <div className="flex justify-content-end gap-2" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Button 
                label="Voltar" 
                severity="secondary" 
                text 
                onClick={() => activeIndex === 0 ? navigate('/') : setActiveIndex(activeIndex - 1)} 
              />
              {activeIndex < 2 ? (
                <Button label="Avançar" icon="pi pi-arrow-right" iconPos="right" className="siaj-btn-primary" onClick={() => setActiveIndex(activeIndex + 1)} />
              ) : (
                <>
                  <Button 
                    label="Salvar" 
                    icon="pi pi-save" 
                    className="p-button-outlined siaj-btn-primary" 
                    onClick={() => handleSave('Suas alterações foram salvas como rascunho com sucesso!')} 
                  />
                  <Button 
                    label="Salvar e Submeter para Análise" 
                    icon="pi pi-check" 
                    disabled={!data.termos || !isEnderecoValid() || !data.areasAtuacao || data.areasAtuacao.length === 0} 
                    className="siaj-btn-primary" 
                    onClick={() => handleSave('Cadastro submetido para análise com sucesso!')} 
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}