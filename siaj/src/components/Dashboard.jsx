import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Menu } from 'primereact/menu';
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

  // Estilo base para os cartões clicáveis
  const cardStyle = { flex: '1 1 18%', minWidth: '200px', cursor: 'pointer', borderLeft: '4px solid transparent' };

  return (
    <div className="animate__animated animate__fadeIn">
      {/* Cards de Estatísticas Lado a Lado (Flexbox) */}
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
  return (
    <div className="animate__animated animate__fadeIn">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ flex: '1 1 60%' }}>
          <Card title="Bem-vindo(a) ao SIAJ">
            <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Detectamos que o seu cadastro de Auxiliar da Justiça ainda precisa ser complementado para análise.
            </p>
            <Button 
              label="Completar Cadastro" 
              icon="pi pi-file-edit" 
              style={{ backgroundColor: '#002b5c', borderColor: '#002b5c', fontWeight: 'bold' }}
              onClick={() => navigate('/completar-cadastro')} 
            />
          </Card>
        </div>
        <div style={{ flex: '1 1 35%' }}>
          <Card title="Meu Status Atual">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <Tag value="CADASTRO INCOMPLETO" severity="danger" style={{ fontSize: '1rem', padding: '0.6rem 1rem' }} />
              <small style={{ color: '#94a3b8' }}>Última atualização: Hoje</small>
            </div>
          </Card>
        </div>
      </div>
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

  // Estilos padronizados dos botões do menu para estado aberto/fechado
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
        {/* Logo container */}
        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {sidebarVisible ? (
             <img src={logoSiaj} alt="SIAJ" style={{ width: '140px' }} />
          ) : (
             <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#f59e0b' }}>SJ</h2>
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

          <Button 
            icon="pi pi-cog" 
            label={sidebarVisible ? "Configurações" : ""} 
            text 
            style={getMenuBtnStyle('Config')}
          />
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