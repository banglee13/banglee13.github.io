---
version: alpha
name: Shirone
description: A soft, anime-oriented personal blog built on Material 3 Expressive foundations.
colors:
  primary: "oklch(42% 0.16 315)"
  secondary: "oklch(52% 0.13 20)"
  tertiary: "oklch(50% 0.12 215)"
  surface: "oklch(96% 0.012 315)"
  surface-container-low: "oklch(96.5% 0.01 315)"
  surface-container: "oklch(94% 0.015 315)"
  surface-container-high: "oklch(92% 0.02 315)"
  on-surface: "oklch(16% 0.02 315)"
  on-surface-variant: "oklch(34% 0.03 315)"
  outline: "oklch(45% 0.03 315)"
  outline-variant: "oklch(76% 0.02 315)"
  error: "oklch(57% 0.21 27)"
  on-primary: "oklch(99% 0.02 315)"
typography:
  display:
    fontFamily: "var(--font-sans)"
    fontSize: 2.75rem
    fontWeight: 700
    lineHeight: 1.18
  headline:
    fontFamily: "var(--font-sans)"
    fontSize: 1.5rem
    fontWeight: 500
    lineHeight: 1.33
  title:
    fontFamily: "var(--font-sans)"
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "var(--font-sans)"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "var(--font-sans)"
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.33
  label:
    fontFamily: "var(--font-sans)"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.43
  code:
    fontFamily: "var(--font-mono)"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 28px
  full: 999px
spacing:
  unit: 4px
  compact: 8px
  control: 12px
  section: 24px
  content: 32px
  page: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.control}"
  button-tonal:
    backgroundColor: "var(--secondary-container)"
    textColor: "var(--on-secondary-container)"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.control}"
  card:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section}"
  input:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.control}"
  state-layer:
    backgroundColor: "color-mix(in oklab, var(--on-surface) 8%, transparent)"
  code-block:
    backgroundColor: "var(--codeblock-bg)"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "{spacing.section}"
---

## Overview

Shirone is a personal anime blog that treats reading as the primary interaction. Its visual language is **soft material editorial**: expressive enough to feel personal, restrained enough to keep long-form writing comfortable. Material 3 Expressive supplies the interaction grammar, while the anime character comes from the chosen wallpaper, dynamic hue, rounded geometry, and typography rather than from decorative UI chrome.

The interface should feel calm on a first visit and efficient on a repeat visit. A reader should be able to identify the current page, scan post metadata, open an article, and return to navigation without learning a new control language.

The tokens above document the runtime CSS variables rather than replacing them with fixed brand colors. HCT dynamic color is intentional: the configured seed hue, style, color specification, and light/dark mode produce the final palette in the browser.

## Colors

The palette is a tonal surface system, not a fixed swatch collection.

- **Primary** drives the active page, primary actions, links, progress, and the small accents that help a reader orient themselves.
- **Secondary** provides selection and grouping states such as tonal chips, tabs, filters, and navigation indicators.
- **Tertiary** is a supporting accent for expressive content and semantic distinctions. It should not compete with the primary reading path.
- **Surface** and its container levels establish depth through tonal elevation. Content surfaces should be distinct from the page background without looking like a collection of floating marketing cards.
- **On-surface** is the default reading color. **On-surface-variant** is reserved for metadata, supporting text, and secondary controls.
- **Error** is reserved for failed actions, validation, protected-content errors, and other states that require attention.

Never replace semantic tokens with a hard-coded black, white, or brand hex value. The only fixed colors allowed in the application are content-specific image overlays where contrast must be stable over arbitrary imagery.

## Typography

Typography is friendly and readable, with the configured body role for prose, the CJK role for Chinese, Japanese, and Korean text, and the mono role for code. The default pairing is Outfit for Latin UI text, Yozai Medium for CJK text, and JetBrains Mono for code.

- **Display** belongs to the home banner and major page identity only. It must not leak into compact panels, sidebars, or utility controls.
- **Headline** establishes article and page hierarchy with modest scale differences. Shirone favors rhythm and readable measure over oversized promotional type.
- **Title** is used for card and section headings.
- **Body** is the default long-form reading style. Keep line-height generous and avoid dense all-caps treatments in prose.
- **Label** is for controls, metadata, filters, and navigation. It should remain scannable without becoming visually louder than article titles.
- **Code** uses the mono role and remains visually distinct through surface treatment and spacing rather than excessive color.

Do not introduce a new font family for an isolated component. Font roles are configured centrally and are subset during production builds.

## Layout

Shirone uses a responsive reading frame. On small screens, content becomes a single vertical flow with navigation and sidebar widgets stacked around the article. On desktop, the main content is paired with a persistent sidebar; the optional dual arrangement expands to a three-column frame only when the secondary column contains enabled widgets.

The banner and top app bar form the site identity layer. The article or page content remains the visual priority below it. The main reading column should never be squeezed by decorative elements, and the page should preserve a visible continuation of content below the first viewport.

Spacing follows a 4px base grid. Use the named M3E spacing variables for component padding and gaps. Use the responsive layout utilities for columns and page width instead of adding one-off breakpoint values in individual components.

## Elevation & Depth

Depth comes from tonal elevation first and shadow second. Surface container levels are the primary way to separate the page, cards, floating panels, navigation, and transient feedback. M3E elevation tokens provide the corresponding shadow only where an element needs physical separation from its surroundings.

- Page background: `--page-bg`.
- Content and card surfaces: `--card-bg` or the appropriate surface container token.
- Floating panels: `--float-panel-bg` with the matching M3E elevation level.
- Snackbar and inverse feedback: inverse surface roles.

Avoid glass effects, heavy blur, gratuitous glow, and stacked cards. A card is a genuinely framed repeated item or tool, not a default wrapper for every section. When a section needs hierarchy, use whitespace, a heading, a divider, or a tonal change first.

## Shapes

Shirone uses a rounded but disciplined shape language. Buttons, inputs, and ordinary controls use `--shape-corner-m`; cards use `--shape-corner-l`; dialogs and large sheets use `--shape-corner-xl`; chips and selected indicators use `--shape-corner-full`. The shape contract is part of the component API and should not be bypassed with arbitrary radius values.

Rounded geometry supports the anime-blog personality, but it does not turn every element into a pill. Reserve full rounding for chips, toggles, indicators, avatars, and controls whose semantics call for a compact capsule.

## Components

Components are organized as atoms, molecules, organisms, layouts, and pages. Dependencies flow upward: atoms consume tokens, molecules combine atoms, organisms own business state and route synchronization, layouts own page skeletons, and pages shape route data.

Use the existing M3E components before creating a new one. Interaction feedback belongs to `.m3-state-layer`, which standardizes hover, focus, and pressed overlays and the focus-visible outline. Interactive controls must retain native keyboard and semantic behavior.

- **Top app bar and navigation:** use the persistent shell components. Route-dependent shell state must synchronize through Swup lifecycle events.
- **Post cards and article content:** keep the article title, metadata, cover, and entry action independently accessible. Do not wrap a card containing links in another link.
- **Sidebar widgets:** remain data-driven and obey page filters. Disabled optional widgets output no DOM, make no network requests, and add no main-bundle dependency.
- **Forms and overlays:** use the existing TextField, Select, Dialog, Sheet, Snackbar, and Tooltip primitives with their tokenized focus, motion, and shape behavior.
- **Media:** real content imagery is the visual signal. Do not use darkened or abstract imagery when the reader needs to inspect the subject.

## Do's and Don'ts

- **Do** keep the reading path obvious: page identity, content, metadata, navigation.
- **Do** preserve SSR output for static content and hydrate only behavior that needs a browser.
- **Do** respect `prefers-reduced-motion` and the project motion tokens.
- **Do** keep optional integrations truly optional with zero burden when disabled.
- **Do** use i18n keys for all user-visible component copy across all locale modules.
- **Do** let dynamic HCT colors follow the configured hue and light/dark mode.
- **Don't** add marketing-style hero sections to ordinary blog pages.
- **Don't** use gradients, decorative blobs, glassmorphism, or heavy shadows as the default visual language.
- **Don't** hard-code colors, radii, typography, breakpoints, or animation durations in components.
- **Don't** create nested cards or use cards as generic page-section wrappers.
- **Don't** add an interaction without its disabled, focus, keyboard, loading, and reduced-motion behavior where applicable.
- **Don't** introduce a new component layer, reverse dependency, or route-owned persistence shortcut.