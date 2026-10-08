# Despliegue y base de datos

El proyecto está vinculado con `nation-core`, una instancia Prisma Postgres conectada desde Vercel a los entornos `production`, `preview` y `development`.

La migración inicial se aplicó mediante Prisma y vive en `prisma/migrations`. Para una nueva migración local:

```bash
vercel env pull .env.local
set -a; source .env.local; set +a
npx prisma migrate dev --name nombre_del_cambio
```

En CI/producción se debe usar `npx prisma migrate deploy`, nunca `migrate dev`. No se versiona `.env.local` ni ninguna cadena de conexión.
