// Resumen de acreditaciones · Vista A «Con lo que hay hoy» (diseño de Jorge).
// Datos de prueba: generadas, por subsanar e impresas y laminadas por deporte, rol y delegación.
// JS plano, con las clases del SDK (nwt-*) y las del Resumen compilado (nws-summary__*).
// Convive con el Resumen compilado, que queda oculto en esta ruta. Los datos son de ejemplo.
(() => {
  const base = window.__BASE__ || '';
  const ROUTE = '/delivery/summary';
  const rel = () => location.pathname.slice(base.length) || '/';
  const T = (n, fb) => `var(--naotech-color-${n}-700,${fb})`;

  // Datos de prueba tomados de la hoja de cálculo: cupos, acreditaciones generadas, por subsanar (Ministerio) e impresas y laminadas.
  // `cupo: null` = la hoja no trae cupo para ese deporte.
  const SPORTS = [
    { sport: 'Para atletismo', delivered: 62, cupo: 166, generated: 124, subsanar: 31, printed: 115, para: true },
    { sport: 'Para natación', delivered: 40, cupo: 110, generated: 85, subsanar: 11, printed: 83, para: true },
    { sport: 'Bádminton', delivered: 18, cupo: 65, generated: 50, subsanar: 20, printed: 39 },
    { sport: 'Baloncesto 3x3', delivered: 75, cupo: 171, generated: 133, subsanar: 3, printed: 122 },
    { sport: 'Fútbol Prejuvenil', delivered: 60, cupo: null, generated: 223, subsanar: 17, printed: 131 },
    { sport: 'Taekwondo', delivered: 120, cupo: 257, generated: 190, subsanar: 41, printed: 178 },
    { sport: 'Baloncesto Juvenil', delivered: 90, cupo: null, generated: 157, subsanar: 0, printed: 167 },
    { sport: 'Balonmano Juvenil', delivered: 70, cupo: null, generated: 161, subsanar: 0, printed: 145 }
  ];
  // Roles con deporte: los que en la inscripción vinculan un deporte. Sin deporte: el resto, que se acredita por evento.
  // `count: null` = todavía sin dato en la demo (no se inventa una cifra).
  const CON = [
    { code: 'ATHLETE', label: 'Deportista', icon: 'thunder', count: 800, color: T('blue', '#1f78d1') },
    { code: 'SUPPORT', label: 'Personal de apoyo', icon: 'helper', count: 140, color: T('teal', '#0d9488') }
  ];
  const SIN = [
    { code: 'MISSION', cupo: 90, label: 'Personal de misión', count: 83, color: T('orange', '#d74009'), icon: 'avatar', theme: '', hint: '34 funciones: Jefe de Misión, Prensa, Coordinador de Jueces…' },
    { code: 'NAOWEE', cupo: 5, label: 'Personal Naowee', count: 4, color: T('purple', '#7c3aed'), icon: 'star', theme: 'informative', hint: 'Coordinador Naowee y Personal de apoyo Naowee' },
    { code: 'LOGISTICS', cupo: 45, label: 'Personal logístico', count: 40, color: T('yellow', '#b7791f'), icon: 'delivery', theme: 'warning', hint: 'Transporte, montaje y apoyo en sedes' },
    { code: 'VOLUNTEERS', cupo: 40, label: 'Voluntarios', count: 36, color: T('green', '#1f8923'), icon: 'donation', theme: 'positive', hint: 'Apoyo en escenarios y acreditación' },
    { code: 'MEDICAL', cupo: 25, label: 'Personal médico', count: 20, color: T('red', '#c0392b'), icon: 'favorite', theme: 'informative', hint: 'Médicos y paramédicos de las sedes' }
  ];

  // Vista B «Con todos los datos» (artefacto de Jorge, opción B): cifras ilustrativas; los totales por rol son los reales.
  const SPORTS_B = [
    { sport: 'Para atletismo', quota: 166, generated: 124, toFix: 31, ready: 4, printed: 115, para: true },
    { sport: 'Para natación', quota: 110, generated: 85, toFix: 11, ready: 2, printed: 83, para: true },
    { sport: 'Bádminton', quota: 65, generated: 50, toFix: 20, ready: 3, printed: 39 },
    { sport: 'Baloncesto 3x3', quota: 171, generated: 133, toFix: 3, ready: 1, printed: 122 },
    { sport: 'Fútbol Prejuvenil', quota: 260, generated: 223, toFix: 17, ready: 6, printed: 131 },
    { sport: 'Taekwondo', quota: 257, generated: 190, toFix: 41, ready: 5, printed: 178 },
    { sport: 'Baloncesto Juvenil', quota: 176, generated: 157, toFix: 0, ready: 3, printed: 157 },
    { sport: 'Balonmano Juvenil', quota: 180, generated: 161, toFix: 0, ready: 2, printed: 145 }
  ];
  // Los tres roles sin deporte que se añadieron en la vista de hoy (logístico, voluntarios, médico) entran con cifras de prueba;
  // el total sigue en 4.904, así que Deportista y Personal de apoyo bajan en proporción.
  const FAM_B = [
    { code: 'ATHLETE', label: 'Deportista', count: 3486, color: T('blue', '#1f78d1') },
    { code: 'SUPPORT', label: 'Personal de apoyo', count: 617, color: T('teal', '#0d9488') },
    { code: 'MISSION', label: 'Personal de misión', count: 364, color: T('orange', '#d74009') },
    { code: 'NAOWEE', label: 'Personal Naowee', count: 18, color: T('purple', '#7c3aed') },
    { code: 'LOGISTICS', label: 'Personal logístico', count: 175, color: T('yellow', '#b7791f') },
    { code: 'VOLUNTEERS', label: 'Voluntarios', count: 157, color: T('green', '#1f8923') },
    { code: 'MEDICAL', label: 'Personal médico', count: 87, color: T('red', '#c0392b') }
  ];

  const TOTAL_B = 4904;
  // Cupos de prueba de los roles sin deporte en la escala de la vista B (misma proporción cupo/generadas que en la vista de hoy).
  const CUPO_B = { MISSION: 395, NAOWEE: 23, LOGISTICS: 197, VOLUNTEERS: 174, MEDICAL: 109 };
  const CB = { delivered: T('green', '#1f9d63'), printed: 'var(--naotech-color-blue-900,#2a3bb0)', generated: 'var(--naotech-color-blue-300,#8b97ec)', ready: 'var(--naotech-color-teal-500,#5cc8b0)', toFix: 'var(--naotech-color-yellow-500,#f2b544)' };
  // Vista de hoy: solo los estados que ya existen (la barra de entrega y el detalle de cada deporte).
  // Colores de las tarjetas: Generadas (naranja, en un tono más claro para que la barra no pese), Por subsanar (amarillo) y Entregadas (azul).
  const CA = { gen: 'var(--naotech-color-orange-300,#ffbf75)', sub: T('yellow', '#fbd100'), ent: T('blue', '#1f78d1') };
  const LEGEND_A = [['Entregadas', CA.ent], ['Generadas sin entregar', CA.gen], ['Por subsanar', CA.sub]];
  const LEGEND_B = [['Entregadas', CB.delivered], ['Impresas', CB.printed], ['Generadas sin imprimir', CB.generated], ['Listos sin acreditar', CB.ready], ['Por subsanar', CB.toFix]];

  // Regional Atletismo: solo pruebas de atletismo (cifras de prueba). Cada una trae los campos de las dos vistas (hoy y todos los datos).
  const mk = (sport, g, sub, p, d, q, rd) => ({ sport, generated: g, subsanar: sub, printed: p, delivered: d, cupo: q, quota: q, toFix: sub, ready: rd });
  const PRUEBAS = [mk('100 m planos', 62, 6, 58, 30, 70, 2), mk('200 m planos', 48, 4, 44, 22, 55, 1), mk('400 m planos', 40, 5, 36, 15, 48, 2), mk('800 m planos', 36, 3, 33, 14, 42, 1), mk('110 m con vallas', 28, 2, 26, 12, 32, 1), mk('Salto largo', 44, 7, 38, 19, 52, 2), mk('Lanzamiento de bala', 33, 3, 30, 11, 38, 1), mk('Relevos 4x100 m', 56, 8, 49, 28, 64, 3)];
  // Regional Conjunto: solo deportes de conjunto (sin paras ni individuales).
  const CONJUNTO = ['Baloncesto 3x3', 'Fútbol Prejuvenil', 'Baloncesto Juvenil', 'Balonmano Juvenil'];
  const porFase = (arr) => (st.fase === 'Regional Atletismo' ? PRUEBAS : st.fase === 'Regional Conjunto' ? arr.filter((s) => CONJUNTO.includes(s.sport)) : arr);
  const UNIT = () => (st.fase === 'Regional Atletismo' ? { uno: 'prueba', otros: 'pruebas', Uno: 'Prueba' } : { uno: 'deporte', otros: 'deportes', Uno: 'Deporte' });

  const FAMILIES = [{ code: 'all', label: 'Todos', count: 1123 }, ...CON, ...SIN];
  const BAR = FAMILIES.filter((f) => f.code !== 'all' && f.count != null);
  const FUNCTIONS = ['Todas', 'Docente/Entrenador', 'Docente/Asistente', 'Auxiliar Discapacidad', 'Fisioterapeuta', 'Médico', 'Asistente Técnico'];
  const DELEGS = [['all', 'Todas las delegaciones', 1], ['ant', 'Antioquia', 0.11], ['atl', 'Atlántico', 0.06], ['bog', 'Bogotá D.C.', 0.13], ['val', 'Valle del Cauca', 0.09], ['san', 'Santander', 0.05]];
  const FASES = ['Nacionales', 'Regional Conjunto', 'Regional Atletismo'];
  const TOTAL = 1123;
  const C_PEND = 'var(--naotech-color-gray-300,#d0d4e6)', C_ENT = T('green', '#1f8923');

  // La vista (hoy / todos) la elige el marco con ResumenVista.set; se recuerda en localStorage y también acepta ?vista=todos.
  const VKEY = 'naowee.vistas.acreditaciones';
  const vistaInicial = () => { try { return /[?&]vista=todos/.test(location.search) || localStorage.getItem(VKEY) === 'todos' ? 'todos' : 'hoy'; } catch (e) { return 'hoy'; } };
  const st = { vista: vistaInicial(), fase: 'Nacionales', deleg: 'all', family: 'all', fn: 'Todas', menu: false, supOpen: false, q: '', page: 1, anim: 'all', fx: '', pop: new Set(), open: new Set(['Taekwondo']) };
  const PAGE = 5;
  const fmt = (v) => Number(v).toLocaleString('es-CO');
  const pct = (v) => Math.round(v) + ' %';
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const badge = (theme, txt) => `<span class="nwt-badge" role="status" nwt-theme="${theme}" nwt-size="medium" nwt-variant="quiet"><div class="nwt-badge__content"><div class="nwt-badge__label">${txt}</div></div></span>`;
  const stat = (icon, theme, label, value, hint) =>
    `<div class="nwt-stat-card"${theme ? ` nwt-theme="${theme}"` : ''}><div class="nwt-stat-card__content"><span class="nwt-stat-card__label">${label}</span><span class="nwt-stat-card__value">${value}</span><span class="nwt-stat-card__hint">${hint}</span></div><div class="nwt-stat-card__icon"><div class="nwt-icon"><i class="naotech-icon-${icon}"></i></div></div></div>`;
  const card = (cls, inner) => `<div class="nwt-card ${cls}" nwt-variant="quiet" nwt-size="medium"><div class="nwt-card__body"><div class="nwt-card__header"></div><div class="nwt-card__content">${inner}</div></div></div>`;
  const dot = (c) => `<i class="nws-summary__dot" style="background:${c}"></i>`;
  const seg = (w, c) => `<span class="nws-summary__stack-part" style="width:${w}%;background:${c}"></span>`;

  const compute = () => {
    const fam = FAMILIES.find((f) => f.code === st.family);
    const delegF = DELEGS.find((d) => d[0] === st.deleg)[2];
    const ATH = 0.85;
    let famF = st.family === 'ATHLETE' ? ATH : st.family === 'SUPPORT' ? 1 - ATH : 1;
    if (st.family === 'SUPPORT' && st.fn !== 'Todas') famF /= 4;
    const factor = famF * delegF;
    const sportFamily = ['all', 'ATHLETE', 'SUPPORT'].includes(st.family);
    const alloc = (total, shares) => { const raw = shares.map((x) => total * x), out = raw.map(Math.floor); let rest = total - out.reduce((a, b) => a + b, 0); raw.map((v, i) => [v - out[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest > 0) { out[i]++; rest--; } }); return out; };
    const B = st.vista === 'todos';
    const listaB = porFase(SPORTS_B), listaA = porFase(SPORTS), gen = (arr) => arr.reduce((a, s) => a + s.generated, 0);
    const phaseF = gen(B ? listaB : listaA) / gen(B ? SPORTS_B : SPORTS);
    const rowsB = B && sportFamily ? listaB.map((s) => {
      const g = Math.round(s.generated * factor), p = Math.min(g, Math.round(s.printed * factor)), f = Math.round(s.toFix * factor), rd = Math.round(s.ready * factor), q = Math.round(s.quota * factor), ins = g + f + rd;
      const split = s.para
        ? [['Deportista', 0.76], ['Docente/Entrenador', 0.1], ['Docente/Asistente', 0.06], ['Auxiliar Discapacidad', 0.08]]
        : [['Deportista', 0.86], ['Docente/Entrenador', 0.09], ['Docente/Asistente', 0.05]];
      const sh = split.map((r) => r[1]), ci = alloc(ins, sh), cg = alloc(g, sh), cp = alloc(p, sh);
      return { sport: s.sport, cupo: q, ins, sub: f, rd, g, p, e: 0, roles: split.map((r, i) => ({ label: r[0], ins: ci[i], count: cg[i], p: cp[i], e: 0 })) };
    }) : [];
    const rows = B ? rowsB : sportFamily ? listaA.map((s) => {
      const g = Math.round(s.generated * factor), sub = Math.round(s.subsanar * factor), p = Math.round(s.printed * factor), e = Math.round(s.delivered * factor);
      const split = s.para
        ? [['Deportista', 0.76], ['Docente/Entrenador', 0.1], ['Docente/Asistente', 0.06], ['Auxiliar Discapacidad', 0.08]]
        : [['Deportista', 0.86], ['Docente/Entrenador', 0.09], ['Docente/Asistente', 0.05]];
      const sh = split.map((r) => r[1]), cg = alloc(g, sh), cs = alloc(sub, sh), cp = alloc(p, sh), ce = alloc(e, sh), cc = s.cupo == null ? null : alloc(Math.round(s.cupo * factor), sh);
      return { sport: s.sport, cupo: s.cupo == null ? null : Math.round(s.cupo * factor), g, sub, p, e, roles: split.map((r, i) => ({ label: r[0], count: cg[i], sub: cs[i], p: cp[i], e: ce[i], cupo: cc ? cc[i] : null })) };
    }) : [];
    const famB = FAM_B.find((f) => f.code === st.family);
    const famCount = Math.round((B ? (famB ? famB.count : TOTAL_B) : (fam.count || 0)) * delegF * (st.family === 'SUPPORT' && st.fn !== 'Todas' ? 0.25 : 1));
    return { rows, famCount: Math.round(famCount * phaseF), sportFamily, delegF: delegF * phaseF, B };
  };

  const SUBS = FUNCTIONS.filter((f) => f !== 'Todas');
  const rolcon = () => {
    const sup = st.family === 'SUPPORT';
    const cur = CON.find((r) => r.code === st.family);
    const lbl = cur ? cur.label + (sup && st.fn !== 'Todas' ? ' · ' + st.fn : '') : 'Todos';
    const opt = (attrs, txt, on, extra) => `<button type="button" role="option" class="rsa-dd__opt${on ? ' is-on' : ''}" aria-selected="${!!on}" ${attrs}>${txt}${extra || ''}</button>`;
    const chev = `<svg class="rsa-dd__chev${st.supOpen ? ' is-open' : ''}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
    let list = opt('data-pick="all"', 'Todos', !cur);
    list += opt('data-pick="ATHLETE"', 'Deportista', st.family === 'ATHLETE');
    list += opt('data-sup="1"', 'Personal de apoyo', sup && st.fn === 'Todas', chev).replace('class="rsa-dd__opt', 'class="rsa-dd__opt rsa-dd__opt--parent').replace('aria-selected', 'aria-expanded="' + !!st.supOpen + '" aria-selected');
    if (st.supOpen) list += `<div class="rsa-dd__sub${st.fx === 'sub' ? ' rsa-dd__sub--in' : ''}" role="group" aria-label="Función">` + SUBS.map((f) => opt(`data-sub="${esc(f)}"`, esc(f), sup && st.fn === f)).join('') + '</div>';
    return `<div class="rsa-field rsa-dd"><span>Rol con deporte</span><button type="button" class="rsa-dd__btn" data-dd="toggle" aria-haspopup="listbox" aria-expanded="${!!st.menu}">${esc(lbl)}${chev.replace('rsa-dd__chev', 'rsa-dd__chev rsa-dd__arrow')}</button>${st.menu ? `<div class="rsa-dd__panel${st.fx === 'menu' ? ' rsa-dd__panel--in' : ''}" role="listbox">${list}</div>` : ''}</div>`;
  };

  const filtrado = () => st.fase !== 'Nacionales' || st.deleg !== 'all' || st.family !== 'all' || st.fn !== 'Todas';
  const filtros = () =>
    `<div class="rsa-filters"><label class="rsa-field"><span>Fase</span><select data-f="fase">${FASES.map((f) => `<option${f === st.fase ? ' selected' : ''}>${esc(f)}</option>`).join('')}</select></label>` +
    `<label class="rsa-field"><span>Delegación</span><select data-f="deleg">${DELEGS.map((d) => `<option value="${d[0]}"${d[0] === st.deleg ? ' selected' : ''}>${esc(d[1])}</option>`).join('')}</select></label>` +
    rolcon() +
    `<label class="rsa-field"><span>Rol sin deporte</span><select data-f="rolsin">${[['', 'Todos'], ...SIN.map((r) => [r.code, r.label])].map((o) => `<option value="${o[0]}"${(o[0] === '' ? !SIN.some((r) => r.code === st.family) : st.family === o[0]) ? ' selected' : ''}>${esc(o[1])}</option>`).join('')}</select></label>` +
    `<button type="button" class="rsa-clear" data-clear${filtrado() ? '' : ' disabled'}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 001 1h8a1 1 0 001-1l1-12M9 7V4h6v3"/></svg><span>Limpiar filtros</span></button>` +
    '</div>';

  const countUp = (host) => {
    host.querySelectorAll('.nwt-stat-card__value').forEach((el, i) => {
      const txt = el.textContent, end = parseInt(txt.replace(/\./g, ''), 10);
      if (!isFinite(end) || end === 0) return;
      const t0 = performance.now() + i * 60, dur = 700;
      el.textContent = '0';
      const step = (t) => {
        const k = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - k, 3);
        el.textContent = k >= 1 ? txt : fmt(Math.round(end * e));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  const render = (host) => {
    const { rows: allRows, famCount, sportFamily, delegF, B } = compute();
    const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const rows = st.q ? allRows.filter((r) => norm(r.sport).includes(norm(st.q))) : allRows;
    const G = sportFamily ? allRows.reduce((a, r) => a + r.g, 0) : famCount;
    const E = allRows.reduce((a, r) => a + r.e, 0), SUB = allRows.reduce((a, r) => a + r.sub, 0), P = allRows.reduce((a, r) => a + r.p, 0);
    const pend = sportFamily ? G - P : G;
    const sinSel = SIN.find((r) => r.code === st.family);
    const pc = (n, d) => (d ? Math.round((n / d) * 100) : 0);
    const FAMS = B ? FAM_B : BAR, TOT = B ? TOTAL_B : TOTAL;
    const bar = FAMS.map((f) => {
      const dim = st.family !== 'all' && st.family !== f.code;
      return { ...f, n: Math.round(f.count * delegF), dim };
    });
    const allOpen = rows.length && rows.every((r) => st.open.has(r.sport));
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    st.page = Math.min(Math.max(1, st.page), pages);
    const pageRows = rows.slice((st.page - 1) * PAGE, st.page * PAGE);
    const body = pageRows.map((r) => {
      const open = st.open.has(r.sport);
      const wd = (w) => `style="width:${w}%"`;
      const tog = `<button type="button" class="nws-summary__toggle" data-open="${esc(r.sport)}" aria-expanded="${open}"><div class="nwt-icon nws-summary__chevron"><i class="naotech-icon-chevron-right"></i></div><span class="nwt-text-font-medium">${esc(r.sport)}</span></button>`;
      if (B) {
        const share = (v) => (r.ins ? (v / r.ins) * 100 : 0);
        const parts = [['Entregadas', r.e, CB.delivered], ['Impresas sin entregar', r.p - r.e, CB.printed], ['Generadas sin imprimir', r.g - r.p, CB.generated], ['Listos sin acreditar', r.rd, CB.ready], ['Por subsanar', r.sub, CB.toFix]];
        const num = (w, v) => `<td class="nwt-datatable__cell nws-summary__center" ${wd(w)}><span>${fmt(v)}</span></td>`;
        const recB = `<tr class="nwt-datatable__record ${open ? 'nws-summary__open' : ''}">` +
          `<td class="nwt-datatable__cell" ${wd(19)}>${tog}</td>` + `<td class="nwt-datatable__cell nws-summary__center rsa-muted" ${wd(7)}><span>${fmt(r.cupo)}</span></td>` +
          num(8, r.ins).replace('<span>', '<span class="rsa-strong">') + num(9, r.sub) + num(9.5, r.rd) + num(8.5, r.g) + num(8, r.p) + num(7, r.e) +
          `<td class="nwt-datatable__cell nws-summary__center" ${wd(24)}><span>${pct(share(r.g))}</span></td></tr>`;
        const detB = open ? `<tr class="nws-summary__detail"><td colspan="9"><div class="rsa-d${st.pop.has(r.sport) ? ' rsa-d--in' : ''}">` +
          `<div class="rsa-d__kpis rsa-d__kpis--4">` +
            `<div class="rsa-d__kpi rsa-d__kpi--main"><span>Inscritos</span><b>${fmt(r.ins)}</b></div>` +
            `<div class="rsa-d__kpi"><span>Cupo ocupado</span><b>${r.cupo ? pct((r.ins / r.cupo) * 100) : '—'}</b><small>${fmt(r.ins)} inscritos de ${fmt(r.cupo)} cupos</small></div>` +
            `<div class="rsa-d__kpi"><span>${dot(CB.ready)}Listos sin acreditar</span><b>${fmt(r.rd)}</b><small>Ya cumplen con todo</small></div>` +
            `<div class="rsa-d__kpi"><span>${dot(CB.toFix)}Por subsanar</span><b>${fmt(r.sub)}</b><small>Les falta documentación</small></div>` +
          `</div>` +
          `<span class="rsa-d__sub">Dónde están los ${fmt(r.ins)} inscritos</span>` +
          `<div class="nws-summary__stack rsa-d__bar" role="img" aria-label="${parts.map((x) => x[0] + ' ' + pct(share(x[1]))).join(', ')}">${parts.map((x) => (x[1] ? `<span class="nws-summary__stack-part" data-tip="${x[0]}|${fmt(x[1])} · ${pct(share(x[1]))} de los inscritos|${x[2]}" style="width:${share(x[1])}%;background:${x[2]}"></span>` : '')).join('')}</div>` +
          `<div class="rsa-d__roles rsa-d__roles--4"><div class="rsa-d__rhead"><span>Por rol</span><span>Inscritos</span><span>Generadas</span><span>Impresas</span><span>Entregadas</span></div>` +
          r.roles.map((x) => `<div class="rsa-d__rrow"><span class="rsa-d__rname">${esc(x.label)}</span><span>${fmt(x.ins)}</span><span>${fmt(x.count)}</span><span>${fmt(x.p)}</span><span>${fmt(x.e)}</span></div>`).join('') + `</div>` +
          `</div></td></tr>` : '';
        return recB + detB;
      }
      const pr = Math.min(100, pc(r.e, r.g));
      const rec = `<tr class="nwt-datatable__record ${open ? 'nws-summary__open' : ''}">` +
        `<td class="nwt-datatable__cell" ${wd(32)}>${tog}</td>` +
        `<td class="nwt-datatable__cell nws-summary__center" ${wd(18)}><span>${fmt(r.g)}</span></td>` +
        `<td class="nwt-datatable__cell nws-summary__center" ${wd(18)}><span>${fmt(r.sub)}</span></td>` +
        `<td class="nwt-datatable__cell nws-summary__center" ${wd(32)}><span>${pr} %</span></td></tr>`;
      const pend1 = r.g - r.p, over = r.p > r.g;
      const det = open ? `<tr class="nws-summary__detail"><td colspan="4"><div class="rsa-d${st.pop.has(r.sport) ? ' rsa-d--in' : ''}">` +
        `<div class="rsa-d__kpis">` +
          `<div class="rsa-d__kpi rsa-d__kpi--main"><span>${dot(CA.gen)}Generadas</span><b>${fmt(r.g)}</b></div>` +
          `<div class="rsa-d__kpi"><span>${dot(CA.sub)}Por subsanar</span><b>${fmt(r.sub)}</b><small>Por parte del Ministerio</small></div>` +
          `<div class="rsa-d__kpi"><span>${dot(CA.ent)}Entregadas</span><b>${fmt(r.e)}</b><small>${pc(r.e, r.g)} % de las generadas</small></div>` +
        `</div>` +
        (() => { const tot = r.g + r.sub, e = r.e, pe = r.g - e, parts = [['Entregadas', e, CA.ent], ['Generadas sin entregar', pe, CA.gen], ['Por subsanar', r.sub, CA.sub]]; return `<div class="nws-summary__stack rsa-d__bar" role="img" aria-label="${parts.map((x) => x[0] + ' ' + x[1]).join(', ')}">${parts.map((x) => (x[1] ? `<span class="nws-summary__stack-part" data-tip="${x[0]}|${fmt(x[1])} · ${pc(x[1], tot)} % del total|${x[2]}" style="width:${(x[1] / tot) * 100}%;background:${x[2]}"></span>` : '')).join('')}</div>`; })() +
        `<div class="rsa-d__roles"><div class="rsa-d__rhead"><span>Por rol</span><span>Cupos asignados</span><span>Generadas</span><span>Por subsanar</span><span>Entregadas</span></div>` +
        r.roles.map((x) => `<div class="rsa-d__rrow"><span class="rsa-d__rname">${esc(x.label)}</span><span>${x.cupo == null ? '—' : fmt(x.cupo)}</span><span>${fmt(x.count)}</span><span>${fmt(x.sub)}</span><span>${fmt(x.e)}</span></div>`).join('') + `</div>` +
        `</div></td></tr>` : '';
      return rec + det;
    }).join('') + (sportFamily && st.q && !rows.length ? `<tr class="nwt-datatable__record"><td class="nwt-datatable__cell rsa-empty" colspan="${B ? 9 : 4}">Ningún ${UNIT().uno} coincide con «${esc(st.q)}».</td></tr>` : '') + (!sportFamily ? `<tr class="nwt-datatable__record"><td class="nwt-datatable__cell rsa-empty" colspan="4">Este rol no se acredita por deporte: ver «Sin deporte» abajo.</td></tr>` : '');

    host.innerHTML =
      `<section class="nws-delivery nws-summary"><div class="nws-delivery__content">` +
      `<div class="nws-delivery__header rsa-head"><div class="nws-delivery__description"><span class="nwt-h5-font-bold">Resumen de acreditaciones</span>` +
        `<div class="rsa-evline"><small class="nwt-smalltext-font-regular">Juegos Intercolegiados Nacionales 2026</small>` +
        `<span class="nwt-badge" role="status" nwt-theme="positive" nwt-size="medium" nwt-variant="quiet"><div class="nwt-badge__content"><div class="nwt-badge__label">● Activo</div></div></span></div></div>` +
        `<button type="button" class="rsa-dl" data-dl><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg><span>Descargar informe</span></button></div>` +
      card('rsa-filtros', filtros()) +
      (B ? (() => { const k = famCount / TOTAL_B, ins = Math.round(5258 * k), imp = Math.round(4217 * k); return `<div class="nws-summary__stats rsa-stats rsa-stats--6">` +
        (CUPO_B[st.family] ? stat('bookmark', 'informative', 'Cupos', fmt(Math.round(CUPO_B[st.family] * delegF)), 'Cupos asignados al rol') : stat('user', '', 'Inscritos', fmt(ins), 'Personas activas en los grupos de las delegaciones')) +
        stat('edit', 'warning', 'Por subsanar', fmt(Math.round(236 * k)), 'Les falta documentación') +
        stat('to-agree', 'positive', 'Listos sin acreditar', fmt(Math.round(118 * k)), 'Cumplen todo: falta emitir') +
        stat('copy', '', 'Generadas', fmt(famCount), '93 % de los inscritos') +
        stat('file', 'informative', 'Impresas', fmt(imp), '86 % de las generadas') +
        stat('history', 'informative', 'Entregadas', '0', '0 % de las generadas') + `</div>`; })() : (
      `<div class="nws-summary__stats rsa-stats${sinSel ? ' rsa-stats--5' : ''}">` +
        (sinSel ? stat('bookmark', 'informative', 'Cupos asignados', fmt(Math.round(sinSel.cupo * delegF)), `${sinSel.count && sinSel.cupo ? pc(sinSel.count, sinSel.cupo) : 0} % del cupo con acreditación generada`) : '') +
        stat('copy', '', 'Generadas', fmt(G), sportFamily ? `+ ${fmt(SUB)} por subsanar · ${fmt(G + SUB)} en total` : 'Acreditaciones activas') +
        stat('edit', 'warning', 'Por subsanar', fmt(sportFamily ? SUB : 0), 'Por parte del Ministerio') +
        stat('history', 'informative', 'Entregadas', fmt(sportFamily ? E : 0), sportFamily ? `${pc(E, G)} % de las generadas` : 'Tienen fecha de entrega registrada') + `</div>`)) +
      card('rsa-rolcard', `<div class="rsa-rolhead"><span class="nwt-text-font-medium">Generadas por rol</span></div>` +
        (() => {
          let acc = 0;
          const seg = bar.map((b, i) => { const w = (b.count / TOT) * 100, c = acc + w / 2; acc += w; const p = b.count / TOT < 0.005 ? '< 1 %' : pct(w); return { b, w, c, p, i }; });
          const tipAttr = (x) => `data-tip="${esc(x.b.label)}|${fmt(x.b.n)} generadas · ${x.p}|${x.b.color}"`;
          return `<div class="rsa-pb" role="group" aria-label="Generadas por rol">` +
            `<div class="rsa-pb__pins">${seg.map((x) => `<span class="rsa-pb__pin rsa-pb__pin--${x.i % 2 ? 'hi' : 'lo'}" ${tipAttr(x)} tabindex="0" style="left:${x.c}%;opacity:${x.b.dim ? 0.3 : 1};color:${x.b.color}"><i class="rsa-pb__stem"></i></span>`).join('')}</div>` +
            `<div class="rsa-pb__bar">${seg.map((x) => `<span ${tipAttr(x)} style="width:${x.w}%;background:${x.b.color};opacity:${x.b.dim ? 0.2 : 1}"></span>`).join('')}</div>` +
            `<div class="rsa-pb__labels">${seg.filter((x) => x.w >= 4).map((x) => `<span style="left:${x.c}%;opacity:${x.b.dim ? 0.4 : 1}"><b>${x.p}</b><small>${esc(x.b.label)}</small></span>`).join('')}</div>` +
          `</div>`;
        })()) +
      (sportFamily ? (
      `<div class="nws-summary__table-head"><span class="nwt-text-font-medium">Avance por ${UNIT().uno}</span>` +
        `<ul class="rsa-leg rsa-leg--top" aria-label="Leyenda">${(B ? LEGEND_B : LEGEND_A).map((l) => `<li>${dot(l[1])}${l[0]}</li>`).join('')}</ul>` +
      `</div>` +
      card('nws-summary__table', `<div class="rsa-headtools">` + (sportFamily ? `<label class="rsa-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><input type="search" data-q placeholder="Buscar ${UNIT().uno}" aria-label="Buscar ${UNIT().uno}" value="${esc(st.q)}"></label>` : '') +
        (rows.length ? `<button type="button" class="rsa-allbtn" data-all="${allOpen ? 'close' : 'open'}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${allOpen ? '<path d="M7 20l5-5 5 5"/><path d="M7 4l5 5 5-5"/>' : '<path d="M7 15l5 5 5-5"/><path d="M7 9l5-5 5 5"/>'}</svg><span>${allOpen ? 'Plegar todos' : 'Desplegar todos'}</span></button>` : '') + `</div>` + `<div class="nwt-datatable"><div class="nwt-datatable__table"><table><thead class="nwt-datatable__head"><tr class="nwt-datatable__header">` +
        `${B ? `<th class="nwt-datatable__title" style="width:19%">${UNIT().Uno}</th><th class="nwt-datatable__title nws-summary__center" style="width:7%">Cupo</th><th class="nwt-datatable__title nws-summary__center" style="width:8%">Inscritos</th><th class="nwt-datatable__title nws-summary__center" style="width:9%">Por subsanar</th><th class="nwt-datatable__title nws-summary__center" style="width:9.5%">Listos sin acreditar</th><th class="nwt-datatable__title nws-summary__center" style="width:8.5%">Generadas</th><th class="nwt-datatable__title nws-summary__center" style="width:8%">Impresas</th><th class="nwt-datatable__title nws-summary__center" style="width:7%">Entregadas</th><th class="nwt-datatable__title nws-summary__center" style="width:24%">Acreditados</th>` : `<th class="nwt-datatable__title" style="width:32%">${UNIT().Uno}</th><th class="nwt-datatable__title nws-summary__center" style="width:18%">Generadas</th><th class="nwt-datatable__title nws-summary__center" style="width:18%">Por subsanar</th><th class="nwt-datatable__title nws-summary__center" style="width:32%">Avance de entrega</th>`}</tr></thead><tbody class="nwt-datatable__body">${body}</tbody></table></div></div>` + (sportFamily && rows.length ? `<div class="rsa-pager"><span class="rsa-pager__info">Mostrando ${(st.page - 1) * PAGE + 1}–${(st.page - 1) * PAGE + pageRows.length} de ${rows.length} ${UNIT().otros}</span><div class="rsa-pager__ctl"><span>Página</span><input type="number" class="rsa-pager__in" data-pg min="1" max="${pages}" value="${st.page}" aria-label="Página"><span>de <b>${pages}</b></span><button type="button" class="rsa-pager__btn" data-page="prev" aria-label="Página anterior"${st.page <= 1 ? ' disabled' : ''}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="rsa-pager__btn" data-page="next" aria-label="Página siguiente"${st.page >= pages ? ' disabled' : ''}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button></div></div>` : ''))
      ) : '') +
      `</div></section>`;
    // Animaciones: solo cuando cambia algo relevante; al escribir en el buscador no se repiten.
    st.last = { rows: allRows, B, sportFamily, G, SUB, E, famCount };
    host.dataset.anim = st.anim || '';
    if (st.anim === 'all' && !matchMedia('(prefers-reduced-motion: reduce)').matches) countUp(host);
    st.anim = ''; st.fx = ''; st.pop.clear();
  };

  const host = document.createElement('div'); host.id = 'resumen-a'; host.hidden = true;
  document.body.appendChild(host);
  let wasOn = false;
  const sync = () => {
    const on = rel() === ROUTE;
    document.documentElement.classList.toggle('res-a', on);
    host.hidden = !on;
    if (on && !wasOn) st.anim = 'all';
    wasOn = on;
    if (on) render(host);
  };
  // Tooltip con el dato de cada segmento de «Generadas por rol» (útil para los roles pequeños)
  const tip = document.createElement('div'); tip.className = 'rsa-tip'; tip.hidden = true; document.body.appendChild(tip);
  const showTip = (el) => {
    const [l, n, c] = el.dataset.tip.split('|');
    tip.innerHTML = `<i style="background:${c}"></i><span><b>${l}</b><em>${n}</em></span>`;
    tip.hidden = false;
    const r = el.getBoundingClientRect(), w = tip.offsetWidth;
    tip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
    tip.style.top = (r.top - tip.offsetHeight - 10) + 'px';
  };
  host.addEventListener('mouseover', (e) => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); else tip.hidden = true; });
  host.addEventListener('mouseleave', () => { tip.hidden = true; });
  host.addEventListener('focusin', (e) => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el) showTip(el); });
  host.addEventListener('focusout', () => { tip.hidden = true; });
  host.addEventListener('change', (e) => {
    if (e.target.matches('[data-pg]')) { st.page = parseInt(e.target.value, 10) || 1; st.anim = 'rows'; render(host); return; }
    const k = e.target.dataset.f; if (!k) return;
    if (k === 'rolsin') { st.family = e.target.value || 'all'; st.fn = 'Todas'; } else st[k] = e.target.value;
    if (k === 'fase') { st.open = new Set(); st.q = ''; }
    st.page = 1; st.anim = 'all';
    render(host);
    const again = host.querySelector(`[data-f="${k}"]`); if (again) again.focus();
  });
  host.addEventListener('input', (e) => {
    if (!e.target.matches('[data-q]')) return;
    const pos = e.target.selectionStart; st.q = e.target.value; st.page = 1; render(host);
    const i = host.querySelector('[data-q]'); if (i) { i.focus(); i.setSelectionRange(pos, pos); }
  });
  host.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-dl]')) { descargar(); return; }
    if (t.closest('[data-clear]')) { const c = t.closest('[data-clear]'); if (!c.disabled) { st.fase = 'Nacionales'; st.deleg = 'all'; st.family = 'all'; st.fn = 'Todas'; st.page = 1; st.menu = false; st.supOpen = false; st.anim = 'all'; render(host); } return; }
    const dd = t.closest('[data-dd]'), pk = t.closest('[data-pick]'), sp = t.closest('[data-sup]'), sb = t.closest('[data-sub]');
    if (dd) { st.fx = 'menu'; st.menu = !st.menu; st.supOpen = st.family === 'SUPPORT'; render(host); return; }
    if (t.closest('[data-page]')) { const d = t.closest('[data-page]'); if (!d.disabled) { st.page += d.dataset.page === 'next' ? 1 : -1; st.anim = 'rows'; render(host); } return; }
    if (pk) { st.anim = 'all'; st.family = pk.dataset.pick; st.page = 1; st.fn = 'Todas'; st.menu = false; render(host); return; }
    if (sp) { st.fx = 'sub'; if (st.family !== 'SUPPORT') { st.family = 'SUPPORT'; st.fn = 'Todas'; st.supOpen = true; } else st.supOpen = !st.supOpen; render(host); return; }
    if (sb) { st.anim = 'all'; st.page = 1; st.family = 'SUPPORT'; st.fn = sb.dataset.sub; st.menu = false; render(host); return; }
    const fn = t.closest('[data-fn]'), op = t.closest('[data-open]'), all = t.closest('[data-all]');
    if ((op && st.open.has(op.dataset.open)) || (all && all.dataset.all !== 'open')) { cerrarDetalles(op ? [op.dataset.open] : [...st.open]); return; }
    if (fn) st.fn = fn.dataset.fn;
    else if (op) { const s = op.dataset.open; if (st.open.has(s)) st.open.delete(s); else { st.open.add(s); st.pop.add(s); } }
    else if (all) { if (all.dataset.all === 'open') SPORTS.forEach((s) => { if (!st.open.has(s.sport)) st.pop.add(s.sport); st.open.add(s.sport); }); else st.open.clear(); }
    else return;
    render(host);
  });
  document.addEventListener('click', (e) => { if (st.menu && !e.target.closest('.rsa-dd')) { st.menu = false; render(host); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && st.menu) { st.menu = false; render(host); } });
  // Informe en CSV (separado por «;» y con BOM para que Excel lo abra bien en español) de lo que se está viendo.
  const descargar = () => {
    const l = st.last; if (!l) return;
    const q = (v) => '"' + String(v).replace(/"/g, '""') + '"';
    const fam = (FAMILIES.find((f) => f.code === st.family) || {}).label || 'Todos';
    const deleg = (DELEGS.find((d) => d[0] === st.deleg) || [])[1];
    const lineas = [['Resumen de acreditaciones'], ['Evento', 'Juegos Intercolegiados Nacionales 2026'], ['Vista', l.B ? 'Con todos los datos' : 'Con los datos de hoy'], ['Fase', st.fase], ['Delegación', deleg], ['Rol', fam + (st.family === 'SUPPORT' && st.fn !== 'Todas' ? ' · ' + st.fn : '')], []];
    if (l.sportFamily && l.rows.length) {
      const sum = (k) => l.rows.reduce((a, r) => a + (r[k] || 0), 0);
      if (l.B) {
        lineas.push([UNIT().Uno, 'Cupo', 'Inscritos', 'Por subsanar', 'Listos sin acreditar', 'Generadas', 'Impresas', 'Entregadas']);
        l.rows.forEach((r) => lineas.push([r.sport, r.cupo, r.ins, r.sub, r.rd, r.g, r.p, r.e]));
        lineas.push(['Total', sum('cupo'), sum('ins'), sum('sub'), sum('rd'), sum('g'), sum('p'), sum('e')]);
      } else {
        lineas.push([UNIT().Uno, 'Generadas', 'Por subsanar', 'Entregadas']);
        l.rows.forEach((r) => lineas.push([r.sport, r.g, r.sub, r.e]));
        lineas.push(['Total', sum('g'), sum('sub'), sum('e')]);
      }
    } else lineas.push(['Rol', 'Generadas'], [fam, l.famCount]);
    const csv = '\ufeff' + lineas.map((r) => r.map(q).join(';')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'resumen-acreditaciones-' + (l.B ? 'todos-los-datos' : 'datos-de-hoy') + '.csv';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  // Cerrar un deporte (o todos): el detalle se pliega con animación y recién entonces se actualiza el estado.
  let cerrando = false;
  const cerrarDetalles = (names) => {
    if (cerrando) return;
    const fin = () => { names.forEach((n) => st.open.delete(n)); cerrando = false; render(host); };
    const filas = names.map((n) => { const b = [...host.querySelectorAll('[data-open]')].find((x) => x.dataset.open === n); const rec = b && b.closest('tr'); return rec && rec.nextElementSibling && rec.nextElementSibling.classList.contains('nws-summary__detail') ? rec : null; }).filter(Boolean);
    if (!filas.length || matchMedia('(prefers-reduced-motion: reduce)').matches) { fin(); return; }
    cerrando = true;
    filas.forEach((rec) => {
      rec.classList.remove('nws-summary__open');
      const d = rec.nextElementSibling.querySelector('.rsa-d'); if (!d) return;
      d.style.height = d.offsetHeight + 'px'; d.style.overflow = 'hidden'; void d.offsetHeight;
      d.style.transition = 'height .3s cubic-bezier(.32,.72,0,1), padding .3s cubic-bezier(.32,.72,0,1), opacity .2s ease';
      d.style.height = '0px'; d.style.paddingTop = '0px'; d.style.paddingBottom = '0px'; d.style.opacity = '0';
    });
    setTimeout(fin, 320);
  };
  const setVista = (v) => {
    if (v !== 'hoy' && v !== 'todos') return;
    try { localStorage.setItem(VKEY, v); } catch (e) {}
    if (st.vista === v) return;
    st.vista = v; st.anim = 'all'; st.page = 1; st.q = ''; st.menu = false;
    if (rel() === ROUTE) render(host);
  };
  window.ResumenVista = { get: () => st.vista, set: setVista };
  window.addEventListener('popstate', sync);
  const rp = history.replaceState.bind(history); history.replaceState = (...a) => { rp(...a); sync(); };
  sync();
})();
