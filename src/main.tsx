import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Captura de erros globais para evitar tela preta sem feedback no Android
window.addEventListener('error', (event) => {
  console.error('Erro global capturado:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event.reason);
});

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
} catch (error: any) {
  console.error('Erro fatal ao renderizar React:', error);
  document.body.innerHTML = `
    <div style="padding: 24px; color: #f8fafc; background: #0b0f19; font-family: system-ui, sans-serif; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
      <h2 style="color: #f97316; font-size: 20px; font-weight: bold; margin-bottom: 8px;">SNEAKERVAULT</h2>
      <p style="color: #94a3b8; font-size: 14px; margin-bottom: 16px;">Ocorreu uma falha ao iniciar o aplicativo.</p>
      <pre style="background: #1e293b; color: #ef4444; padding: 12px 16px; border-radius: 12px; font-size: 12px; max-width: 90%; word-break: break-all; text-align: left;">${error?.message || error}</pre>
      <button onclick="window.location.reload()" style="margin-top: 20px; background: #ea580c; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: bold;">Recarregar App</button>
    </div>
  `;
}
