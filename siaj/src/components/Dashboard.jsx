import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png';

// --- DADOS MOCK (SIMULADOS) ---
const PROFISSIONAIS_INICIAIS = [
  { id: 1, nome: 'Dr. Ricardo Santos', cpf: '123.***.***-01', atuacao: 'Perito Médico', status: 'Novo', data: '10/04/2026' },
  { id: 2, nome: 'Eng. Maria Clara', cpf: '234.***.***-02', atuacao: 'Perito Engenharia', status: 'Em Análise (TJPB)', data: '09/04/2026' },
  { id: 3, nome: 'Dra. Juliana Lima', cpf: '345.***.***-03', atuacao: 'Tradutora Pública', status: 'Pendente (Ajustes)', data: '08/04/2026' },
  { id: 4, nome: 'Leiloeiro Bruno', cpf: '456.***.***-04', atuacao: 'Leiloeiro', status: 'Aguardando Reanálise', data: '11/04/2026' },
  { id: 5, nome: 'Adm. Roberto', cpf: '567.***.***-05', atuacao: 'Adm. Judicial', status: 'Aprovado', data: '05/04/2026' }
];

// --- COMPONENTE: DASHBOARD DO SERVIDOR ---
const ServidorDashboard = ({ profissionais, onAction, changeTab }) => {
  const menuRef = useRef(null);
  const [selectedProf, setSelectedProf] = useState(null);

  const getStatusSeverity = (status) => {
    switch (status) {
      case 'Novo': return 'info';
      case 'Em Análise (TJPB)': return 'warning';
      case 'Pendente (Ajustes)': return 'danger';
      case 'Aguardando Reanálise': return 'help';
      case 'Aprovado': return 'success';
      default: return null;
    }
  };

  const statusTemplate = (rowData) => (
    <Tag value={rowData.status} severity={getStatusSeverity(rowData.status)} />
  );

  const actionTemplate = (rowData) => {
    const items = [
      { label: 'Editar', icon: 'pi pi-pencil' },
      { label: 'Detalhar', icon: 'pi pi-search' },
      { label: 'Ativar/Inativar', icon: 'pi pi-power-off' },
      { label: 'Excluir', icon: 'pi pi-trash' }
    ];

    if (['Novo', 'Em Análise (TJPB)', 'Aguardando Reanálise'].includes(rowData.status)) {
      items.unshift({ 
        label: 'Analisar', 
        icon: 'pi pi-check-square',
        command: () => onAction('Analisar', rowData)
      });
    }

    return (
      <div className="flex justify-content-center">
        <Menu model={items} popup ref={menuRef} id="popup_menu" />
        <Button 
          icon="pi pi-ellipsis-v" 
          rounded 
          text 
          severity="secondary" 
          onClick={(e) => { setSelectedProf(rowData); menuRef.current.toggle(e); }} 
        />
      </div>
    );
  };

  const cardStyle = { flex: '1 1 18%', minWidth: '200px', cursor: 'pointer', borderLeft: '4px solid transparent' };

  return (
    <div className="animate__animated animate__fadeIn">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ ...cardStyle, borderLeftColor: '#3b82f6' }} onClick={() => changeTab('Profissionais')}>
          <Card title="Novos" subTitle="Este mês" className="shadow-2">
            <h2 style={{ color: '#3b82f6', margin: 0, fontSize: '2rem' }}>12</h2>
          </Card>
        </div>
        <div style={{ ...cardStyle, borderLeftColor: '#f59e0b' }} onClick={() => changeTab('Profissionais')}>
          <Card title="Em Análise" subTitle="TJPB" className="shadow-2">
            <h2 style={{ color: '#f59e0b', margin: 0, fontSize: '2rem' }}>08</h2>
          </Card>
        </div>
        <div style={{ ...cardStyle, borderLeftColor: '#a855f7' }} onClick={() => changeTab('Profissionais')}>
          <Card title="Reanálise" subTitle="Correções" className="shadow-2">
            <h2 style={{ color: '#a855f7', margin: 0, fontSize: '2rem' }}>03</h2>
          </Card>
        </div>
        <div style={{ ...cardStyle, borderLeftColor: '#ef4444' }} onClick={() => changeTab('Profissionais')}>
          <Card title="Pendentes" subTitle="Com Auxiliar" className="shadow-2">
            <h2 style={{ color: '#ef4444', margin: 0, fontSize: '2rem' }}>05</h2>
          </Card>
        </div>
        <div style={{ ...cardStyle, borderLeftColor: '#22c55e' }} onClick={() => changeTab('Profissionais')}>
          <Card title="Aprovados" subTitle="Total Ativos" className="shadow-2">
            <h2 style={{ color: '#22c55e', margin: 0, fontSize: '2rem' }}>142</h2>
          </Card>
        </div>
      </div>

      <Card title="Gestão de Profissionais Requerentes" style={{ borderRadius: '12px' }}>
        <DataTable value={profissionais} paginator rows={5} tableStyle={{ minWidth: '50rem' }} className="p-datatable-sm">
          <Column field="nome" header="Nome / Razão Social" sortable />
          <Column field="atuacao" header="Área de Atuação" />
          <Column field="data" header="Data Solicitação" sortable />
          <Column header="Status" body={statusTemplate} />
          <Column header="Ações" body={actionTemplate} style={{ width: '80px', textAlign: 'center' }} />
        </DataTable>
      </Card>
    </div>
  );
};

// --- COMPONENTE: HOME DO AUXILIAR ---
const AuxiliarHome = () => {
  const navigate = useNavigate();

  // Dados pré-preenchidos vindos do cadastro básico
  const dadosCadastrais = {
    nomeCivil: 'João da Silva',
    email: 'joao.silva@email.com',
    cpf: '111.111.111-11',
    dataNascimento: '15/05/1980',
    nomeMae: 'Maria da Silva',
    statusAtual: 'Cadastro Incompleto' // Opções: "Cadastro Incompleto", "Cadastro em Análise", "Cadastro Ativo", "Cadastro Reprovado", "Cadastro Inativo"
  };

  const getStatusSeverity = (status) => {
    switch (status) {
      case 'Cadastro Ativo': return 'success';
      case 'Cadastro em Análise': return 'warning';
      case 'Cadastro Reprovado': 
      case 'Cadastro Inativo': return 'danger';
      default: return 'info';
    }
  };

  return (
    <div className="animate__animated animate__fadeIn">
      <div style={{ marginBottom: '1rem' }}>
        <Tag 
          value={dadosCadastrais.statusAtual} 
          severity={getStatusSeverity(dadosCadastrais.statusAtual)} 
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        />
      </div>

      <Card title="Meus Dados Cadastrais">
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Abaixo estão os dados preenchidos em seu cadastro básico. Revise-os antes de submeter.
        </p>
        
        <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', color: '#002b5c', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nome Completo</label>
              <InputText value={dadosCadastrais.nomeCivil} disabled />
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', color: '#002b5c', fontWeight: 'bold', marginBottom: '0.5rem' }}>E-mail</label>
              <InputText value={dadosCadastrais.email} disabled />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 30%' }}>
              <label style={{ display: 'block', color: '#002b5c', fontWeight: 'bold', marginBottom: '0.5rem' }}>CPF</label>
              <InputText value={dadosCadastrais.cpf} disabled />
            </div>
            <div style={{ flex: '1 1 30%' }}>
              <label style={{ display: 'block', color: '#002b5c', fontWeight: 'bold', marginBottom: '0.5rem' }}>Data de Nascimento</label>
              <InputText value={dadosCadastrais.dataNascimento} disabled />
            </div>
            <div style={{ flex: '1 1 30%' }}>
              <label style={{ display: 'block', color: '#002b5c', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nome da Mãe</label>
              <InputText value={dadosCadastrais.nomeMae} disabled />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <Button 
            label="Editar Cadastro" 
            icon="pi pi-user-edit" 
            severity="secondary" 
            outlined
            onClick={() => navigate('/completar-cadastro')} 
          />
          <Button 
            label="Submeter Cadastro" 
            icon="pi pi-send" 
            style={{ backgroundColor: '#002b5c', borderColor: '#002b5c', fontWeight: 'bold' }}
            onClick={() => alert('Cadastro submetido com sucesso para análise do TJPB!')} 
          />
        </div>
      </Card>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL: DASHBOARD ---
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userRole, setUserRole] = useState(location.state?.role || 'servidor'); 
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');

  const handleLogout = () => navigate('/welcome');

  const getMenuBtnStyle = (tabName) => ({
    width: '100%', 
    color: activeTab === tabName ? '#f59e0b' : '#ffffff', 
    justifyContent: sidebarVisible ? 'flex-start' : 'center', 
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    transition: 'background-color 0.2s'
  });

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
      
      {/* Sidebar Retrátil */}
      <div style={{ 
        width: sidebarVisible ? '260px' : '80px', 
        backgroundColor: '#002b5c', 
        color: '#fff', 
        transition: 'width 0.3s ease',
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        zIndex: 10
      }}>
        {/* Logo Container com Fundo Branco (Aumentado conforme pedido) */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          height: '200px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '1rem', 
          borderBottom: '1px solid rgba(255,255,255,0.1)' 
        }}>
          {sidebarVisible ? (
             <img src={logoSiaj} alt="SIAJ" style={{ width: '400px' }} />
          ) : (
             <img src={logoSiaj} alt="SIAJ" style={{ width: '150px' }} />
          )}
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column' }}>
          <Button 
            icon="pi pi-home" 
            label={sidebarVisible ? "Início" : ""} 
            text 
            style={getMenuBtnStyle('Home')}
            onClick={() => setActiveTab('Home')}
          />
          
          {userRole === 'servidor' && (
            <Button 
              icon="pi pi-users" 
              label={sidebarVisible ? "Profissionais" : ""} 
              text 
              style={getMenuBtnStyle('Profissionais')}
              onClick={() => setActiveTab('Profissionais')}
            />
          )}

          {/* Opção Configurações removida conforme solicitado */}
        </div>

        {/* Footer Sidebar */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button 
            icon="pi pi-sign-out" 
            label={sidebarVisible ? "Sair" : ""} 
            severity="danger" 
            text 
            style={{ width: '100%', justifyContent: sidebarVisible ? 'flex-start' : 'center', padding: '1rem' }}
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Área de Conteúdo Principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Cabeçalho */}
        <header style={{ 
          backgroundColor: '#ffffff', 
          minHeight: '80px',
          padding: '0 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          zIndex: 5
        }}>
          <Button icon="pi pi-bars" text severity="secondary" size="large" onClick={() => setSidebarVisible(!sidebarVisible)} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold', color: '#002b5c', fontSize: '1rem' }}>
                {userRole === 'servidor' ? 'Carlos Validador' : 'João Profissional'}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                {userRole === 'servidor' ? 'Servidor TJPB' : 'Profissional Liberal'}
              </span>
            </div>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#002b5c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {userRole === 'servidor' ? 'CV' : 'JP'}
            </div>
          </div>
        </header>

        {/* Corpo da Página */}
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
             <h1 style={{ color: '#002b5c', margin: 0, fontSize: '1.8rem' }}>{activeTab}</h1>
          </div>

          {userRole === 'servidor' ? (
            <ServidorDashboard 
              profissionais={PROFISSIONAIS_INICIAIS} 
              onAction={(action, data) => console.log(action, data)} 
              changeTab={setActiveTab}
            />
          ) : (
            <AuxiliarHome />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;