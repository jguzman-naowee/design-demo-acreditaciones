import {
  NwtBadge,
  NwtButton,
  NwtCard,
  NwtDatatable,
  NwtDatatableCell,
  NwtDatatableHeader,
  NwtDatatableRecord,
  NwtDatatableTitle,
  NwtIcon,
  NwtProgressBar,
  NwtStatCard,
  NwtTooltip
} from '@naowee-tech/sdk-react-components';
import { Fragment, useMemo, useState } from 'react';
import { SPORTS, toRow, totals, type SportRow } from './summary.data';
import './SummaryPage.scss';

const n = (v: number) => v.toLocaleString('es-CO');
const pct = (v: number) => `${Math.round(v)} %`;

// Mismos anchos en encabezado, filas y totales para que las columnas no se corran.
const W = {
  sport: 'nwt-width-xs-20',
  num: 'nwt-width-xs-12-5 nws-summary__center',
  progress: 'nwt-width-xs-17-5 nws-summary__center'
};

function Progress({ value, warn = false }: { value: number; warn?: boolean }) {
  // Un 100 % que sale de un dato malo no es «completo»: se pinta como advertencia.
  const theme = warn ? 'warning' : value >= 100 ? 'positive' : 'primary';
  return (
    <div className="nws-summary__progress">
      <NwtProgressBar value={value} nwtSize="small" nwtTheme={theme} />
      <span className="nwt-smalltext-font-regular">{pct(value)}</span>
    </div>
  );
}

// El total del deporte (generadas + por subsanar) repartido en sus tres estados.
function Detail({ r }: { r: SportRow }) {
  const total = r.generated + r.toFix;
  const printed = Math.min(r.printed, r.generated);
  const share = (v: number) => (total ? (v / total) * 100 : 0);
  const parts = [
    { key: 'printed', label: 'Impresas y laminadas', value: printed },
    { key: 'to-print', label: 'Por imprimir', value: r.toPrint },
    { key: 'to-fix', label: 'Por subsanar', value: r.toFix }
  ];
  const metrics = [
    {
      label: 'Cupo ocupado',
      value: r.quota ? pct((total / r.quota) * 100) : '—',
      hint: r.quota ? `${n(total)} de ${n(r.quota)} cupos` : 'Sin cupo asignado'
    },
    { label: 'Impresas sobre generadas', value: pct(r.generated ? (r.printed / r.generated) * 100 : 0), hint: `${n(r.printed)} de ${n(r.generated)} generadas` }
  ];
  return (
    <tr className="nws-summary__detail">
      <td colSpan={7}>
        <div className="nws-summary__detail-body">
          <div className="nws-summary__stack" role="img" aria-label={parts.map((p) => `${p.label} ${pct(share(p.value))}`).join(', ')}>
            {parts.map((p) => p.value > 0 && (
              <span key={p.key} className={`nws-summary__stack-part nws-summary__stack-part--${p.key}`} style={{ width: `${share(p.value)}%` }} />
            ))}
          </div>
          <ul className="nws-summary__legend">
            {parts.map((p) => (
              <li key={p.key}>
                <i className={`nws-summary__dot nws-summary__stack-part--${p.key}`} />
                {p.label} <strong>{pct(share(p.value))}</strong> <span className="nws-summary__muted">({n(p.value)})</span>
              </li>
            ))}
          </ul>
          <div className="nws-summary__metrics">
            {metrics.map((m) => (
              <div key={m.label} className="nws-summary__metric">
                <span className="nws-summary__metric-label">{m.label}</span>
                <span className="nws-summary__metric-value">{m.value}</span>
                <span className="nws-summary__metric-hint">{m.hint}</span>
              </div>
            ))}
          </div>
          {r.overPrinted && (
            <p className="nws-summary__detail-warn">
              <NwtBadge nwtVariant="quiet" nwtTheme="warning" vignette={true}>Revisar</NwtBadge>
              Hay {n(r.printed - r.generated)} impresas más que generadas: las impresas se cuentan hasta el total generado.
            </p>
          )}
        </div>
      </td>
    </tr>
  );
}

function Row({ r, odd, open, onToggle }: { r: SportRow; odd: boolean; open: boolean; onToggle: () => void }) {
  return (
    <Fragment>
    <NwtDatatableRecord className={`${odd ? 'nws-summary__odd' : ''} ${open ? 'nws-summary__open' : ''}`}>
      <NwtDatatableCell className={W.sport}>
        <button type="button" className="nws-summary__toggle" aria-expanded={open} onClick={onToggle}>
          <NwtIcon value="chevron-right" className="nws-summary__chevron" />
          <span className="nwt-text-font-medium">{r.sport}</span>
        </button>
      </NwtDatatableCell>
      <NwtDatatableCell className={W.num}>
        {r.quota === null ? (
          <NwtTooltip content="Este deporte no tiene cupos asignados en la planilla" position="top">
            <span className="nws-summary__muted">Sin cupo</span>
          </NwtTooltip>
        ) : (
          <span>{n(r.quota)}</span>
        )}
      </NwtDatatableCell>
      <NwtDatatableCell className={W.num}>
        <span>{n(r.generated)}</span>
      </NwtDatatableCell>
      <NwtDatatableCell className={W.num}>
        <span className={r.toFix ? '' : 'nws-summary__muted'}>{n(r.toFix)}</span>
      </NwtDatatableCell>
      <NwtDatatableCell className={W.num}>
        <span>{n(r.printed)}</span>
      </NwtDatatableCell>
      <NwtDatatableCell className={W.num}>
        {r.overPrinted ? (
          <NwtTooltip content={`Hay ${n(r.printed - r.generated)} impresas más que generadas: revisar el dato`} position="top" wrap={true}>
            <NwtBadge nwtVariant="quiet" nwtTheme="warning" vignette={true}>Revisar</NwtBadge>
          </NwtTooltip>
        ) : (
          <span>{n(r.toPrint)}</span>
        )}
      </NwtDatatableCell>
      <NwtDatatableCell className={W.progress}>
        <Progress value={r.progress} warn={r.overPrinted} />
      </NwtDatatableCell>
    </NwtDatatableRecord>
    {open && <Detail r={r} />}
    </Fragment>
  );
}

export function SummaryPage() {
  const rows = useMemo(() => SPORTS.map(toRow), []);
  const t = useMemo(() => totals(rows), [rows]);
  const issues = rows.filter((r) => r.overPrinted);
  const noQuota = rows.filter((r) => r.quota === null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const allOpen = open.size === rows.length;
  const toggle = (sport: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(sport)) next.add(sport);
      return next;
    });

  return (
    <section className="nws-delivery nws-summary">
      <div className="nws-delivery__content">
        <div className="nws-delivery__header">
          <div className="nws-delivery__description">
            <span className="nwt-h5-font-bold">Resumen de acreditaciones</span>
            <small className="nwt-smalltext-font-regular">
              Avance por deporte, desde la generación hasta la impresión del carnet.
            </small>
          </div>
        </div>

        <div className="nws-summary__stats">
          <NwtStatCard icon="copy" label="Total de acreditaciones" value={n(t.total)} hint={`${n(t.generated)} generadas + ${n(t.toFix)} por subsanar`} />
          <NwtStatCard icon="positive" nwtTheme="positive" label="Impresas y laminadas" value={n(t.printed)} hint={`${pct(t.progress)} de las generadas`} />
          <NwtStatCard icon="history" nwtTheme="informative" label="Pendientes por imprimir" value={n(t.toPrint)} hint="Generadas que aún no se imprimen" />
          <NwtStatCard icon="attention" nwtTheme="warning" label="Por subsanar" value={n(t.toFix)} hint="Las corrige el Ministerio" />
        </div>

        <NwtCard className="nws-summary__overall">
          <div className="nws-summary__overall-head">
            <span className="nwt-text-font-medium">Avance de impresión</span>
            <div className="nws-summary__chips">
              <NwtBadge nwtVariant="quiet" nwtTheme="neutral">{n(t.printed)} de {n(t.generated)} generadas</NwtBadge>
              <NwtBadge nwtVariant="quiet" nwtTheme="neutral">{n(t.toPrint + t.toFix)} pendientes</NwtBadge>
              <NwtBadge nwtVariant="quiet" nwtTheme="informative">{n(t.toPrint)} por imprimir</NwtBadge>
              <NwtBadge nwtVariant="quiet" nwtTheme="warning">{n(t.toFix)} por subsanar</NwtBadge>
            </div>
          </div>
          <NwtProgressBar value={t.progress} nwtSize="medium" nwtTheme="primary" />
        </NwtCard>

        <div className="nws-summary__table-head">
          <span className="nwt-text-font-medium">Avance por deporte</span>
          <NwtButton nwtVariant="quiet" nwtSize="small" onClick={() => setOpen(allOpen ? new Set() : new Set(rows.map((r) => r.sport)))}>
            {allOpen ? 'Plegar todos' : 'Desplegar todos'}
          </NwtButton>
        </div>

        <NwtCard className="nws-summary__table">
          <NwtDatatable
            header={
              <NwtDatatableHeader>
                <NwtDatatableTitle className={W.sport}>Deporte</NwtDatatableTitle>
                <NwtDatatableTitle className={W.num}>Cupos</NwtDatatableTitle>
                <NwtDatatableTitle className={W.num}>Generadas</NwtDatatableTitle>
                <NwtDatatableTitle className={W.num}>Por subsanar</NwtDatatableTitle>
                <NwtDatatableTitle className={W.num}>Impresas</NwtDatatableTitle>
                <NwtDatatableTitle className={W.num}>Por imprimir</NwtDatatableTitle>
                <NwtDatatableTitle className={W.progress}>Avance</NwtDatatableTitle>
              </NwtDatatableHeader>
            }
          >
            {rows.map((r, i) => (
              <Row key={r.sport} r={r} odd={i % 2 === 1} open={open.has(r.sport)} onToggle={() => toggle(r.sport)} />
            ))}
            <NwtDatatableRecord className="nws-summary__total">
              <NwtDatatableCell className={W.sport}><span>Total</span></NwtDatatableCell>
              <NwtDatatableCell className={W.num}>
                <NwtTooltip content={`Suma de los ${t.sportsWithQuota} deportes con cupo asignado`} position="top" wrap={true}>
                  <span>{n(t.quota)}*</span>
                </NwtTooltip>
              </NwtDatatableCell>
              <NwtDatatableCell className={W.num}><span>{n(t.generated)}</span></NwtDatatableCell>
              <NwtDatatableCell className={W.num}><span>{n(t.toFix)}</span></NwtDatatableCell>
              <NwtDatatableCell className={W.num}><span>{n(t.printed)}</span></NwtDatatableCell>
              <NwtDatatableCell className={W.num}><span>{n(t.toPrint)}</span></NwtDatatableCell>
              <NwtDatatableCell className={W.progress}><Progress value={t.progress} /></NwtDatatableCell>
            </NwtDatatableRecord>
          </NwtDatatable>

          {(issues.length > 0 || noQuota.length > 0) && (
            <ul className="nws-summary__notes nwt-smalltext-font-regular">
              {issues.map((r) => (
                <li key={r.sport}>
                  <strong>{r.sport}</strong> tiene más impresas ({n(r.printed)}) que generadas ({n(r.generated)}); no suma a pendientes hasta corregir el dato.
                </li>
              ))}
              {noQuota.length > 0 && (
                <li>
                  * El total de cupos cuenta solo {t.sportsWithQuota} de {rows.length} deportes: {noQuota.map((r) => r.sport).join(', ')} no tienen cupo asignado.
                </li>
              )}
            </ul>
          )}
        </NwtCard>
      </div>
    </section>
  );
}
