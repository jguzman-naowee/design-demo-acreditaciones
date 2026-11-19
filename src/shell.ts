// El marco de Sports: sidebar con el markup de `ns-sidebar` y la bandera de demo por ruta.
// Pantalla propia de la demo: el micro no la tiene, la monta main.tsx en su lugar.
export const SUMMARY = '/delivery/summary';

const GROUPS = [
  { l: 'Parametrización', i: 'icon-checklist-pen', s: 'ACREDITACIONES', c: [
    ['Permisos de acceso', '/parametrization/access-permissions'],
    ['Tipos de acreditados', '/parametrization/accredited-types']] },
  { l: 'Entrega de acreditaciones', i: 'icon-shield-check', c: [
    ['Resumen', SUMMARY],
    ['Gestión de acreditables', '/delivery/enabled'],
    ['Lista de acreditados', '/delivery/accredited'],
    ['Acreditados del evento', '/delivery/event-accredited'],
    ['Lotes de acreditaciones', '/delivery/card-batches'],
    ['Historial de movimientos', '/delivery/history']] },
  { l: 'Validación', i: 'file-eye', c: [
    ['Validar acceso', '/validation/validate'],
    ['Lista de accesos', '/validation/access-control']] }
];
// Pantallas que en el producto solo viven en modo demo (datos en memoria del micro).
const DEMO = /^\/(delivery\/(enabled|batches|history|accredited\/[^/]+$)|validation\/access-control|profile\/[^/]+$)/;

let base = '';
export const rel = () => location.pathname.slice(base.length) || '/';
const on = (p: string) => rel() === p || rel().startsWith(p + '/');

export function syncDemoFlag(): void {
  (globalThis as any).__NAOWEE_ACCREDITATION_MOCK__ = DEMO.test(rel());
}

// Como en producción: todos los grupos abiertos de entrada; el padre solo pliega, no navega.
const closed = new Set<string>();

function html(): string {
  const arrow = (open: boolean) => `<svg class="ns-sidebar__menu-arrow ${open ? 'ns-sidebar__menu-arrow--expanded' : ''}" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M8 16L14 11L8 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const items = GROUPS.map((g) => {
    const open = !closed.has(g.l);
    const kids = open ? `<ul class="ns-sidebar__submenu-list">${g.c.map((c) => {
      const a = on(c[1]);
      return `<li class="ns-sidebar__menu-item"><a class="ns-sidebar__menu-link ${a ? 'ns-sidebar__menu-link--active' : ''}" href="${base}${c[1]}" data-go="${c[1]}"${a ? ' aria-current="page"' : ''}>${a ? '<div class="ns-sidebar__menu-indicator"></div>' : ''}<div class="ns-sidebar__menu-content"><span class="ns-sidebar__menu-label">${c[0]}</span></div></a></li>`;
    }).join('')}</ul>` : '';
    return `${g.s ? `<li class="ns-sidebar__menu-section"><p class="ns-sidebar__menu-title">${g.s}</p></li>` : ''}<li class="ns-sidebar__menu-item ns-sidebar__menu-item--has-children ${open ? 'ns-sidebar__menu-item--expanded' : ''}"><button type="button" class="ns-sidebar__menu-link ns-sidebar__menu-link--parent" data-toggle="${g.l}" aria-expanded="${open}"><div class="ns-sidebar__menu-content"><span class="ns-sidebar__menu-icon"><img src="${base}/assets/icons/${g.i}.svg" alt=""></span><span class="ns-sidebar__menu-label">${g.l}</span></div>${arrow(open)}</button>${kids}</li>`;
  }).join('');
  return `<aside class="ns-sidebar ns-sidebar--mode-fixed"><div class="ns-sidebar__header"><div class="ns-sidebar__logo"><img src="${base}/assets/SUID.png" alt="SUID"></div></div><div class="ns-sidebar__content"><nav class="ns-sidebar__menu" aria-label="Menú principal"><ul class="ns-sidebar__menu-list">${items}</ul></nav></div></aside>`;
}

export function mountSidebar(b: string): void {
  base = b;
  const host = document.getElementById('sidebar')!;
  const render = () => { host.innerHTML = html(); };
  render();

  host.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest('[data-toggle]') as HTMLElement | null;
    if (t) {
      const k = t.dataset.toggle!;
      if (!closed.delete(k)) closed.add(k);
      render();
      return;
    }
    const a = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null;
    if (!a) return;
    e.preventDefault();
    history.pushState({}, '', base + a.dataset.go);
  });

  // El router del micro usa pushState y no avisa: se envuelve para sincronizar bandera y sidebar,
  // y se dispara `popstate` para que React Router lea la nueva ruta cuando navega el sidebar.
  const push = history.pushState.bind(history);
  history.pushState = (...args: Parameters<History['pushState']>) => {
    push(...args);
    syncDemoFlag();
    render();
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  // Los redirects del micro (sin evento elegido → entrada) usan replaceState: el activo no debe quedar viejo.
  const replace = history.replaceState.bind(history);
  history.replaceState = (...args: Parameters<History['replaceState']>) => { replace(...args); syncDemoFlag(); render(); };
  window.addEventListener('popstate', () => { syncDemoFlag(); render(); });
}
