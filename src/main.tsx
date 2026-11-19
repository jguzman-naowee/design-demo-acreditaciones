import './boot';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { NwtApplication } from '@naowee-tech/sdk-react-components';
import { Session } from '@naowee-tech/sdk-frontend-web';
import { AccreditationsApp } from '@acreditaciones/app';
import { mountSidebar, rel, SUMMARY, syncDemoFlag } from './shell';
import { SummaryPage } from './summary/SummaryPage';

const base = (window as any).__BASE__ as string;

// La bandera de demo y el sidebar se fijan antes de montar, para que la primera pantalla ya los vea.
syncDemoFlag();
mountSidebar(base);

const session = new Session('demo-user', 'Demo Naowee', 'demo@naowee.com', 'INDIVIDUAL', ['ROOT'] as any, ['all:all']);
// El Resumen no existe en el micro: se monta en su lugar, y al salir el micro vuelve a montar
// con la ruta nueva. El sidebar avisa cada navegación con `popstate`.
function Root() {
  const [summary, setSummary] = useState(rel() === SUMMARY);
  useEffect(() => {
    const sync = () => setSummary(rel() === SUMMARY);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  return summary ? (
    <NwtApplication><SummaryPage /></NwtApplication>
  ) : (
    <AccreditationsApp basename={base || '/'} session={session} />
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
