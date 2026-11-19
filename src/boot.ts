// Va PRIMERO en main.tsx: el SDK toma `fetch` al cargarse, así que el simulador del gateway
// tiene que estar puesto antes de que se evalúe cualquier módulo suyo.
import { installGateway } from './gateway-browser';

installGateway();
