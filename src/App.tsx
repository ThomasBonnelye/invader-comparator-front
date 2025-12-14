import React from 'react';

/**
 * CONCEPT : Composant Fonctionnel
 * 
 * Un composant est une FONCTION qui retourne du JSX (HTML dans JavaScript)
 * 
 * RÈGLES :
 * 1. Le nom du composant commence par une MAJUSCULE
 * 2. Il retourne du JSX (ressemble à du HTML)
 * 3. On l'utilise comme une balise : <App />
 */
function App() {
  // La fonction retourne du JSX
  return (
    <div>
      <h1>Invader Comparator</h1>
    </div>
  );
}

// Exporter le composant pour pouvoir l'utiliser ailleurs
export default App;