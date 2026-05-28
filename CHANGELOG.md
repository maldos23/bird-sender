# Changelog

Todas las mejoras notables de bird-sender documentadas aqui.

El formato sigue [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), y el proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-05-28

### Agregado
- Toggle de tema claro/oscuro con persistencia en `localStorage` y deteccion de `prefers-color-scheme`.
- Sistema de tokens CSS con `[data-theme="dark"]` y `[data-theme="light"]` para escalar colores facilmente.
- Toggle de visibilidad de password con icono animado (ojo/eye-off) en el modal de contrasena.
- Soporte completo de `prefers-reduced-motion` para usuarios con sensibilidad al movimiento.
- Deploy en Vercel con link al demo en vivo.
- `CHANGELOG.md` y seccion Changelog en GitHub Pages.

### Mejorado
- Paleta de colores migrada de `#000`/`#fff` puro a OKLCH con neutros tintados (azul-gris).
- Micro-interacciones: hover lift en botones, stagger entrance en peers/transfers, shimmer en progress bars, glow en drop-zone activo.
- A11y: `aria-label`, `aria-live`, `role`, `aria-modal`, `inert` attribute en modales, focus trap, tecla Escape cierra modales.
- Logo SVG ahora usa variables CSS (`--logo-circle` / `--logo-stroke`) -- visible en ambos temas.
- Diseno completamente plano sin bordes ni sombras -- los componentes se distinguen por contraste de fondo.
- Estructura del CSS reorganizada con tokens de duracion (`--duration-fast/base/slow/entrance`) y easing (`--ease-out-quart/expo`).
- Responsive: breakpoint a 480px con layout stacked, botones full-width en mobile.
- Drop-zone migrada de `<div>` a `<button>` para soporte nativo de teclado.
- File-chip remove buttons son `<button>` con `aria-label`.

### Corregido
- OKLCH con sintaxis de comas (`oklch(0.15, 0.005, 258)`) causaba colores transparentes en Chromium. Corregido a sintaxis con espacios (`oklch(0.15 0.005 258)`).
- Logo blanco invisible en tema claro -- ahora usa tokens por tema.
- `outline: none` sin reemplazo en inputs -- ahora el focus muestra cambio de background.
- Modales no tenian focus trap -- ahora usan `inert` en `<main>`.
- Password modal no tenia toggle de visibilidad.

---

## [1.0.0] - 2025-04-12

### Agregado
- Transferencia de archivos en tiempo real via WebSocket en red local.
- Protocolo binario personalizado con headers de 27 bytes y chunks de 64 KB.
- Cifrado extremo a extremo con AES-GCM 256-bit para transferencias protegidas por contrasena.
- Derivacion de clave PBKDF2 con 100,000 iteraciones y SHA-256.
- Soporte de nicknames para identificar dispositivos en la red.
- Servidor relay Express + ws (sin almacenamiento de archivos).
- GitHub Pages landing page (`docs/index.html`).
- Tests unitarios con Jest y E2E con Cypress.
- CI/CD con GitHub Actions.

---

## Como funciona el versionado

| Tipo de cambio      | Version bump |
|---------------------|-------------|
| Breaking change     | `2.0.0`     |
| Nueva feature       | `1.1.0`     |
| Bug fix / polish    | `1.0.1`     |

Cada release se publica como tag de git (`v1.0.0`, `v1.1.0`, etc.) con sus notas en [GitHub Releases](https://github.com/maldos23/bird-sender/releases).
