import { useEffect, useMemo, useRef, useState } from 'react';
import type { Artist } from 'pyxis-types';
import { Button } from 'pyxis-components';
import { useCreateArtistMutation, useGetArtistsQuery, useUpdateArtistMutation } from '../../api/appApi';
import { AppShell } from '../../components/shell';
import { ArtistRoster, Panel } from '../../components/organisms';
import { ActionMessages, EmptyState, ErrorState, LoadingState } from '../shared';
import './Page.css';

type ArtistDraft = Pick<Artist, 'name' | 'genre' | 'links' | 'notes'>;

const emptyDraft: ArtistDraft = { name: '', genre: '', links: '', notes: '' };

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function ArtistsPage() {
  const { data: artists, isLoading, isError } = useGetArtistsQuery();
  const [createArtist, createState] = useCreateArtistMutation();
  const [updateArtist, updateState] = useUpdateArtistMutation();
  const [selected, setSelected] = useState<Artist | undefined>();
  const [draft, setDraft] = useState<ArtistDraft>(emptyDraft);
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();
  const [query, setQuery] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selected) return;
    setDraft({ name: selected.name, genre: selected.genre, links: selected.links, notes: selected.notes });
    setActionError(undefined);
    setActionSuccess(undefined);
  }, [selected]);

  const visibleArtists = useMemo(() => {
    if (!artists) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return artists;
    return artists.filter((artist) => [artist.name, artist.genre, artist.links, artist.notes].some((value) => value.toLowerCase().includes(needle)));
  }, [artists, query]);

  const set = <K extends keyof ArtistDraft>(key: K, value: ArtistDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const handleNew = () => {
    setSelected(undefined);
    setDraft(emptyDraft);
    setActionError(undefined);
    setActionSuccess(undefined);
    window.setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nameInputRef.current?.focus({ preventScroll: true });
    }, 0);
  };
  const handleSave = async () => {
    setActionError(undefined);
    setActionSuccess(undefined);
    const name = draft.name.trim();
    if (!name) { setActionError('Artist name is required.'); return; }
    const duplicate = artists?.find((artist) => artist.id !== selected?.id && normalizeName(artist.name) === normalizeName(name));
    if (duplicate) { setActionError(`An artist named “${duplicate.name}” already exists. Select that artist or choose a different name.`); return; }
    try {
      if (selected) {
        const updated = await updateArtist({ ...selected, ...draft, name }).unwrap();
        setSelected(updated);
        setActionSuccess('Artist updated.');
      } else {
        const created = await createArtist({ ...draft, name }).unwrap();
        setSelected(created);
        setActionSuccess('Artist created.');
      }
    } catch {
      setActionError('Could not save artist. Check for duplicate names, validation errors, session expiry, or backend logs.');
    }
  };

  return (
    <AppShell page="artists" title="Artists" eyebrow="Home / Artists" action={<Button size="sm" variant="outline" onClick={handleNew}>New artist</Button>}>
      {isLoading ? <LoadingState /> : isError || !artists ? <ErrorState /> : artists.length === 0 ? <><ActionMessages error={actionError} success={actionSuccess} /><EmptyState label="No artists returned from the backend." /></> : (
        <div className="app-detail-grid">
          <Panel title="All artists" section="artists-roster">
            <label className="app-page-search"><span>Search artists</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, genre, link, or notes" /></label>
            {visibleArtists.length > 0 ? <ArtistRoster artists={visibleArtists} selectedArtistId={selected?.id} onSelectArtist={setSelected} /> : <EmptyState label="No artists match that search." />}
          </Panel>
          <div ref={editorRef}>
            <Panel title={selected ? 'Artist detail' : 'New artist'} section="artist-editor">
              <div className="app-form-grid">
                <label><span>Name</span><input ref={nameInputRef} value={draft.name} onChange={(event) => set('name', event.target.value)} /></label>
                <label><span>Genre</span><input value={draft.genre} onChange={(event) => set('genre', event.target.value)} /></label>
                <label><span>Links</span><input value={draft.links} onChange={(event) => set('links', event.target.value)} placeholder="https://…" /></label>
                <label><span>Notes</span><textarea rows={5} value={draft.notes} onChange={(event) => set('notes', event.target.value)} /></label>
              </div>
              {selected && <div className="app-detail-list app-artist-detail-meta"><span>Created <b>{selected.createdAt || '—'}</b></span><span>Updated <b>{selected.updatedAt || '—'}</b></span></div>}
              <ActionMessages error={actionError} success={actionSuccess} />
              <div className="app-detail-actions"><Button variant="outline" onClick={handleNew}>Clear</Button><Button onClick={handleSave} disabled={!draft.name.trim()} isLoading={createState.isLoading || updateState.isLoading}>{selected ? 'Save artist' : 'Create artist'}</Button></div>
            </Panel>
          </div>
        </div>
      )}
    </AppShell>
  );
}
