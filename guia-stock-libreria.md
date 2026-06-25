# Guía de stock — Librería de usados

Sistema de control de inventario para librería de libros usados. App web deployada en Vercel con base de datos en Supabase.

---

## Archivos del proyecto

```
/
├── index.html          ← la app completa (UI + lógica)
└── supabase-config.js  ← tus credenciales (no subir a repositorio público)
```

---

## Configuración inicial (una sola vez)

### 1. Crear proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta gratuita
2. Nuevo proyecto → poné un nombre y una contraseña segura
3. Esperá que termine de provisionar (~1 minuto)

### 2. Crear la tabla de libros

En tu proyecto de Supabase, andá a **SQL Editor** y ejecutá esto:

```sql
create table libros (
  id            bigint generated always as identity primary key,
  titulo        text not null,
  autor         text not null,
  genero        text not null default 'Otro',
  estado        text not null default 'Bueno',
  stock         integer not null default 1,
  precio_compra numeric(10,2) not null default 0,
  precio_venta  numeric(10,2) not null default 0,
  created_at    timestamptz default now()
);

alter table libros enable row level security;
create policy "Acceso total" on libros for all using (true) with check (true);
```

### 3. Conectar la app

En Supabase: **Settings → API**. Copiá:
- **Project URL** → va en `SUPABASE_URL`
- **anon public key** → va en `SUPABASE_KEY`

Editá `supabase-config.js`:

```js
const SUPABASE_URL = "https://xxxx.supabase.co";
const SUPABASE_KEY = "eyJhbGci...";
```

### 4. Deploy en Vercel

1. Subí los dos archivos a un repositorio de GitHub
2. En [vercel.com](https://vercel.com): New Project → importar el repo
3. Deploy sin ninguna configuración extra — Vercel detecta el HTML solo

---

## Estructura de datos

Cada libro tiene estos campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | número | Generado automáticamente |
| `titulo` | texto | Título del libro |
| `autor` | texto | Nombre del autor o autora |
| `genero` | texto | Narrativa / Poesía / Ensayo / Historia / Filosofía / Ciencia ficción / Policial / Infantil / Otro |
| `estado` | texto | Bueno / Regular / Deteriorado |
| `stock` | entero | Cantidad de ejemplares disponibles |
| `precio_compra` | decimal | Lo que pagaste por el libro |
| `precio_venta` | decimal | Lo que pedís por él |
| `created_at` | fecha | Se registra solo al crear |

---

## Uso diario

### Agregar un libro
Botón **+ Agregar libro** → completar el formulario → Guardar.

### Registrar una venta
En la fila del libro, botón **−1** → descuenta un ejemplar del stock automáticamente.

### Editar un libro
Botón **Editar** en la fila → se abre el mismo formulario con los datos cargados.

### Buscar
El campo de búsqueda filtra por título y autor en tiempo real. También podés filtrar por género o estado con los selectores.

### Eliminar
Botón **✕** en la fila → pide confirmación antes de borrar.

---

## Panel de resumen

La app muestra cuatro métricas siempre visibles arriba:

| Métrica | Cómo se calcula |
|---|---|
| **Títulos en stock** | Libros con al menos 1 ejemplar disponible |
| **Ejemplares totales** | Suma de todos los `stock` |
| **Ganancia potencial** | Σ (`precio_venta` − `precio_compra`) × `stock` |
| **Capital invertido** | Σ `precio_compra` × `stock` |

---

## Estados y colores

| Estado | Color | Cuándo usarlo |
|---|---|---|
| Bueno | Verde | Libro en buen estado, sin daños visibles |
| Regular | Amarillo | Subrayados, lomo gastado, páginas amarillas |
| Deteriorado | Rojo | Daño visible que afecta la lectura |

Los géneros también tienen colores propios en la tabla para identificación visual rápida.

---

## Comportamiento sin Supabase

Si los archivos se abren sin credenciales configuradas, la app muestra un aviso y carga datos de ejemplo (Borges, Cortázar, Sabato) para poder ver cómo funciona. Los cambios en ese modo no se guardan.

---

## Posibles mejoras futuras

- Historial de ventas con fecha y precio
- Foto de tapa por libro
- Exportar stock a CSV
- Vista de libros agotados para reposición
- Múltiples vendedores con login
