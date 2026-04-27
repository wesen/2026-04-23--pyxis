import { useGetArtistsQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell/AppShell';
import { ArtistRoster, Panel } from '../../components/organisms/Panels';
import { EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

export function ArtistsPage() {
  const { data: artists, isLoading, isError } = useGetArtistsQuery();

  return (
    <AppShell page="artists" title="Artists" eyebrow="Home / Artists">
      {isLoading ? <LoadingState /> : isError || !artists ? <ErrorState /> : artists.length === 0 ? <EmptyState label="No artists returned from the backend." /> : <Panel title="All artists" section="artists-roster"><ArtistRoster artists={artists} /></Panel>}
    </AppShell>
  );
}
