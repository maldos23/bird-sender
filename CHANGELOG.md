# Changelog

All notable changes to bird-sender are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-05-28

### Added
- Light/dark theme toggle with `localStorage` persistence and `prefers-color-scheme` detection.
- CSS token system with `[data-theme="dark"]` and `[data-theme="light"]` for easy color scaling.
- Password visibility toggle with animated eye/eye-off icon in the password modal.
- Full `prefers-reduced-motion` support for motion-sensitive users.
- Vercel deployment with live demo link.
- `CHANGELOG.md` and Changelog section on GitHub Pages.

### Improved
- Color palette migrated from pure `#000`/`#fff` to OKLCH with tinted neutrals (blue-gray base).
- Micro-interactions: button hover lift, peer/transfer staggered entrance, progress bar shimmer, drop-zone glow.
- A11y: `aria-label`, `aria-live`, `role`, `aria-modal`, `inert` on modals, focus trap, Escape key closes modals.
- Logo SVG now uses CSS variables (`--logo-circle` / `--logo-stroke`) -- visible in both themes.
- Completely flat design with no borders or shadows -- components are distinguished by background contrast.
- CSS restructured with duration tokens (`--duration-fast/base/slow/entrance`) and easing tokens (`--ease-out-quart/expo`).
- Responsive: 480px breakpoint with stacked layout, full-width buttons on mobile.
- Drop-zone migrated from `<div>` to `<button>` for native keyboard support.
- File-chip remove buttons are `<button>` elements with `aria-label`.

### Fixed
- OKLCH comma syntax (`oklch(0.15, 0.005, 258)`) caused transparent colors in Chromium. Fixed to space syntax (`oklch(0.15 0.005 258)`).
- White logo invisible on light theme -- now uses per-theme tokens.
- `outline: none` without replacement on inputs -- focus now shows background color change.
- Modals lacked focus trap -- now use `inert` on `<main>`.
- Password modal lacked visibility toggle.

---

## [1.0.0] - 2025-04-12

### Added
- Real-time file transfer via WebSocket over local network.
- Custom binary protocol with 27-byte headers and 64 KB chunks.
- End-to-end encryption with AES-GCM 256-bit for password-protected transfers.
- PBKDF2 key derivation with 100,000 iterations and SHA-256.
- Nickname support to identify devices on the network.
- Express + ws relay server (no file storage).
- GitHub Pages landing page (`docs/index.html`).
- Unit tests with Jest and E2E tests with Cypress.
- CI/CD with GitHub Actions.

---

## Versioning

| Change type         | Version bump |
|---------------------|-------------|
| Breaking change     | `2.0.0`     |
| New feature         | `1.1.0`     |
| Bug fix / polish    | `1.0.1`     |

Each release is published as a git tag (`v1.0.0`, `v1.1.0`, etc.) with release notes on [GitHub Releases](https://github.com/maldos23/bird-sender/releases).
