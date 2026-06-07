import { useEffect } from 'react';
import './App.css';
import MenuRoutes from './pages/MenuRoutes';

function App() {
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return (
    <div>
      <MenuRoutes />
    </div>
  );
}

export default App;
