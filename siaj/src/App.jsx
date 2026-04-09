import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';

function App() {
  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <h2>Testando PrimeReact</h2>
      
      {/* Botão com ícone */}
      <Button label="Salvar" icon="pi pi-check" />
      
      {/* Exemplo de Badge (Misc) */}
      <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '2rem' }}>
        <Badge value="2" severity="danger"></Badge>
      </i>

      {/* Exemplo de Avatar (Misc) */}
      <Avatar label="F" size="large" shape="circle" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
    </div>
  )
}

export default App;