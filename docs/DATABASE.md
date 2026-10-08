# Modelo de datos

El esquema Prisma establece PostgreSQL como fuente de verdad e implementa UUIDs, campos monetarios `Decimal`, relaciones explícitas de propiedad y borrado lógico mediante `archivedAt`.

## Invariantes ya representados

- `Property.code` es único.
- Un propietario y un inmueble mantienen una relación muchos-a-muchos mediante `PropertyOwner`, incluyendo porcentaje, firmante y contacto principal.
- El nivel de disclosure forma parte del inmueble y se evalúa en servidor.
- Leads normalizan teléfono/correo y sus identificadores normalizados son únicos.
- Los eventos de auditoría solo se modelan para inserción; el servicio no expone actualización ni borrado.

Antes de ejecutar migraciones se debe configurar `DATABASE_URL`. La migración inicial se crea con `npx prisma migrate dev --name foundation` en un entorno de desarrollo con PostgreSQL.
