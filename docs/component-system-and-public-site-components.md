---
Title: Pyxis Component System and Public Site Components
Status: active
Topics:
  - frontend
  - design-system
  - storybook
  - public-site
  - atomic-design
DocType: reference
Intent: education
Summary: Explains how Pyxis uses atoms, molecules, organisms, domain components, and page stories across the generic design system and public-site component system.
LastUpdated: 2026-04-24T00:00:00Z
---

# Pyxis Component System and Public Site Components

A component system is a vocabulary for building interfaces. The point is not to argue whether a component is “really” an atom or “really” an organism. The point is to give developers and designers a shared map. When two people say “Button,” they should mean the same primitive. When they say “VenueCard,” they should understand that it is a composed public-site object, not a global primitive. That shared map is what lets us test the system one layer at a time instead of debugging a whole page every time a border radius changes.

Pyxis uses two ideas together. The first idea is **composition level**: small parts combine into larger parts. The second idea is **domain**: some parts are generic and reusable anywhere, while others are specific to the public site, the staff/admin app, or the mobile app. A component can be an organism in one domain without being part of the generic organism layer. This distinction matters because our visual testing workflow depends on it.

---

## 1. The two axes

The most common mistake is to treat “atom,” “molecule,” and “organism” as one global hierarchy. That sounds tidy, but real products are not that simple. A `VenueCard` is more complex than a `Field`, so it feels like an organism. But it is also specific to the public site, so it should not be mixed into the generic design-system organisms beside `Modal` or `TopBar`.

A better model uses two axes:

```text
Axis 1: composition level
  atom → molecule → organism → template/page

Axis 2: domain
  generic design system
  public site
  staff/full app
  mobile app
```

This gives us language such as:

```text
Button      = generic atom
Field       = generic molecule
Modal       = generic organism
VenueCard   = public-site organism
ShowsPage   = public-site page
Settings    = staff-app page
MHome       = mobile-app screen
```

The labels are useful because they tell us where to put stories, what to compare first, and how much visual noise to expect.

---

## 2. Atoms: the smallest reusable primitives

An atom is a small reusable primitive. It has one main job and very little domain meaning. It should not know about shows, bookings, venues, Discord, artists, or archive years. It should be reusable in many contexts.

Examples in Pyxis:

```text
Button
Badge
Tag
Icon
IconButton
Input
Select
Textarea
Avatar
```

A `Button` is an atom because its job is to express an action. It can be red, outlined, disabled, loading, or full-width, but it is still just a button. A `Badge` is an atom because it marks status or category; the text might say “Confirmed” or “Pending,” but the badge itself is not a booking workflow.

Atoms are the first things we capture in Storybook because every larger component inherits their visual decisions. If the button padding is wrong, the booking form is wrong. If the badge color is wrong, the show table is wrong. Fixing pages before fixing atoms is like tuning an orchestra before the instruments are tuned.

### Atom examples

| Component | Why it is an atom | Typical states to test |
|---|---|---|
| `Button` | It is a generic action primitive. | default, primary, secondary, danger, disabled, loading, icon-only |
| `Input` | It is a generic text entry primitive. | default, placeholder, filled, error, disabled, icon |
| `Badge` | It is a generic status marker. | neutral, success, warning, danger, on-dark |
| `Avatar` | It is a generic identity marker. | initials, sizes, fallback |
| `Icon` | It is a generic symbolic primitive. | size, color, inline, button use |

The rule of thumb is simple: if the component makes sense outside Pyxis, it is probably an atom or generic molecule. A button belongs in any application. A venue card does not.

---

## 3. Molecules: generic combinations of atoms

A molecule combines atoms into a reusable pattern. It is larger than an atom, but it should still be mostly domain-neutral. A molecule often describes a recurring UI shape: a field, a card, a stat tile, a table, an empty state, or a log row.

Examples in Pyxis:

```text
Card
CardHead
Field
Stat
Table
Empty
LogRow
```

A `Field` is a molecule because it combines a label, a form control, help text, and error text. The input inside the field is an atom; the field is the reusable form pattern. A `Stat` is a molecule because it combines a label, a number, and maybe trend text. It can show “Upcoming: 6” on a dashboard or “Average draw: 84” in another context without becoming a public-site component.

### Molecule examples

| Component | Built from | Why it is a molecule |
|---|---|---|
| `Field` | label + input/select/textarea + hint/error | It standardizes form layout and validation display. |
| `Card` | surface + border + padding + optional header | It standardizes containment and hierarchy. |
| `Stat` | label + value + trend/caption | It standardizes compact metric display. |
| `Table` | header + rows + cells + status/action content | It standardizes structured data display. |
| `Empty` | icon/heading/body/action | It standardizes an empty or zero-state panel. |
| `LogRow` | status dot + timestamp + actor/action text | It standardizes chronological activity display. |

Molecules are where the design system starts to feel like a product language. They encode repeated patterns without encoding a specific product page.

---

## 4. Organisms: larger reusable structures

An organism is a larger structure made from atoms and molecules. It usually represents a complete interaction area or shell element. A modal, for example, is not just a card. It has a backdrop, panel, title, body, footer, buttons, focus behavior, and sometimes form fields.

Generic Pyxis organisms include:

```text
Modal
TopBar
```

The prototype and application also contain organism-shaped patterns such as sidebars, navigation groups, and app shells. Some of these may not exist as standalone React components yet. That is not a contradiction; it is a roadmap. If a repeated shell pattern matters enough to test independently, it should eventually get a component and a Storybook story.

### Organism examples

| Component | Domain | Why it is an organism |
|---|---|---|
| `Modal` | generic/staff app | It combines overlay, panel, header, body, footer, and actions. |
| `TopBar` | generic/staff app | It combines title, search/action affordances, and shell layout. |
| `PubNav` | public site | It combines brand, navigation links, responsive behavior, and active state. |
| `BookingForm` | public site | It combines fields, validation, sections, and submit behavior. |
| `VenueCard` | public site | It combines public venue information into one reusable section. |

The key point is that “organism” describes composition level, not global reuse. `VenueCard` can be an organism in the public-site system even though it does not belong to the generic organism folder.

---

## 5. Public site components are domain components

The public site has its own component system. These components use the generic design system, but they represent public-facing Pyxis concepts: shows, tickets, venue information, booking rules, archive years, and the public navigation shell.

Examples from `web/packages/pyxis-components/src/public/`:

```text
AboutHero
ArchiveStats
BookingForm
BookingRules
BookingSuccess
EthosStrip
LineupRow
MailingListCTA
PubFooter
PubHero
PubNav
PubShowRow
SpaceInfo
TicketStub
VenueCard
YearGroup
```

These are not less important than atoms. They are simply a different layer. A public component is allowed to know about the public site. `TicketStub` knows about show/ticket presentation. `YearGroup` knows about archive grouping. `VenueCard` knows about the venue. That domain knowledge is exactly why they should not be placed in the generic primitive layer.

### Public-site component taxonomy

| Component | Composition level | Domain | Notes |
|---|---|---|---|
| `PubNav` | organism | public site | Public brand/navigation shell with active states. |
| `PubFooter` | organism | public site | Public footer shell and links. |
| `VenueCard` | organism | public site | Public venue/space information section. |
| `BookingForm` | organism | public site | Form workflow composed of many fields and actions. |
| `TicketStub` | molecule/organism | public site | Ticket-shaped show information; complexity decides final level. |
| `ArchiveStats` | molecule/section | public site | Public archive metrics. |
| `YearGroup` | molecule/section | public site | Archive grouping pattern. |
| `AboutHero` | section organism | public site | Public page hero section. |
| `EthosStrip` | section organism | public site | Public principles/ethos section. |
| `PubShowRow` | molecule/organism | public site | Public show listing row. |

This table explains why `VenueCard` is best described as a **public-site organism**. It is built from smaller pieces and represents a substantial section, but it belongs to the public domain rather than the generic design-system domain.

---

## 6. Page stories are not components in the same sense

A page story renders a route or full page composition. It is useful, but it is not the first place to debug a visual system. A page combines many components, data states, layout rules, and responsive decisions. When a page looks wrong, the cause may be a button, a card, a missing story fixture, a shell layout, or the page itself.

For Pyxis, the public site page stories live in a separate package:

```text
web/packages/pyxis-user-site
```

Known public page stories include:

```text
public-site-pages--shows-desktop
public-site-pages--shows-mobile
public-site-pages--show-detail-desktop
public-site-pages--show-detail-mobile
public-site-pages--archive-desktop
public-site-pages--archive-mobile
public-site-pages--book-desktop
public-site-pages--book-mobile
public-site-pages--about-desktop
public-site-pages--about-mobile
```

These are important later. They should not be the first repair target. We capture and compare them after atoms, molecules, organisms, and public components are inspectable.

---

## 7. How the catalog workflow uses this taxonomy

The visual catalog workflow follows the component hierarchy because it reduces noise. We begin with small generic pieces, then move to public-site sections, then pages.

```text
1. Generic atoms
   Button, Badge, Tag, Input, Select, Textarea, Avatar, Icon

2. Generic molecules
   Card, Field, Stat, Table, Empty, LogRow

3. Generic organisms
   Modal, TopBar, future shell components

4. Public-site components
   PubNav, PubFooter, VenueCard, BookingForm, TicketStub, YearGroup

5. Public-site pages
   Shows, Show Detail, Archive, Book, About
```

The prototype baseline and Storybook catalog sit side by side:

```text
prototype-design/baseline/
  source-of-truth captures from prototype HTML

prototype-design/storybook-catalog/
  implementation captures from Storybook
```

The first tells us what the design says. The second tells us what the React implementation currently does.

---

## 8. What we capture in Storybook

For each Storybook story, the first pass captures two probes:

```text
story-root
component-focus
```

The `story-root` probe captures the whole Storybook-rendered story area. This is useful for examples that intentionally show a grid of variants. The `component-focus` probe captures the first child of `#storybook-root`, which often isolates the actual component.

Pseudocode for a Storybook capture config:

```yaml
original:
  url: http://localhost:6006/iframe.html?id=atoms-button--default&viewMode=story
  root_selector: '#storybook-root'
  prepare:
    wait_for: "document.querySelector('#storybook-root > *:first-child')"

styles:
  - name: story-root
    selector: '#storybook-root'
  - name: component-focus
    selector: '#storybook-root > *:first-child'
```

This is extraction, not comparison. The command is:

```bash
css-visual-diff inspect --config CONFIG.yml --side original --all-styles
```

Each probe writes:

```text
screenshot.png
computed-css.md
computed-css.json
prepared.html
inspect.json
metadata.json
```

The screenshots are for human inspection. The CSS and inspect JSON are for debugging and later automated comparison.

---

## 9. How we compare later

After Storybook is captured, we can compare specific prototype baselines against specific Storybook stories.

For example:

```text
Prototype Foundations buttons card
  ↔ Storybook Button all variants

Prototype Foundations form fields card
  ↔ Storybook Field/Input/Select/Textarea stories

Prototype public nav
  ↔ Storybook PubNav variants

Prototype public show tile
  ↔ Storybook public show/ticket component stories
```

This mapping is the reason we do not want to flatten everything into one folder called “components.” We need to know which layer a component belongs to and which prototype source should be used as its reference.

---

## 10. Key points to remember

- Atomic Design is a vocabulary, not a court verdict. Use it to coordinate work, not to win arguments about labels.
- Pyxis uses both composition level and domain. `VenueCard` is a public-site organism, not a generic design-system organism.
- Generic atoms and molecules should be captured before domain components because larger components inherit their visual decisions.
- Public-site components are first-class components. They just live in a domain-specific layer.
- Page stories are valuable but noisy. They should come after lower-level components are cataloged and inspected.
- The prototype baseline says what the design intends. The Storybook catalog says what the React implementation currently renders.

Once this distinction is clear, the workflow becomes straightforward: tune the primitives, capture the reusable patterns, expand public components, and only then compare full public pages.
