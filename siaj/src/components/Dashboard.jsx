import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

// --- Visão do Auxiliar ---
const AuxiliarDashboard = () => {
  return (
    <div className="siaj-grid">
      <div className="siaj-col-12 md:siaj-col-4">
        <Card title="Status do Cadastro">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Tag value="EM ANÁLISE" severity="warning" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }} />
          </div>
          <p>Sua documentação foi enviada e está na fila para validação por um servidor do TJPB.</p>
        </Card>
      </div>
      <div className="siaj-col-12 md:siaj-col-8">
        <Card title="Minhas Atuações Pretendidas">
          <ul>
            <li><strong>Perito:</strong> Aguardando validação do diploma.</li>
            <li><strong>Tradutor:</strong> Aguardando validação de proficiência.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

// --- Visão do Servidor Validador ---
const ServidorDashboard = () => {
  // Mock de dados para a fila de trabalho do servidor
  const pendenciasMock = [
    { id: 1, nome: 'João da Silva', cpf: '111.***.***-11', atuacao: 'Perito', dataEnvio: '10/04/2026', status: 'Pendente' },
    { id: 2, nome: 'Maria Oliveira', cpf: '222.***.***-22', atuacao: 'Leiloeiro', dataEnvio: '09/04/2026', status: 'Pendente' },
    { id: 3, nome: 'Carlos Souza', cpf: '333.***.***-33', atuacao: 'Administrador Judicial', dataEnvio: '08/04/2026', status: 'Pendente' },
  ];

  const acoesTemplate = () => {
    return <Button label="Analisar" icon="pi pi-search" className="siaj-btn-primary p-button-sm" />;
  };

  const statusTemplate = (rowData) => {
    return <Tag value={rowData.status} severity="warning" />;
  };

  return (
    <Card title="Fila de Validação Cadastral">
      <p>Cadastros aguardando conferência documental (Total: {pendenciasMock.length})</p>
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

// --- Controlador Principal do Dashboard ---
export const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Ao carregar a página, verifica quem está "logado" no localStorage
    const loggedUser = localStorage.getItem('siaj_user_role');
    if (!loggedUser) {
      navigate('/login'); // Se não tiver ninguém logado, chuta pro login
    } else {
      setUserRole(loggedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('siaj_user_role');
    navigate('/login');
  };

  if (!userRole) return null;

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--siaj-blue)', margin: 0 }}>Portal SIAJ</h1>
          <p style={{ margin: 0, color: '#64748b' }}>
            {userRole === 'auxiliar' ? 'Painel do Auxiliar da Justiça' : 'Painel do Servidor Validador'}
          </p>
        </div>
        <Button label="Sair (Logout)" icon="pi pi-sign-out" severity="danger" text onClick={handleLogout} />
      </div>

      {/* Renderiza a visão correta baseada no perfil */}
      {userRole === 'auxiliar' ? <AuxiliarDashboard /> : <ServidorDashboard />}
    </div>
  );
};

export default Dashboard;