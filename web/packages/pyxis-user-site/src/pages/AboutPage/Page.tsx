import {
  AboutIntro,
  CollectiveList,
  EthosGrid,
  FindUsBlock,
  PublicPageHeader,
} from 'pyxis-components';
import { usePublicSettings } from '../../api/hooks';
import './Page.css';

export function About() {
  const { data: settings } = usePublicSettings();
  return (
    <main className="pyxis-public-page pyxis-about-page" data-page="about">
      <div className="pyxis-public-page__inner">
        <header className="pyxis-about-page__hero" data-section="about-hero">
          <PublicPageHeader kicker={settings?.tagline || 'Est. 2023'} title={`About ${settings?.spaceName || 'ppxis'}`} />
        </header>

        <div className="pyxis-about-page__sections" data-section="about-content">
          <section data-section="about-intro">
            <AboutIntro lead={settings?.tagline || undefined} />
          </section>

          <section data-section="about-ethos">
            <EthosGrid />
          </section>

          <section className="pyxis-about-page__split" data-section="about-collective-find-us">
            <CollectiveList />
            <FindUsBlock />
          </section>
        </div>
      </div>
    </main>
  );
}
