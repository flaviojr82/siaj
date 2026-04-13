import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Divider } from 'primereact/divider';
import logoSiaj from '../assets/Logo_SIAJ_Sem_Fundo.png';

// --- Componente de Cartão de Estatística ---
const StatCard = ({ title, value, icon, color, onClick }) => (
  <div onClick={onClick} style={{ cursor: 'pointer', transition: 'transform 0.2s', flex: '1 1 200px' }}>
    <Card style={{ borderLeft: `5px solid ${color}`, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#64748b', fontSize: '0.70rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{title}</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginTop: '0.4rem' }}>{value}</div>
        </div>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: `${color}15`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <i className={icon} style={{ color: color, fontSize: '1.2rem' }}></i>
        </div>
      </div>
    </Card>
  </div>
);

// --- TELA DE ANÁLISE DE CADASTRO (Nova Funcionalidade) ---
const AnaliseCadastro = ({ profissional, onVoltar }) => {
  const documentos = [
    { id: 1, nome: 'RG_Frente.pdf', tipo: 'Identificação' },
    { id: 2, nome: 'Diploma_Graduacao.pdf', tipo: 'Escolaridade' },
    { id: 3, nome: 'Certidao_Negativa_Criminal.pdf', tipo: 'Certidão' }
  ];

  return (
    <Card title={`Analisar Cadastro: ${profissional.nome}`} subTitle={`Status Atual: ${profissional.status}`}>
      <div className="grid">
        <div className="col-12" style={{ marginBottom: '1.5rem' }}>
           <h4 style={{ color: '#002b5c' }}><i className="pi pi-user mr-2"></i> Dados do Profissional</h4>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div><strong>Nome Completo:</strong><br/>{profissional.nome}</div>
              <div><strong>CPF:</strong><br/>{profissional.cpf}</div>
              <div><strong>Área de Atuação:</strong><br/>{profissional.atuacao}</div>
           </div>
        </div>

        <Divider />

        <div className="col-12" style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#002b5c' }}><i className="pi pi-file mr-2"></i> Documentação Anexada</h4>
          <DataTable value={documentos} className="mt-3" size="small">
            <Column field="tipo" header="Tipo de Documento" />
            <Column field="nome" header="Arquivo" />
            <Column header="Ações" body={() => (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button icon="pi pi-eye" text tooltip="Visualizar" />
                <Button icon="pi pi-download" text severity="secondary" tooltip="Baixar" />
              </div>
            )} />
          </DataTable>
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button label="Voltar" icon="pi pi-arrow-left" text onClick={onVoltar} />
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button 
              label="Devolver para Correção" 
              icon="pi pi-undo" 
              severity="warning" 
              onClick={() => { alert('O cadastro foi devolvido e o status será "Aguardando Correção".'); onVoltar(); }} 
            />
            <Button 
              label="Reprovar Cadastro" 
              icon="pi pi-times" 
              severity="danger" 
              onClick={() => { alert('O cadastro foi Reprovado definitivamente.'); onVoltar(); }} 
            />
            <Button 
              label="Aprovar e Ativar" 
              icon="pi pi-check" 
              severity="success" 
              onClick={() => { alert('O cadastro foi Aprovado e o status será "Ativo".'); onVoltar(); }} 
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

// --- LISTAGEM DE PROFISSIONAIS ---
const ProfissionaisList = ({ filter, onAnalisar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const pendenciasMock = [
    { id: 1, nome: 'João da Silva', cpf: '111.111.111-11', atuacao: 'Perito', dataEnvio: '10/04/2026', status: 'Novo' },
    { id: 2, nome: 'Maria Oliveira', cpf: '222.222.222-22', atuacao: 'Leiloeiro', dataEnvio: '09/04/2026', status: 'Em Análise (TJPB)' },
    { id: 3, nome: 'Carlos Souza', cpf: '333.333.333-33', atuacao: 'Administrador Judicial', dataEnvio: '08/04/2026', status: 'Ativo' },
    { id: 4, nome: 'Ana Costa', cpf: '444.444.444-44', atuacao: 'Tradutor', dataEnvio: '11/04/2026', status: 'Aguardando Correção (Auxiliar)' },
    { id: 5, nome: 'Roberto Alves', cpf: '555.555.555-55', atuacao: 'Perito', dataEnvio: '12/04/2026', status: 'Novo' },
    { id: 6, nome: 'Fernanda Lima', cpf: '666.666.666-66', atuacao: 'Mediador/Conciliador', dataEnvio: '13/04/2026', status: 'Aguardando Reanálise' },
    { id: 7, nome: 'Pedro Marques', cpf: '777.777.777-77', atuacao: 'Perito', dataEnvio: '14/04/2026', status: 'Ativo' },
  ];

  let dadosExibidos = filter ? pendenciasMock.filter(item => item.status === filter) : pendenciasMock;

  if (searchTerm.length >= 3) {
    const termo = searchTerm.toLowerCase();
    dadosExibidos = dadosExibidos.filter(item => 
      item.nome.toLowerCase().includes(termo) || 
      item.cpf.includes(termo) || 
      item.atuacao.toLowerCase().includes(termo)
    );
  }

  const getMenuItems = () => {
    if (!selectedRow) return [];
    
    const items = [];
    
    if (['Novo', 'Em Análise', 'Em Análise (TJPB)', 'Aguardando Reanálise'].includes(selectedRow.status)) {
        items.push({ label: 'Analisar', icon: 'pi pi-search', command: () => onAnalisar(selectedRow) });
    }
    
    items.push(
        { label: 'Detalhar', icon: 'pi pi-id-card' },
        { label: 'Editar', icon: 'pi pi-pencil' },
        { label: 'Ativar/Inativar', icon: 'pi pi-power-off' },
        { label: 'Excluir', icon: 'pi pi-trash', style: { color: 'var(--red-500)' } }
    );
    
    return items;
  };

  const acoesTemplate = (rowData) => (
    <Button 
      icon="pi pi-ellipsis-v" 
      text 
      rounded 
      severity="secondary" 
      aria-label="Ações" 
      onClick={(e) => { 
        setSelectedRow(rowData); 
        menuRef.current.toggle(e); 
      }} 
    />
  );
  
  const statusTemplate = (rowData) => {
    const severities = { 
      'Novo': 'info', 
      'Em Análise (TJPB)': 'warning', 
      'Ativo': 'success', 
      'Aguardando Correção (Auxiliar)': 'danger',
      'Aguardando Reanálise': 'help' 
    };
    return <Tag value={rowData.status} severity={severities[rowData.status] || 'info'} />;
  };

  return (
    <>
      <Card title={`Gestão de Profissionais ${filter ? `- Filtrando por: ${filter}` : '(Todos os Registros)'}`}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <i className="pi pi-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <InputText 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Buscar CPF, Nome ou Área..." 
              style={{ width: '100%', paddingLeft: '2.5rem' }}
              tooltip="Digite pelo menos 3 caracteres para iniciar a busca"
              tooltipOptions={{ position: 'top' }}
            />
          </div>
        </div>

        <DataTable 
          value={dadosExibidos} 
          responsiveLayout="scroll" 
          stripedRows 
          emptyMessage="Nenhum registro encontrado."
          paginator 
          rows={5} 
          rowsPerPageOptions={[5, 10, 20]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Total de {totalRecords} registros"
        >
          <Column field="cpf" header="CPF" />
          <Column field="nome" header="Profissional" />
          <Column field="atuacao" header="Área de Atuação" />
          <Column field="dataEnvio" header="Data de Envio" />
          <Column header="Status" body={statusTemplate} />
          <Column header="Ações" body={acoesTemplate} align="center" style={{ width: '80px' }} />
        </DataTable>

        <Menu model={getMenuItems()} popup ref={menuRef} id="popup_menu_acoes" />
      </Card>
    </>
  );
};

// --- Dashboard Principal do Servidor ---
const ServidorHome = ({ onCardClick }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
    <StatCard title="Novos Cadastros" value="2" icon="pi pi-user-plus" color="#0056b3" onClick={() => onCardClick('Novo')} />
    <StatCard title="Em Análise (TJPB)" value="1" icon="pi pi-file-edit" color="#f59e0b" onClick={() => onCardClick('Em Análise (TJPB)')} />
    <StatCard title="Aguardando Reanálise" value="1" icon="pi pi-sync" color="#8b5cf6" onClick={() => onCardClick('Aguardando Reanálise')} />
    <StatCard title="Auxiliares Ativos" value="2" icon="pi pi-check-circle" color="#16a34a" onClick={() => onCardClick('Ativo')} />
    <StatCard title="Aguardando Correção" value="1" icon="pi pi-exclamation-triangle" color="#ef4444" onClick={() => onCardClick('Aguardando Correção (Auxiliar)')} />
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
  const [listFilter, setListFilter] = useState(null); 
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem('siaj_user_role');
    if (!loggedUser) navigate('/login');
    else setUserRole(loggedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('siaj_user_role');
    navigate('/login');
  };

  const handleMenuClick = (id) => {
    setActiveView(id);
    if (id === 'profissionais') setListFilter(null); 
  };

  const handleCardClick = (filtro) => {
    setListFilter(filtro); 
    setActiveView('profissionais'); 
  };

  const handleAnalisar = (profissional) => {
    setSelectedProfessional(profissional);
    setActiveView('analisar_detalhe');
  };

  if (!userRole) return null;

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
        backgroundColor: '#002b5c', 
        color: 'white', 
        transition: 'width 0.3s ease',
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}>
        
        <div style={{ padding: '2rem 1rem', textAlign: 'center', backgroundColor: '#ffffff', marginBottom: '1rem' }}>
          <img src={logoSiaj} alt="Logo" style={{ width: collapsed ? '65px' : '160px', transition: 'width 0.3s' }} />
        </div>

        <div onClick={() => setCollapsed(!collapsed)} style={{
            position: 'absolute', right: '-15px', top: '100px', width: '30px', height: '30px', borderRadius: '50%',
            backgroundColor: '#0056b3', display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', border: '2px solid white', zIndex: 10
          }}>
          <i className={collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'} style={{ fontSize: '0.8rem' }}></i>
        </div>

        <div style={{ flex: 1, padding: '1rem 0' }}>
          {menuItems.map((item) => (
            <div key={item.id} onClick={() => handleMenuClick(item.id)} style={{
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

        <div onClick={handleLogout} style={{ padding: '1.5rem', borderTop: '1px solid #004494', cursor: 'pointer', color: '#ffbaba', textAlign: collapsed ? 'center' : 'left' }}>
          <i className="pi pi-sign-out"></i>
          {!collapsed && <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>Sair</span>}
        </div>
      </div>

      {/* 2. ÁREA DE CONTEÚDO */}
      <div style={{ flex: 1, backgroundColor: '#f4f7fa', overflowY: 'auto', padding: '2rem' }}>
        
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
          activeView === 'inicio' ? <ServidorHome onCardClick={handleCardClick} /> : 
          activeView === 'profissionais' ? <ProfissionaisList filter={listFilter} onAnalisar={handleAnalisar} /> : 
          activeView === 'analisar_detalhe' ? <AnaliseCadastro profissional={selectedProfessional} onVoltar={() => setActiveView('profissionais')} /> :
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