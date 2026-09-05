# Industry design system

Industry is a night-ground system: near-black grounds, one leaf-green accent, Outfit headings over Lato body text, generous 100px section rhythm and soft-cornered objects. Cards, buttons and figures are filled shapes rather than line drawings — rounded, low-lit, lifting a little on hover with an accent glow. Photography runs full colour behind dark gradient scrims; the accent is the only colour that carries meaning, so it marks the interactive layer and nothing else.

## How to use this

- Link the one stylesheet from every page — `<link rel="stylesheet" href="styles.css">` (adjust the relative path) — and take every color, font, spacing, radius and shadow from its variables (`var(--color-*)`, `var(--font-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)`). Never hard-code a hex, a font name or a px value the tokens already carry.
- Build with the classes below rather than inventing parallel ones.
- The whole system reads from the tokens at the top of `styles.css`. To change the look, edit them there — every page and this guide read from them — and keep the written guidance in step so it doesn't drift from what the CSS actually does.

## Direction

Full-width sections stacked on a black ground, each one 100px tall in padding and separated by a hairline accent rule, with content held to a 1400px `.container`. Section openings are centred: an 800-weight heading, a muted line under it, then the 80px accent `.section-separator` bar. Content below the opening is asymmetric — image beside text, or an auto-fitting card grid.

Objects are soft-cornered and filled: cards at 20px, media at `--radius-md`, buttons as full pills. Hover is a small lift (`translateY(-8px)` on cards, `-2px` on buttons) plus an accent glow — never a colour change alone. Photographs are never tinted; they sit at full saturation under a gradient scrim so type stays readable over them.

## Color

A black ground (`--color-bg` #000) with `--color-surface` #0a0a0a for raised panels, `--color-text` #f5f5f5, and a single leaf-green accent #6fd44a. Each role carries a 100–900 tonal ramp, 100 lightest to 900 darkest; the neutral ramp's dark tail is tuned to the grounds this system sits on rather than to an even lightness curve. `--color-accent-800` is the exact ink of the Bangalore Music Trust logo, and `--color-accent-2-*` is the deep-forest half of the same hue, for full-bleed fields behind reversed type. Use 300–400 for accent text on the dark ground (500 and darker do not carry enough contrast at body size), 500 as the interactive base, and 700–900 for fills behind light type. For elevation use `--shadow-sm/md/lg`, and `--shadow-glow` for the accent lift on hover.

## Type

Outfit for headings over Lato for body text, loaded as `--font-heading` / `--font-body`. Headings are clamped so they scale with the viewport without overflowing a 320px screen — `h1` runs 2.5rem → 5rem at weight 800 and −0.03em tracking. `h6` is the system's eyebrow: uppercase, 0.16em tracking, accent-coloured. Body copy is 16px at 1.6 line-height, dropping to 15px under 768px and 14px under 480px. Buttons and eyebrows set in Outfit, uppercase, with letter-spacing; paragraphs never are.

## Icons

Use Lucide icons (https://lucide.dev), at stroke-width 2 to match the weight of the type.

## Interaction states

Interactive states are themed, never browser defaults. Hover lifts and glows from the accent ramp; pressed states drop the lift (`translateY(0)`). Keyboard focus is `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px }` — never the default blue ring. Every hit target is at least 48px tall. `::selection` is the accent with the ground reversed out of it.

## Components

| Class | What it is |
| --- | --- |
| `.container`, `.section`, `.section-header`, `.section-separator`, `.section-title` | The page skeleton — 1400px measure, 100px rhythm, centred section openings |
| `.btn` with `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-block` | Pill actions; the primary is the accent gradient |
| `.tag` with `.tag-accent`, `.tag-accent-2`, `.tag-neutral`, `.tag-outline` | Small uppercase pills tinted from the ramps |
| `.field` + `label`, `.input`, `.radio` + `.dot`, `.seg` + `.seg-opt` | Form fields and choices on native elements — no script |
| `.card` with `.card-media`, `.card-plate`, `.card-badge`, `.card-content`, `.card-kicker`, `.card-title`, `.card-body`, `.card-meta` | Filled, soft-cornered cards that lift on hover |
| `.media` (+ `.media-ring`) | The photograph wrapper — owns the aspect ratio so nothing shifts while the file loads |
| `.nav` + `.nav-brand` | The header bar |
| `.table` | Data tables with an accent header row |
| `.dialog-backdrop` + `.dialog` (+ `.dialog-title/-body/-actions`) | A modal at the top elevation |
| `.skip-link`, `.visually-hidden` | Accessibility affordances every page should carry |
| `[data-reveal]` / `.in-view` | Opt-in scroll reveal, inert under `prefers-reduced-motion` |
| `.text-gradient`, `.text-muted`, `.text-dim`, `.text-accent` | The type colour roles |
| `.hr` | A horizontal rule — present, but this system prefers whitespace; avoid it |

## Do

- Give every image a `.media` (or `.card-media`) wrapper with an explicit `aspect-ratio`, so the layout is stable before the file arrives.
- Keep the accent for the interactive layer and one word of a heading; let photographs carry the colour.
- Scrim photographs rather than tinting them, and keep type off the busy half of the frame.
- Use `.card-plate` where a card's subject genuinely has no photograph yet — a designed accent plate, never an empty box.

## Don't

- Do not square the corners or flatten the fills — this system is soft-cornered and lit from within.
- Do not add a second decorative hue; the leaf green and the neutral ramp are the whole palette.
- Do not set `touch-action` or attach wheel/touch handlers to images or decorative layers — the page must stay scrollable wherever the gesture starts.
- Do not use accent 500 or darker for body-size text on the dark ground; step up to 300/400.

## Files

- `styles.css` — the only stylesheet: the token sheet (`:root` variables, ramps, base type) plus the component layer. Link it from every page.
- `readme.md` — this guide.
- `_adherence.oxlintrc.json` — the machine-readable record of the tokens and fonts the system provides.
