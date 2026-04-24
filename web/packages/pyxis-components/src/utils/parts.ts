export type PyxisPartAttributes = {
  'data-pyxis-component': string;
  'data-pyxis-part': string;
};

/**
 * Stable Pyxis component/part selector contract for screenshots, tests, and themed CSS.
 *
 * Component roots should use `pyxisPart('button')`, which emits:
 *
 * ```html
 * data-pyxis-component="button" data-pyxis-part="root"
 * ```
 *
 * Internal parts should use explicit part names such as `label`, `control`,
 * `indicator`, `icon-start`, or `icon-end`.
 */
export function pyxisPart(component: string, part = 'root'): PyxisPartAttributes {
  return {
    'data-pyxis-component': component,
    'data-pyxis-part': part,
  };
}
