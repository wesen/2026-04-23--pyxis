import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../src/api/mockData';
import { DrawProgress } from '../src/components/atoms/DrawProgress';
import { AgeBadge } from '../src/components/atoms/AgeBadge';
import { StatusPill } from '../src/components/atoms/StatusPill';
import { ShowsArchivedPanel, ShowsConfirmedPanel, ShowsFilterBar } from '../src/components/organisms/ShowsSections';

const confirmed = shows.filter((show) => show.status === 'confirmed').sort((a, b) => a.date.localeCompare(b.date));
const archived = shows.filter((show) => show.status === 'archived');

const meta: Meta = { title: 'Pyxis App/Organisms/Shows', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

export const ConfirmedPanel: Story = { render: () => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsConfirmedPanel shows={confirmed}/></div> };
export const ArchivedPanel: Story = { render: () => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsArchivedPanel shows={archived}/></div> };
export const Filters: Story = { render: () => <div style={{ width: 1018, padding: 26, background: 'var(--app-canvas)' }}><ShowsFilterBar confirmedCount={confirmed.length}/></div> };
export const RowAtoms: Story = { render: () => <div style={{ display: 'flex', gap: 18, alignItems: 'center', padding: 26, background: 'var(--app-canvas)' }}><AgeBadge>21+</AgeBadge><AgeBadge>All Ages</AgeBadge><StatusPill tone="confirmed">confirmed</StatusPill><DrawProgress value={70} max={150}/><DrawProgress value={160} max={150}/></div> };
