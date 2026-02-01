import React from 'react';
import Search from './components/Search';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>GitHub User Search</h1>
      </header>
      <main>
        <Search />
      </main>
    </div>
  );
}

export default App;
