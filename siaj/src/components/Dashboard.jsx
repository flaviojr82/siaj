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

  return (
    <div className="animate__animated animate__fadeIn">
      {/* Cards de Estatísticas com atalho para a listagem (cursor pointer) */}
      <div className="siaj-grid" style={{ marginBottom: '2rem' }}>
        <div className="siaj-col-12 md:siaj-col-2" onClick={() => changeTab('Profissionais')} style={{ cursor: 'pointer' }}>
          <Card title="Novos" subTitle="Este mês" className="siaj-stat-card border-left-info">
            <h2 style={{ color: '#3b82f6' }}>12</h2>
          </Card>
        </div>
        <div className="siaj-col-12 md:siaj-col-2" onClick={() => changeTab('Profissionais')} style={{ cursor: 'pointer' }}>
          <Card title="Em Análise" subTitle="TJPB" className="siaj-stat-card border-left-warning">
            <h2 style={{ color: '#f59e0b' }}>08</h2>
          </Card>
        </div>
        <div className="siaj-col-12 md:siaj-col-3" onClick={() => changeTab('Profissionais')} style={{ cursor: 'pointer' }}>
          <Card title="Aguardando Reanálise" subTitle="Correções" className="siaj-stat-card border-left-help">
            <h2 style={{ color: '#a855f7' }}>03</h2>
          </Card>
        </div>
        <div className="siaj-col-12 md:siaj-col-2" onClick={() => changeTab('Profissionais')} style={{ cursor: 'pointer' }}>
          <Card title="Pendentes" subTitle="Com Profissional" className="siaj-stat-card border-left-danger">
            <h2 style={{ color: '#ef4444' }}>05</h2>
          </Card>
        </div>
        <div className="siaj-col-12 md:siaj-col-3" onClick={() => changeTab('Profissionais')} style={{ cursor: 'pointer' }}>
          <Card title="Aprovados" subTitle="Total Ativos" className="siaj-stat-card border-left-success">
            <h2 style={{ color: '#22c55e' }}>142</h2>
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
      <div className="siaj-grid">
        <div className="siaj-col-12 md:siaj-col-6">
          <Card title="Bem-vindo(a) ao SIAJ">
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Detectamos que o seu cadastro de Auxiliar da Justiça ainda precisa ser complementado para análise.
            </p>
            <Button 
              label="Auxiliar da Justiça (Completar Cadastro)" 
              icon="pi pi-file-edit" 
              className="siaj-btn-primary" 
              style={{ fontWeight: 'bold' }}
              onClick={() => navigate('/completar-cadastro')} 
            />
          </Card>
        </div>
        <div className="siaj-col-12 md:siaj-col-4">
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
  
  // Resgata a permissão informada no login (auxiliar ou servidor). Padrão para evitar quebra de rota direta.
  const [userRole, setUserRole] = useState(location.state?.role || 'servidor'); 
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');

  const handleLogout = () => navigate('/welcome');

  return (
    <div className="siaj-layout-wrapper" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar Retrátil */}
      <div className="siaj-sidebar" style={{ 
        width: sidebarVisible ? '260px' : '80px', 
        backgroundColor: '#002b5c', 
        color: '#fff', 
        transition: 'width 0.3s ease',
        display: 'flex', 
        flexDirection: 'column'
      }}>
        <div style={{ padding: '1.5rem', textAlign: 'center', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {sidebarVisible ? (
             <img src={logoSiaj} alt="SIAJ" style={{ width: '140px' }} />
          ) : (
             <h2 style={{ margin: 0, fontSize: '1.5rem' }}>SJ</h2>
          )}
        </div>

        <div style={{ flex: 1, padding: '1rem 0' }}>
          <Button 
            icon="pi pi-home" 
            label={sidebarVisible ? "Início" : ""} 
            text 
            style={{ width: '100%', color: activeTab === 'Home' ? '#f59e0b' : '#fff', justifyContent: sidebarVisible ? 'flex-start' : 'center', padding: '1rem' }}
            onClick={() => setActiveTab('Home')}
          />
          
          {userRole === 'servidor' && (
            <Button 
              icon="pi pi-users" 
              label={sidebarVisible ? "Profissionais" : ""} 
              text 
              style={{ width: '100%', color: activeTab === 'Profissionais' ? '#f59e0b' : '#fff', justifyContent: sidebarVisible ? 'flex-start' : 'center', padding: '1rem' }}
              onClick={() => setActiveTab('Profissionais')}
            />
          )}

          <Button 
            icon="pi pi-cog" 
            label={sidebarVisible ? "Configurações" : ""} 
            text 
            style={{ width: '100%', color: '#fff', justifyContent: sidebarVisible ? 'flex-start' : 'center', padding: '1rem' }}
          />
        </div>

        <div style={{ padding: '1rem' }}>
          <Button 
            icon="pi pi-sign-out" 
            label={sidebarVisible ? "Sair" : ""} 
            severity="danger" 
            text 
            style={{ width: '100%', justifyContent: sidebarVisible ? 'flex-start' : 'center' }}
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Área de Conteúdo Principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9', overflowY: 'auto' }}>
        <header style={{ backgroundColor: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          {/* Botão de Retrair/Expandir a Sidebar */}
          <Button icon="pi pi-bars" text severity="secondary" onClick={() => setSidebarVisible(!sidebarVisible)} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: '#002b5c' }}>
                {userRole === 'servidor' ? 'Carlos Validador' : 'João Profissional'}
              </div>
              <small style={{ color: '#64748b' }}>{userRole === 'servidor' ? 'Servidor TJPB' : 'Profissional Liberal'}</small>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#002b5c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {userRole === 'servidor' ? 'CV' : 'JP'}
            </div>
          </div>
        </header>

        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
             <h1 style={{ color: '#002b5c', margin: 0 }}>{activeTab}</h1>
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