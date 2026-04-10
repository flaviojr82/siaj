import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png';

// --- Componente de Cartão de Estatística ---
const StatCard = ({ title, value, icon, color }) => (
  <div className="siaj-col-12 md:siaj-col-3">
    <Card style={{ borderLeft: `5px solid ${color}`, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{title}</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginTop: '0.4rem' }}>{value}</div>
        </div>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: `${color}15`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <i className={icon} style={{ color: color, fontSize: '1.2rem' }}></i>
        </div>
      </div>
    </Card>
  </div>
);

// --- LISTAGEM DE PROFISSIONAIS (Chamada pelo Menu) ---
const ProfissionaisList = () => {
  const pendenciasMock = [
    { id: 1, nome: 'João da Silva', cpf: '111.***.***-11', atuacao: 'Perito', dataEnvio: '10/04/2026', status: 'Pendente' },
    { id: 2, nome: 'Maria Oliveira', cpf: '222.***.***-22', atuacao: 'Leiloeiro', dataEnvio: '09/04/2026', status: 'Pendente' },
    { id: 3, nome: 'Carlos Souza', cpf: '333.***.***-33', atuacao: 'Administrador Judicial', dataEnvio: '08/04/2026', status: 'Pendente' },
  ];

  const acoesTemplate = () => <Button label="Analisar" icon="pi pi-search" className="p-button-sm" style={{ backgroundColor: '#0056b3' }} />;
  const statusTemplate = (rowData) => <Tag value={rowData.status} severity="warning" />;

  return (
    <Card title="Gestão de Profissionais">
      <DataTable value={pendenciasMock} responsiveLayout="scroll" stripedRows>
        <Column field="cpf" header="CPF" />
        <Column field="nome" header="Requerente" />
        <Column field="atuacao" header="Área de Atuação" />
        <Column field="dataEnvio" header="Data de Envio" />
        <Column header="Status" body={statusTemplate} />
        <Column header="Ação" body={acoesTemplate} align="center" />
      </DataTable>
    </Card>
  );
};

// --- Dashboard Principal do Servidor ---
const ServidorHome = () => (
  <div className="siaj-grid">
    <StatCard title="Novos Cadastros" value="12" icon="pi pi-user-plus" color="#0056b3" />
    <StatCard title="Validações Pendentes" value="05" icon="pi pi-file-edit" color="#f59e0b" />
    <StatCard title="Auxiliares Ativos" value="348" icon="pi pi-check-circle" color="#16a34a" />
    <StatCard title="Diligências do Mês" value="47" icon="pi pi-map-marker" color="#6366f1" />
  </div>
);

// --- Dashboard Principal do Auxiliar ---
const AuxiliarHome = () => (
  <div className="siaj-grid">
    <div className="siaj-col-12 md:siaj-col-4">
      <Card title="Meu Status">
        <Tag value="EM ANÁLISE" severity="warning" style={{ fontSize: '1rem', padding: '0.5rem' }} />
        <p style={{ marginTop: '1rem' }}>Sua documentação está em fila de conferência.</p>
      </Card>
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('inicio');

  useEffect(() => {
    const loggedUser = localStorage.getItem('siaj_user_role');
    if (!loggedUser) navigate('/login');
    else setUserRole(loggedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('siaj_user_role');
    navigate('/login');
  };

  if (!userRole) return null;

  // Itens de Menu conforme novas regras
  const menuItems = userRole === 'servidor' 
    ? [ 
        { id: 'inicio', label: 'Início', icon: 'pi pi-chart-bar' }, 
        { id: 'profissionais', label: 'Profissionais', icon: 'pi pi-users' },
        { id: 'config', label: 'Configurações', icon: 'pi pi-cog' }
      ]
    : [ 
        { id: 'inicio', label: 'Meu Cadastro', icon: 'pi pi-id-card' }, 
        { id: 'nomeacoes', label: 'Nomeações', icon: 'pi pi-briefcase' } 
      ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* 1. SIDEBAR RETRÁTIL */}
      <div style={{ 
        width: collapsed ? '80px' : '260px', 
        backgroundColor: '#002b5c', // Azul escuro padrão TJPB/SIAJ
        color: 'white', 
        transition: 'width 0.3s ease',
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}>
        
        {/* Logo Container com Fundo Branco */}
        <div style={{ 
          padding: '2rem 1rem', 
          textAlign: 'center', 
          backgroundColor: '#ffffff', // Fundo branco solicitado
          marginBottom: '1rem'
        }}>
          <img 
            src={logoSiaj} 
            alt="Logo" 
            style={{ width: collapsed ? '65px' : '200px', transition: 'width 0.3s' }} 
          />
        </div>

        {/* Botão de Retrair/Expandir */}
        <div 
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute', right: '-15px', top: '100px',
            width: '30px', height: '30px', borderRadius: '50%',
            backgroundColor: '#0056b3', display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', border: '2px solid white', zIndex: 10
          }}>
          <i className={collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'} style={{ fontSize: '0.8rem' }}></i>
        </div>

        {/* Links do Menu */}
        <div style={{ flex: 1, padding: '1rem 0' }}>
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem',
                backgroundColor: activeView === item.id ? '#004494' : 'transparent',
                borderLeft: activeView === item.id ? '4px solid #16a34a' : '4px solid transparent',
                color: activeView === item.id ? '#ffffff' : '#cbd5e1',
                justifyContent: collapsed ? 'center' : 'flex-start'
              }}>
              <i className={item.icon} style={{ fontSize: '1.2rem' }}></i>
              {!collapsed && <span style={{ fontSize: '0.9rem', fontWeight: activeView === item.id ? 'bold' : 'normal' }}>{item.label}</span>}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div onClick={handleLogout} style={{ padding: '1.5rem', borderTop: '1px solid #004494', cursor: 'pointer', color: '#ffbaba', textAlign: collapsed ? 'center' : 'left' }}>
          <i className="pi pi-sign-out"></i>
          {!collapsed && <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>Sair</span>}
        </div>
      </div>

      {/* 2. ÁREA DE CONTEÚDO */}
      <div style={{ flex: 1, backgroundColor: '#f4f7fa', overflowY: 'auto', padding: '2rem' }}>
        
        {/* Header Interno */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#002b5c', margin: 0, fontSize: '1.5rem' }}>
            {menuItems.find(i => i.id === activeView)?.label || 'Painel'}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontWeight: 'bold', color: '#002b5c' }}>{userRole === 'servidor' ? 'Validador TJPB' : 'Profissional Auxiliar'}</div>
               <small style={{ color: '#64748b' }}>Acesso Restrito</small>
             </div>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0056b3', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                {userRole === 'servidor' ? 'S' : 'A'}
             </div>
          </div>
        </div>

        {/* Lógica de Troca de Telas */}
        {userRole === 'servidor' ? (
          activeView === 'inicio' ? <ServidorHome /> : 
          activeView === 'profissionais' ? <ProfissionaisList /> : 
          <Card>Funcionalidade em desenvolvimento.</Card>
        ) : (
          activeView === 'inicio' ? <AuxiliarHome /> :
          <Card>Funcionalidade em desenvolvimento.</Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;