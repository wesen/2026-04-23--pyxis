// Pyxis public-facing site — uses window.PX tokens + lib/components.
// Screens: Shows (upcoming), Show detail, Archive, Book us, About.
// Visual language: warm paper (#F3F1EB), Fraunces display, Inter body,
// single crimson accent. Reads like a printed show bill.

const PC = window.PX.color, PR = window.PX.radius, PF = window.PX.font;

/* ───────── public data (derived from PX_DATA, extended with public copy) ───────── */

const PUB_UPCOMING = [
  { id: 42, artist: "Burial Hex",     date: "2025-05-02", doors: "8:00 PM", age: "21+", price: "$12 adv / $15 door", genre: "Darkwave / Ritual Ambient",
    desc: "Cole Coonce's long-running ritual electronics project. Heavy drones, processed vocals, and an immersive ceremony-like performance. Support TBA.",
    tickets: true, soldOut: false },
  { id: 43, artist: "Moor Mother",    date: "2025-05-09", doors: "7:00 PM", age: "All Ages", price: "$15", genre: "Experimental / Noise Poetry",
    desc: "Philadelphia-based poet, musician, and activist Camae Ayewa performing as Moor Mother. Raw, confrontational, essential.",
    tickets: true, soldOut: true },
  { id: 44, artist: "Cygnus + Guests", date: "2025-05-17", doors: "9:00 PM", age: "18+", price: "$8", genre: "Techno",
    desc: "Cygnus brings his signature hybrid live/DJ set of hard techno and electro, joined by local guests TBA. Dance floor in full effect.",
    tickets: true, soldOut: false },
  { id: 45, artist: "Open Mic Night", date: "2025-05-23", doors: "7:00 PM", age: "All Ages", price: "Free", genre: "Open Format",
    desc: "Monthly open mic. All formats welcome — music, spoken word, performance, whatever you've got. Sign up at the door from 6:30.",
    tickets: false, soldOut: false },
  { id: 46, artist: "Zola Jesus",     date: "2025-06-06", doors: "8:00 PM", age: "21+", price: "$20", genre: "Art Pop / Darkwave",
    desc: "Nika Roza Danilova returns to Providence on her headline tour. One of the most powerful live performers working today.",
    tickets: true, soldOut: false },
  { id: 47, artist: "Orphx",          date: "2025-07-04", doors: "9:00 PM", age: "18+", price: "$12", genre: "EBM / Industrial",
    desc: "Canadian EBM veterans Orphx make a rare US appearance. Driving beats, sharp synths, a wall of sound.",
    tickets: true, soldOut: false },
];

const PUB_ARCHIVE = [
  { id: 41, artist: "Planning for Burial", date: "2025-03-14", genre: "Ambient",      draw: 34 },
  { id: 40, artist: "Actress",             date: "2025-02-28", genre: "Electronic",   draw: 61 },
  { id: 39, artist: "Container",           date: "2025-01-18", genre: "Noise",        draw: 55 },
  { id: 38, artist: "Burial Hex",          date: "2024-11-15", genre: "Darkwave",     draw: 55 },
  { id: 37, artist: "Moor Mother",         date: "2024-09-06", genre: "Experimental", draw: 94 },
  { id: 36, artist: "Pharmakon",           date: "2024-08-02", genre: "Industrial",   draw: 80 },
  { id: 35, artist: "Cygnus",              date: "2024-07-19", genre: "Techno",       draw: 88 },
  { id: 34, artist: "Actress",             date: "2024-05-10", genre: "Electronic",   draw: 72 },
  { id: 33, artist: "Planning for Burial", date: "2024-04-12", genre: "Ambient",      draw: 41 },
  { id: 32, artist: "Container",           date: "2024-02-23", genre: "Noise",        draw: 49 },
  { id: 31, artist: "Zola Jesus",          date: "2023-12-08", genre: "Art Pop",      draw: 148 },
  { id: 30, artist: "Orphx",               date: "2023-10-27", genre: "EBM",          draw: 77 },
];

const fmtFull  = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const fmtMed   = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtMonth = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short" }).toUpperCase();
const fmtDay   = d => new Date(d + "T00:00:00").getDate();
const fmtYear  = d => new Date(d + "T00:00:00").getFullYear();

/* ───────── shared chrome ───────── */

function PubShell({ page, onNav, children, width = 1180, height = 820 }) {
  return (
    <div className="px-root" style={{ width, height, background: PC.bg, overflow: "hidden", borderRadius: PR.lg, border: `1px solid ${PC.line}`, display: "flex", flexDirection: "column", color: PC.ink }}>
      <PubNav page={page} onNav={onNav} />
      <main className="px-scroll" style={{ flex: 1, overflow: "auto" }}>
        {children}
        <PubFooter />
      </main>
    </div>
  );
}

function PubNav({ page, onNav }) {
  const links = [
    { id: "shows",    label: "Shows" },
    { id: "archive",  label: "Archive" },
    { id: "book",     label: "Book us" },
    { id: "about",    label: "About" },
  ];
  const isShows = page === "shows" || page === "detail";
  return (
    <header style={{ background: "rgba(243,241,235,.88)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${PC.line}`, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
        <button onClick={() => onNav("shows")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <PyxisMark size={22} color={PC.ink} />
          <span className="px-serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.025em", color: PC.ink }}>pyxis</span>
        </button>
        <nav style={{ display: "flex", gap: 2 }}>
          {links.map(l => {
            const active = l.id === page || (l.id === "shows" && isShows);
            return (
              <button key={l.id} onClick={() => onNav(l.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                  padding: "8px 14px", fontSize: 13, fontWeight: active ? 600 : 500,
                  color: active ? PC.ink : PC.ink3, position: "relative",
                }}>
                {l.label}
                {active && <span style={{ position: "absolute", left: 14, right: 14, bottom: 4, height: 1.5, background: PC.accent }} />}
              </button>
            );
          })}
          <button onClick={() => onNav("book")} style={{
            marginLeft: 14, background: PC.ink, color: "#fff", border: "none", borderRadius: PR.pill,
            padding: "8px 18px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Get tickets</button>
        </nav>
      </div>
    </header>
  );
}

function PubFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${PC.line}`, marginTop: 80, padding: "44px 32px 36px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 32, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <PyxisMark size={22} color={PC.ink} />
            <span className="px-serif" style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em" }}>pyxis</span>
          </div>
          <div style={{ fontSize: 12, color: PC.ink3, fontStyle: "italic", lineHeight: 1.7 }}>
            A music and artist space in Providence, RI.<br/>
            25 Manton Ave · Providence RI 02909
          </div>
        </div>
        {[
          ["Visit", ["Shows", "Archive", "Book us", "About"]],
          ["Follow", ["Instagram", "Bandcamp", "Discord"]],
          ["Stay in touch", ["Mailing list", "hello@pyxis.xyz"]],
        ].map(([h, items]) => (
          <div key={h}>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".09em", color: PC.ink3, fontWeight: 600, marginBottom: 10 }}>{h}</div>
            {items.map(i => <div key={i} style={{ fontSize: 13, color: PC.ink2, marginBottom: 6 }}>{i}</div>)}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 980, margin: "40px auto 0", paddingTop: 20, borderTop: `1px solid ${PC.line}`, display: "flex", justifyContent: "space-between", fontSize: 11, color: PC.ink4 }}>
        <div>© 2025 Pyxis · A staff collective</div>
        <div>Since 2021 · 247 shows and counting</div>
      </div>
    </footer>
  );
}

/* ───────── SHOWS ───────── */

function PubShows({ onShowClick, onNav }) {
  const [hero, ...rest] = PUB_UPCOMING;
  return (
    <div>
      {/* Hero marquee — the next big show */}
      <div style={{ background: PC.ink, color: "#fff", borderBottom: `1px solid ${PC.ink}` }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "56px 32px 52px", display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 40, alignItems: "center", position: "relative" }}>
          <div style={{ position: "absolute", right: -80, top: -40, opacity: .06 }}><PyxisMark size={320} color="#fff" /></div>

          <div style={{ textAlign: "center", position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>{fmtMonth(hero.date)}</div>
            <div className="px-serif" style={{ fontSize: 88, fontWeight: 500, lineHeight: .9, letterSpacing: "-0.03em", marginTop: 2 }}>{fmtDay(hero.date)}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 4, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600 }}>
              {new Date(hero.date+"T00:00:00").toLocaleDateString("en-US",{weekday:"short"})}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: PC.accent, marginBottom: 10 }}>Next on stage</div>
            <div className="px-serif" style={{ fontSize: 54, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{hero.artist}</div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.7)", lineHeight: 1.7, maxWidth: 540 }}>{hero.desc}</div>
            <div style={{ display: "flex", gap: 18, marginTop: 18, fontSize: 12, color: "rgba(255,255,255,.55)" }}>
              <span>Doors {hero.doors}</span>
              <span>·</span>
              <span>{hero.age}</span>
              <span>·</span>
              <span>{hero.price}</span>
              <span>·</span>
              <span>{hero.genre}</span>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <button onClick={() => onShowClick(hero)} style={{
              background: "#fff", color: PC.ink, border: "none", borderRadius: PR.pill,
              padding: "13px 24px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              Tickets <Icon name="chev" size={14} color={PC.ink} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "56px 32px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", color: PC.ink3, textTransform: "uppercase", marginBottom: 10 }}>Providence, Rhode Island</div>
            <h1 className="px-serif" style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: .98, margin: 0 }}>Upcoming<br/>shows.</h1>
          </div>
          <div style={{ fontSize: 12, color: PC.ink3, textAlign: "right", maxWidth: 240 }}>
            {PUB_UPCOMING.length} shows booked<br/>
            through summer 2025 →
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${PC.ink}` }}>
          {rest.map((show, i) => (
            <div key={show.id} onClick={() => onShowClick(show)} className="pyx-row" style={{
              display: "grid", gridTemplateColumns: "92px 1fr 200px 140px", gap: 28, alignItems: "center",
              padding: "28px 12px", borderBottom: `1px solid ${PC.line}`, cursor: "pointer", transition: "background .15s",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", color: PC.ink3, textTransform: "uppercase" }}>{fmtMonth(show.date)}</div>
                <div className="px-serif" style={{ fontSize: 44, fontWeight: 500, lineHeight: .9, letterSpacing: "-0.02em", marginTop: 2 }}>{fmtDay(show.date)}</div>
                <div style={{ fontSize: 10, color: PC.ink3, marginTop: 3, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600 }}>
                  {new Date(show.date+"T00:00:00").toLocaleDateString("en-US",{weekday:"short"})}
                </div>
              </div>

              <div>
                <div className="px-serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 6 }}>{show.artist}</div>
                <div style={{ fontSize: 12.5, color: PC.ink2, lineHeight: 1.65, maxWidth: 440 }}>{show.desc.length > 110 ? show.desc.slice(0, 110) + "…" : show.desc}</div>
              </div>

              <div style={{ fontSize: 11.5, color: PC.ink3, lineHeight: 1.9 }}>
                <div style={{ color: PC.ink2 }}>{show.genre}</div>
                <div>Doors {show.doors}</div>
                <div>{show.age} · {show.price}</div>
              </div>

              <div style={{ textAlign: "right" }}>
                {show.soldOut ? (
                  <span style={{ fontSize: 11, fontWeight: 600, color: PC.mute, background: PC.muteLt, padding: "6px 12px", borderRadius: PR.pill, letterSpacing: ".04em" }}>SOLD OUT</span>
                ) : show.price === "Free" ? (
                  <span style={{ fontSize: 11, fontWeight: 600, color: PC.green, background: PC.greenLt, padding: "6px 12px", borderRadius: PR.pill, letterSpacing: ".04em" }}>FREE · WALK UP</span>
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 600, color: PC.accent, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Get tickets <Icon name="chev" size={12} color={PC.accent} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary panel — mailing list */}
        <div style={{ marginTop: 56, background: PC.surface, border: `1px solid ${PC.line}`, borderRadius: PR.lg, padding: 36, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", color: PC.accent, textTransform: "uppercase", marginBottom: 10 }}>Don't miss a show</div>
            <h3 className="px-serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1 }}>One short email, once a month.</h3>
            <div style={{ fontSize: 13, color: PC.ink2, marginTop: 8, lineHeight: 1.6 }}>Upcoming shows, tickets before they go public, nothing else.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="you@wherever.com" style={{ flex: 1, padding: "12px 14px", borderRadius: PR.md, border: `1px solid ${PC.line}`, fontSize: 13, background: PC.bg, outline: "none", fontFamily: "inherit", color: PC.ink }} />
            <button style={{ background: PC.ink, color: "#fff", border: "none", borderRadius: PR.md, padding: "0 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── SHOW DETAIL ───────── */

function PubShowDetail({ show, onBack }) {
  return (
    <div>
      {/* Poster strip */}
      <div style={{ background: PC.ink, color: "#fff", borderBottom: `1px solid ${PC.ink}` }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 32px 0" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.6)", fontSize: 12, fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="chev" size={12} color="rgba(255,255,255,.6)" style={{ transform: "scaleX(-1)" }} /> All shows
          </button>
        </div>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "44px 32px 56px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 56, alignItems: "end", position: "relative" }}>
          <div style={{ position: "absolute", right: -60, top: -40, opacity: .07 }}><PyxisMark size={300} color="#fff" /></div>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".16em", color: PC.accent, textTransform: "uppercase", marginBottom: 14 }}>{fmtFull(show.date)}</div>
            <h1 className="px-serif" style={{ fontSize: 80, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: .92, margin: 0 }}>{show.artist}</h1>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.6)", marginTop: 12, fontStyle: "italic" }}>{show.genre}</div>
          </div>
          <div style={{ position: "relative" }}>
            {/* Ticket-stub visual */}
            <div style={{ background: PC.bg, color: PC.ink, borderRadius: PR.lg, padding: 22, position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,.4)" }}>
              <div style={{ position: "absolute", left: -6, top: "50%", width: 12, height: 12, borderRadius: "50%", background: PC.ink, transform: "translateY(-50%)" }} />
              <div style={{ position: "absolute", right: -6, top: "50%", width: 12, height: 12, borderRadius: "50%", background: PC.ink, transform: "translateY(-50%)" }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: PC.accent, marginBottom: 4 }}>Admit one</div>
              <div className="px-serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 12 }}>{show.artist}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11, color: PC.ink3, paddingTop: 12, borderTop: `1px dashed ${PC.line}` }}>
                <div><div style={{ color: PC.ink4, fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 600 }}>Doors</div>{show.doors}</div>
                <div><div style={{ color: PC.ink4, fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 600 }}>Price</div>{show.price}</div>
                <div><div style={{ color: PC.ink4, fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 600 }}>Age</div>{show.age}</div>
                <div><div style={{ color: PC.ink4, fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 600 }}>No.</div>#{show.id}</div>
              </div>
              <div style={{ marginTop: 14, height: 22, display: "flex", gap: 2 }}>
                {Array.from({length: 34}).map((_, i) => <div key={i} style={{ flex: 1, background: PC.ink, opacity: (i % 3 === 0 ? 1 : i % 2 === 0 ? .6 : .3) }} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "56px 32px 0", display: "grid", gridTemplateColumns: "1fr 300px", gap: 56, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: PC.ink3, textTransform: "uppercase", marginBottom: 14 }}>About the show</div>
          <div className="px-serif" style={{ fontSize: 22, fontWeight: 400, color: PC.ink, lineHeight: 1.5, marginBottom: 28, letterSpacing: "-0.005em" }}>
            {show.desc}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 44 }}>
            {show.soldOut ? (
              <button disabled style={{ background: PC.muteLt, color: PC.mute, border: "none", borderRadius: PR.pill, padding: "14px 30px", fontSize: 14, fontWeight: 600, cursor: "not-allowed", fontFamily: "inherit" }}>
                Sold out
              </button>
            ) : show.price === "Free" ? (
              <button style={{ background: PC.ink, color: "#fff", border: "none", borderRadius: PR.pill, padding: "14px 30px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Free · just show up
              </button>
            ) : (
              <button style={{ background: PC.accent, color: "#fff", border: "none", borderRadius: PR.pill, padding: "14px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Get tickets — {show.price}
              </button>
            )}
            <button style={{ background: "transparent", color: PC.ink2, border: `1px solid ${PC.line}`, borderRadius: PR.pill, padding: "14px 22px", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Add to calendar
            </button>
          </div>

          {/* Lineup */}
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: PC.ink3, textTransform: "uppercase", marginBottom: 14 }}>Lineup</div>
          <div>
            {[
              [show.artist, "Headline", "9:30 PM"],
              ["Support TBA", "Opening", "8:30 PM"],
            ].map(([n, role, t]) => (
              <div key={n} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 18, padding: "16px 0", borderTop: `1px solid ${PC.line}`, alignItems: "baseline" }}>
                <div className="px-serif" style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>{n}</div>
                <div style={{ fontSize: 12, color: PC.ink3 }}>{role}</div>
                <div style={{ fontSize: 12, color: PC.ink3, fontVariantNumeric: "tabular-nums", minWidth: 60, textAlign: "right" }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Side card */}
        <div style={{ position: "sticky", top: 84 }}>
          <div style={{ background: PC.surface, border: `1px solid ${PC.line}`, borderRadius: PR.lg, padding: 22 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".12em", color: PC.ink3, textTransform: "uppercase", marginBottom: 14 }}>Venue</div>
            <div className="px-serif" style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 4 }}>Pyxis</div>
            <div style={{ fontSize: 12, color: PC.ink2, lineHeight: 1.6, marginBottom: 16 }}>
              25 Manton Ave<br/>Providence, RI 02909
            </div>
            <div style={{ height: 120, background: `repeating-linear-gradient(45deg, ${PC.muteLt} 0 8px, ${PC.surface2} 8px 16px)`, border: `1px solid ${PC.line}`, borderRadius: PR.md, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", color: PC.ink4, fontSize: 11, fontFamily: PF.mono }}>
              ◆ map placeholder
            </div>
            <div style={{ fontSize: 12, color: PC.ink3, lineHeight: 1.7 }}>
              Street parking · Walkable from downtown · BYOB welcome, no glass.
            </div>
          </div>
          <div style={{ marginTop: 14, padding: "16px 20px", background: PC.accentLt, border: `1px solid ${PC.accent}22`, borderRadius: PR.md, fontSize: 12, color: PC.ink2, lineHeight: 1.65 }}>
            <strong style={{ color: PC.accent, fontWeight: 600 }}>Heads up:</strong> capacity is 150. We always sell out these headliners — grab tickets early.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── ARCHIVE ───────── */

function PubArchive() {
  const [q, setQ] = React.useState("");
  const filtered = PUB_ARCHIVE.filter(s =>
    s.artist.toLowerCase().includes(q.toLowerCase()) ||
    s.genre.toLowerCase().includes(q.toLowerCase())
  );
  const byYear = filtered.reduce((acc, s) => {
    const y = fmtYear(s.date);
    (acc[y] = acc[y] || []).push(s);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "72px 32px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 40, alignItems: "end", marginBottom: 48 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", color: PC.ink3, textTransform: "uppercase", marginBottom: 10 }}>Every show since day one</div>
          <h1 className="px-serif" style={{ fontSize: 72, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: .95, margin: 0 }}>Archive.</h1>
          <div style={{ fontSize: 13.5, color: PC.ink2, marginTop: 12, maxWidth: 440, lineHeight: 1.65 }}>
            Four years of shows at 25 Manton Ave. Search by artist or genre — if we had them, they're here.
          </div>
        </div>
        <div>
          <div style={{ position: "relative" }}>
            <Icon name="search" size={14} color={PC.ink3} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Artist or genre…" style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: PR.pill, border: `1px solid ${PC.line}`, fontSize: 13, background: PC.surface, outline: "none", fontFamily: "inherit", color: PC.ink, boxSizing: "border-box" }} />
          </div>
          <div style={{ fontSize: 11, color: PC.ink3, marginTop: 8, textAlign: "right" }}>
            {filtered.length} of {PUB_ARCHIVE.length} shows
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginBottom: 56, borderTop: `1px solid ${PC.ink}`, borderBottom: `1px solid ${PC.line}` }}>
        {[
          ["247", "Total shows"],
          ["18,400", "People through the door"],
          ["4", "Years running"],
          ["132", "Unique artists"],
        ].map(([v, l], i) => (
          <div key={l} style={{ padding: "24px 20px", borderLeft: i > 0 ? `1px solid ${PC.line}` : "none" }}>
            <div className="px-serif" style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 11, color: PC.ink3, textTransform: "uppercase", letterSpacing: ".09em", marginTop: 8, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      {Object.keys(byYear).sort((a,b) => b - a).map(year => (
        <div key={year} style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${PC.ink}` }}>
            <div className="px-serif" style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em" }}>{year}</div>
            <div style={{ fontSize: 11, color: PC.ink3, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 600 }}>
              {byYear[year].length} {byYear[year].length === 1 ? "show" : "shows"}
            </div>
          </div>
          {byYear[year].map((s) => (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: "110px 1fr 180px 90px", gap: 24, alignItems: "center", padding: "14px 12px", borderBottom: `1px solid ${PC.line}`, cursor: "default" }}>
              <div style={{ fontSize: 12, color: PC.ink3, fontVariantNumeric: "tabular-nums" }}>{fmtMed(s.date)}</div>
              <div className="px-serif" style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>{s.artist}</div>
              <div><Tag>{s.genre}</Tag></div>
              <div style={{ fontSize: 12, color: PC.ink3, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{s.draw} attended</div>
            </div>
          ))}
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: PC.ink3, fontSize: 14 }}>
          No shows match "<span style={{ color: PC.ink }}>{q}</span>"
        </div>
      )}
    </div>
  );
}

/* ───────── BOOK US ───────── */

function PubBook() {
  const [form, setForm] = React.useState({ name: "", genre: "", date: "", draw: "", links: "", tech: "", message: "" });
  const [sent, setSent] = React.useState(false);
  const set = k => v => setForm(p => ({ ...p, [k]: v }));

  if (sent) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "140px 32px 0", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: PC.greenLt, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Icon name="check" size={22} color={PC.green} stroke={2} />
        </div>
        <h1 className="px-serif" style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.03em", margin: "0 0 14px", lineHeight: 1 }}>Got it.</h1>
        <div style={{ fontSize: 15, color: PC.ink2, lineHeight: 1.7, marginBottom: 28 }}>
          We read every submission. If your dates are flexible, mention it — it helps. Expect a reply within a week.
        </div>
        <button onClick={() => setSent(false)} style={{ background: "transparent", border: `1px solid ${PC.line}`, borderRadius: PR.pill, padding: "10px 22px", fontSize: 13, cursor: "pointer", color: PC.ink2, fontFamily: "inherit" }}>Submit another</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "72px 32px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 64, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", color: PC.ink3, textTransform: "uppercase", marginBottom: 10 }}>Play at Pyxis</div>
          <h1 className="px-serif" style={{ fontSize: 72, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: .95, margin: "0 0 16px" }}>Book us.</h1>
          <p style={{ fontSize: 15, color: PC.ink2, lineHeight: 1.75, marginBottom: 44, maxWidth: 520 }}>
            We're into most things — ambient, noise, techno, jazz, poetry, whatever. Don't second-guess yourself. Fill this out and we'll be in touch.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Artist or project *"><Input value={form.name} onChange={set("name")} placeholder="What should we call you?" /></Field>
            </div>
            <Field label="Genre · style"><Input value={form.genre} onChange={set("genre")} placeholder="e.g. Noise, Jazz, EBM" /></Field>
            <Field label="Preferred date"><Input value={form.date} onChange={set("date")} placeholder="Month, rough week, or specific day" /></Field>
            <Field label="Expected draw"><Input value={form.draw} onChange={set("draw")} placeholder="Rough headcount" /></Field>
            <Field label="Links *"><Input value={form.links} onChange={set("links")} placeholder="Bandcamp, Instagram, anything" /></Field>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Tech rider · needs"><Input value={form.tech} onChange={set("tech")} placeholder="PA, backline, anything specific" /></Field>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Anything else">
                <Textarea value={form.message} onChange={set("message")} rows={5} placeholder="Tell us about the project, touring context, the kind of show you're imagining." />
              </Field>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 14 }}>
            <button
              onClick={() => form.name && form.links && setSent(true)}
              style={{ background: PC.accent, color: "#fff", border: "none", borderRadius: PR.pill, padding: "14px 32px", fontSize: 14, fontWeight: 600, cursor: form.name && form.links ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: form.name && form.links ? 1 : .5 }}>
              Send inquiry →
            </button>
            <div style={{ fontSize: 11.5, color: PC.ink3 }}>* required · we reply to everything</div>
          </div>
        </div>

        {/* Sidebar — the space & the rules */}
        <div style={{ position: "sticky", top: 84, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: PC.ink, color: "#fff", borderRadius: PR.lg, padding: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -40, top: -30, opacity: .08 }}><PyxisMark size={180} color="#fff" /></div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", color: PC.accent, textTransform: "uppercase", marginBottom: 12, position: "relative" }}>The space</div>
            <div style={{ position: "relative" }}>
              {[["Capacity", "~150 standing"], ["Stages", "1 main room"], ["Address", "25 Manton Ave, Providence RI"], ["Ages", "Varies by show"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.08)", fontSize: 12.5 }}>
                  <span style={{ color: "rgba(255,255,255,.55)" }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: PC.surface, border: `1px solid ${PC.line}`, borderRadius: PR.lg, padding: 22 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", color: PC.ink3, textTransform: "uppercase", marginBottom: 14 }}>What to know</div>
            {[
              "We book 4–8 weeks out on average.",
              "Live, DJ, hybrid, or performance — all welcome.",
              "Door splits or flat guarantees depending on the show.",
              "Dates are soft-held until we confirm in writing.",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 12.5, color: PC.ink2, lineHeight: 1.65 }}>
                <span style={{ color: PC.accent, fontWeight: 700, flexShrink: 0 }}>{String(i+1).padStart(2, "0")}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── ABOUT ───────── */

function PubAbout({ onNav }) {
  return (
    <div>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "72px 32px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", color: PC.ink3, textTransform: "uppercase", marginBottom: 14 }}>Providence, Rhode Island · since 2021</div>
        <h1 className="px-serif" style={{ fontSize: 88, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: .92, margin: "0 0 24px", maxWidth: 820 }}>
          A room where the weird shows happen.
        </h1>
        <div style={{ fontSize: 18, color: PC.ink2, lineHeight: 1.65, maxWidth: 680, marginBottom: 56 }}>
          Pyxis is an independent artist space on Manton Ave. Live music, DJ nights, performance, anything that doesn't fit neatly in the rooms around town.
        </div>

        {/* Image strip placeholder */}
        <div style={{ height: 340, borderRadius: PR.lg, background: `repeating-linear-gradient(135deg, ${PC.muteLt} 0 12px, ${PC.surface2} 12px 24px)`, border: `1px solid ${PC.line}`, marginBottom: 64, display: "flex", alignItems: "center", justifyContent: "center", color: PC.ink3, fontSize: 12, fontFamily: PF.mono, letterSpacing: ".1em" }}>
          ◆ hero photograph — 980 × 340
        </div>

        {/* Body columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, marginBottom: 72 }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", color: PC.accent, textTransform: "uppercase", marginBottom: 14 }}>What we do</div>
            <div style={{ fontSize: 15, color: PC.ink, lineHeight: 1.8, marginBottom: 18 }}>
              We've been running shows here since 2021. The focus has always been underground and experimental work — things that don't fit the usual venues.
            </div>
            <div style={{ fontSize: 15, color: PC.ink, lineHeight: 1.8, marginBottom: 18 }}>
              We're staff-run by a small collective. Sound is dialled by people who care about it. Doors are staffed by people who know the artists.
            </div>
            <div style={{ fontSize: 15, color: PC.ink, lineHeight: 1.8 }}>
              No bouncers. No bottle service. Bring your friends.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", color: PC.accent, textTransform: "uppercase", marginBottom: 14 }}>Visit</div>
            <div style={{ background: PC.surface, border: `1px solid ${PC.line}`, borderRadius: PR.lg, padding: 24 }}>
              {[
                ["Address", "25 Manton Ave, Providence RI 02909"],
                ["Capacity", "~150 standing"],
                ["Email", "hello@pyxis.xyz"],
                ["Hours", "Show nights · doors from 7"],
              ].map(([k, v], i, arr) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${PC.line2}` : "none" }}>
                  <span style={{ fontSize: 11, color: PC.ink3, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: PC.ink }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ethos strip */}
        <div style={{ background: PC.ink, color: "#fff", borderRadius: PR.lg, padding: "48px 40px", marginBottom: 64, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -60, top: -30, opacity: .05 }}><PyxisMark size={340} color="#fff" /></div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", color: PC.accent, textTransform: "uppercase", marginBottom: 20, position: "relative" }}>How we run it</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, position: "relative" }}>
            {[
              ["01", "Artists first", "Guarantees and door splits negotiated fairly. We'd rather lose money on a show than stiff someone at the end of the night."],
              ["02", "Room for risk", "We book things we haven't seen before. If a sound isn't represented in Providence, we're interested."],
              ["03", "All ages when we can", "We lean all-ages whenever the show and insurance allow it. No artificial gatekeeping."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <div className="px-serif" style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", color: PC.accent, marginBottom: 10 }}>{n}</div>
                <div className="px-serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 10 }}>{t}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.65 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <button onClick={() => onNav("book")} style={{ background: PC.accent, color: "#fff", border: "none", borderRadius: PR.pill, padding: "14px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Book the space →
          </button>
          <button onClick={() => onNav("shows")} style={{ background: "transparent", color: PC.ink2, border: `1px solid ${PC.line}`, borderRadius: PR.pill, padding: "14px 24px", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            See upcoming shows
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PubShell, PubShows, PubShowDetail, PubArchive, PubBook, PubAbout, PUB_UPCOMING, PUB_ARCHIVE });
