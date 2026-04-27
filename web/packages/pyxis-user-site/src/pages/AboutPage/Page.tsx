import {
  AboutIntro,
  CollectiveList,
  EthosGrid,
  FindUsBlock,
  PublicPageHeader,
} from 'pyxis-components';
import './Page.css';

export function About() {
  return (
    <main className="pyxis-public-page pyxis-about-page" data-page="about">
      <div className="pyxis-public-page__inner">
        <header className="pyxis-about-page__hero" data-section="about-hero">
          <PublicPageHeader kicker="Est. 2023" title="About ppxis" />
        </header>

        <div className="pyxis-about-page__sections" data-section="about-content">
          <section data-section="about-intro">
            <AboutIntro />
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
