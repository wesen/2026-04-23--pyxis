import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveStats } from './ArchiveStats';
import { LineupRow } from './LineupRow';
import { PubShowRow } from './PubShowRow';
import { TicketStub } from './TicketStub';
import { YearGroup } from './YearGroup';

function FixtureRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', paddingTop: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

const show = {
  id: 1,
  artist: 'Redroom Inferno',
  date: '2026-02-14',
  doors_time: '9:00 PM',
  genre: 'electronic / noise',
  price: '$10 adv / $15 door',
  age: '21+' as const,
  status: 'confirmed' as const,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

const archiveShow = {
  id: 2,
  artist: 'Winter Solstice Rave',
  date: '2025-12-12',
  doors_time: '9:00 PM',
  genre: 'Electronic',
  price: '$12',
  age: '21+' as const,
  status: 'archived' as const,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

function PublicDiffFixture() {
  return (
    <div
      data-fixture="pyxis-public"
      style={{
        width: 920,
        padding: 24,
        background: '#F3F1EB',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}
    >
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500 }}>Public diff fixture</h1>

      <FixtureRow label="Lineup">
        <div data-comp="public-lineup-row-default" style={{ width: 360 }}>
          <LineupRow entry={{ start_time: '9:45', artist: 'sable witch', role: 'support' }} />
        </div>
      </FixtureRow>

      <FixtureRow label="Ticket">
        <div data-comp="public-ticket-stub-default" style={{ width: 260 }}>
          <TicketStub show={show} />
        </div>
      </FixtureRow>

      <FixtureRow label="Archive stats">
        <div data-comp="public-archive-stats-default" style={{ width: 680 }}>
          <ArchiveStats stats={{ total_shows: 194, total_attendance: 312, years_running: 31, unique_artists: 0 }} />
        </div>
      </FixtureRow>

      <FixtureRow label="Year group">
        <div data-comp="public-year-group-default" style={{ width: 560 }}>
          <YearGroup year={2025} showCount={8}>
            <div style={{ paddingTop: 8, color: 'var(--color-text-tertiary)', fontSize: 12 }}>Winter Solstice Rave · Electronic</div>
          </YearGroup>
        </div>
      </FixtureRow>

      <FixtureRow label="Show row">
        <div data-comp="public-pub-show-row-default" style={{ width: 640 }}>
          <PubShowRow show={archiveShow} />
        </div>
      </FixtureRow>
    </div>
  );
}

const meta: Meta<typeof PublicDiffFixture> = {
  title: 'Public/Fixtures/Public Diff Fixture',
  component: PublicDiffFixture,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
