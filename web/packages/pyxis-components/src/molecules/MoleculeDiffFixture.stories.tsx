import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Card } from './Card';
import { Empty } from './Empty';
import { Field } from './Field';
import { Stat } from './Stat';
import '../atoms/Button/Button.css';
import '../atoms/Input/Input.css';
import './Card/Card.css';

function FixtureRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', paddingTop: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function MoleculeDiffFixture() {
  return (
    <div
      data-fixture="pyxis-molecules"
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
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500 }}>Molecule diff fixture</h1>

      <FixtureRow label="Cards">
        <div data-comp="card-default" style={{ width: 260 }}><Card>Basic card content</Card></div>
      </FixtureRow>

      <FixtureRow label="Fields">
        <div data-comp="field-default" style={{ width: 260 }}>
          <Field label="Artist name" hint="Use the public billing name.">
            <Input placeholder="Enter artist" defaultValue="Moor Mother" />
          </Field>
        </div>
        <div data-comp="field-error" style={{ width: 260 }}>
          <Field label="Contact email" error="Enter a valid email.">
            <Input placeholder="booking@example.com" defaultValue="bad-address" style={{ borderColor: 'var(--color-accent)' }} />
          </Field>
        </div>
      </FixtureRow>

      <FixtureRow label="Stats">
        <div data-comp="stat-default" style={{ width: 220 }}>
          <Stat label="Shows" value={12} sub="This month" trend="+3" />
        </div>
      </FixtureRow>

      <FixtureRow label="Empty">
        <div data-comp="empty-cta" style={{ width: 320 }}>
          <Empty
            title="No bookings yet"
            description="When artists submit booking requests, they will appear here."
            action={<Button variant="primary" size="sm">Create hold</Button>}
          />
        </div>
      </FixtureRow>
    </div>
  );
}

const meta: Meta<typeof MoleculeDiffFixture> = {
  title: 'Molecules/Molecule Diff Fixture',
  component: MoleculeDiffFixture,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
