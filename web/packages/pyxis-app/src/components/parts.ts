export function appPart(component: string, part = 'root') {
  return { 'data-pyxis-component': component, 'data-pyxis-part': part } as const;
}
