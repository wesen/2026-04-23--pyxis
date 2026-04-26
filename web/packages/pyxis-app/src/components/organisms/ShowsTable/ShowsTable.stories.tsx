import type { Meta, StoryObj } from '@storybook/react';
import { DrawProgress } from '../../atoms/DrawProgress';
import { AgeBadge } from '../../atoms/AgeBadge';
import { StatusPill } from '../../atoms/StatusPill';
const meta: Meta = { title: 'Pyxis App/Organisms/Shows', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const RowAtoms: Story = { render: () => <div style={{ display: 'flex', gap: 18, alignItems: 'center', padding: 26, background: 'var(--app-canvas)' }}><AgeBadge>21+</AgeBadge><AgeBadge>All Ages</AgeBadge><StatusPill tone="confirmed">confirmed</StatusPill><DrawProgress value={70} max={150}/><DrawProgress value={160} max={150}/></div> };
