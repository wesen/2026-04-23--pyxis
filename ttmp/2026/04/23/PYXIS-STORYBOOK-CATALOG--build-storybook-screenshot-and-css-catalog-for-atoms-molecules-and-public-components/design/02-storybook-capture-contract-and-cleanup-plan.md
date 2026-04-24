---
Title: Storybook Capture Contract and Cleanup Plan
Ticket: PYXIS-STORYBOOK-CATALOG
Status: active
Topics:
  - frontend
  - storybook
  - css-visual-diff
  - design-system
  - visual-regression
DocType: design
Intent: implementation-guide
Summary: Defines the React/Storybook selector contract needed for focused widget screenshots and direct prototype-vs-Storybook visual comparisons.
LastUpdated: 2026-04-24T00:00:00Z
---

# Storybook Capture Contract and Cleanup Plan

The first Storybook atom extraction proved that the transport works but also exposed a fundamental selector problem. The `Badge` screenshot was far too large because the initial capture selector selected a Storybook wrapper instead of the badge. That failure is useful: it tells us that screenshot extraction cannot rely on generic DOM guesses such as `#storybook-root > *:first-child`.

The correct long-term fix is to make the React components and Storybook stories expose a stable capture contract. The capture tool should not be a clever DOM detective. It should be handed a meaningful target.

---

## 1. Problem statement

A Storybook story usually renders extra DOM around the actual widget. The DOM for `Badge / Default` looked like this:

```html
<div id="storybook-root">
  <div>                         <!-- story wrapper, roughly viewport-sized -->
    <div>                       <!-- layout wrapper, roughly viewport-sized -->
      <span class="pyxis-badge" data-part="badge">
        Confirmed
      </span>
    </div>
  </div>
</div>
```

The broad selector:

```css
#storybook-root > *:first-child
```

captured the large story wrapper. The meaningful widget was:

```css
#storybook-root [data-part="badge"]
```

But adding special cases for every component is not a durable workflow. We will use this workflow many times, across atoms, molecules, public components, and page stories. We need a selector API that the components themselves own.

---

## 2. Required React-side contract

Every exported component root must expose:

```html
data-pyxis-component="<component-slug>"
data-pyxis-part="root"
```

Examples:

```html
<button data-pyxis-component="button" data-pyxis-part="root">
<span data-pyxis-component="badge" data-pyxis-part="root">
<div data-pyxis-component="input" data-pyxis-part="root">
<div data-pyxis-component="venue-card" data-pyxis-part="root">
```

Internal parts may expose the same component name with a different part:

```html
<span data-pyxis-component="badge" data-pyxis-part="indicator">
<span data-pyxis-component="badge" data-pyxis-part="label">
<input data-pyxis-component="input" data-pyxis-part="control">
<label data-pyxis-component="input" data-pyxis-part="label">
```

The old ad hoc `data-part` convention should be replaced. We do not need backwards compatibility, so the canonical selector API is the namespaced version.

---

## 3. Component helper

Components should not handwrite these attributes. Add a helper:

```ts
export function pyxisPart(component: string, part = 'root') {
  return {
    'data-pyxis-component': component,
    'data-pyxis-part': part,
  } as const;
}
```

This keeps naming consistent and makes the selector contract explicit in code review.

---

## 4. Storybook story contract

Some stories render a single widget. Other stories render a grid, fixture, or scenario. A single root selector cannot cover both cases.

For single-widget stories, the primary target should be the component root:

```css
#storybook-root [data-pyxis-component="badge"][data-pyxis-part="root"]
```

For grid or fixture stories, the story should expose a story root:

```html
<div
  data-pyxis-story-root
  data-pyxis-story-id="atoms-badge-all-statuses"
  data-pyxis-domain="generic"
  data-pyxis-level="atom"
  data-pyxis-component="badge"
>
  ...variants...
</div>
```

Then the capture target is:

```css
#storybook-root [data-pyxis-story-root]
```

A later helper such as `StoryFrame` should make this easy for story authors.

---

## 5. css-visual-diff extraction strategy

Each Storybook config should produce at least two probes.

### `story-root`

```css
#storybook-root
```

This is a debug/context image. It verifies that Storybook loaded and that the story rendered.

### `capture-target`

This is the comparison image. It should be the widget itself, or the story frame for a fixture/grid story.

Selector priority:

```text
1. Story-declared capture selector, once available.
2. [data-pyxis-story-root] for fixture stories.
3. [data-pyxis-component="<slug>"][data-pyxis-part="root"] for single-widget stories.
4. #storybook-root > *:first-child only as a temporary fallback.
```

The old probe name `component-focus` is too vague. The new primary comparison probe is:

```text
capture-target
```

That name works for atoms, molecules, public-site organisms, and page stories.

---

## 6. Implementation phases

### Phase A: Atom selector cleanup

Update atom roots and critical internal parts:

```text
Button
Badge
Tag
Avatar
Icon
IconButton
Input
Select
Textarea
```

Regenerate Storybook configs and rerun the atom sample. The badge `capture-target` screenshot should be badge-sized, not viewport-sized.

### Phase B: Storybook generator update

Update the generator to emit:

```yaml
- name: story-root
  selector: '#storybook-root'

- name: capture-target
  selector: '#storybook-root [data-pyxis-component="badge"][data-pyxis-part="root"]'
```

The generator can infer the component slug from Storybook title for now, then later consume story-level metadata.

### Phase C: StoryFrame and variant stories

Add a `StoryFrame` helper and use it in multi-widget stories such as:

```text
Button / All Variants
Badge / All Statuses
Icon / All Icons
AtomDiffFixture / Default
```

### Phase D: Molecules and organisms

Normalize the same selector contract across:

```text
Card
CardHead
Field
Stat
Table
Empty
LogRow
Modal
TopBar
```

### Phase E: Public-site components

Normalize public components with public-domain slugs:

```text
venue-card
booking-form
pub-nav
pub-footer
ticket-stub
archive-stats
year-group
about-hero
ethos-strip
```

This prepares direct public component comparison against `prototype-design/Pyxis Public Site.html`.

---

## 7. Definition of done

The cleanup is successful when:

- every captured component has a stable `data-pyxis-component` root,
- every primary Storybook screenshot uses `capture-target`,
- the `Badge` screenshot is tightly scoped to the badge,
- the atom sample validates Button, Badge, Tag, Input, Avatar/Icon examples,
- future Storybook configs no longer need ad hoc `data-part` exceptions for atom roots,
- the workflow is documented in a reusable playbook under `docs/playbooks/`.
