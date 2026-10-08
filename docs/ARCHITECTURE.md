# Arquitectura inicial

NATION se implementará como un monolito modular con Next.js, TypeScript y PostgreSQL. La interfaz actual es el portal del asesor. La siguiente iteración añade servicios de dominio para `properties`, `leads`, `appointments`, `offers`, `deals`, `commissions`, `documents`, `audit` y `permissions`.

Las rutas y acciones de servidor serán la frontera de autorización. La visibilidad de datos de propietarios y direcciones dependerá de reglas de disclosure evaluadas en servidor; nunca únicamente del estado de la interfaz.
