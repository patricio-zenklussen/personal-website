# Phase 2 — UX, Legibilidad y Navegación Multi-Dispositivo

## Overview

Phase 2 consolidó el sitio en tres frentes principales:

1. **Refinamiento de arquitectura UI** (menú, paneles y jerarquía de contenido).
2. **Legibilidad editorial real** para textos largos (posts extensos).
3. **Navegación móvil/tablet tipo “pantallas apiladas”** con transición direccional suave, manteniendo desktop intacto.

El resultado es un sitio más consistente, más accesible y más robusto en distintos tamaños de viewport.

## Cambios Implementados

## 1) Estructura y navegación principal

- Se eliminó **CV** del menú principal y su panel intermedio en Columna 2.
- **ABOUT** conserva el acceso a CV desde el link interno (`CV →`) en formato detalle (Columna 3).
- En ABOUT, `READ MORE` y `CV` quedaron en stack vertical (ya no en la misma línea).
- Se renombró `ABOUT THIS SITE` a `THIS SITE` (botón + título del panel).
- Se ajustó el comportamiento de click en el nombre:
  - `PATRICIO ZENKLUSSEN` funciona como **HOME reset** (vuelve al estado inicial de columnas).

## 2) Ajustes de contenido/espaciado en columnas

- Corrección de alineación inicial en Columna 3:
  - Regla global: `.prose > *:first-child { margin-top: 0; }`.
- Se quitó `ROMPE EL VIDRIO` de Columna 1 (quedó fuera del menú lateral).
- Se organizaron “grupos” de enlaces en Columna 1:
  - `ABOUT/BLOG` agrupados.
  - `CONTACT` separado.
  - bloque de redes separado.
  - `THIS SITE` + `THEME` al pie.
- Espaciado de Columna 1 alineado con el ritmo del resto del sitio mediante variables.

## 3) Legibilidad editorial (posts largos)

- Escala tipográfica ajustada para lectura real de artículos extensos.
- Se aumentó el ancho utilizable del cuerpo de lectura:
  - `.prose` y encabezado del post (`.post-header`) comparten el mismo ancho.
- Mejoras en ritmo tipográfico:
  - interlineado y spacing de párrafos/listas.
  - refinamiento de `blockquote`.
  - estilo para `h4` (metadatos editoriales).
  - reglas de imagen en prosa (`max-width`, márgenes, bloque).
- Encabezado de post mejor jerarquizado:
  - fecha separada de la bajada.
  - bajada (`post-lead`) más visible y consistente con el bloque header.

## 4) Sistema de color y favicon dinámico

- El favicon dejó de ser estático cyan:
  - ahora se genera dinámicamente y cambia color según tema activo.
  - sincronizado tanto en carga inicial como en cada rotación de tema.
- Se mantuvo consistencia de paletas y contraste entre texto, heading, muted y accent.

## 5) Navegación móvil/tablet (cambio mayor)

Se reemplazó el stack vertical de columnas por una navegación de **una pantalla por vez**:

- Columna 1 visible al entrar.
- Al navegar:
  - Col 1 -> Col 2 (ABOUT/BLOG/THIS SITE),
  - Col 2 -> Col 3 (READ MORE/CV/post).
- Siempre una sola columna ocupa el viewport completo.
- `BACK` vuelve al nivel anterior (3->2, 2->1).
- Click en nombre vuelve a HOME.

### Motion

- Slide horizontal direccional con curvas refinadas:
  - ida (forward): suave y progresiva.
  - vuelta (back): orgánica y consistente con el lenguaje desktop.
- Sensación general “buttery smooth”, evitando look snappy.

### Cobertura de dispositivos

El modo stack ahora cubre:

- móviles,
- tablets,
- viewports táctiles intermedios/anchos,
- layouts compactos en landscape.

Se añadieron ajustes para:

- `dvh` (viewport dinámico móvil),
- `safe-area insets` (notch/bordes),
- compact-height touch layouts.

## 6) Easter Egg del nombre

- Frase actualizada a: `LIKE CLICKING?`
- Umbral reducido: 3 clics (antes 5).
- Duración reducida: 3 segundos.
- Se removió el efecto de brillo pulsante (por preferencia final).
- Quedó limpio: cambio de texto + color, con transición simple.

## Archivos Clave Tocadas en Phase 2

- `src/pages/index.astro`
- `src/styles/global.css`
- `src/scripts/navigation.ts`
- `src/scripts/theme.ts`
- `src/scripts/scramble.ts`
- `src/layouts/Base.astro`

(También se actualizó contenido editorial del blog con entradas reales en `src/content/blog/`.)

## Estado Final de Phase 2

- Desktop mantiene su layout y comportamiento base.
- Mobile/tablet ahora comparten una navegación clara, jerárquica y consistente.
- Lectura de textos largos mejorada con criterios editoriales.
- Tema visual y microinteracciones más pulidas.
- Sitio listo como snapshot de referencia para inicio de Phase 3.
