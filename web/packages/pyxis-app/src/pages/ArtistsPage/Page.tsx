import { useEffect, useState } from 'react';
import type { Artist } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { useCreateArtistMutation, useGetArtistsQuery, useUpdateArtistMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { ArtistRoster, Panel } from '../../components/organisms';
import { EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

type ArtistDraft = Pick<Artist, 'name' | 'genre' | 'links' | 'notes'>;

const emptyDraft: ArtistDraft = { name: '', genre: '', links: '', notes: '' };

export function ArtistsPage() {
  const { data: artists, isLoading, isError } = useGetArtistsQuery();
  const [createArtist, createState] = useCreateArtistMutation();
  const [updateArtist, updateState] = useUpdateArtistMutation();
  const [selected, setSelected] = useState<Artist | undefined>();
  const [draft, setDraft] = useState<ArtistDraft>(emptyDraft);
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    if (!selected) return;
    setDraft({ name: selected.name, genre: selected.genre, links: selected.links, notes: selected.notes });
  }, [selected]);

  const set = <K extends keyof ArtistDraft>(key: K, value: ArtistDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const handleNew = () => { setSelected(undefined); setDraft(emptyDraft); setMessage(undefined); };
  const handleSave = async () => {
    setMessage(undefined);
    try {
      if (selected) {
        const updated = await updateArtist({ ...selected, ...draft }).unwrap();
        setSelected(updated);
        setMessage('Artist updated.');
      } else {
        const created = await createArtist(draft).unwrap();
        setSelected(created);
        setMessage('Artist created.');
      }
    } catch {
      setMessage('Could not save artist. Check your session and backend logs.');
    }
  };

  return (
    <AppShell page="artists" title="Artists" eyebrow="Home / Artists" action={<Button size="sm" variant="outline" onClick={handleNew}>New artist</Button>}>
      {isLoading ? <LoadingState /> : isError || !artists ? <ErrorState /> : artists.length === 0 ? <EmptyState label="No artists returned from the backend." /> : (
        <div className="app-detail-grid">
          <Panel title="All artists" section="artists-roster"><ArtistRoster artists={artists} selectedArtistId={selected?.id} onSelectArtist={setSelected} /></Panel>
          <Panel title={selected ? 'Artist detail' : 'New artist'} section="artist-editor">
            <div className="app-form-grid">
              <label><span>Name</span><input value={draft.name} onChange={(event) => set('name', event.target.value)} /></label>
              <label><span>Genre</span><input value={draft.genre} onChange={(event) => set('genre', event.target.value)} /></label>
              <label><span>Links</span><input value={draft.links} onChange={(event) => set('links', event.target.value)} /></label>
              <label><span>Notes</span><textarea rows={5} value={draft.notes} onChange={(event) => set('notes', event.target.value)} /></label>
            </div>
            {selected && <div className="app-detail-list app-artist-detail-meta"><span>Created <b>{selected.createdAt || '—'}</b></span><span>Updated <b>{selected.updatedAt || '—'}</b></span></div>}
            {message && <div className={message.startsWith('Could') ? 'app-action-error' : 'app-action-success'} role="status">{message}</div>}
            <div className="app-detail-actions"><Button variant="outline" onClick={handleNew}>Clear</Button><Button onClick={handleSave} disabled={!draft.name.trim()} isLoading={createState.isLoading || updateState.isLoading}>{selected ? 'Save artist' : 'Create artist'}</Button></div>
          </Panel>
        </div>
      )}
    </AppShell>
  );
}
