# Habita Inmobiliaria · Real Estate Distribution Network

Portal comercial para una red inmobiliaria con inventario centralizado, vendedores aprobados, atribución de leads y trazabilidad hasta la comisión.

## Estado actual

La primera versión publicada implementa el shell responsive del portal del asesor: resumen comercial, pipeline de clientes, agenda, inventario, actividad y recomendaciones. El diseño toma como referencia el documento maestro y deja clara la jerarquía de los módulos del MVP. La plataforma ya cuenta con una instancia PostgreSQL Prisma Postgres y su migración de fundación aplicada.

## Próxima capa de producto

El documento maestro requiere que estos flujos se implementen en servidor antes de cualquier uso comercial: autenticación/RBAC, auditoría inmutable, propietarios e inventario, reglas de disclosure, CRM con atribución/dedupe, visitas, ofertas, negocios, comisiones y documentos privados.

## Desarrollo

```bash
npm install
npm run dev
```

El sitio se despliega automáticamente en Vercel tras cada push a `main`.
