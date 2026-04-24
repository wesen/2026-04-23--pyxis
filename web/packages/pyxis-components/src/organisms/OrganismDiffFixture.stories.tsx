import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Field } from '../molecules/Field';
import { Modal } from './Modal';
import { TopBar } from './TopBar';
import '../atoms/Button/Button.css';
import '../atoms/Input/Input.css';

function FixtureRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', paddingTop: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function OrganismDiffFixture() {
  return (
    <div
      data-fixture="pyxis-organisms"
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
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500 }}>Organism diff fixture</h1>

      <FixtureRow label="Top bars">
        <div data-comp="topbar-default" style={{ width: 760 }}>
          <TopBar
            breadcrumb="Admin / Shows"
            title="Upcoming shows"
            subtitle="Manage holds, confirmations, and settlements."
            actions={(
              <>
                <Button variant="outline" size="sm">Export</Button>
                <Button variant="primary" size="sm">New show</Button>
              </>
            )}
          />
        </div>
      </FixtureRow>

      <FixtureRow label="Modals">
        <div data-comp="modal-default" style={{ position: 'relative', width: 760, height: 460, background: 'var(--color-canvas)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <Modal
            isOpen
            onClose={() => undefined}
            title="Confirm booking"
            subtitle="Send this show to the public calendar."
            footer={(
              <>
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Confirm</Button>
              </>
            )}
          >
            <Field label="Internal note"><Input placeholder="Optional note" /></Field>
          </Modal>
        </div>
      </FixtureRow>
    </div>
  );
}

const meta: Meta<typeof OrganismDiffFixture> = {
  title: 'Organisms/Organism Diff Fixture',
  component: OrganismDiffFixture,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
