# Design System Strategy: The Curated Ledger

### 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Curated Ledger."** 

Unlike generic tech portfolios that rely on heavy shadows and neon accents, this system treats the screen as high-grade editorial paper. It is an exercise in restraint, authority, and "quiet luxury." We break the "template look" by prioritizing extreme typographic scale and intentional asymmetry. The layout should feel like a premium broadsheet reimagined for the digital age—structured enough to build trust, but airy enough to feel bespoke. We move away from rigid boxes and toward a fluid, layered experience where content is framed by whitespace rather than lines.

---

### 2. Colors & Surface Architecture
The palette is rooted in a "Bright Editorial" philosophy. We use a range of sophisticated neutrals to create depth without clutter.

*   **Primary (#1960A3):** This is our "Intellectual Blue." Use it sparingly for primary actions and key highlights. It should feel like a fountain pen mark on a clean page.
*   **Neutral Foundation:** The `background` (#F8F9FA) is our base canvas. We use `surface_container_lowest` (#FFFFFF) for primary content cards to create a crisp, high-contrast "pop."

#### The "No-Line" Rule
Standard UI relies on 1px borders to separate content. **In this system, 1px solid borders for sectioning are prohibited.** 
Boundaries must be defined solely through background color shifts. For example, a project gallery section should transition from `background` to `surface_container_low` to denote a change in context. This creates a seamless, high-end flow that feels organic rather than boxed in.

#### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Layer 0:** `background` (#F8F9FA) – The desk.
*   **Layer 1:** `surface_container_low` (#F1F4F6) – The secondary paper.
*   **Layer 2:** `surface_container_lowest` (#FFFFFF) – The focal document.
Nesting `surface_container_lowest` inside `surface_container_low` creates a soft, natural lift that replaces the need for heavy shadows.

#### Signature Textures: The "Glass & Gradient" Rule
To add visual "soul," use a subtle linear gradient for hero backgrounds or large CTA buttons transitioning from `primary` (#1960A3) to `primary_container` (#D3E4FF) at a 135-degree angle. For floating navigation or overlays, apply **Glassmorphism**: use `surface_container_lowest` at 80% opacity with a `24px` backdrop-blur. This ensures the editorial background remains visible, maintaining a sense of place.

---

### 3. Typography: The Editorial Voice
Our typography is a dialogue between the timeless elegance of **Newsreader** (Serif) and the technical precision of **Manrope** (Sans-Serif).

*   **The Display Scale (Newsreader):** Use `display-lg` and `headline-lg` for project titles and hero statements. These should be set with tight letter-spacing (-0.02em) to mimic high-end print. 
*   **The Body Scale (Manrope):** Use `body-lg` for all narrative text. Manrope provides a "tech-forward" clarity that balances the serif’s warmth.
*   **The Label Scale:** `label-md` should be used for metadata (e.g., "Year," "Category"). Use all-caps with increased letter-spacing (0.05em) to differentiate from body copy.

**Hierarchy Strategy:** Always pair a large `display-sm` headline with a `label-md` eyebrow. The extreme size difference (2.25rem vs 0.75rem) is what creates the "Award-Winning" editorial feel.

---

### 4. Elevation & Depth
We convey hierarchy through **Tonal Layering** rather than structural lines.

*   **The Layering Principle:** Avoid shadows for static elements. Instead, stack your tokens: a `surface_container_lowest` card placed on a `surface_container_low` section provides a sophisticated, "flat-depth" look.
*   **Ambient Shadows:** If a floating element (like a modal or dropdown) requires a shadow, it must be "Ambient." Use the `on_surface` color at 6% opacity with a blur of `32px` and a `12px` Y-offset. Never use pure black for shadows; use a tinted navy to maintain the "high-trust" calm.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use the `outline_variant` token at **20% opacity**. It should be felt, not seen.

---

### 5. Components

#### Buttons
*   **Primary:** `primary` background with `on_primary` text. Use `rounded-lg` (0.5rem). No shadow.
*   **Secondary:** `surface_container_high` background with `on_surface` text. This provides a tactile feel without competing with the primary CTA.
*   **Tertiary:** Text-only using `primary` color, with a `2px` underline that appears only on hover.

#### Cards & Lists
*   **The "Anti-Box" Card:** Cards should not have borders. Use `surface_container_low` for the card body. 
*   **Spacing over Dividers:** Forbid the use of divider lines in lists. Use `24px` of vertical whitespace (from the spacing scale) to separate items. Trust the typography to define the start of a new thought.

#### Input Fields
*   Minimalist "Float" style. No background fill—only a bottom border using `outline_variant` at 40% opacity. Upon focus, the border transitions to `primary` at 100% opacity.

#### Creative Component: The "Editorial Pull-Quote"
For portfolio testimonials, use `headline-sm` in Newsreader, italicized, with a `4px` vertical accent bar on the left using the `primary_fixed_dim` color. This breaks the grid and draws the eye to social proof.

---

### 6. Do’s and Don’ts

**Do:**
*   **Use Intentional Asymmetry:** Align a headline to the left and the body copy to a narrow 5-column span on the right.
*   **Embrace Whitespace:** If a section feels crowded, double the padding. This system breathes.
*   **Mix Weights:** Pair a `headline-lg` (Regular weight) with a `label-sm` (Bold weight) for sophisticated contrast.

**Don’t:**
*   **Don't use 1px solid dividers:** Use background tone shifts (`surface` to `surface_container_low`).
*   **Don't use "Default" Shadows:** Avoid the standard CSS `0 2px 4px rgba(0,0,0,0.1)`. It looks cheap. Use our tinted Ambient Shadow spec.
*   **Don't use Neon:** Our blue is `2B6CB0` (Restrained), not a vibrant electric blue. Stay within the high-trust, navy-adjacent spectrum.
*   **Don't center-align long-form text:** Editorial styles are almost always left-aligned to maintain a strong "axis" of design.