import { useSearchParams } from 'react-router-dom';
import { Button, Field, Input, PyxisMark } from 'pyxis-components';
import { endpoints } from '../../api/endpoints';
import './Page.css';

function buildDiscordLoginURL(returnTo: string | null) {
  const safeReturnTo = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
  const params = new URLSearchParams({ return_to: safeReturnTo });
  return `${endpoints.discordLogin}?${params.toString()}`;
}

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const loginURL = buildDiscordLoginURL(searchParams.get('return_to'));
  const handleDiscordLogin = () => {
    window.location.assign(loginURL);
  };

  return (
    <main className="app-auth-page" data-page="login">
      <section className="app-auth-marquee" data-section="login-marquee">
        <header><PyxisMark size={30}/><b>pyxis</b></header>
        <div>
          <h1><span className="app-auth-desktop-copy">The operations desk for a small-venue community.</span><span className="app-auth-mobile-copy">Run the room from your pocket.</span></h1>
          <p><span className="app-auth-desktop-copy">Confirm shows, review booking requests, and let a friendly bot handle the Discord posts, pins and archives — so the humans can focus on the music.</span><span className="app-auth-mobile-copy">Confirm shows, review bookings, and keep the Discord humming — wherever you are.</span></p>
          <Button type="button" className="app-auth-mobile-cta" variant="discord" size="lg" iconLeft="discord" fullWidth onClick={handleDiscordLogin}>Continue with Discord</Button>
        </div>
        <footer><span><strong>v1.2.0</strong> · est. 2025</span><span>25 Manton Ave · Providence RI</span></footer>
      </section>
      <section className="app-auth-panel" data-section="login-panel">
        <span className="app-eyebrow">Staff portal</span>
        <h2>Welcome back</h2>
        <p>Access is invite-only. Sign in with the Discord account your admin has authorised.</p>
        <Button type="button" variant="discord" size="lg" iconLeft="discord" fullWidth onClick={handleDiscordLogin}>Continue with Discord</Button>
        <div className="app-auth-divider"><i/>OR<i/></div>
        <Field label="Email"><Input placeholder="you@venue.xyz" icon="mail" disabled /></Field>
        <Field label="Magic link" hint="Discord login is active for this staff portal."><Input placeholder="Magic links are disabled" disabled /></Field>
        <Button type="button" variant="outline" size="lg" fullWidth disabled>Email me a link</Button>
        <footer><span>Not on the list? <b>Ask an admin →</b></span><span>Privacy</span></footer>
      </section>
    </main>
  );
}
