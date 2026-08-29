# Bengaluru Music Trust — Image Requirements Brief

Audit date: 29 August 2026
Source audited: `Bengaluru Music Trust.dc.html` (all six views: Home, Concert detail, Classes & workshops, About, Venue, Contact)
No code was changed to produce this document.

---

## 0. Audit notes — what needs an image and what deliberately does not

**Ten image locations exist in the design.** Each is already a fixed-size container with its ratio and cropping behaviour set, so a delivered photograph drops in without any layout change.

Areas that are **intentionally image-free** — do not commission photography for these:

| Area | Why no image |
|---|---|
| Top utility bar / header / footer | Text and links only; no image region in the design |
| Stats band (340 students, 26 teachers…) | Numerals are the graphic |
| Navy testimonial band (Ananya R. quote) | Typographic pull-quote; no avatar frame exists. Adding a face would need a layout change |
| "What we run" / "Coming up" section headings | Rules and type only |
| Concert programme list, governance table, venue facts list, contact form | Structured text |
| Trust logo mark (circle + dot, top left) | Vector, already drawn in code. **If the client has a real logo, that is a separate asset request — not a photograph** |

The brand palette every photograph must sit against: deep navy `#2B3A67`, cool bone ground `#F6F6F4`, white cards `#FFFFFF`, warm rust accent `#7A3B2E`, near-black text `#16181C`. Typography is Spectral (serif headlines) over Public Sans. The register is **modern institutional but warm** — considered, well-lit, unfussy. Not glossy commercial stock, not moody art photography.

Location is Bengaluru — Richmond Town. Cast, dress, architecture and instruments should read as **Indian, and specifically South Indian urban**, mixing Hindustani and Carnatic classical with guitar and percussion.

---

## 1. Image inventory

| # | Page | Section | Image name | Purpose | Required subject | Orientation | Aspect ratio | Approx. dimensions (display) | Priority |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Home | Hero, right column | `home-hero-rehearsal-room.jpg` | Main hero visual, sits beside the headline "A place in Bengaluru to learn music, and to be heard." | Three or four students mid-rehearsal in a bright teaching room, instruments in hand, one leaning in to listen to another | Portrait | ~24:25 (near square, marginally tall) | 500 × 520 px | **High** |
| 2 | Home | "What we run" card 1 | `programme-classes-group-lesson.jpg` | Card thumbnail for *Classes & workshops* | A teacher working with a small seated group; hands, faces and one instrument all readable | Landscape | ~2.1:1 | 353 × 170 px | High |
| 3 | Home | "What we run" card 2 | `programme-concerts-hall-performance.jpg` | Card thumbnail for *Concert series* | The hall mid-concert seen from the side — performers lit, first rows of audience in silhouette | Landscape | ~2.1:1 | 353 × 170 px | High |
| 4 | Home | "What we run" card 3 | `programme-grants-empty-hall-rehearsal.jpg` | Card thumbnail for *Grants & residencies* | Two musicians rehearsing alone in the empty hall, house lights up, chairs stacked or bare | Landscape | ~2.1:1 | 353 × 170 px | High |
| 5 | Concert detail | Hero band under the title | `concert-term-end-ensembles.jpg` | Wide banner for the term-end student concert page | Wide view of a student ensemble on stage from the middle of the audience; several performers, a full stage picture | Landscape (wide) | ~2.8:1 | 1116 × 400 px | High |
| 6 | Classes & workshops | Hero, right column | `classes-hero-teacher-and-student.jpg` | Supporting visual beside "Classes & workshops" | One teacher and one student at close range — a correction being given, hands on the instrument | Landscape | 3:2 | 450 × 300 px | **High** (this is the page the enrol button leads to) |
| 7 | About | Trustees, card 1 | `trustee-01-meera-iyengar-chair.jpg` | Portrait of the Chair | Individual portrait — head and shoulders | Portrait | ~9:8 (near square, slightly tall) | 259 × 230 px | Medium |
| 8 | About | Trustees, card 2 | `trustee-02-s-raghavan-education.jpg` | Portrait of Trustee, education | Individual portrait — head and shoulders | Portrait | ~9:8 | 259 × 230 px | Medium |
| 9 | About | Trustees, card 3 | `trustee-03-nandita-bose-finance.jpg` | Portrait of Trustee, finance | Individual portrait — head and shoulders | Portrait | ~9:8 | 259 × 230 px | Medium |
| 10 | About | Trustees, card 4 | `trustee-04-joel-fernandes-artists.jpg` | Portrait of Trustee, artists | Individual portrait — head and shoulders | Portrait | ~9:8 | 259 × 230 px | Medium |
| 11 | Venue & directions | Hero band | `venue-hall-entrance.jpg` | Establishing shot for "Finding us" | The building entrance from the street, or the hall interior looking towards the stage | Landscape (wide) | ~8:3 | 1116 × 420 px | Medium |

Numbering runs 1–11 because the three programme cards are three distinct images; total distinct files: **11**.

All containers use `object-fit: cover`, so **every image is centre-cropped to fill**. Anything important near an edge will be cut.

---

## 2. Generation prompts

Copy each prompt as-is. Every prompt ends with the aspect ratio; adjust the ratio flag to your tool's syntax.

---

### 1 · `home-hero-rehearsal-room.jpg` — Home hero

> Documentary editorial photograph of four young Indian music students, roughly ages 16 to 24, rehearsing together in a bright first-floor teaching room in Bengaluru. One student stands with a violin under her chin mid-phrase; two are seated on simple wooden chairs, one with a classical guitar, one with a tanpura resting upright against the shoulder; the fourth leans in slightly, listening with head tilted. Candid unposed interaction, nobody looking at the camera. Room has plain pale plastered walls, a tall window on the left throwing soft diffused daylight across the group, a worn wooden floor, a music stand and a stacked chair visible at the edges. Vertical composition, camera at seated eye level, three-quarter medium-wide framing showing the group from mid-thigh up with headroom above. Subjects grouped in the central and lower two-thirds of the frame. Natural window light only, soft directional falloff, no flash, no coloured gels. Warm, focused, unhurried mood — people concentrating, not performing for a lens. Muted neutral colour palette: bone whites, warm wood, soft indigo and rust in the clothing, low overall saturation. Shallow-but-not-extreme depth of field, background gently soft. Fine natural film grain, 35mm prime look. No text, no logos, no watermarks, no visible branding. Aspect ratio 24:25 (near square, slightly vertical).

**Important cropping considerations:** the container is a tall near-square (500 × 520) and crops from the centre. Keep the whole group inside the **central 80%** of the frame both horizontally and vertically. No faces in the top 10% or bottom 10%. Do not let the violin's scroll or the guitar's headstock touch a frame edge — instruments crossing the boundary read as an error. There is **no text over this image**, so it does not need negative space; it can be dense and full.

**File requirements:** 24:25 · minimum 1600 × 1670 px · portrait · JPEG (quality 85) · `home-hero-rehearsal-room.jpg`

---

### 2 · `programme-classes-group-lesson.jpg` — "Classes & workshops" card

> Editorial documentary photograph of an Indian music teacher in her forties teaching four seated students, ages roughly 12 to 20, in a plain bright teaching room in Bengaluru. The teacher stands to the right of the frame, hand raised marking a beat; the students sit in a shallow arc facing her, one holding a violin, one with a notebook, two singing. Candid, mid-lesson, nobody addressing the camera. Soft daylight from a window out of frame at the left, plain pale wall behind, wooden floor. Strongly horizontal composition, camera at standing chest height looking slightly down, medium-wide framing. All heads sit along the vertical middle third of the frame. Muted warm neutral palette, low saturation, bone and wood tones with soft indigo clothing accents. Natural light only, no flash. Warm and attentive mood. Subtle film grain, 35mm look. No text, no logos, no watermarks. Aspect ratio 2.1:1 (wide letterbox).

**Important cropping considerations:** the card crop is a **shallow 353 × 170 letterbox** — brutally short vertically. Every face must sit within the **middle 50% of the frame height**. Nothing important in the top or bottom quarter. Compose as if shooting for a panoramic band from the start; a normal 3:2 frame will lose all heads.

**File requirements:** 2.1:1 · minimum 1400 × 670 px · landscape · JPEG (quality 85) · `programme-classes-group-lesson.jpg`

---

### 3 · `programme-concerts-hall-performance.jpg` — "Concert series" card

> Editorial photograph of a small classical Indian music concert in progress in an intimate hall seating about a hundred and twenty people, Bengaluru. Three performers seated cross-legged on a low carpeted platform — a vocalist centre, a violinist to her right, a mridangam player to her left — warmly lit from above by simple stage lights. The first two rows of audience appear as dark silhouetted heads across the bottom edge of the frame. Shot from the side of the auditorium, camera at seated audience height, wide horizontal framing taking in the platform and the plain dark backdrop behind it. Performers occupy the central band of the frame. Warm tungsten stage light against a deep neutral dark background, strong but soft contrast, no coloured stage wash, no haze machine, no spotlight flare. Dignified, absorbed, intimate mood. Muted palette: warm amber light, deep navy-black shadow, low saturation. Fine natural grain, fast prime lens look. No text, no logos, no watermarks, no captions. Aspect ratio 2.1:1 (wide letterbox).

**Important cropping considerations:** shallow 353 × 170 crop from the centre. Keep the performers' heads and hands within the **middle 50% of frame height**. Audience silhouettes may be sacrificed by the bottom crop — that is fine, but do not put a performer's face in the lower quarter. The dark backdrop is an advantage here: this card sits on a white surface, so a dark image reads with good contrast.

**File requirements:** 2.1:1 · minimum 1400 × 670 px · landscape · JPEG (quality 88 — dark gradients need the extra data) · `programme-concerts-hall-performance.jpg`

---

### 4 · `programme-grants-empty-hall-rehearsal.jpg` — "Grants & residencies" card

> Editorial documentary photograph of two young Indian musicians rehearsing alone in an otherwise empty hundred-and-twenty-seat hall in Bengaluru, house lights up rather than stage lights. One sits at a tuned wooden upright piano at the right of the frame, the other stands beside it with a classical guitar, both looking at a shared score on the piano's music desk. Rows of empty wooden chairs stretch across the foreground and middle distance; a stacked chair tower stands against the far wall. Wide horizontal composition, camera at standing height from the back of the hall, deep perspective down the room. The two figures sit in the central-right third. Flat even daylight-balanced house lighting, gentle shadows, no drama. Quiet, spacious, work-in-progress mood — the feeling of time and room to practise. Muted neutral palette, bone walls, warm wood, low saturation. Natural grain, 35mm look. No text, no logos, no watermarks. Aspect ratio 2.1:1 (wide letterbox).

**Important cropping considerations:** shallow 353 × 170 centre crop. Place both musicians squarely in the **middle 50% of frame height** and inside the **central 70% horizontally** — the left and right extremes will be trimmed. The empty chairs are the point of the picture; keep at least one clear row visible in the surviving central band.

**File requirements:** 2.1:1 · minimum 1400 × 670 px · landscape · JPEG (quality 85) · `programme-grants-empty-hall-rehearsal.jpg`

---

### 5 · `concert-term-end-ensembles.jpg` — Concert detail hero

> Editorial photograph of a student ensemble performing on stage at a term-end concert in an intimate hall in Bengaluru, seating about a hundred and twenty. Roughly eight to ten performers aged twelve to twenty-two arranged across the low stage: a row of singers standing at the back, two violinists seated at the left, a guitarist and a percussionist with a kanjira at the right. Warm overhead stage light on the performers, plain dark backdrop behind. Shot from the centre of the auditorium, camera at seated audience height, very wide horizontal framing that takes in the full width of the stage with a little dark space above the heads. Performers spread evenly across the central horizontal band; the frame is symmetrical and calm. Warm tungsten light against deep neutral shadow, soft contrast, no coloured wash, no lens flare, no haze. Proud, celebratory but composed mood — a school concert, not a rock show. Muted palette: amber highlights, navy-black shadow, restrained saturation. Fine natural grain, fast prime look. No text, no logos, no watermarks, no signage on the backdrop. Aspect ratio 2.8:1 (very wide).

**Important cropping considerations:** displayed at 1116 × 400 full-width and centre-cropped, so a 16:9 original will lose top and bottom. Shoot or generate at 2.8:1 directly. Keep every performer's head within the **middle 60% of frame height**. Leave the outer 10% at each side expendable — no key performer at the extreme left or right edge. The stage front edge should not run exactly along the bottom crop line; give it clearance.

**File requirements:** 2.8:1 · minimum 2400 × 860 px (this displays full-bleed at 1116 px, so it needs real resolution for retina) · landscape · JPEG (quality 88) · `concert-term-end-ensembles.jpg`

---

### 6 · `classes-hero-teacher-and-student.jpg` — Classes & workshops hero

> Intimate editorial documentary photograph of one Indian music teacher and one student in a plain bright teaching room in Bengaluru. The teacher, a man in his fifties, sits at the right of the frame and reaches across to adjust the student's left-hand position on the neck of a violin; the student, a girl of about fourteen, sits at the left holding the instrument, attention on her own hands. Both in profile or three-quarter view, neither looking at the camera. Close medium framing — both figures from waist up, hands and the violin clearly visible and sharp. Camera at seated eye level. Soft diffused daylight from a window out of frame at the left, plain pale wall behind, a music stand slightly out of focus in the background. Horizontal composition, the two figures filling the centre of the frame with a little clean wall space above their heads. Warm, patient, one-to-one teaching mood. Muted neutral palette — bone wall, warm skin tones, soft indigo and rust clothing, low saturation. Natural light only, no flash. Subtle film grain, 50mm prime look. No text, no logos, no watermarks. Aspect ratio 3:2.

**Important cropping considerations:** the container is 450 × 300, a true 3:2 — minimal cropping if you deliver 3:2. The critical detail is **the hands on the instrument**; keep them within the central 60% of the frame so any minor crop cannot clip them. Both faces should sit in the upper-middle third, not near the top edge.

**File requirements:** 3:2 · minimum 1500 × 1000 px · landscape · JPEG (quality 85) · `classes-hero-teacher-and-student.jpg`

---

### 7–10 · Trustee portraits

The four cards are identical in size and treatment, so the four portraits must be **visually consistent with each other** — same background approach, same light, same distance, same crop. Shot as one session if possible. The site currently identifies:

| # | Name as published | Role as published | Filename |
|---|---|---|---|
| 7 | Meera Iyengar | Chair | `trustee-01-meera-iyengar-chair.jpg` |
| 8 | S. Raghavan | Trustee, education | `trustee-02-s-raghavan-education.jpg` |
| 9 | Nandita Bose | Trustee, finance | `trustee-03-nandita-bose-finance.jpg` |
| 10 | Joel Fernandes | Trustee, artists | `trustee-04-joel-fernandes-artists.jpg` |

I have deliberately **not** specified age, appearance or gender for any of them — the site publishes only name and role, and inventing personal characteristics for real trustees would be wrong. Take those details from the client. The specification below covers everything that is a *photographic* decision.

**Shared specification for all four:**

- **Framing:** head and shoulders to upper chest. Eyes on the upper-third line. Roughly 15% clear space above the head.
- **Orientation:** portrait, delivered at 9:8 (near square, marginally tall).
- **Background:** plain, unpatterned, mid-to-light neutral — bone, pale warm grey, or the plaster wall of the Trust's own teaching room. Slightly out of focus. **No bookshelves, no logos, no busy interiors, no pure white studio sweep** (a pure white background would fight the site's `#F6F6F4` ground and look cut out).
- **Lighting:** soft, single large source from one side at roughly 45°, gentle fill on the shadow side. Window light is ideal. No hard shadow on the background, no ring-light catchlights, no coloured rim light.
- **Expression:** relaxed, present, mouth closed or in a slight natural smile. Direct eye contact with the lens. Warm rather than corporate-stern; the site's tone is welcoming.
- **Clothing:** the subject's own everyday professional dress. Plain fabrics preferred; avoid fine stripes and small checks (they moiré at 259 px) and avoid saturated colours that would clash with the navy — deep neutrals, off-whites, muted earth tones sit best.
- **Formal or candid:** **semi-formal.** Composed and looking at camera, but shot in a real room with natural light rather than in a studio. Not a corporate ID photo, not a candid grab.
- **Lens:** 85mm equivalent, shallow but not extreme depth of field — eyes sharp, background softly separated.

**Important cropping considerations:** the card crops centrally to 259 × 230. Keep the face in the **central 60%** of the frame. Nothing critical — chin, top of head, an ear — within 12% of any edge. Do not deliver a full-length or three-quarter-body shot expecting the site to crop it; the crop is shallow and would land on the torso.

**File requirements (each):** 9:8 · minimum 1000 × 890 px · portrait · JPEG (quality 88 — faces need it) · filenames as tabled above.

**Prompt, if a temporary stand-in is genuinely needed before client photography arrives:**

> Semi-formal editorial portrait of a person photographed against a plain pale warm-grey plastered wall, softly out of focus. Head-and-shoulders framing, eyes on the upper third, about 15 percent clear space above the head, subject centred. Soft directional window light from 45 degrees to one side with gentle fill; no hard background shadow, no ring light. Relaxed present expression, slight natural smile, direct eye contact. Plain unpatterned everyday professional clothing in muted neutral tones. 85mm prime lens look, eyes sharp, background gently separated. Muted neutral colour grade, low saturation, natural skin tones. No text, no logos, no watermarks. Aspect ratio 9:8.

> ⚠ Use a generated face for **internal layout review only**. Never publish a synthetic face on a trustee card — it misrepresents named real people. Replace all four before the site goes live.

---

### 11 · `venue-hall-entrance.jpg` — Venue & directions hero

Two viable options. Pick one; do not use both.

**Option A — the entrance (recommended).** This is a "Finding us" page; a visitor's real need is recognising the door from the street.

> Architectural documentary photograph of the street entrance to a modest arts building on a quiet tree-lined street in Richmond Town, Bengaluru. A step-free doorway set into a plain plastered façade, painted in a muted neutral tone, with a simple flush entrance and a small unbranded plaque beside it. A jacaranda or rain tree casts dappled shade across the pavement in front. One or two people walking in, mid-distance, small in the frame. Very wide horizontal composition, camera at standing eye level directly across the street, square-on to the façade. The doorway sits in the central third. Late afternoon daylight, soft and warm, gentle dappled shadow, no harsh sun flare. Calm, welcoming, easy-to-find mood. Muted neutral palette, low saturation, warm plaster and green foliage. Sharp throughout, 35mm look. No legible text, no signage lettering, no logos, no watermarks. Aspect ratio 8:3 (very wide).

**Option B — the hall interior.**

> Architectural documentary photograph of an intimate empty performance hall in Bengaluru seating about a hundred and twenty, looking from the back of the room towards a low carpeted stage platform. Rows of plain wooden chairs, a tuned upright piano at the left of the stage, a drum kit at the right, plain pale plastered walls, a doorway to a courtyard throwing daylight in from one side. Very wide horizontal composition, camera at standing height on the centre line, symmetrical perspective down the room. House lights up, flat even warm daylight, no stage lighting, no drama. Quiet, ready, generous mood. Muted neutral palette, bone walls, warm wood, low saturation. Sharp throughout, 24mm look with corrected verticals. No text, no logos, no watermarks. Aspect ratio 8:3 (very wide).

**Important cropping considerations:** displayed 1116 × 420, centre-cropped. Keep the subject — doorway or stage — in the **central 60% horizontally** and the **middle 70% vertically**. Verticals must be straight; a converging façade or leaning doorframe is very visible in an 8:3 band. Do not include legible signage or house numbers unless they are the client's real ones.

**File requirements:** 8:3 · minimum 2400 × 900 px · landscape · JPEG (quality 88) · `venue-hall-entrance.jpg`

---

## 3. Client photography vs. generated — categorisation

| # | Image | Category | Reasoning |
|---|---|---|---|
| 7–10 | Trustee portraits ×4 | **A — client photography required** | Named real people. A synthetic or stock face on a trustee card is a misrepresentation, and donors and grant bodies read this page. Non-negotiable before launch. |
| 11 | Venue | **A — client photography strongly recommended** | The page's entire job is helping someone find and recognise a specific building at 14 Wellington Street. A generated door is the wrong door. |
| 5 | Concert detail hero | **A — client photography strongly recommended** | It illustrates a specific named event (term-end concert, the Trust's own students). Also the single most credibility-carrying image on the site — donors want to see that the concerts happen. |
| 3 | Programme card — concerts | **C — either** | Lean A: the Trust's own hall is distinctive and a real photograph builds trust. But at 353 × 170 the crop is small and atmospheric, so a generic concert image survives review. |
| 1 | Home hero | **C — either** | Lean A for launch. It is the first thing anyone sees and real students are far more persuasive than generic ones; but it is atmospheric enough that a generated version holds a design review convincingly. |
| 6 | Classes hero | **C — either** | Lean A: it sits on the page your primary call-to-action leads to, and prospective parents are reading it for a sense of who actually teaches. A generic teacher/student image is acceptable as an interim. |
| 2 | Programme card — classes | **B — generated or stocked** | Small, atmospheric, generic by nature. No specific claim being made. |
| 4 | Programme card — grants | **B — generated or stocked** | Small and conceptual (space and time to rehearse). No specific person or place identified. |

**Summary:** 3 images must come from the client (venue, concert hero, plus all four portraits = 6 files), 3 are safely generic, 3 are judgement calls where client photography is better but a generated interim works for review.

---

## 4. Reuse, uniqueness and re-cropping

**Must be unique — no reuse possible:**

- All four trustee portraits (different people).
- Home hero (#1) and Classes hero (#6). They are the two largest human images and a visitor moving from Home to Classes via the enrol button sees them within seconds of each other. Repeating would be immediately obvious.
- Venue (#11) — nothing else on the site is architectural.

**Genuine reuse opportunity — one:**

- **Concert detail hero (#5) → Programme card "Concert series" (#3).** Both are the hall mid-concert. If #5 is delivered at 2400 × 860 or larger, a **different sub-crop** of it — a tighter 2.1:1 pull on two performers rather than the full stage — can serve #3. They appear on different pages, so the repetition is not seen side by side. Deliver as two separate files (`concert-term-end-ensembles.jpg` and a crop saved as `programme-concerts-hall-performance.jpg`) rather than reusing one file, so the framing is right in each slot.

**Do not reuse:**

- The three programme cards sit **side by side in one row**. They must be three visibly different pictures — different rooms, different light, different subject count. Any two that read alike will look like a mistake.
- Do not use a crop of the Home hero (#1) for programme card #2. Same room, same students, stacked vertically within one scroll — reads as padding.

**Could be cropped differently from a single shoot:** if the client runs one photography day at the Trust, images 1, 2, 4, 6 can all come from that day (teaching rooms and empty hall) and 3, 5 from one concert night. That is two sessions plus a portrait sitting for the whole site.

---

## 5. Production checklist

**Totals**

- Total images required: **11**
- Client photographs required (Category A): **6** (4 portraits + venue + concert hero)
- Generic / generatable (Category B): **3**
- Either (Category C): **3** — client preferred, generated acceptable for review
- Portraits (vertical): **5** (home hero + 4 trustees)
- Landscape: **6**
- Wide heroes (2.8:1 and wider): **2** (concert hero, venue)
- Square / near-square: **5** counted above as portraits — the home hero (24:25) and the four trustee cards (9:8) are all near-square; treat them as such when framing
- Distinct aspect ratios to deliver: **6** — 24:25, 2.1:1, 2.8:1, 3:2, 9:8, 8:3

**File manifest**

| Filename | Ratio | Min. resolution | Cat. | Status |
|---|---|---|---|---|
| `home-hero-rehearsal-room.jpg` | 24:25 | 1600 × 1670 | C | ☐ |
| `programme-classes-group-lesson.jpg` | 2.1:1 | 1400 × 670 | B | ☐ |
| `programme-concerts-hall-performance.jpg` | 2.1:1 | 1400 × 670 | C | ☐ |
| `programme-grants-empty-hall-rehearsal.jpg` | 2.1:1 | 1400 × 670 | B | ☐ |
| `concert-term-end-ensembles.jpg` | 2.8:1 | 2400 × 860 | A | ☐ |
| `classes-hero-teacher-and-student.jpg` | 3:2 | 1500 × 1000 | C | ☐ |
| `trustee-01-meera-iyengar-chair.jpg` | 9:8 | 1000 × 890 | A | ☐ |
| `trustee-02-s-raghavan-education.jpg` | 9:8 | 1000 × 890 | A | ☐ |
| `trustee-03-nandita-bose-finance.jpg` | 9:8 | 1000 × 890 | A | ☐ |
| `trustee-04-joel-fernandes-artists.jpg` | 9:8 | 1000 × 890 | A | ☐ |
| `venue-hall-entrance.jpg` | 8:3 | 2400 × 900 | A | ☐ |

**Delivery notes**

- Format: JPEG for all eleven. Quality 85 generally; 88 for the dark concert images and the four portraits.
- Colour: sRGB. Keep saturation restrained — the site's palette is muted, and vivid photography will look pasted on.
- Suggested location when you insert them: `assets/images/`.
- Two files still need a decision from you: which venue option (A entrance / B interior), and whether the Home and Classes heroes wait for client photography or go live with interim images.

---

## 6. Where each file goes

For reference when you insert the finals — each slot is identified in the code by a stable id:

| # | Filename | Slot id in `Bengaluru Music Trust.dc.html` |
|---|---|---|
| 1 | `home-hero-rehearsal-room.jpg` | `bmt-home-hero` |
| 2 | `programme-classes-group-lesson.jpg` | `bmt-prog-classes` |
| 3 | `programme-concerts-hall-performance.jpg` | `bmt-prog-concerts` |
| 4 | `programme-grants-empty-hall-rehearsal.jpg` | `bmt-prog-grants` |
| 5 | `concert-term-end-ensembles.jpg` | `bmt-event-hero` |
| 6 | `classes-hero-teacher-and-student.jpg` | `bmt-classes-hero` |
| 7–10 | `trustee-01…04` | `bmt-trustee-1` … `bmt-trustee-4` |
| 11 | `venue-hall-entrance.jpg` | `bmt-venue` |

Each container already sets `object-fit: cover` and the correct ratio, so a correctly-cropped file needs no CSS change on insertion.
