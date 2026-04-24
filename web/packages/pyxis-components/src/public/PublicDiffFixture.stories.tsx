import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArchiveStats } from './ArchiveStats';
import { LineupRow } from './LineupRow';
import { PubShowRow } from './PubShowRow';
import { TicketStub } from './TicketStub';
import { YearGroup } from './YearGroup';
import { PubNav } from './PubNav';
import { PubFooter } from './PubFooter';
import { PubHero } from './PubHero';
import { AboutHero } from './AboutHero';
import { VenueCard } from './VenueCard';
import { SpaceInfo } from './SpaceInfo';
import { EthosStrip } from './EthosStrip';
import { MailingListCTA } from './MailingListCTA';
import { BookingRules } from './BookingRules';
import { BookingSuccess } from './BookingSuccess';
import { BookingForm } from './BookingForm';
import { Poster } from './Poster';
import { ShowTile, type ShowTileShow } from './ShowTile';
import { ShowGrid } from './ShowGrid';

import { PublicPageHeader } from './PublicPageHeader';
import { ReserveTicketCard } from './ReserveTicketCard';
import { ShowDetailHeader } from './ShowDetailHeader';
import { ShowMetaStrip } from './ShowMetaStrip';
import { SafetyNote } from './SafetyNote';
import { ArchiveSearchFilters } from './ArchiveSearchFilters';
import { ArchiveShowRow } from './ArchiveShowRow';
import { ArchiveShowList } from './ArchiveShowList';
import { ShowTypeChips } from './ShowTypeChips';
import { BookingSpaceAside } from './BookingSpaceAside';
import { SaferSpaceAgreement } from './SaferSpaceAgreement';
import { AboutIntro } from './AboutIntro';
import { EthosGrid } from './EthosGrid';
import { CollectiveList } from './CollectiveList';
import { FindUsBlock } from './FindUsBlock';

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

const tileShows: ShowTileShow[] = [
  { artist: 'Redroom Inferno', date: 'Fri, Feb 14', doors_time: '9:00 PM', age: '25+', price: '$10 adv / $15 door', kind: 'tickets', poster: 'redroom' },
  { artist: '808 Collective', date: 'Fri, Feb 21', doors_time: '8:00 PM', age: '21+', price: '$12', kind: 'tickets', poster: 'pixel808' },
  { artist: 'Petals of Love', date: 'Sat, Feb 28', doors_time: '6:30 PM', age: 'All Ages', price: '$15', kind: 'tickets', poster: 'petals' },
];

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

      <FixtureRow label="Poster/tile">
        <div data-comp="public-poster-redroom" style={{ width: 270 }}><Poster kind="redroom" /></div>
        <div data-comp="public-show-tile-redroom" style={{ width: 270 }}><ShowTile show={tileShows[0]} /></div>
      </FixtureRow>

      <FixtureRow label="Show grid">
        <div data-comp="public-show-grid-desktop" style={{ width: 856 }}><ShowGrid shows={tileShows} /></div>
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


      <FixtureRow label="Nav">
        <div data-comp="public-pub-nav-default" style={{ width: 920 }}><PubNav currentPage="shows" /></div>
      </FixtureRow>

      <FixtureRow label="Footer">
        <div data-comp="public-pub-footer-default" style={{ width: 920 }}><PubFooter /></div>
      </FixtureRow>

      <FixtureRow label="Hero">
        <div data-comp="public-pub-hero-default" style={{ width: 720 }}><PubHero show={{ ...show, description: 'A Valentine noise ritual with hardware, fog, and red light.' }} /></div>
      </FixtureRow>

      <FixtureRow label="About hero">
        <div data-comp="public-about-hero-default" style={{ width: 620 }}><AboutHero tagline="a music artist space in a former print shop — 150 cap, one beautiful PA, and a deep love for the loud end of the spectrum." /></div>
      </FixtureRow>

      <FixtureRow label="Venue/space">
        <div data-comp="public-venue-card-default" style={{ width: 300 }}><VenueCard /></div>
        <div data-comp="public-space-info-default" style={{ width: 300 }}><SpaceInfo email="book@ppxis.space" /></div>
      </FixtureRow>

      <FixtureRow label="Ethos">
        <div data-comp="public-ethos-strip-default" style={{ width: 860 }}><EthosStrip /></div>
      </FixtureRow>

      <FixtureRow label="Mailing list">
        <div data-comp="public-mailing-list-cta-default" style={{ width: 520 }}><MailingListCTA /></div>
      </FixtureRow>

      <FixtureRow label="Booking">
        <div data-comp="public-booking-rules-default" style={{ width: 320 }}><BookingRules /></div>
        <div data-comp="public-booking-success-default" style={{ width: 420 }}><BookingSuccess artistName="sable witch" /></div>
      </FixtureRow>



      <FixtureRow label="Page header">
        <div data-comp="public-page-header-default" style={{ width: 856 }}><PublicPageHeader kicker="Since 2023" title="The archive" /></div>
      </FixtureRow>

      <FixtureRow label="Detail parts">
        <div data-comp="public-reserve-ticket-card-default" style={{ width: 340 }}><ReserveTicketCard /></div>
        <div data-comp="public-show-detail-header-default" style={{ width: 520 }}><ShowDetailHeader /></div>
        <div data-comp="public-show-meta-strip-default" style={{ width: 480 }}><ShowMetaStrip /></div>
        <div data-comp="public-safety-note-default" style={{ width: 480 }}><SafetyNote /></div>
      </FixtureRow>

      <FixtureRow label="Archive parts">
        <div data-comp="public-archive-search-filters-default" style={{ width: 720 }}><ArchiveSearchFilters /></div>
        <div data-comp="public-archive-show-row-default" style={{ width: 720 }}><ArchiveShowRow date="Dec 12" name="Winter Solstice Rave" tag="Electronic" /></div>
        <div data-comp="public-archive-show-list-default" style={{ width: 720 }}><ArchiveShowList /></div>
      </FixtureRow>

      <FixtureRow label="Book extras">
        <div data-comp="public-show-type-chips-default" style={{ width: 560 }}><ShowTypeChips /></div>
        <div data-comp="public-booking-space-aside-default" style={{ width: 300 }}><BookingSpaceAside /></div>
        <div data-comp="public-safer-space-agreement-default" style={{ width: 560 }}><SaferSpaceAgreement /></div>
      </FixtureRow>

      <FixtureRow label="About extras">
        <div data-comp="public-about-intro-default" style={{ width: 620 }}><AboutIntro /></div>
        <div data-comp="public-ethos-grid-default" style={{ width: 856 }}><EthosGrid /></div>
        <div data-comp="public-collective-list-default" style={{ width: 400 }}><CollectiveList /></div>
        <div data-comp="public-find-us-block-default" style={{ width: 400 }}><FindUsBlock /></div>
      </FixtureRow>

      <FixtureRow label="Booking form">
        <div data-comp="public-booking-form-default" style={{ width: 560 }}><BookingForm /></div>
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
