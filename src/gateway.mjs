// El contrato congelado del gateway.
//
// Cada forma que aparece acá se midió contra dev, y por eso el mock es EXIGENTE: no
// filtra lo que el gateway no filtra, ni añade lo que no manda. Un mock más generoso que
// el backend da por bueno lo que en producción no funciona.
//
// Es UNA sola interceptación con despacho explícito, y no una ruta por endpoint, por dos
// razones: los globs de Playwright ya nos costaron un rato de rutas que se tapaban entre
// ellas (se resuelven de la última registrada a la primera), y así todo lo que la
// aplicación pida y no esté acá cae en el 501 del final, que es un fallo visible en lugar
// de una llamada silenciosa a dev.
export const SESSION = {
  user_code: 'dev-user',
  email: 'dev@naowee.com',
  nature: 'INDIVIDUAL',
  individual_detail: { first_name: 'Dev', first_last_name: 'PW' },
  roles: ['ROOT'],
  permissions: ['all:all'],
  eventCode: '80fd12ca-337b-417b-83cd-fe39ad4a343a',
  eventName: 'Juegos Nacionales 2026',
  phaseCode: 'fase-elim-1',
  phaseName: 'Fase Eliminatoria',
  // El event_id del módulo identifica el par evento+fase, no el evento.
  eventId: 7,
  // La segunda fase acreditable, que solo aparece cuando la prueba la enciende: es el
  // caso en el que hay que PREGUNTAR en qué fase se trabaja, porque el event_id cambia.
  secondPhaseCode: 'fase-final-2',
  secondPhaseName: 'Fase Final',
  secondEventId: 8
};

// Segundo evento de la demo: tiene su propio event_id, tipos y acreditados.
export const INTERCOLEGIADOS = {
  eventCode: 'c1a2b3d4-0000-4000-8000-000000000010',
  eventName: 'Juegos Intercolegiados 2026',
  eventId: 20
};

const json = (route, status, body) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body)
  });

// Como el `search` del backend: sin tildes y sin mayúsculas.
const plain = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

// El listado paginado del módulo: {data, meta}. El SDK exige las dos claves.
const page1 = (rows) => ({
  data: rows,
  meta: { total: rows.length, page: 1, limit: 10, last_page: 1 }
});

export async function interceptGateway(page) {
  // Lo que el mock recibió y decidió queda acá para poder afirmar sobre ello: no basta
  // con que la pantalla se vea bien, tiene que MANDAR lo que el contrato pide.
  const state = {
    // El catálogo del módulo: SOLO los eventos con acreditación configurada, una fila por
    // evento. El segundo lleva tildes a propósito: el contrato promete búsqueda tolerante.
    eventCatalog: [
      {
        event_code: SESSION.eventCode,
        name: SESSION.eventName,
        start_date: '2026-09-01T08:00:00Z'
      },
      {
        event_code: 'c1a2b3d4-0000-4000-8000-000000000009',
        name: 'Clásica de Atletismo',
        start_date: '2026-11-03T08:00:00Z'
      },
      {
        event_code: INTERCOLEGIADOS.eventCode,
        name: INTERCOLEGIADOS.eventName,
        start_date: '2026-10-12T08:00:00Z'
      }
    ],
    roles: [
      {
        code: 'cfd0e564-69c9-4091-bf12-3fdb9d2948ab',
        id: 10,
        role_name: 'Deportista',
        role_code: 'ATHLETE',
        event_id: SESSION.eventId,
        is_active: true,
        permissions: []
      },
      {
        code: '4be744ed-9fe5-46b7-952c-8607e6c609c7',
        id: 11,
        role_name: 'Delegado',
        role_code: 'DELEGADO',
        event_id: SESSION.eventId,
        is_active: true,
        permissions: []
      },
      {
        // Activo pero sin nadie acreditado: es el caso del 422 NO_ACCREDITATIONS.
        code: 'b21f0a2b-0000-4000-8000-000000000003',
        id: 12,
        role_name: 'Prensa',
        role_code: 'PRENSA',
        event_id: SESSION.eventId,
        is_active: true,
        permissions: []
      },
      {
        // Inactivo: no debe ofrecerse para generar carnets.
        code: '7c1f0a2b-0000-4000-8000-000000000004',
        id: 13,
        role_name: 'Tipo inactivo',
        role_code: 'INACTIVO',
        event_id: SESSION.eventId,
        is_active: false,
        permissions: []
      }
    ],
    accreditations: [
      {
        code: 'aaaa1111-0000-4000-8000-000000000001',
        event_id: SESSION.eventId,
        user_code: 'user-andres',
        document_number: '150001002001',
        full_name: 'Andrés Camilo Martínez Rodríguez',
        department_name: 'ANTIOQUIA',
        role_code: 'ATHLETE',
        role_name: 'Deportista',
        status: 'ACTIVE',
        permissions_total: 2,
        uses_consumed: 0,
        created_at: '2026-07-28T10:15:00.000Z'
      },
      {
        code: 'aaaa1111-0000-4000-8000-000000000002',
        event_id: SESSION.eventId,
        user_code: 'user-maria',
        document_number: '150001003081',
        full_name: 'María Camila Arias Díaz',
        department_name: 'BOLÍVAR',
        role_code: 'DELEGADO',
        role_name: 'Delegado',
        status: 'ACTIVE',
        permissions_total: 1,
        uses_consumed: 0,
        created_at: '2026-07-29T09:00:00.000Z'
      },
      {
        // Aparece en el listado pero el endpoint de carnets no la reconoce: emula la
        // carrera real de una acreditación que alguien borra o inactiva entre que se
        // pinta la tabla y se manda el lote. Es el caso de `skipped`.
        code: 'aaaa1111-0000-4000-8000-000000000003',
        event_id: SESSION.eventId,
        user_code: 'user-juan',
        document_number: '150001004055',
        full_name: 'Juan Esteban Ríos Peña',
        department_name: 'VALLE',
        role_code: 'DELEGADO',
        role_name: 'Delegado',
        status: 'ACTIVE',
        permissions_total: 1,
        uses_consumed: 0,
        created_at: '2026-07-30T09:00:00.000Z',
        orphan: true
      },
      {
        code: 'aaaa1111-0000-4000-8000-000000000004',
        event_id: SESSION.eventId,
        user_code: 'user-laura',
        document_number: '150001007033',
        full_name: 'Laura Gómez Peña',
        department_name: 'ATLÁNTICO',
        role_code: 'DELEGADO',
        role_name: 'Delegado',
        status: 'ACTIVE',
        // Su carnet se pidió de a uno, así que ya está entregado.
        delivered: true,
        permissions_total: 1,
        uses_consumed: 0,
        created_at: '2026-07-31T09:00:00.000Z'
      }
    ],
    // Los participantes con su documentación aprobada, que es de donde sale el mostrador.
    // El primero YA está acreditado: es el que `exclude_accredited` tiene que quitar.
    readyParticipants: [
      {
        user_code: 'user-andres',
        user_role: 'ATHLETE',
        user_first_name: 'Andrés',
        user_first_lastname: 'Martínez',
        document_type: 'CC',
        document_type_name: 'Cédula',
        document_number: '150001002001',
        department_code: '05',
        department_name: 'ANTIOQUIA'
      },
      {
        user_code: 'user-sofia',
        user_role: 'ATHLETE',
        user_first_name: 'Sofía',
        user_first_lastname: 'Restrepo',
        document_type: 'CC',
        document_type_name: 'Cédula',
        document_number: '150001005011',
        department_code: '05',
        department_name: 'ANTIOQUIA'
      },
      {
        user_code: 'user-diego',
        user_role: 'DELEGADO',
        user_first_name: 'Diego',
        user_first_lastname: 'Salazar',
        document_type: 'CC',
        document_type_name: 'Cédula',
        document_number: '150001006022',
        department_code: '13',
        department_name: 'BOLÍVAR'
      }
    ],
    // Dos lotes que ya existían antes de entrar: uno terminado y partido en dos PDFs
    // —cada chunk es un PDF de hasta 30 carnets— y uno que sigue generándose, que es el
    // que deja ver qué hace la pantalla cuando el backend todavía no publica nada.
    cardBatches: [
      {
        batch_code: 'lote0002-0000-4000-8000-000000000000',
        batch_number: 2,
        event_code: SESSION.eventCode,
        kind: 'BULK',
        status: 'PROCESSING',
        total_cards: 2,
        total_chunks: 1,
        cards_without_photo: 2,
        requested_by: SESSION.user_code,
        created_at: '2026-08-17T16:20:00.000Z',
        members: [
          {
            accreditation_code: 'aaaa1111-0000-4000-8000-000000000001',
            full_name: 'Andrés Camilo Martínez Rodríguez'
          }
        ],
        skipped: [],
        uploads: ['pdf-lote0002-0'],
        // Nunca termina dentro de la verificación: es el lote «en curso».
        settleAfter: Number.POSITIVE_INFINITY
      },
      {
        batch_code: 'lote0001-0000-4000-8000-000000000000',
        batch_number: 1,
        event_code: SESSION.eventCode,
        kind: 'BULK',
        status: 'COMPLETED',
        total_cards: 2,
        total_chunks: 2,
        cards_without_photo: 2,
        requested_by: SESSION.user_code,
        created_at: '2026-08-16T09:00:00.000Z',
        members: [
          {
            accreditation_code: 'aaaa1111-0000-4000-8000-000000000001',
            full_name: 'Andrés Camilo Martínez Rodríguez'
          },
          {
            accreditation_code: 'aaaa1111-0000-4000-8000-000000000002',
            full_name: 'María Camila Arias Díaz'
          }
        ],
        // Los omitidos persisten en el lote: se siguen viendo entrando después, no solo
        // en la respuesta del POST.
        skipped: [
          {
            code: 'aaaa1111-0000-4000-8000-000000000003',
            reason: 'La acreditación no existe en el evento'
          }
        ],
        uploads: ['pdf-lote0001-0', 'pdf-lote0001-1'],
        settleAfter: 0
      },
      {
        // Un carnet pedido de a uno: numera en la misma serie del evento, pero no es un
        // lote de varios y la tabla no debe llamarlo así.
        batch_code: 'indiv001-0000-4000-8000-000000000000',
        batch_number: 3,
        event_code: SESSION.eventCode,
        kind: 'INDIVIDUAL',
        status: 'COMPLETED',
        total_cards: 1,
        total_chunks: 1,
        cards_without_photo: 1,
        requested_by: SESSION.user_code,
        created_at: '2026-08-15T11:30:00.000Z',
        members: [
          {
            accreditation_code: 'aaaa1111-0000-4000-8000-000000000004',
            full_name: 'Laura Gómez Peña'
          }
        ],
        skipped: [],
        uploads: ['pdf-indiv001-0'],
        settleAfter: 0
      }
    ],
    // El consecutivo del lote es POR EVENTO, y los sembrados ya gastaron del 1 al 3.
    batchSequence: 3,
    // El cuerpo de cada POST de carnets, en orden: es lo que se comprueba.
    cardRequests: [],
    // Y el de cada acción masiva: por códigos o por lote entero, no es lo mismo.
    bulkRequests: [],
    // Cuántas veces se preguntó por cada lote. El estado avanza con las consultas para
    // ver el «generando» en pantalla sin depender de un reloj.
    polls: {},
    // Todo lo que la aplicación pidió, en orden: sirve para exigir que NO pida cosas.
    requests: [],
    // Lo enciende la verificación para probar el paso de fase de la pantalla de entrada.
    twoPhases: false,
    // Los PDFs que el navegador pidió de verdad al bucket.
    bucket: [],
    // Todo lo que la aplicación pidió y este contrato no cubre.
    unexpected: []
  };

  // Datos propios de Juegos Intercolegiados 2026 (event_id distinto al de Nacionales).
  state.roles.push(
    { code: 'ic000000-0000-4000-8000-000000000001', id: 30, role_name: 'Deportista escolar', role_code: 'ATHLETE', event_id: INTERCOLEGIADOS.eventId, is_active: true, permissions: [] },
    { code: 'ic000000-0000-4000-8000-000000000002', id: 31, role_name: 'Docente acompañante', role_code: 'DOCENTE', event_id: INTERCOLEGIADOS.eventId, is_active: true, permissions: [] },
    { code: 'ic000000-0000-4000-8000-000000000003', id: 32, role_name: 'Delegado', role_code: 'DELEGADO', event_id: INTERCOLEGIADOS.eventId, is_active: true, permissions: [] }
  );
  state.accreditations.push(
    { code: 'ic111111-0000-4000-8000-000000000001', event_id: INTERCOLEGIADOS.eventId, user_code: 'user-ic-valentina', document_number: '1020304050', full_name: 'Valentina Ospina Cardona', department_name: 'CALDAS', role_code: 'ATHLETE', role_name: 'Deportista escolar', status: 'ACTIVE', permissions_total: 2, uses_consumed: 0, created_at: '2026-10-02T10:00:00.000Z' },
    { code: 'ic111111-0000-4000-8000-000000000002', event_id: INTERCOLEGIADOS.eventId, user_code: 'user-ic-samuel', document_number: '1030405060', full_name: 'Samuel Herrera Quintero', department_name: 'SANTANDER', role_code: 'ATHLETE', role_name: 'Deportista escolar', status: 'ACTIVE', permissions_total: 2, uses_consumed: 0, created_at: '2026-10-03T10:00:00.000Z' },
    { code: 'ic111111-0000-4000-8000-000000000003', event_id: INTERCOLEGIADOS.eventId, user_code: 'user-ic-marta', document_number: '52111222', full_name: 'Marta Lucía Gaviria Toro', department_name: 'RISARALDA', role_code: 'DOCENTE', role_name: 'Docente acompañante', status: 'ACTIVE', permissions_total: 1, uses_consumed: 0, created_at: '2026-10-03T11:00:00.000Z' }
  );

  // Las rutas se prueban en orden y la primera que coincide contesta.
  const routes = [
    ['GET', /^\/v1\/auth\/me$/, ({ route }) => json(route, 200, SESSION)],

    // La pantalla de entrada: el catálogo del módulo, con búsqueda de SERVIDOR. El mock
    // filtra igual que el contrato promete —parcial y sin distinguir tildes— porque si
    // devolviera todo, un buscador que no manda `search` pasaría por bueno.
    [
      'GET',
      /^\/v1\/accreditation\/events\/catalog$/,
      ({ route, url }) => {
        const search = url.searchParams.get('search');

        return json(
          route,
          200,
          page1(
            state.eventCatalog.filter(
              (row) => !search || plain(row.name).includes(plain(search))
            )
          )
        );
      }
    ],
    [
      'GET',
      /^\/v1\/event\/[^/]+$/,
      ({ route, url }) =>
        json(route, 200, {
          event_code: url.pathname.split('/').pop(),
          name:
            url.pathname.split('/').pop() === INTERCOLEGIADOS.eventCode
              ? INTERCOLEGIADOS.eventName
              : SESSION.eventName,
          phases: [
            {
              code: SESSION.phaseCode,
              name: SESSION.phaseName,
              sequence_number: 1,
              has_accreditation_process: true
            },
            ...(state.twoPhases
              ? [
                  {
                    code: SESSION.secondPhaseCode,
                    name: SESSION.secondPhaseName,
                    sequence_number: 2,
                    has_accreditation_process: true
                  }
                ]
              : [])
          ]
        })
    ],

    // El lookup del event_id. Ojo con la forma: viene envuelta en `data` pero SIN
    // `meta`. Y va por GET: un POST acá duplicaría la fila del evento.
    [
      'GET',
      /^\/v1\/accreditation\/events$/,
      ({ route, url }) => {
        const phaseCode = url.searchParams.get('phase_code');
        const askedEvent = url.searchParams.get('event_code');

        if (askedEvent === INTERCOLEGIADOS.eventCode) {
          return json(route, 200, {
            data: [
              {
                id: INTERCOLEGIADOS.eventId,
                event_code: INTERCOLEGIADOS.eventCode,
                phase_code: phaseCode ?? SESSION.phaseCode
              }
            ]
          });
        }

        return json(route, 200, {
          data: [
            {
              // Cada fase del evento tiene su propio event_id: por eso hay que elegirla
              // y no se puede adivinar.
              id:
                phaseCode === SESSION.secondPhaseCode
                  ? SESSION.secondEventId
                  : SESSION.eventId,
              event_code: SESSION.eventCode,
              phase_code: phaseCode ?? SESSION.phaseCode
            }
          ]
        });
      }
    ],

    [
      'GET',
      /^\/v1\/accreditation\/roles$/,
      ({ route, url }) => {
        const eventId = url.searchParams.get('event_id');

        return json(
          route,
          200,
          page1(
            state.roles.filter(
              (role) => !eventId || String(role.event_id) === eventId
            )
          )
        );
      }
    ],

    // Como el gateway DE VERDAD: filtra por event_id y por search, y descarta
    // `role_code` y `status` si se los mandan.
    [
      'GET',
      /^\/v1\/accreditation\/accreditations$/,
      ({ route, url }) => {
        const eventId = url.searchParams.get('event_id');
        const search = url.searchParams.get('search');

        const rows = state.accreditations
          .filter((row) => !eventId || String(row.event_id) === eventId)
          .filter(
            (row) =>
              !search ||
              row.full_name.toLowerCase().includes(search.toLowerCase()) ||
              row.document_number.includes(search)
          );

        return json(route, 200, {
          ...page1(rows),
          // El summary solo aparece cuando se pide con event_id.
          ...(eventId
            ? { summary: { total: rows.length, by_status: { ACTIVE: rows.length } } }
            : {})
        });
      }
    ],

    // El mostrador. Ojo con dos cosas del contrato, las dos medidas por backend: el sobre
    // NO es el {data, meta} del módulo —los totales van sueltos y el tamaño se llama
    // `size`— y `exclude_accredited` filtra DENTRO de la página, así que la página puede
    // venir corta sin que `total` baje.
    [
      'GET',
      /\/participants\/ready-for-accreditation$/,
      ({ route, url }) => {
        const params = url.searchParams;
        const exclude = params.get('exclude_accredited') === 'true';
        const search = params.get('search');
        const size = Number(params.get('limit') ?? 10);

        const all = state.readyParticipants.filter(
          (row) =>
            !search ||
            plain(`${row.user_first_name} ${row.user_first_lastname}`).includes(
              plain(search)
            ) ||
            (row.document_number ?? '').includes(search)
        );

        const page = all.slice(0, size);
        const accredited = new Set(
          state.accreditations
            .filter((row) => row.status === 'ACTIVE')
            .map((row) => row.user_code)
        );

        return json(route, 200, {
          event_code: SESSION.eventCode,
          phase_code: SESSION.phaseCode,
          phase_name: SESSION.phaseName,
          participants: exclude
            ? page.filter((row) => !accredited.has(row.user_code))
            : page,
          // El total cuenta a TODOS, incluidos los que el filtro acaba de quitar.
          total: all.length,
          page: Number(params.get('page') ?? 1),
          size
        });
      }
    ],

    // Las acciones masivas. Acá lo interesante no es el 200: es lo que le pasa al LOTE.
    [
      'POST',
      /^\/v1\/accreditation\/accreditations\/bulk-(deliver|deactivate)$/,
      ({ route, path }) => {
        const body = route.request().postDataJSON() ?? {};
        const action = path.endsWith('deactivate') ? 'deactivate' : 'deliver';

        state.bulkRequests.push({ action, ...body });

        const fromBatch = body.batch_code
          ? (state.cardBatches
              .find((batch) => batch.batch_code === body.batch_code)
              ?.members.map((member) => member.accreditation_code) ?? [])
          : [];

        const codes = body.codes ?? fromBatch;
        const targets = state.accreditations.filter((row) =>
          codes.includes(row.code)
        );

        targets.forEach((row) => {
          row.status = action === 'deactivate' ? 'REVOKED' : row.status;
          row.delivered = action === 'deliver' ? true : row.delivered;
        });

        if (action === 'deactivate') {
          // Los lotes que perdieron gente: el backend rehace su PDF sin esas hojas —el
          // resto conserva su QR— y retira el lote que se queda sin nadie.
          state.cardBatches.forEach((batch) => {
            const left = batch.members.filter(
              (member) => !codes.includes(member.accreditation_code)
            );

            if (left.length === batch.members.length) {
              return;
            }

            batch.members = left;
            batch.total_cards = left.length;
            batch.status = 'PROCESSING';
            // Un PDF nuevo, para poder afirmar que el visor pide OTRO archivo.
            batch.uploads = batch.uploads.map((upload) => `${upload}-re`);
            // Termina en la siguiente consulta por code.
            batch.settleAfter = (state.polls[batch.batch_code] ?? 0) + 1;
          });

          state.cardBatches = state.cardBatches.filter(
            (batch) => batch.members.length
          );
        }

        return json(route, 200, {
          processed: targets.map((row) => ({
            code: row.code,
            status: row.status,
            delivered_at: row.delivered ? '2026-08-18T11:00:00.000Z' : null
          })),
          skipped: [],
          total_requested: codes.length,
          total_processed: targets.length
        });
      }
    ],

    // ── Carnets en lote ──────────────────────────────────────────────────────
    // Medido contra dev: el 202 no trae estado ni chunks, la selección vacía es 422 y
    // un tipo sin acreditados también.
    [
      'POST',
      /^\/v1\/accreditation\/events\/[^/]+\/cards$/,
      ({ route }) => {
        const body = route.request().postDataJSON() ?? {};

        state.cardRequests.push(body);

        if (
          Array.isArray(body.accreditation_codes) &&
          !body.accreditation_codes.length
        ) {
          return json(route, 422, {
            code: 'EMPTY_SELECTION',
            messages: [
              'accreditation_codes no puede ser una lista vacía: omite el campo para generar todo el evento'
            ]
          });
        }

        // Por códigos se contesta uno por uno: los que no reconoce salen en `skipped` y
        // el lote se genera con el resto. Por evento o por tipo no hay nada que omitir,
        // porque los códigos los elige el propio backend.
        const requested = body.accreditation_codes
          ? body.accreditation_codes.map((code) => ({
              code,
              row: state.accreditations.find((item) => item.code === code)
            }))
          : state.accreditations
              .filter((row) => !row.orphan)
              .filter((row) => !body.role_code || row.role_code === body.role_code)
              .map((row) => ({ code: row.code, row }));

        const cards = requested
          .filter((item) => item.row && !item.row.orphan)
          .map((item) => item.row);

        const skipped = requested
          .filter((item) => !item.row || item.row.orphan)
          .map((item) => ({
            code: item.code,
            reason: 'La acreditación no existe en el evento'
          }));

        if (!cards.length) {
          return json(route, 422, {
            code: 'NO_ACCREDITATIONS',
            messages: [
              'El evento no tiene acreditaciones que coincidan con los filtros'
            ]
          });
        }

        state.batchSequence += 1;

        const number = state.batchSequence;
        const batchCode = `lote000${number}-0000-4000-8000-000000000000`;

        state.cardBatches.unshift({
          batch_code: batchCode,
          // El consecutivo del lote dentro del evento.
          batch_number: number,
          event_code: SESSION.eventCode,
          kind: body.accreditation_codes ? 'SELECTION' : 'BULK',
          status: 'PROCESSING',
          total_cards: cards.length,
          total_chunks: 1,
          // En el LISTADO es un conteo; en el detalle por code es la lista de uuids.
          cards_without_photo: cards.length,
          requested_by: SESSION.user_code,
          created_at: '2026-08-18T10:00:00.000Z',
          members: cards.map((row) => ({
            accreditation_code: row.code,
            full_name: row.full_name
          })),
          skipped,
          uploads: [`pdf-${batchCode}-0`],
          // Termina en la segunda consulta por code.
          settleAfter: 1
        });

        return json(route, 202, {
          batch_code: batchCode,
          batch_number: number,
          total_cards: cards.length,
          total_chunks: 1,
          cards_without_photo: cards.map((row) => row.code),
          // Los omitidos llegan ya en el 202, antes de que exista ningún PDF.
          skipped
        });
      }
    ],

    // El listado APLANADO: una fila por acreditado con carnet, con su lote. Se deriva de los
    // lotes en lugar de mantenerse a mano, para que inactivar o matar un lote se refleje acá
    // —que es justo lo que hace el backend—.
    [
      'GET',
      /^\/v1\/accreditation\/card-batches\/members$/,
      ({ route, url }) => {
        const eventCode = url.searchParams.get('event_code');
        const search = url.searchParams.get('search');

        // UNA fila por acreditado, no por par persona+lote: backend lo describió como «tus
        // 11 personas», y una persona puede tener varios carnets generados. Gana el lote más
        // reciente, y la lista viene de más nuevo a más viejo.
        //
        // OJO: es una interpretación, no una medición. Está en la lista de lo que hay que
        // confirmar contra dev, y si allá salieran dos filas para la misma persona, la
        // pantalla mostraría duplicados.
        const seen = new Set();

        const rows = state.cardBatches
          .filter((batch) => !eventCode || batch.event_code === eventCode)
          .flatMap((batch) =>
            batch.members.map((member) => {
              const row = state.accreditations.find(
                (item) => item.code === member.accreditation_code
              );

              return {
                accreditation_code: member.accreditation_code,
                full_name: member.full_name,
                document_number: row?.document_number ?? null,
                role_code: row?.role_code ?? null,
                role_name: row?.role_name ?? null,
                status: row?.status ?? 'ACTIVE',
                delivered: row?.delivered ?? false,
                batch_code: batch.batch_code,
                batch_number: batch.batch_number,
                batch_kind: batch.kind
              };
            })
          )
          .filter((row) => {
            if (seen.has(row.accreditation_code)) {
              return false;
            }

            seen.add(row.accreditation_code);

            return true;
          })
          .filter(
            (row) =>
              !search ||
              plain(row.full_name).includes(plain(search)) ||
              (row.document_number ?? '').includes(search)
          );

        return json(route, 200, page1(rows));
      }
    ],

    // El listado de lotes, los más recientes primero. Se recorta a mano en lugar de
    // devolver la fila entera: el listado NO trae integrantes ni omitidos, y un mock que
    // los filtrara de más daría por buena una pantalla que en dev se quedaría sin datos.
    [
      'GET',
      /^\/v1\/accreditation\/card-batches$/,
      ({ route }) =>
        json(
          route,
          200,
          page1(
            state.cardBatches.map((batch) => ({
              batch_code: batch.batch_code,
              batch_number: batch.batch_number,
              event_code: batch.event_code,
              kind: batch.kind,
              status: batch.status,
              total_cards: batch.total_cards,
              total_chunks: batch.total_chunks,
              cards_without_photo: batch.cards_without_photo,
              requested_by: batch.requested_by,
              created_at: batch.created_at
            }))
          )
        )
    ],

    // El detalle del lote. La primera consulta lo da en curso y la segunda terminado:
    // así la pantalla muestra su espera sin que la prueba dependa de un reloj.
    [
      'GET',
      /^\/v1\/accreditation\/card-batches\/[^/]+$/,
      ({ route, path }) => {
        const code = path.split('/').pop();
        const listed = state.cardBatches.find(
          (batch) => batch.batch_code === code
        );

        if (!listed) {
          return json(route, 404, {
            code: 'NOT_FOUND',
            messages: ['No se encontró el lote']
          });
        }

        state.polls[code] = (state.polls[code] ?? 0) + 1;

        const done = state.polls[code] > listed.settleAfter;

        if (done) {
          // El GET por code es el que reconcilia contra file-storage, así que de acá
          // sale el estado que el listado repinta.
          listed.status = 'COMPLETED';
        }

        return json(route, 200, {
          batch_code: listed.batch_code,
          batch_number: listed.batch_number,
          event_code: listed.event_code,
          kind: listed.kind,
          status: listed.status,
          total_cards: listed.total_cards,
          total_chunks: listed.total_chunks,
          // En el detalle es la LISTA de uuids, no el conteo del listado. Y hoy salen
          // todos sin foto, porque el paquete documental no entrega la del acreditado.
          cards_without_photo: listed.members.map(
            (member) => member.accreditation_code
          ),
          // La regla que obliga a la pantalla a seguir consultando: los integrantes solo
          // viajan cuando el lote está en un estado final.
          accreditations: done ? listed.members : [],
          // Los omitidos, en cambio, persisten desde el 202.
          skipped: listed.skipped,
          chunks: listed.uploads.map((upload, index) => ({
            chunk_index: index,
            // El lote se reparte entre sus PDFs; con uno solo van todos ahí.
            card_count: Math.ceil(listed.total_cards / listed.uploads.length),
            // El upload_id existe desde que está en cola: descargar por tenerlo da
            // NoSuchKey, así que la pantalla debe esperar el COMPLETED del chunk.
            status: done ? 'COMPLETED' : 'ENQUEUED',
            upload_id: upload
          })),
          created_at: listed.created_at
        });
      }
    ],

    [
      'GET',
      /^\/v1\/files\/[^/]+\/download-url$/,
      ({ route, path }) => {
        const uploadId = path.split('/')[3];

        return json(route, 200, {
          download_url: `https://bucket.pruebas.test/generated/carnets_${uploadId}.pdf?X-Amz-Signature=firma`,
          file_name: `carnets_${uploadId}.pdf`,
          size_bytes: 51450
        });
      }
    ]
  ];

  await page.route('**/public-gateway/**', (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.split('/public-gateway')[1] ?? url.pathname;

    state.requests.push(`${request.method()} ${path}${url.search}`);

    const handler = routes.find(
      ([method, pattern]) => method === request.method() && pattern.test(path)
    );

    if (!handler) {
      state.unexpected.push(`${request.method()} ${path}`);

      return json(route, 501, {
        code: 'SIN_CONTRATO',
        messages: [`La verificación no tiene contrato para ${path}`]
      });
    }

    return handler[2]({ route, url, path });
  });

  // El bucket falso. Va en el CONTEXTO y no en la página: el PDF se abre con
  // window.open, y esa pestaña es otra Page que no heredaría una ruta de ésta.
  await page.context().route('https://bucket.pruebas.test/**', (route) => {
    state.bucket.push(route.request().url().split('/').pop().split('?')[0]);

    return route.fulfill({
      status: 200,
      contentType: 'application/pdf',
      body: '%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF'
    });
  });

  return state;
}
