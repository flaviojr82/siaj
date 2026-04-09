import React from 'react';
// Importamos o nosso novo componente de formulário
import AuxiliarRegistrationForm from './components/AuxiliarRegistrationForm';

function App() {
  return (
    // Um contêiner limpo com um fundo cinza claro para destacar o cartão branco do formulário
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '2rem' }}>
      
      {/* Aqui fazemos a renderização central do formulário SIAJ */}
      <AuxiliarRegistrationForm />
      
    </div>
  );
}

export default App;