import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Button } from './Button';
import { Icon, IconButton } from './Icon';
import { Input } from './Input';
import { Select } from './Select';
import { Tag } from './Tag';
import './Button/Button.css';
import './Icon/Icon.css';
import './Input/Input.css';
import './Select/Select.css';

function FixtureRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', paddingTop: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function AtomDiffFixture() {
  return (
    <div
      data-fixture="pyxis-atoms"
      style={{
        width: 920,
        padding: 24,
        background: 'var(--color-canvas)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500 }}>Atom diff fixture</h1>

      <FixtureRow label="Buttons">
        <span data-comp="button-primary"><Button variant="primary" iconRight="chevron-right">Get tickets</Button></span>
        <span data-comp="button-dark"><Button variant="dark">Dark</Button></span>
        <span data-comp="button-outline"><Button variant="outline" iconLeft="calendar">Add to calendar</Button></span>
        <span data-comp="button-ghost"><Button variant="ghost">Ghost</Button></span>
        <span data-comp="button-danger"><Button variant="danger">Danger</Button></span>
        <span data-comp="button-success"><Button variant="success">Success</Button></span>
      </FixtureRow>

      <FixtureRow label="Badges">
        <span data-comp="badge-confirmed"><Badge status="confirmed" /></span>
        <span data-comp="badge-pending"><Badge status="pending" /></span>
        <span data-comp="badge-declined"><Badge status="declined" /></span>
        <span data-comp="badge-archived"><Badge status="archived" /></span>
      </FixtureRow>

      <FixtureRow label="Tags">
        <span data-comp="tag-default"><Tag>Darkwave</Tag></span>
        <span data-comp="tag-accent"><Tag color="var(--color-accent)">Featured</Tag></span>
      </FixtureRow>

      <FixtureRow label="Avatars">
        <span data-comp="avatar-md"><Avatar name="Ada Lovelace" size="md" /></span>
        <span data-comp="avatar-lg"><Avatar name="Moor Mother" size="lg" color="var(--color-accent)" /></span>
      </FixtureRow>

      <FixtureRow label="Icons">
        <span data-comp="icon-calendar"><Icon name="calendar" size={20} /></span>
        <span data-comp="icon-ticket"><Icon name="ticket" size={20} /></span>
        <span data-comp="icon-discord"><Icon name="discord" size={20} /></span>
        <span data-comp="icon-button"><IconButton icon="edit" label="Edit" /></span>
      </FixtureRow>

      <FixtureRow label="Inputs">
        <div data-comp="input-search" style={{ width: 260 }}><Input label="Search" icon="search" placeholder="Find a show" defaultValue="Burial" /></div>
        <div data-comp="input-error" style={{ width: 260 }}><Input label="Email" placeholder="you@example.com" style={{ borderColor: 'var(--color-accent)' }} /></div>
      </FixtureRow>

      <FixtureRow label="Select">
        <div data-comp="select-status" style={{ width: 260 }}>
          <Select
            label="Status"
            value="confirmed"
            options={[
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'pending', label: 'Pending' },
              { value: 'archived', label: 'Archived' },
            ]}
            onChange={() => {}}
          />
        </div>
      </FixtureRow>
    </div>
  );
}

const meta: Meta<typeof AtomDiffFixture> = {
  title: 'Atoms/Atom Diff Fixture',
  component: AtomDiffFixture,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
