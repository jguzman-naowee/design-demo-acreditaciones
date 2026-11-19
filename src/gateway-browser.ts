// @ts-ignore: el contrato del gateway viene del arnés e2e del micro (JS puro).
import { interceptGateway } from './gateway.mjs';

// El arnés habla con Playwright (`page.route`); acá se le da una página falsa que solo guarda
// el manejador, y el transporte del SDK (XMLHttpRequest) le pasa cada llamada al gateway como
// si fuera una ruta. Lo que no es del gateway sigue su camino normal.
export function installGateway(): void {
  const handlers: Array<(route: unknown) => unknown> = [];
  const fakePage = {
    route: (_pattern: string, handler: (route: unknown) => unknown) => handlers.push(handler),
    context: () => ({ route: () => undefined })
  };
  void interceptGateway(fakePage);

  const proto = XMLHttpRequest.prototype;
  const realOpen = proto.open;
  const realSend = proto.send;
  type Tagged = XMLHttpRequest & { __gw?: { method: string; url: URL } };

  proto.open = function (this: Tagged, method: string, url: string | URL, ...rest: unknown[]) {
    const u = new URL(String(url), location.href);
    this.__gw = u.pathname.includes('/public-gateway/') ? { method: method.toUpperCase(), url: u } : undefined;
    return (realOpen as (...a: unknown[]) => void).call(this, method, url, ...rest);
  } as typeof proto.open;

  proto.send = function (this: Tagged, body?: Document | XMLHttpRequestBodyInit | null) {
    const gw = this.__gw;
    if (!gw) return realSend.call(this, body);

    let json: unknown = null;
    try { json = typeof body === 'string' && body ? JSON.parse(body) : null; } catch { /* sin cuerpo JSON */ }

    const route = {
      request: () => ({ url: () => gw.url.href, method: () => gw.method, postDataJSON: () => json }),
      fulfill: ({ status, contentType, body: text }: { status: number; contentType: string; body: string }) => {
        const set = (k: string, v: unknown) => Object.defineProperty(this, k, { value: v, configurable: true });
        const type = this.responseType;
        set('readyState', 4); set('status', status); set('statusText', status < 400 ? 'OK' : 'Error');
        set('responseURL', gw.url.href);
        set('responseText', text);
        set('response', type === 'json' ? JSON.parse(text || 'null') : text);
        this.getResponseHeader = (h: string) => (h.toLowerCase() === 'content-type' ? contentType : null);
        this.getAllResponseHeaders = () => `content-type: ${contentType}\r\n`;
        for (const ev of ['readystatechange', 'load', 'loadend']) this.dispatchEvent(new Event(ev));
      }
    };
    queueMicrotask(() => handlers[0](route));
  } as typeof proto.send;
}
