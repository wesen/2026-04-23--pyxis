/**
 * SEO head component — injects meta tags per page.
 * Usage: <Seo title="Show Archive" description="..." />
 * Falls back to site defaults if props are omitted.
 */

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

const SITE_NAME = 'Pyxis';
const SITE_URL = 'https://pyxis.xyz';
const SITE_DESCRIPTION =
  'A 150-capacity underground venue in Providence, RI. Noise, darkwave, EBM, techno, and everything else that other venues turn away.';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

export function Seo({
  title,
  description = SITE_DESCRIPTION,
  image = DEFAULT_IMAGE,
  noIndex = false,
}: SeoProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={SITE_URL} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Icons */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/favicon.svg" />
    </>
  );
}
