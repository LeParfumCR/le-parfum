# Le Parfum — Proyecto web

Perfumería online construida con Astro. Sitio 100% estático, catálogo en JSON,
administrable sin código a través de un panel visual (Decap CMS).

## Estructura del proyecto

```
le-parfum/
├── src/
│   ├── pages/          → cada archivo aquí es una página del sitio
│   ├── components/     → piezas reutilizables (ej. ProductCard)
│   ├── layouts/         → plantilla base compartida (SEO, tipografía)
│   ├── styles/           → tokens.css = sistema de diseño (colores, tipografía)
│   ├── data/
│   │   └── perfumes.json  → EL CATÁLOGO. Fuente única de verdad.
│   ├── scripts/           → lógica JS (buscador, favoritos — próximas fases)
│   └── utils/              → funciones auxiliares
├── public/
│   ├── images/perfumes/    → fotos de productos (subidas por el CMS o manual)
│   └── admin/                → panel de Decap CMS
```

## Cómo correr el proyecto en tu computadora

```bash
npm install
npm run dev
```

Abre `http://localhost:4321` en el navegador. Cada vez que guardes un archivo,
la página se actualiza sola.

## Cómo agregar/editar perfumes SIN tocar código

Una vez publicado el sitio en Netlify (ver abajo), entra a:

```
tudominio.com/admin
```

Ahí vas a ver un panel con botón "Nuevo Perfume", campos para nombre, precio,
categoría, disponibilidad, e imagen (arrastrar y soltar). Al publicar, el
cambio se sube automáticamente al catálogo y el sitio se reconstruye solo.

**Importante:** el panel de administración (`/admin`) solo funciona una vez
el sitio está en Netlify con "Identity" y "Git Gateway" activados — se
configura en 2 clics desde el panel de Netlify. Te guío en ese paso cuando
lleguemos a publicar.

## Próximas fases (aún no implementadas, arquitectura ya preparada para esto)

- Página individual de cada producto (`/producto/[slug]`)
- Filtros y buscador
- Favoritos (guardado local en el navegador)
- Diseño final del Home (esta versión es funcional, no la versión visual definitiva)
- Panel administrativo avanzado, carrito, pagos — cuando exista backend
