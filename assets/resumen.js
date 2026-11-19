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

  const FAMILIES = [{ code: 'all', label: 'Todos', count: 1123 }, ...CON, ...SIN];
  const BAR = FAMILIES.filter((f) => f.code !== 'all' && f.count != null);
  const FUNCTIONS = ['Todas', 'Docente/Entrenador', 'Docente/Asistente', 'Auxiliar Discapacidad', 'Fisioterapeuta', 'Médico', 'Asistente Técnico'];
  const DELEGS = [['all', 'Todas las delegaciones', 1], ['ant', 'Antioquia', 0.11], ['atl', 'Atlántico', 0.06], ['bog', 'Bogotá D.C.', 0.13], ['val', 'Valle del Cauca', 0.09], ['san', 'Santander', 0.05]];
  const FASES = ['Nacionales', 'Regional Conjunto', 'Regional Atletismo'];
  const TOTAL = 1123;
  const C_PEND = 'var(--naotech-color-gray-300,#d0d4e6)', C_ENT = T('green', '#1f8923');

  const st = { fase: 'Nacionales', deleg: 'all', family: 'all', fn: 'Todas', menu: false, supOpen: false, q: '', page: 1, anim: 'all', fx: '', pop: new Set(), open: new Set(['Taekwondo']) };
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
    const rows = sportFamily ? SPORTS.map((s) => {
      const g = Math.round(s.generated * factor), sub = Math.round(s.subsanar * factor), p = Math.round(s.printed * factor), e = Math.round(s.delivered * factor);
      const split = s.para
        ? [['Deportista', 0.76], ['Docente/Entrenador', 0.1], ['Docente/Asistente', 0.06], ['Auxiliar Discapacidad', 0.08]]
        : [['Deportista', 0.86], ['Docente/Entrenador', 0.09], ['Docente/Asistente', 0.05]];
      const sh = split.map((r) => r[1]), cg = alloc(g, sh), cs = alloc(sub, sh), cp = alloc(p, sh), ce = alloc(e, sh), cc = s.cupo == null ? null : alloc(Math.round(s.cupo * factor), sh);
      return { sport: s.sport, cupo: s.cupo == null ? null : Math.round(s.cupo * factor), g, sub, p, e, roles: split.map((r, i) => ({ label: r[0], count: cg[i], sub: cs[i], p: cp[i], e: ce[i], cupo: cc ? cc[i] : null })) };
    }) : [];
    const famCount = Math.round((fam.count || 0) * delegF * (st.family === 'SUPPORT' && st.fn !== 'Todas' ? 0.25 : 1));
    return { rows, famCount, sportFamily, delegF };
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

  const filtros = () =>
    `<div class="rsa-filters"><label class="rsa-field"><span>Fase</span><select data-f="fase">${FASES.map((f) => `<option${f === st.fase ? ' selected' : ''}>${esc(f)}</option>`).join('')}</select></label>` +
    `<label class="rsa-field"><span>Delegación</span><select data-f="deleg">${DELEGS.map((d) => `<option value="${d[0]}"${d[0] === st.deleg ? ' selected' : ''}>${esc(d[1])}</option>`).join('')}</select></label>` +
    rolcon() +
    `<label class="rsa-field"><span>Rol sin deporte</span><select data-f="rolsin">${[['', 'Todos'], ...SIN.map((r) => [r.code, r.label])].map((o) => `<option value="${o[0]}"${(o[0] === '' ? !SIN.some((r) => r.code === st.family) : st.family === o[0]) ? ' selected' : ''}>${esc(o[1])}</option>`).join('')}</select></label>` +
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
    const { rows: allRows, famCount, sportFamily, delegF } = compute();
    const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const rows = st.q ? allRows.filter((r) => norm(r.sport).includes(norm(st.q))) : allRows;
    const G = sportFamily ? allRows.reduce((a, r) => a + r.g, 0) : famCount;
    const E = allRows.reduce((a, r) => a + r.e, 0), SUB = allRows.reduce((a, r) => a + r.sub, 0), P = allRows.reduce((a, r) => a + r.p, 0);
    const pend = sportFamily ? G - P : G;
    const sinSel = SIN.find((r) => r.code === st.family);
    const pc = (n, d) => (d ? Math.round((n / d) * 100) : 0);
    const bar = BAR.map((f) => {
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
      const pr = Math.min(100, pc(r.e, r.g));
      const rec = `<tr class="nwt-datatable__record ${open ? 'nws-summary__open' : ''}">` +
        `<td class="nwt-datatable__cell" ${wd(32)}><button type="button" class="nws-summary__toggle" data-open="${esc(r.sport)}" aria-expanded="${open}"><div class="nwt-icon nws-summary__chevron"><i class="naotech-icon-chevron-right"></i></div><span class="nwt-text-font-medium">${esc(r.sport)}</span></button></td>` +
        `<td class="nwt-datatable__cell nws-summary__center" ${wd(18)}><span>${fmt(r.g)}</span></td>` +
        `<td class="nwt-datatable__cell nws-summary__center" ${wd(18)}><span>${fmt(r.sub)}</span></td>` +
        `<td class="nwt-datatable__cell nws-summary__center" ${wd(32)}><div class="nws-summary__progress"><div class="nwt-progress-bar" role="progressbar" aria-valuenow="${pr}" aria-valuemin="0" aria-valuemax="100" nwt-theme="positive" nwt-size="small"><div class="nwt-progress-bar__track"><div class="nwt-progress-bar__fill" style="width:${pr}%"></div></div></div><span class="nwt-smalltext-font-regular">${pr} %</span></div></td></tr>`;
      const pend1 = r.g - r.p, over = r.p > r.g;
      const det = open ? `<tr class="nws-summary__detail"><td colspan="4"><div class="rsa-d${st.pop.has(r.sport) ? ' rsa-d--in' : ''}">` +
        `<div class="rsa-d__kpis">` +
          `<div class="rsa-d__kpi rsa-d__kpi--main"><span>Generadas</span><b>${fmt(r.g)}</b></div>` +
          `<div class="rsa-d__kpi"><span>${dot(T('orange', '#d74009'))}Por subsanar</span><b>${fmt(r.sub)}</b><small>Por parte del Ministerio</small></div>` +
          `<div class="rsa-d__kpi"><span>${dot(T('blue', '#1f78d1'))}Entregadas</span><b>${fmt(r.e)}</b><small>${pc(r.e, r.g)} % de las generadas</small></div>` +
        `</div>` +
        (() => { const tot = r.g + r.sub, e = r.e, pe = r.g - e, parts = [['Entregadas', e, T('blue', '#1f78d1')], ['Generadas sin entregar', pe, C_PEND], ['Por subsanar', r.sub, T('orange', '#d74009')]]; return `<div class="nws-summary__stack rsa-d__bar" role="img" aria-label="${parts.map((x) => x[0] + ' ' + x[1]).join(', ')}">${parts.map((x) => (x[1] ? `<span class="nws-summary__stack-part" data-tip="${x[0]}|${fmt(x[1])} · ${pc(x[1], tot)} % del total|${x[2]}" style="width:${(x[1] / tot) * 100}%;background:${x[2]}"></span>` : '')).join('')}</div>`; })() +
        `<div class="rsa-d__roles"><div class="rsa-d__rhead"><span>Por rol</span><span>Cupos asignados</span><span>Generadas</span><span>Por subsanar</span><span>Entregadas</span></div>` +
        r.roles.map((x) => `<div class="rsa-d__rrow"><span class="rsa-d__rname">${esc(x.label)}</span><span>${x.cupo == null ? '—' : fmt(x.cupo)}</span><span>${fmt(x.count)}</span><span>${fmt(x.sub)}</span><span>${fmt(x.e)}</span></div>`).join('') + `</div>` +
        `</div></td></tr>` : '';
      return rec + det;
    }).join('') + (sportFamily && st.q && !rows.length ? `<tr class="nwt-datatable__record"><td class="nwt-datatable__cell rsa-empty" colspan="4">Ningún deporte coincide con «${esc(st.q)}».</td></tr>` : '') + (!sportFamily ? `<tr class="nwt-datatable__record"><td class="nwt-datatable__cell rsa-empty" colspan="4">Este rol no se acredita por deporte: ver «Sin deporte» abajo.</td></tr>` : '');

    host.innerHTML =
      `<section class="nws-delivery nws-summary"><div class="nws-delivery__content">` +
      `<div class="nws-delivery__header rsa-head"><div class="nws-delivery__description"><span class="nwt-h5-font-bold">Resumen de acreditaciones</span><small class="nwt-smalltext-font-regular">Juegos Intercolegiados Nacionales 2026</small></div>` +
        `<span class="nwt-badge" role="status" nwt-theme="positive" nwt-size="medium" nwt-variant="quiet"><div class="nwt-badge__content"><div class="nwt-badge__label">● Activo</div></div></span></div>` +
      card('rsa-filtros', filtros()) +
      `<div class="nws-summary__stats rsa-stats${sinSel ? ' rsa-stats--5' : ''}">` +
        (sinSel ? stat('bookmark', 'informative', 'Cupos asignados', fmt(Math.round(sinSel.cupo * delegF)), `${sinSel.count && sinSel.cupo ? pc(sinSel.count, sinSel.cupo) : 0} % del cupo con acreditación generada`) : '') +
        stat('copy', '', 'Generadas', fmt(G), sportFamily ? `+ ${fmt(SUB)} por subsanar · ${fmt(G + SUB)} en total` : 'Acreditaciones activas') +
        stat('edit', 'warning', 'Por subsanar', fmt(sportFamily ? SUB : 0), 'Por parte del Ministerio') +
        stat('history', 'informative', 'Entregadas', fmt(sportFamily ? E : 0), sportFamily ? `${pc(E, G)} % de las generadas` : 'Tienen fecha de entrega registrada') + `</div>` +
      card('rsa-rolcard', `<div class="rsa-rolhead"><span class="nwt-text-font-medium">Generadas por rol</span></div>` +
        (() => {
          let acc = 0;
          const seg = bar.map((b, i) => { const w = (b.count / TOTAL) * 100, c = acc + w / 2; acc += w; const p = b.count / TOTAL < 0.005 ? '< 1 %' : pct(w); return { b, w, c, p, i }; });
          const tipAttr = (x) => `data-tip="${esc(x.b.label)}|${fmt(x.b.n)} generadas · ${x.p}|${x.b.color}"`;
          return `<div class="rsa-pb" role="group" aria-label="Generadas por rol">` +
            `<div class="rsa-pb__pins">${seg.map((x) => `<span class="rsa-pb__pin rsa-pb__pin--${x.i % 2 ? 'hi' : 'lo'}" ${tipAttr(x)} tabindex="0" style="left:${x.c}%;opacity:${x.b.dim ? 0.3 : 1};color:${x.b.color}"><i class="rsa-pb__stem"></i></span>`).join('')}</div>` +
            `<div class="rsa-pb__bar">${seg.map((x) => `<span ${tipAttr(x)} style="width:${x.w}%;background:${x.b.color};opacity:${x.b.dim ? 0.2 : 1}"></span>`).join('')}</div>` +
            `<div class="rsa-pb__labels">${seg.filter((x) => x.w >= 4).map((x) => `<span style="left:${x.c}%;opacity:${x.b.dim ? 0.4 : 1}"><b>${x.p}</b><small>${esc(x.b.label)}</small></span>`).join('')}</div>` +
          `</div>`;
        })()) +
      (sportFamily ? (
      `<div class="nws-summary__table-head"><span class="nwt-text-font-medium">Avance por deporte</span>` +
      `</div>` +
      card('nws-summary__table', `<div class="rsa-headtools">` + (sportFamily ? `<label class="rsa-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><input type="search" data-q placeholder="Buscar deporte" aria-label="Buscar deporte" value="${esc(st.q)}"></label>` : '') +
        (rows.length ? `<button type="button" class="rsa-allbtn" data-all="${allOpen ? 'close' : 'open'}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${allOpen ? '<path d="M7 20l5-5 5 5"/><path d="M7 4l5 5 5-5"/>' : '<path d="M7 15l5 5 5-5"/><path d="M7 9l5-5 5 5"/>'}</svg><span>${allOpen ? 'Plegar todos' : 'Desplegar todos'}</span></button>` : '') + `</div>` + `<div class="nwt-datatable"><div class="nwt-datatable__table"><table><thead class="nwt-datatable__head"><tr class="nwt-datatable__header">` +
        `<th class="nwt-datatable__title" style="width:32%">Deporte</th><th class="nwt-datatable__title nws-summary__center" style="width:18%">Generadas</th><th class="nwt-datatable__title nws-summary__center" style="width:18%">Por subsanar</th><th class="nwt-datatable__title nws-summary__center" style="width:32%">Avance de entrega</th></tr></thead><tbody class="nwt-datatable__body">${body}</tbody></table></div></div>` + (sportFamily && rows.length ? `<div class="rsa-pager"><span class="rsa-pager__info">Mostrando ${(st.page - 1) * PAGE + 1}–${(st.page - 1) * PAGE + pageRows.length} de ${rows.length} deportes</span><div class="rsa-pager__ctl"><span>Página</span><input type="number" class="rsa-pager__in" data-pg min="1" max="${pages}" value="${st.page}" aria-label="Página"><span>de <b>${pages}</b></span><button type="button" class="rsa-pager__btn" data-page="prev" aria-label="Página anterior"${st.page <= 1 ? ' disabled' : ''}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="rsa-pager__btn" data-page="next" aria-label="Página siguiente"${st.page >= pages ? ' disabled' : ''}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button></div></div>` : ''))
      ) : '') +
      `</div></section>`;
    // Animaciones: solo cuando cambia algo relevante; al escribir en el buscador no se repiten.
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
    const dd = t.closest('[data-dd]'), pk = t.closest('[data-pick]'), sp = t.closest('[data-sup]'), sb = t.closest('[data-sub]');
    if (dd) { st.fx = 'menu'; st.menu = !st.menu; st.supOpen = st.family === 'SUPPORT'; render(host); return; }
    if (t.closest('[data-page]')) { const d = t.closest('[data-page]'); if (!d.disabled) { st.page += d.dataset.page === 'next' ? 1 : -1; st.anim = 'rows'; render(host); } return; }
    if (pk) { st.anim = 'all'; st.family = pk.dataset.pick; st.page = 1; st.fn = 'Todas'; st.menu = false; render(host); return; }
    if (sp) { st.fx = 'sub'; if (st.family !== 'SUPPORT') { st.family = 'SUPPORT'; st.fn = 'Todas'; st.supOpen = true; } else st.supOpen = !st.supOpen; render(host); return; }
    if (sb) { st.anim = 'all'; st.page = 1; st.family = 'SUPPORT'; st.fn = sb.dataset.sub; st.menu = false; render(host); return; }
    const fn = t.closest('[data-fn]'), op = t.closest('[data-open]'), all = t.closest('[data-all]');
    if (fn) st.fn = fn.dataset.fn;
    else if (op) { const s = op.dataset.open; if (st.open.has(s)) st.open.delete(s); else { st.open.add(s); st.pop.add(s); } }
    else if (all) { if (all.dataset.all === 'open') SPORTS.forEach((s) => { if (!st.open.has(s.sport)) st.pop.add(s.sport); st.open.add(s.sport); }); else st.open.clear(); }
    else return;
    render(host);
  });
  document.addEventListener('click', (e) => { if (st.menu && !e.target.closest('.rsa-dd')) { st.menu = false; render(host); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && st.menu) { st.menu = false; render(host); } });
  window.addEventListener('popstate', sync);
  const rp = history.replaceState.bind(history); history.replaceState = (...a) => { rp(...a); sync(); };
  sync();
})();
