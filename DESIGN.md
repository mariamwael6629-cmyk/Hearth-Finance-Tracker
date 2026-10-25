# Design — Hearth

**World: the statement.** Personal finance already has a printed artifact everyone knows: the bank statement and the receipt. Hearth borrows its grammar: white paper on a cool desk, figures set large, dotted leaders to the amount, a heavy rule under each heading, carbon-copy blue for the brand, ledger green for money in and stamp red for money out. On the landing page the net-worth statement has a torn receipt edge. The cream, Fraunces italics, copper and grain texture are gone; they were the default "warm finance" look.

Both themes are maintained: `html[data-theme="light"]` (default) and `html[data-theme="dark"]`.

## Tokens (`frontend/css/styles.css`)

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` / `--bg-deep` | `#F2F3F0` / `#ECEEEA` | `#0E1116` / `#0B0D11` | desk ground, app ground |
| `--surface-solid` / `-2` | `#FFFFFF` / `#F6F7F4` | `#161A21` / `#1C2129` | paper, raised panels |
| `--border` / `-strong` | 11% / 20% ink | 10% / 18% ink | rules |
| `--ink` / `--ink-soft` / `--ink-muted` | `#16181D` / `#41454E` / `#5F6470` | `#EEF0F3` / `#C3C8D0` / `#959CA8` | text levels |
| `--copper` (brand, name kept) | `#2747A0` carbon blue | `#8FA8F2` | brand, primary, active nav |
| `--amber` (name kept) | `#1E7A4C` ledger green | `#5CC98F` | money in, positive change |
| `--coral` | `#C2352B` stamp red | `#F07A6E` | money out, negative change |

Chart palette: income green, expenses red, single-series bars in brand blue; category donut `#2747A0 #1E7A4C #C2352B #B7791F #0F7C8A #5B6B8C`.

### Type
One family: **Schibsted Grotesk** (400–900). Display headings are 800 with tracking −0.035em; the second half of a headline sits at 400 weight instead of an italic accent. Body is 15px (html), landing copy 17–19px. Figures use lining numerals; Schibsted's tabular figures space commas too wide, so they're not used.

### Shape
Radii 4 / 6 / 8 / 12px. Cards are flat (border, no shadow). Shadows appear only on things that float: the statement, the stamps, popovers.

## Components
- **Icons:** `js/icons.js` exposes `icon(name, size)`, a stroke set drawn on a 24px grid at 1.8 stroke. It replaces the Unicode glyphs and emoji in the chrome. Category emoji that users choose stay as data.
- **Statement card** (landing): a heavy rule under its header, dotted leaders, a savings bar with a goal tick, a torn edge made with a CSS mask, and a slight tilt. The AI insight and health score sit on it as stamps.
- **Feature list:** a ruled 3×2 table, not cards.
- **AI spotlight:** a solid carbon-blue block with white rules.
- **Sidebar:** the active item gets a 3px inset bar and a blue tint.
- **Buttons:** 6px radius, 44px tall (36px small). Arrow icons nudge 2px on hover.

## Fixes made during the redesign
- `.app-shell` was a two-column grid while the sidebar was `position: fixed`, so the main area landed in the 248px track, minus a 248px margin, and rendered 0px wide on desktop. The shell is now a block.
- The hero mock was hidden on phones. It now shows, scaled down.
- The transactions table scrolls inside its card on phones, and the summary row stacks.
