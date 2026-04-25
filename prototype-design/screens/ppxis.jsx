// Pyxis public site — poster-grid edition.
// Inspired by reference: lowercase "ppxis" wordmark, minimal nav, light bg,
// 3-up grid of poster tiles with info + tickets pill below.
// Each poster is drawn in pure CSS/SVG (no external imagery needed).

const PP = window.PX.color, PPR = window.PX.radius, PPF = window.PX.font;
const PINK = "#1F1E1C";
const PRULE = "#EAE7E0";
const PMUTE = "#8E887E";

/* ───────── Data with poster specs ───────── */

const P_SHOWS = [
  {
    id: 1, title: "Redroom Inferno", date: "Fri, Feb 14", time: "9:00 PM", age: "25+", price: "$10 adv / $15 door", kind: "tickets",
    poster: "redroom",
  },
  {
    id: 2, title: "808 Collective", date: "Fri, Feb 21", time: "8:00 PM", age: "21+", price: "$12", kind: "tickets",
    poster: "pixel808",
  },
  {
    id: 3, title: "Petals of Love", date: "Sat, Feb 28", time: "6:30 PM", age: "All Ages", price: "$15", kind: "tickets",
    poster: "petals",
  },
  {
    id: 4, title: "Monday Meet-Ups", date: "Every Monday", time: "7:00 PM", age: "All Ages", price: "Free — Sliding Scale", kind: "learn",
    poster: "meetups",
  },
  {
    id: 5, title: "Basement Frequencies", date: "Fri, Feb 28", time: "9:30 PM", age: "21+", price: "$12", kind: "tickets",
    poster: "basement",
  },
  {
    id: 6, title: "Orphx", date: "Fri, Jul 4", time: "9:00 PM", age: "18+", price: "$12", kind: "tickets",
    poster: "orphx",
  },
  {
    id: 7, title: "Moor Mother", date: "Fri, May 9", time: "7:00 PM", age: "All Ages", price: "$15", kind: "soldout",
    poster: "moor",
  },
  {
    id: 8, title: "Cygnus + Guests", date: "Sat, May 17", time: "9:00 PM", age: "18+", price: "$8", kind: "tickets",
    poster: "cygnus",
  },
  {
    id: 9, title: "Zola Jesus", date: "Fri, Jun 6", time: "8:00 PM", age: "21+", price: "$20", kind: "tickets",
    poster: "zola",
  },
];

/* ───────── Posters (pure CSS/SVG) ───────── */

function Poster({ kind, ratio = "4/5" }) {
  const map = {
    redroom: PosterRedroom,
    pixel808: Poster808,
    petals: PosterPetals,
    meetups: PosterMeetups,
    basement: PosterBasement,
    orphx: PosterOrphx,
    moor: PosterMoor,
    cygnus: PosterCygnus,
    zola: PosterZola,
  };
  const C = map[kind] || Poster808;
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: ratio, borderRadius: 4, overflow: "hidden", background: "#111" }}>
      <C />
    </div>
  );
}

function PosterRedroom() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, #7A0E0E 0%, #3D0505 60%, #1A0202 100%)", color: "#FFD9C8", textAlign: "center", fontFamily: "'Fraunces', Georgia, serif", padding: "18px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 9, letterSpacing: ".15em", opacity: .6, textTransform: "uppercase", fontStyle: "italic" }}>A Dusknight residency at ppxis</div>
        <div style={{ fontSize: 20, fontWeight: 600, fontStyle: "italic", margin: "8px 0 2px", color: "#E84545" }}>Redroom Inferno</div>
        <div style={{ fontSize: 8, opacity: .55, fontStyle: "italic" }}>A Kink · Electronica · Queer Music Party</div>
      </div>
      <div style={{ fontSize: 48, color: "#E84545", opacity: .7, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, transform: "translateY(-8px)" }}>♡</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#E84545", fontStyle: "italic" }}>Feb. 14th, 2026</div>
        <div style={{ fontSize: 7.5, opacity: .55, marginTop: 6, letterSpacing: ".02em" }}>25 Manton Ave, Providence RI</div>
        <div style={{ fontSize: 7.5, opacity: .55 }}>21+ · tickets available online ($10 – $15)</div>
        <div style={{ fontSize: 7.5, opacity: .55, marginTop: 8, letterSpacing: ".05em" }}>No Photography · or · Video Recording · Allowed</div>
      </div>
    </div>
  );
}

function Poster808() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B0B0B", color: "#fff", padding: "14px", display: "flex", flexDirection: "column" }}>
      {/* Pixel 808 blocks top */}
      <div style={{ display: "flex", gap: 2, marginBottom: 12, height: 50 }}>
        {["#E24A2E", "#F26B1F", "#F39020", "#F1B51D", "#FDD835", "#fff"].map((c, i) => (
          <div key={i} style={{ flex: 1, background: c, position: "relative" }}>
            <div style={{ position: "absolute", inset: "35% 20% 35% 20%", background: "#0B0B0B" }} />
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "#444", marginBottom: 14 }} />
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.05em", fontFamily: "Inter, sans-serif", lineHeight: .9 }}>808</div>
      <div style={{ fontSize: 8, color: "#bbb", marginTop: 4 }}>The heart of the beat<br/>that changed music</div>
      <div style={{ marginTop: 10, height: 2, background: "linear-gradient(90deg, #E24A2E, #F26B1F 60%, transparent)" }} />
    </div>
  );
}

function PosterPetals() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F8C9D0", color: "#7A2233", padding: "12px", textAlign: "center", fontFamily: "'Fraunces', serif", fontSize: 7.5, lineHeight: 1.3, display: "flex", flexDirection: "column" }}>
      <div style={{ fontStyle: "italic", letterSpacing: ".03em", marginBottom: 4 }}>DyvynHER Collective · Delightful Intentions</div>
      <div style={{ fontSize: 7, letterSpacing: ".15em", textTransform: "uppercase", opacity: .6 }}>Presents</div>
      <div style={{ fontSize: 22, fontStyle: "italic", fontWeight: 500, margin: "4px 0 8px", color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.1)" }}>Petals of Love</div>
      {/* Heart */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox="0 0 100 100" style={{ width: "75%", position: "absolute" }} preserveAspectRatio="xMidYMid meet">
          <path d="M50 85 C20 60, 10 35, 28 22 C40 14, 50 28, 50 28 C50 28, 60 14, 72 22 C90 35, 80 60, 50 85Z" fill="#E55770" />
        </svg>
        <div style={{ position: "relative", color: "#fff", fontSize: 6.5, padding: "0 14px", lineHeight: 1.4 }}>
          Join us for an evening of community, connection, crafts and making floral bouquets honoring love in all its forms.
          <div style={{ margin: "6px 0", padding: "2px 0", background: "rgba(255,255,255,.18)", fontSize: 6, fontWeight: 700, letterSpacing: ".05em" }}>ALL SUPPLIES PROVIDED</div>
          <div style={{ fontSize: 5.5, opacity: .85 }}>MOCKTAILS AND LIGHT FARE PROVIDED<br/>(WHILE SUPPLIES LAST)</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, margin: "8px 0 6px" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>13<sup style={{ fontSize: 6 }}>th</sup></div>
              <div style={{ fontSize: 5, letterSpacing: ".1em" }}>FEB 2026</div>
            </div>
            <div style={{ fontSize: 5.5, textAlign: "left", opacity: .9 }}>HOSTS:<br/>SHAE M.<br/>MHINA J.</div>
          </div>
          <div style={{ fontSize: 6, fontWeight: 700 }}>6:30 PM<br/>EVENTBRITE LINK IN BIO</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 5, opacity: .7, marginTop: 4 }}>
        <div>ATTIRE<br/>SPECIAL OCCASION<br/>DRESS-TO-IMPRESS</div>
        <div style={{ textAlign: "right" }}>LOCATION<br/>ppxis<br/>25 MANTON AVE,<br/>PROVIDENCE, RI 02909</div>
      </div>
      <div style={{ fontSize: 5.5, marginTop: 4, fontStyle: "italic", opacity: .7 }}>Limited supply of tickets for Early Bird, BIPOC & LGBTQIA+</div>
      <div style={{ fontSize: 5, opacity: .5, marginTop: 2 }}>@DyvynHERCollective · @delightful.intentions</div>
    </div>
  );
}

function PosterMeetups() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#9FD8D4", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: "14px 14px 10px", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ background: "#000", color: "#fff", width: 42, height: 42, borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, lineHeight: 1, flexShrink: 0 }}>
          <div>CLUB</div><div>CLUB</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: "#1A1A1A" }}>MONDAY<br/>MEET-UPS</div>
      </div>
      <div style={{ padding: "0 14px 12px", fontSize: 10, color: "#1A1A1A", lineHeight: 1.5 }}>
        Come <mark style={{ background: "#FFEB47", color: "#000", padding: "0 2px" }}>explore</mark> DJ gear, instruments, and <mark style={{ background: "#FFEB47", color: "#000", padding: "0 2px" }}>make pals</mark>! Just sign up and hop in!
      </div>
      <div style={{ display: "flex", padding: "0 14px 12px", gap: 10, alignItems: "flex-end" }}>
        <div style={{ width: 54, height: 36, background: "#222", borderRadius: 3, flexShrink: 0, position: "relative" }}>
          <div style={{ position: "absolute", left: 4, top: 6, width: 20, height: 20, borderRadius: "50%", background: "#444", border: "2px solid #666" }} />
          <div style={{ position: "absolute", right: 4, top: 6, width: 20, height: 20, borderRadius: "50%", background: "#444", border: "2px solid #666" }} />
        </div>
        <div style={{ fontSize: 9.5, color: "#1A1A1A", lineHeight: 1.4 }}>
          <mark style={{ background: "#FFEB47", color: "#000", padding: "0 2px", fontWeight: 700 }}>No experience necessary!</mark> This is a place of learning! :)
        </div>
      </div>
      <div style={{ background: "#F6A25B", padding: "10px 14px", fontSize: 9, color: "#1A1A1A", fontWeight: 600, position: "relative", lineHeight: 1.4 }}>
        Mondays 7p – 10p<br/>25 Manton Ave. · Unit #2<br/>Providence, RI 02999
        <div style={{ position: "absolute", right: 12, top: -6, background: "#fff", border: "1.5px solid #000", width: 46, height: 46, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, textAlign: "center", lineHeight: 1.1, transform: "rotate(8deg)" }}>
          $0 - 30<br/>sliding<br/>scale!
        </div>
      </div>
    </div>
  );
}

function PosterBasement() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0D0D0D", color: "#E8E3D8", padding: "16px 14px", fontFamily: "'Fraunces', Georgia, serif", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 600, fontStyle: "italic", letterSpacing: "-0.02em", lineHeight: 1, color: "#F5EEDF" }}>Basement</div>
        <div style={{ fontSize: 24, fontWeight: 600, fontStyle: "italic", letterSpacing: "-0.02em", lineHeight: 1, color: "#F5EEDF" }}>Frequencies</div>
        <div style={{ fontSize: 7, opacity: .6, marginTop: 6, fontStyle: "italic", letterSpacing: ".02em" }}>an underground electronic night<br/>heavy bass · dark vibes.</div>
      </div>
      {/* Skull */}
      <div style={{ position: "relative", flex: 1, margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox="0 0 100 100" style={{ width: "88%", position: "absolute" }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#5A0707" strokeWidth=".6" />
          {Array.from({length: 48}).map((_, i) => {
            const a = (i / 48) * Math.PI * 2;
            return <line key={i} x1={50 + Math.cos(a) * 28} y1={50 + Math.sin(a) * 28} x2={50 + Math.cos(a) * 46} y2={50 + Math.sin(a) * 46} stroke="#7A1010" strokeWidth=".5" />;
          })}
        </svg>
        <svg viewBox="0 0 100 100" style={{ width: "55%", position: "relative" }}>
          <ellipse cx="50" cy="42" rx="22" ry="26" fill="#2A2A28" stroke="#555" strokeWidth=".4"/>
          <circle cx="41" cy="44" r="5" fill="#E84545" />
          <circle cx="59" cy="44" r="5" fill="#E84545" />
          <path d="M45 58 L50 62 L55 58" stroke="#111" strokeWidth="1" fill="none"/>
          <rect x="44" y="66" width="3" height="8" fill="#2A2A28" stroke="#555" strokeWidth=".3"/>
          <rect x="48.5" y="66" width="3" height="8" fill="#2A2A28" stroke="#555" strokeWidth=".3"/>
          <rect x="53" y="66" width="3" height="8" fill="#2A2A28" stroke="#555" strokeWidth=".3"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, fontStyle: "italic", color: "#F5EEDF" }}>Feb 28th, 2026</div>
        <div style={{ fontSize: 7, opacity: .55, marginTop: 4, fontStyle: "italic", fontFamily: "Inter" }}>Doors 9:30pm · <span style={{ fontFamily: "'Fraunces', serif" }}>ppxis</span></div>
        <div style={{ fontSize: 7, opacity: .55, fontFamily: "Inter" }}>25 Manton Ave, Providence RI</div>
        <div style={{ fontSize: 7, opacity: .55, fontFamily: "Inter" }}>21+ · $12</div>
      </div>
    </div>
  );
}

function PosterOrphx() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, #252523 0%, #0A0A0A 80%)", color: "#fff", padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "center", fontFamily: "Inter, sans-serif" }}>
      <div>
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: ".04em", fontFamily: "'Fraunces', serif", fontStyle: "italic", lineHeight: 1 }}>ORPHX</div>
        <div style={{ fontSize: 8, opacity: .7, marginTop: 4, letterSpacing: ".02em", fontStyle: "italic" }}>industrial / ebm<br/>live performance</div>
      </div>
      {/* Hooded figure silhouette */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <svg viewBox="0 0 100 120" style={{ width: "80%", height: "100%" }} preserveAspectRatio="xMidYMax meet">
          <path d="M30 120 L25 60 Q25 35 50 30 Q75 35 75 60 L70 120 Z" fill="#0A0A0A" stroke="#2A2A28" strokeWidth=".5"/>
          <ellipse cx="50" cy="54" rx="14" ry="18" fill="#1A1A18"/>
          <path d="M38 50 Q50 44 62 50 L62 66 Q50 72 38 66 Z" fill="#0A0A0A"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em" }}>JULY 4TH, 2026</div>
        <div style={{ fontSize: 8.5, opacity: .8, marginTop: 3, letterSpacing: ".05em" }}>PPXIS · 9PM · 18+ · $12</div>
      </div>
    </div>
  );
}

function PosterMoor() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #2A1B3D 0%, #6B1F47 50%, #C14B51 100%)", color: "#FFEAD8", padding: "14px", fontFamily: "'Fraunces', serif", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "center" }}>
      <div style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", opacity: .7 }}>ppxis presents</div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 500, fontStyle: "italic", letterSpacing: "-0.02em", lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,.3)" }}>Moor</div>
        <div style={{ fontSize: 30, fontWeight: 500, fontStyle: "italic", letterSpacing: "-0.02em", lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,.3)" }}>Mother</div>
        <div style={{ fontSize: 7.5, opacity: .8, marginTop: 10, fontStyle: "italic", letterSpacing: ".1em" }}>— noise poetry —</div>
      </div>
      <div style={{ fontSize: 9, letterSpacing: ".1em" }}>
        <div style={{ fontWeight: 600 }}>MAY 9 · 2025</div>
        <div style={{ opacity: .7, marginTop: 2, fontSize: 7 }}>DOORS 7PM · ALL AGES · $15</div>
      </div>
    </div>
  );
}

function PosterCygnus() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", color: "#fff", fontFamily: "Inter, sans-serif", overflow: "hidden" }}>
      {/* Horizontal scan lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(100,200,255,.15) 0 1px, transparent 1px 3px)" }} />
      <div style={{ position: "absolute", inset: 0, padding: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontSize: 8, letterSpacing: ".3em", color: "#5EE0FF", fontWeight: 600 }}>//TECHNO</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", color: "#5EE0FF", textShadow: "2px 0 #E84545, -2px 0 #FFEB47", lineHeight: .9 }}>CYGNUS</div>
          <div style={{ fontSize: 9, opacity: .7, marginTop: 8, fontStyle: "italic" }}>+ guests TBA</div>
        </div>
        <div style={{ fontSize: 9, letterSpacing: ".1em", color: "#5EE0FF" }}>
          MAY.17 · 9PM<br/>
          <span style={{ opacity: .6 }}>PPXIS · 18+ · $8</span>
        </div>
      </div>
    </div>
  );
}

function PosterZola() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #1A0D1C 0%, #3D1A2E 100%)", color: "#F5E8D8", padding: "14px", fontFamily: "'Fraunces', serif", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "center" }}>
      {/* Ornamental frame */}
      <div style={{ position: "absolute", inset: 10, border: "1px solid rgba(245,232,216,.2)" }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 7, letterSpacing: ".25em", opacity: .6, textTransform: "uppercase", fontStyle: "italic" }}>an evening with</div>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 26, fontWeight: 500, fontStyle: "italic", letterSpacing: "-0.015em", lineHeight: 1 }}>Zola</div>
        <div style={{ fontSize: 26, fontWeight: 500, fontStyle: "italic", letterSpacing: "-0.015em", lineHeight: 1 }}>Jesus</div>
        <div style={{ fontSize: 8, opacity: .6, marginTop: 10, letterSpacing: ".1em" }}>· art pop / darkwave ·</div>
      </div>
      <div style={{ position: "relative", fontSize: 8, letterSpacing: ".1em" }}>
        <div style={{ fontWeight: 600 }}>JUNE 6 · 2025</div>
        <div style={{ opacity: .5, marginTop: 3, fontSize: 7 }}>PPXIS · 8PM · 21+ · $20</div>
      </div>
    </div>
  );
}

/* ───────── Top bar & footer ───────── */

function PPXNav({ page, onNav, compact }) {
  const links = [
    { id: "shows",   label: "Shows" },
    { id: "archive", label: "Archive" },
    { id: "book",    label: "Book us" },
    { id: "about",   label: "About" },
  ];
  const isShows = page === "shows" || page === "detail";
  return (
    <header style={{ background: "#fff", borderBottom: `1px solid ${PRULE}`, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: compact ? "0 18px" : "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: compact ? 52 : 60 }}>
        <button onClick={() => onNav("shows")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Fraunces', serif", fontSize: compact ? 22 : 24, fontWeight: 700, letterSpacing: "-0.025em", color: PINK }}>
          ppxis
        </button>
        {!compact ? (
          <nav style={{ display: "flex", gap: 2 }}>
            {links.map(l => {
              const active = l.id === page || (l.id === "shows" && isShows);
              return (
                <button key={l.id} onClick={() => onNav(l.id)} style={{
                  background: active ? "#F3F1EC" : "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                  padding: "6px 14px", fontSize: 13, fontWeight: active ? 600 : 400, borderRadius: 6,
                  color: active ? PINK : PMUTE,
                }}>{l.label}</button>
              );
            })}
          </nav>
        ) : (
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: PINK, display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ width: 18, height: 1.5, background: PINK }}/>
            <span style={{ width: 18, height: 1.5, background: PINK }}/>
            <span style={{ width: 18, height: 1.5, background: PINK }}/>
          </button>
        )}
      </div>
    </header>
  );
}

function PPXFooter({ compact }) {
  return (
    <footer style={{ borderTop: `1px solid ${PRULE}`, marginTop: 60, padding: compact ? "24px 18px" : "28px 32px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: compact ? 18 : 20, fontWeight: 700, letterSpacing: "-0.025em", color: PINK }}>ppxis</div>
          <div style={{ fontSize: 11.5, color: PMUTE, fontStyle: "italic", lineHeight: 1.65, marginTop: 4 }}>
            a music artist space<br/>25 Manton Ave, Providence RI 02909
          </div>
        </div>
        <div style={{ display: "flex", gap: compact ? 20 : 32, flexWrap: "wrap" }}>
          {["Instagram", "Discord", "Mailing list"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: PMUTE, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ───────── Show tile ───────── */

function ShowTile({ show, onClick, compact }) {
  const pill = show.kind === "soldout"
    ? { label: "Sold out", bg: "#F0EFEC", color: "#8E887E" }
    : show.kind === "learn"
      ? { label: "Learn more →", bg: "#FFF2EF", color: "#C8270D" }
      : { label: "Tickets →", bg: "#FFF2EF", color: "#C8270D" };

  return (
    <div onClick={onClick} style={{ cursor: "pointer" }}>
      <Poster kind={show.poster} />
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: compact ? 15 : 16, fontWeight: 700, color: PINK, letterSpacing: "-0.005em" }}>{show.title}</div>
        <div style={{ fontSize: 12.5, color: PMUTE, marginTop: 4 }}>{show.date} · {show.time} · {show.age}</div>
        <div style={{ fontSize: 12.5, color: PMUTE, marginTop: 2 }}>{show.price}</div>
        <button style={{ background: pill.bg, color: pill.color, border: "none", borderRadius: 999, padding: "5px 12px", fontSize: 11.5, fontWeight: 600, marginTop: 10, cursor: "pointer", fontFamily: "inherit" }}>
          {pill.label}
        </button>
      </div>
    </div>
  );
}

/* ───────── Page blocks ───────── */

function PageHeader({ kicker, title, compact }) {
  return (
    <>
      <div style={{ marginBottom: compact ? 22 : 32 }}>
        <div style={{ fontSize: compact ? 10.5 : 11, fontWeight: 600, letterSpacing: ".14em", color: PMUTE, textTransform: "uppercase", marginBottom: compact ? 8 : 10 }}>{kicker}</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: compact ? 30 : 42, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.05, margin: 0, color: PINK }}>{title}</h1>
      </div>
      <div style={{ height: 1, background: PRULE, marginBottom: compact ? 20 : 28 }} />
    </>
  );
}

/* ── Shows page ── */

function ShowsPage({ onOpen, compact }) {
  const shows = compact ? P_SHOWS.slice(0, 6) : P_SHOWS;
  return (
    <>
      <header data-section="shows-header">
        <PageHeader kicker="Providence, RI" title="Upcoming shows" compact={compact} />
      </header>
      <section data-section="shows-list">
        <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(3, 1fr)", gap: compact ? 24 : "32px 24px" }}>
          {shows.map(s => <ShowTile key={s.id} show={s} compact={compact} onClick={() => onOpen && onOpen(s)} />)}
        </div>
      </section>
      <section data-section="mailing-list" style={{ marginTop: compact ? 34 : 48 }}>
        <div data-pyxis-component="mailing-list-cta" data-pyxis-part="root" style={{ borderTop: `1px solid ${PRULE}`, paddingTop: compact ? 22 : 28 }}>
          <h3 data-pyxis-component="mailing-list-cta" data-pyxis-part="title" style={{ fontFamily: "'Fraunces', serif", fontSize: compact ? 22 : 24, fontWeight: 500, color: "#C8270D", margin: "0 0 8px" }}>Stay in the loop</h3>
          <p data-pyxis-component="mailing-list-cta" data-pyxis-part="description" style={{ color: PMUTE, fontSize: 14, margin: "0 0 16px" }}>Get show announcements and venue news.</p>
          <form data-pyxis-component="mailing-list-cta" data-pyxis-part="form" style={{ display: "flex", gap: 8 }}>
            <input data-pyxis-component="mailing-list-cta" data-pyxis-part="input" placeholder="your@email.com" style={{ flex: 1, border: `1px solid ${PRULE}`, fontFamily: "inherit", fontSize: 14, padding: "9px 12px" }} />
            <button data-pyxis-component="mailing-list-cta" data-pyxis-part="button" type="button" style={{ background: "#1F1E1C", border: "none", borderRadius: 4, color: "#fff", fontFamily: "inherit", padding: "9px 14px" }}>Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}

/* ── Show detail page ── */

function ShowDetail({ compact }) {
  const show = P_SHOWS[0]; // Redroom Inferno
  return (
    <>
      <div style={{ marginBottom: compact ? 18 : 24 }}>
        <a href="#" style={{ fontSize: 12, color: PMUTE, textDecoration: "none" }}>← All shows</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "340px 1fr", gap: compact ? 24 : 44, alignItems: "start" }}>
        <div>
          <Poster kind={show.poster} />
          <div style={{ marginTop: 16, padding: "14px 16px", background: "#F8F6F1", borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: PMUTE, marginBottom: 8 }}>
              <span style={{ letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>Ticket</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>№ 0214-A</span>
            </div>
            <div style={{ fontSize: 20, fontFamily: "'Fraunces', serif", fontWeight: 600, color: PINK, letterSpacing: "-0.015em" }}>$10 – $15</div>
            <div style={{ fontSize: 11.5, color: PMUTE, marginTop: 4 }}>sliding. cash or card at door.</div>
            <button style={{ marginTop: 12, width: "100%", background: "#C8270D", color: "#fff", border: "none", borderRadius: 4, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: ".02em" }}>Reserve ticket →</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", color: "#C8270D", textTransform: "uppercase", marginBottom: 10 }}>Fri · Feb 14 · 2026 · 9PM</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: compact ? 36 : 52, fontWeight: 500, fontStyle: "italic", letterSpacing: "-0.03em", lineHeight: 1, margin: 0, color: PINK }}>Redroom Inferno</h1>
          <div style={{ fontSize: 14, color: PMUTE, marginTop: 14, fontStyle: "italic", lineHeight: 1.6, maxWidth: 480 }}>
            A Dusknight residency. A kink, electronica & queer music party — the room turns red, the floor turns into cinder, and we don't stop 'til dawn.
          </div>

          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: `1px solid ${PRULE}`, borderBottom: `1px solid ${PRULE}` }}>
            {[
              ["Doors", "9:00 PM"],
              ["Age", "21+"],
              ["Door", "$15"],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "14px 0" }}>
                <div style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: PMUTE, fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: PINK, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", color: PMUTE, textTransform: "uppercase", marginBottom: 12 }}>Lineup</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <tbody>
                {[
                  ["9:00", "Doors", PMUTE],
                  ["9:45", "sable witch", PINK, "opener · dj set"],
                  ["10:45", "RONE", PINK, "live · hardware"],
                  ["12:00", "DJ VEILED", PINK, "headline · dj set"],
                  ["2:00", "Close", PMUTE],
                ].map(([t, n, c, sub], i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${PRULE}` }}>
                    <td style={{ padding: "12px 12px 12px 0", color: PMUTE, fontVariantNumeric: "tabular-nums", width: 60, verticalAlign: "top" }}>{t}</td>
                    <td style={{ padding: "12px 0", color: c, fontWeight: sub ? 600 : 400, verticalAlign: "top" }}>
                      {n}
                      {sub && <div style={{ fontSize: 11.5, color: PMUTE, fontWeight: 400, marginTop: 2, fontStyle: "italic" }}>{sub}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 28, fontSize: 12.5, color: PMUTE, lineHeight: 1.65, fontStyle: "italic", borderLeft: `2px solid ${PRULE}`, paddingLeft: 14 }}>
            no photo / no video. take care of each other. we honor request-for-removal and safer-space principles. if anything feels off, find a staff member with a red armband.
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Archive page ── */

const P_ARCHIVE = [
  {
    year: 2025, shows: [
      { date: "Dec 12", name: "Winter Solstice Rave",   tag: "Electronic" },
      { date: "Nov 29", name: "Jake Meginsky · live",    tag: "Noise" },
      { date: "Nov 15", name: "Bottom Feeders",          tag: "Hardcore" },
      { date: "Oct 31", name: "The Halloween Drone",     tag: "Drone" },
      { date: "Oct 18", name: "Cecile Believe",          tag: "Pop" },
      { date: "Sep 27", name: "Moor Mother",             tag: "Noise poetry" },
      { date: "Sep 06", name: "808 Collective vol. 4",   tag: "House" },
      { date: "Aug 23", name: "Petals of Love",          tag: "Community" },
    ]
  },
  {
    year: 2024, shows: [
      { date: "Dec 20", name: "Year-end all-nighter",    tag: "Mixed" },
      { date: "Nov 08", name: "Basement Frequencies",    tag: "Techno" },
      { date: "Oct 26", name: "Lolina",                  tag: "Experimental" },
      { date: "Sep 14", name: "Working Men's Club",      tag: "Post-punk" },
      { date: "Aug 02", name: "Wet Tennis",              tag: "Indie" },
      { date: "Jul 13", name: "Fire Toolz",              tag: "Vaporwave" },
      { date: "Jun 22", name: "Redroom Inferno I",       tag: "Electronic" },
    ]
  },
];

function ArchivePage({ compact }) {
  return (
    <>
      <PageHeader kicker="Since 2023" title="The archive" compact={compact} />
      <div style={{ display: "grid", gridTemplateColumns: compact ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: compact ? 16 : 32, marginBottom: compact ? 28 : 40, padding: compact ? "14px 0" : "18px 0", borderTop: `1px solid ${PRULE}`, borderBottom: `1px solid ${PRULE}` }}>
        {[
          ["194", "shows"],
          ["312", "artists"],
          ["31", "residencies"],
          ["0", "cops called"],
        ].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: compact ? 26 : 34, fontWeight: 600, color: PINK, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{n}</div>
            <div style={{ fontSize: 11, color: PMUTE, letterSpacing: ".12em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 28, alignItems: "center", flexWrap: "wrap" }}>
        <input placeholder="Search artists, dates, tags…" style={{
          flex: 1, minWidth: 200, border: `1px solid ${PRULE}`, background: "#fff", borderRadius: 4, padding: "9px 12px",
          fontFamily: "inherit", fontSize: 13, color: PINK, outline: "none",
        }} />
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "2025", "2024", "2023"].map((y, i) => (
            <button key={y} style={{ background: i === 0 ? "#1F1E1C" : "#fff", color: i === 0 ? "#fff" : PINK, border: i === 0 ? "none" : `1px solid ${PRULE}`, borderRadius: 4, padding: "8px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{y}</button>
          ))}
        </div>
      </div>

      {P_ARCHIVE.map(({ year, shows }) => (
        <div key={year} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, borderBottom: `1px solid ${PRULE}`, paddingBottom: 8 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: compact ? 28 : 34, fontWeight: 500, color: PINK, letterSpacing: "-0.02em" }}>{year}</div>
            <div style={{ fontSize: 11, color: PMUTE, letterSpacing: ".12em", textTransform: "uppercase" }}>{shows.length} shows</div>
          </div>
          <div>
            {shows.map((s, i) => (
              <a href="#" key={i} style={{
                display: "grid", gridTemplateColumns: compact ? "64px 1fr auto" : "80px 1fr auto auto", gap: compact ? 10 : 18,
                padding: "14px 0", borderTop: i > 0 ? `1px solid ${PRULE}` : "none", textDecoration: "none", alignItems: "baseline",
              }}>
                <div style={{ fontSize: 12, color: PMUTE, fontVariantNumeric: "tabular-nums", letterSpacing: ".05em" }}>{s.date}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: compact ? 16 : 18, color: PINK, fontWeight: 500 }}>{s.name}</div>
                {!compact && <div style={{ fontSize: 11.5, color: PMUTE, fontStyle: "italic" }}>{s.tag}</div>}
                <div style={{ fontSize: 11.5, color: PMUTE }}>recap →</div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Book us page ── */

function BookUsPage({ compact }) {
  return (
    <>
      <PageHeader kicker="Inquiries" title="Book the space" compact={compact} />
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1fr 300px", gap: compact ? 28 : 40, alignItems: "start" }}>
        <form style={{ display: "grid", gap: 18 }}>
          <div style={{ fontSize: 13.5, color: PMUTE, lineHeight: 1.7, fontStyle: "italic" }}>
            tell us about your show. we read every submission. responses in 3–7 days. we book 6–10 weeks out; late requests get the unused-dates list.
          </div>

          {[
            { label: "Your name", ph: "" },
            { label: "Email", ph: "you@label.com" },
            { label: "Project / artist name", ph: "" },
          ].map(f => (
            <label key={f.label} style={{ display: "block" }}>
              <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: PMUTE, fontWeight: 600, marginBottom: 6 }}>{f.label}</div>
              <input placeholder={f.ph} style={{ width: "100%", border: "none", borderBottom: `1.5px solid ${PRULE}`, background: "transparent", padding: "8px 0", fontFamily: "inherit", fontSize: 14.5, color: PINK, outline: "none" }} />
            </label>
          ))}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <label>
              <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: PMUTE, fontWeight: 600, marginBottom: 6 }}>Preferred date</div>
              <input placeholder="e.g. late April" style={{ width: "100%", border: "none", borderBottom: `1.5px solid ${PRULE}`, background: "transparent", padding: "8px 0", fontFamily: "inherit", fontSize: 14.5, color: PINK, outline: "none" }} />
            </label>
            <label>
              <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: PMUTE, fontWeight: 600, marginBottom: 6 }}>Expected draw</div>
              <select style={{ width: "100%", border: "none", borderBottom: `1.5px solid ${PRULE}`, background: "transparent", padding: "8px 0", fontFamily: "inherit", fontSize: 14.5, color: PINK, outline: "none", appearance: "none" }}>
                <option>Under 50</option><option>50–100</option><option>100–150</option><option>150+</option>
              </select>
            </label>
          </div>

          <label>
            <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: PMUTE, fontWeight: 600, marginBottom: 6 }}>Show type</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["DJ night", "Live music", "Listening party", "Workshop / meet-up", "Screening", "Other"].map((t, i) => (
                <button key={t} type="button" style={{
                  background: i === 1 ? "#1F1E1C" : "#fff", color: i === 1 ? "#fff" : PINK,
                  border: i === 1 ? "none" : `1px solid ${PRULE}`, borderRadius: 999, padding: "7px 14px",
                  fontSize: 12.5, cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
                }}>{t}</button>
              ))}
            </div>
          </label>

          <label>
            <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: PMUTE, fontWeight: 600, marginBottom: 6 }}>Tell us about it</div>
            <textarea rows={6} placeholder="who's on the bill, what it sounds like, what you need from us" style={{ width: "100%", border: `1px solid ${PRULE}`, background: "#fff", borderRadius: 4, padding: "12px", fontFamily: "inherit", fontSize: 14, color: PINK, outline: "none", resize: "vertical" }} />
          </label>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.5, color: PMUTE, lineHeight: 1.55 }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: "#C8270D" }} />
            <span>i've read the <a href="#" style={{ color: PINK }}>safer-space policy</a> and agree to uphold it for my show.</span>
          </label>

          <div>
            <button type="submit" style={{ background: "#C8270D", color: "#fff", border: "none", borderRadius: 4, padding: "12px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: ".02em" }}>Send inquiry →</button>
          </div>
        </form>

        <aside style={{ background: "#1F1E1C", color: "#E8E3D8", padding: compact ? 22 : 26, borderRadius: 6, fontSize: 13, lineHeight: 1.7 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, fontStyle: "italic", letterSpacing: "-0.02em", marginBottom: 14 }}>the space</div>
          <div style={{ display: "grid", gap: 12, fontSize: 12.5, color: "#BCB7AD" }}>
            <div><div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#8E887E", marginBottom: 3 }}>Capacity</div>150 standing · 80 seated</div>
            <div><div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#8E887E", marginBottom: 3 }}>PA</div>Funktion-One F1201, 4-way · 2× Sub infra 108</div>
            <div><div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#8E887E", marginBottom: 3 }}>Backline</div>CDJ-3000 ×2, DJM-900, Moog Sub37, house drum kit</div>
            <div><div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#8E887E", marginBottom: 3 }}>Tech</div>projector, haze, moving heads ×4, basic video chain</div>
            <div><div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#8E887E", marginBottom: 3 }}>Hours</div>close by 2 AM (3 on Sat)</div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #3A3733", fontSize: 11.5, color: "#8E887E", fontStyle: "italic" }}>
            25 Manton Ave · Providence RI 02909<br/>
            <span style={{ color: "#E8E3D8", fontStyle: "normal" }}>book@ppxis.space</span>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ── About page ── */

function AboutPage({ compact }) {
  return (
    <>
      <PageHeader kicker="Est. 2023" title="About ppxis" compact={compact} />
      <div style={{ maxWidth: 620 }}>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: compact ? 24 : 30, fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.015em", lineHeight: 1.3, color: PINK, margin: "0 0 28px" }}>
          a music artist space in a former print shop — 150 cap, one beautiful PA, and a deep love for the loud end of the spectrum.
        </p>
        <p style={{ fontSize: 14.5, color: "#4A463E", lineHeight: 1.75, margin: "0 0 16px" }}>
          we opened in the fall of 2023 with one thing in mind: a room for the kind of shows providence keeps losing. dance nights that get to actually <em>go</em>, experimental sets that trust the audience, residencies that let a project grow over six months instead of six hours.
        </p>
        <p style={{ fontSize: 14.5, color: "#4A463E", lineHeight: 1.75, margin: "0 0 16px" }}>
          we are a worker-run collective. we split door evenly. we do not book shows that conflict with our safer-space policy, and we do not tolerate bullshit at ours.
        </p>
      </div>

      <div style={{ marginTop: compact ? 40 : 56, borderTop: `1px solid ${PRULE}`, paddingTop: compact ? 28 : 36 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", color: PMUTE, textTransform: "uppercase", marginBottom: compact ? 18 : 28 }}>Our ethos</div>
        <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(3, 1fr)", gap: compact ? 24 : 28 }}>
          {[
            ["01", "Artists first", "we exist to book weird shows and pay the people who play them. 100% of door to artists for all local shows under 100 cap."],
            ["02", "A safer room", "no racism, no transphobia, no bullshit. we enforce it. we mean it. the room has to be safe before it can be anything else."],
            ["03", "Loud by design", "the PA is tuned for real volume. we honor ear protection (free at the door) and we start on time. respect the room, respect each other."],
          ].map(([n, h, b]) => (
            <div key={n}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 44, fontWeight: 500, fontStyle: "italic", color: "#C8270D", lineHeight: 1, letterSpacing: "-0.02em" }}>{n}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500, color: PINK, marginTop: 10, letterSpacing: "-0.015em" }}>{h}</div>
              <div style={{ fontSize: 13, color: "#4A463E", lineHeight: 1.65, marginTop: 8 }}>{b}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: compact ? 40 : 56, borderTop: `1px solid ${PRULE}`, paddingTop: compact ? 28 : 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1fr 1fr", gap: compact ? 24 : 40 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", color: PMUTE, textTransform: "uppercase", marginBottom: 10 }}>The collective</div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                ["shae m.",    "bookings, door"],
                ["mhina j.",   "tech, lights"],
                ["ro.",        "sound, residencies"],
                ["devon k.",   "operations"],
                ["emi p.",     "safer-space lead"],
              ].map(([n, r]) => (
                <div key={n} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, borderBottom: `1px solid ${PRULE}`, padding: "9px 0" }}>
                  <span style={{ color: PINK }}>{n}</span>
                  <span style={{ color: PMUTE, fontStyle: "italic" }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", color: PMUTE, textTransform: "uppercase", marginBottom: 10 }}>Find us</div>
            <div style={{ fontSize: 14, color: "#4A463E", lineHeight: 1.8 }}>
              25 Manton Ave, Unit #2<br/>
              Providence, RI 02909<br/>
              <br/>
              <span style={{ color: PINK }}>hello@ppxis.space</span><br/>
              <span style={{ color: PINK }}>book@ppxis.space</span> — bookings<br/>
              <br/>
              <em style={{ color: PMUTE }}>we share a block with an auto body. buzzer on the right. steel door painted red.</em>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ───────── Desktop & Mobile layouts ───────── */

function PPXShell({ page = "shows", compact = false }) {
  const [cur, setCur] = React.useState(page);
  React.useEffect(() => setCur(page), [page]);

  const content = (() => {
    switch (cur) {
      case "detail":  return <ShowDetail compact={compact} />;
      case "archive": return <ArchivePage compact={compact} />;
      case "book":    return <BookUsPage compact={compact} />;
      case "about":   return <AboutPage compact={compact} />;
      default:        return <ShowsPage onOpen={() => setCur("detail")} compact={compact} />;
    }
  })();

  const W = compact ? 390 : 920;

  return (
    <div style={{ width: W, minHeight: compact ? 844 : 1100, background: "#fff", fontFamily: "'Inter', sans-serif", color: PINK }}>
      <PPXNav page={cur} onNav={setCur} compact={compact} />
      <main data-page={cur === "detail" ? "show-detail" : cur} style={{ maxWidth: W, margin: "0 auto", padding: compact ? "26px 18px 0" : "40px 32px 0" }}>
        {content}
      </main>
      <PPXFooter compact={compact} />
    </div>
  );
}

function PPXDesktop({ page = "shows" }) {
  return <PPXShell page={page} />;
}

function PPXMobile({ page = "shows" }) {
  return <PPXShell page={page} compact />;
}

/* ───────── Catalog-only fixtures ─────────
 * These wrappers expose individual public-site parts to browser globals so
 * css-visual-diff can render stable prototype baselines without brittle
 * whole-page DOM crops. They intentionally do not change the user-facing
 * PPXDesktop/PPXMobile render paths above.
 */

function PPXCatalogFrame({ children, width = 320, background = "#fff" }) {
  return (
    <div data-catalog="frame" style={{ width, background, fontFamily: "'Inter', sans-serif", color: PINK }}>
      {children}
    </div>
  );
}

function PPXCatalogPoster({ kind = "redroom", width = 270 }) {
  return (
    <PPXCatalogFrame width={width}>
      <div data-catalog="poster" style={{ width }}>
        <Poster kind={kind} />
      </div>
    </PPXCatalogFrame>
  );
}

function PPXCatalogShowTile({ index = 0, compact = false, width }) {
  const show = P_SHOWS[index] || P_SHOWS[0];
  const w = width || (compact ? 354 : 270);
  return (
    <PPXCatalogFrame width={w}>
      <div data-catalog="show-tile" style={{ width: w }}>
        <ShowTile show={show} compact={compact} onClick={() => {}} />
      </div>
    </PPXCatalogFrame>
  );
}

function PPXCatalogNav({ page = "shows", compact = false }) {
  const width = compact ? 390 : 920;
  return (
    <PPXCatalogFrame width={width}>
      <div data-catalog="nav" style={{ width }}>
        <PPXNav page={page} compact={compact} onNav={() => {}} />
      </div>
    </PPXCatalogFrame>
  );
}

function PPXCatalogFooter({ compact = false }) {
  const width = compact ? 390 : 920;
  return (
    <PPXCatalogFrame width={width}>
      <div data-catalog="footer" style={{ width }}>
        <PPXFooter compact={compact} />
      </div>
    </PPXCatalogFrame>
  );
}

function PPXCatalogPageHeader({ kicker = "Providence, RI", title = "Upcoming shows", compact = false }) {
  const width = compact ? 354 : 856;
  return (
    <PPXCatalogFrame width={width}>
      <div data-catalog="page-header" style={{ width }}>
        <PageHeader kicker={kicker} title={title} compact={compact} />
      </div>
    </PPXCatalogFrame>
  );
}

function PPXCatalogShowGrid({ compact = false, count }) {
  const width = compact ? 354 : 856;
  const shows = P_SHOWS.slice(0, count || (compact ? 3 : 6));
  return (
    <PPXCatalogFrame width={width}>
      <div data-catalog="show-grid" style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(3, 1fr)", gap: compact ? 24 : "32px 24px", width }}>
        {shows.map(s => <ShowTile key={s.id} show={s} compact={compact} onClick={() => {}} />)}
      </div>
    </PPXCatalogFrame>
  );
}

Object.assign(window, {
  PPXDesktop, PPXMobile, PPXShell, P_SHOWS,
  Poster, PPXNav, PPXFooter, ShowTile, PageHeader,
  PPXCatalogFrame, PPXCatalogPoster, PPXCatalogShowTile,
  PPXCatalogNav, PPXCatalogFooter, PPXCatalogPageHeader,
  PPXCatalogShowGrid,
});
