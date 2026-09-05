# Industry design system

Industry is a paper-ground system: white and warm off-white grounds, one deep green accent, a light-weight Garamond over a grotesque, a fluid section rhythm and squared corners. Cards, buttons and figures are held by hairlines rather than fills — flat, sharp-cornered, lifting a little on hover. Photography runs full colour under deep-green gradient scrims whose foot dissolves back into the paper; the green is the only colour that carries meaning, so it marks the interactive layer, the reversed fields and nothing else.

## How to use this

- Link the one stylesheet from every page — `<link rel="stylesheet" href="styles.css">` (adjust the relative path) — and take every color, font, spacing, radius and shadow from its variables (`var(--color-*)`, `var(--font-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)`). Never hard-code a hex, a font name or a px value the tokens already carry.
- Build with the classes below rather than inventing parallel ones.
- The whole system reads from the tokens at the top of `styles.css`. To change the look, edit them there — every page and this guide read from them — and keep the written guidance in step so it doesn't drift from what the CSS actually does.

## Direction

Full-width sections stacked on a white ground, each one `--section-y` tall in padding and separated by a hairline rule, with content held to a 1280px `.container`. Section openings are centred: a 300-weight heading, a muted line under it, then the 64px `.section-separator` hairline. Content below the opening is asymmetric — image beside text, or an auto-fitting card grid.

Objects are squared and flat: `--radius-sm/md/lg` are all `0`, and only portraits and icon wells round, setting `50%` directly. Hover is a small lift (`translateY(-6px)` on cards, `-2px` on buttons) plus a hairline that warms towards the accent — never a fill change alone. Photographs are never tinted; they sit at full saturation under a deep-green gradient scrim so type stays readable over them, and the scrim's last stop is `--color-bg` so a hero hands off to the page instead of ending on a hard edge.

## Color

A white ground (`--color-bg` #ffffff) with `--color-surface` #f6f9f4 for tinted bands, `--color-text` #14231a, and a single deep green accent #1f5137. Each role carries a 100–900 tonal ramp, 100 lightest to 900 darkest. Because the ground is light the ramp is read from the dark end: **700 is the interactive base** (500 and lighter cannot carry white type), 800–900 are the fills behind reversed copy, and 100–300 are the tint fields. `--color-accent-2-*` is the deeper, cooler half of the same hue, for the full-bleed fields and the footer.

Read body copy off the semantic tokens — `--color-text`, `--color-text-muted`, `--color-text-dim`, `--color-on-accent` — rather than reaching into the neutral ramp, so retuning the ground cannot silently wash out a paragraph. For elevation use `--shadow-sm/md/lg`, all long and low-opacity, and `--shadow-glow` for the accent lift on a primary button.

## Type

Cormorant Garamond for headings over Manrope for body text, loaded as `--font-heading` / `--font-body` — two families, no third. Headings are clamped so they scale with the viewport without overflowing a 320px screen: `h1` runs 2.75rem → 5.25rem at weight 300 and −0.03em tracking, `h2` 2.1rem → 3.5rem at 300, `h3` 1.4rem → 2rem at 400. Body copy is 16.5px at 1.75 line-height, dropping to 15.5px under 768px and 15px under 480px.

The label role does the work a third monospace family would otherwise do: `--font-body` at `--label-size` (0.72rem), `--label-weight` (600) and `--label-tracking` (0.22em), uppercase. It carries eyebrows, `h6`, buttons, card kickers, table heads, form labels and captions. Paragraphs and headings are never tracked out or uppercased.

## Icons

Use Lucide icons (https://lucide.dev), at stroke-width 2 to match the weight of the type.

## Interaction states

Interactive states are themed, never browser defaults. Hover lifts and warms the hairline towards the accent; pressed states drop the lift (`translateY(0)`). Text actions (`.btn-ghost`, and the page-level nav links) use a rule that wipes in from the left rather than a colour change. Keyboard focus is `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px }` — never the default blue ring. Every hit target is at least 48px tall. `::selection` is the accent with white reversed out of it.

## Components

| Class | What it is |
| --- | --- |
| `.container`, `.section`, `.section-header`, `.section-separator`, `.section-title` | The page skeleton — 1280px measure, fluid `--section-y` rhythm, centred section openings |
| `.btn` with `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-block` | Squared actions; the primary is the solid accent, `.btn-outline` is the reversed pair for use over photography |
| `.tag` with `.tag-accent`, `.tag-accent-2`, `.tag-neutral`, `.tag-outline` | Small uppercase chips tinted from the ramps |
| `.field` + `label`, `.input`, `.radio` + `.dot`, `.seg` + `.seg-opt` | Form fields and choices on native elements — no script. `.input` is a ruled underline, not a box |
| `.card` with `.card-media`, `.card-plate`, `.card-badge`, `.card-content`, `.card-kicker`, `.card-title`, `.card-body`, `.card-meta` | White, hairline-held cards that lift on hover |
| `.media` (+ `.media-ring`) | The photograph wrapper — owns the aspect ratio so nothing shifts while the file loads |
| `.nav` + `.nav-brand` | The header bar |
| `.table` | Data tables with an accent header row |
| `.dialog-backdrop` + `.dialog` (+ `.dialog-title/-body/-actions`) | A modal at the top elevation |
| `.skip-link`, `.visually-hidden` | Accessibility affordances every page should carry |
| `[data-reveal]` / `.in-view` | Opt-in scroll reveal, inert under `prefers-reduced-motion`. Inside a `.split-media` the figure also wipes up and settles back from a slight over-scale |
| `.text-gradient`, `.text-muted`, `.text-dim`, `.text-accent` | The type colour roles; `.text-gradient` is the Garamond italic tinted with the accent, for one phrase of a heading |
| `.hr` | A horizontal rule — present, but this system prefers whitespace; avoid it |

## Do

- Give every image a `.media` (or `.card-media`) wrapper with an explicit `aspect-ratio`, so the layout is stable before the file arrives.
- Keep the accent for the interactive layer, the reversed fields and one phrase of a heading; let photographs carry the colour.
- Scrim photographs rather than tinting them, and end the scrim on `--color-bg` so the image hands off to the page.
- Reverse the tint components — `.tag-accent`, and any page-level note or chip — when they sit inside a deep-green field, or a panel meant to whisper becomes the brightest thing in the band.
- Use `.card-plate` where a card's subject genuinely has no photograph yet — a designed tint plate, never an empty box.

## Don't

- Do not round the corners or add fills back — this system is squared and flat, held by hairlines.
- Do not add a second decorative hue; the deep green and the neutral ramp are the whole palette.
- Do not add a third font family; the label role is `--font-body` tracked out, and that is deliberate.
- Do not set `touch-action` or attach wheel/touch handlers to images or decorative layers — the page must stay scrollable wherever the gesture starts.
- Do not use accent 500 or lighter behind white type on this light ground; step down to 700 and darker.

## Files

- `styles.css` — the only stylesheet: the token sheet (`:root` variables, ramps, base type) plus the component layer. Link it from every page.
- `readme.md` — this guide.
- `_adherence.oxlintrc.json` — the machine-readable record of the tokens and fonts the system provides.
