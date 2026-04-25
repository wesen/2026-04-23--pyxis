import {
  AboutHero,
  AboutIntro,
  Button,
  CollectiveList,
  EthosGrid,
  FindUsBlock,
} from 'pyxis-components';
import './About.css';

export function About() {
  return (
    <main className="pyxis-public-page pyxis-about-page" data-page="about">
      <div className="pyxis-public-page__inner">
        <section className="pyxis-about-page__hero" data-section="about-hero">
          <AboutHero />
        </section>

        <div className="pyxis-about-page__image" data-section="about-image">
          [Hero image — venue interior]
        </div>

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

          <section className="pyxis-about-page__cta" data-section="about-cta">
            <Button variant="primary" iconRight="chevron-right">Book the space</Button>
          </section>
        </div>
      </div>
    </main>
  );
}
