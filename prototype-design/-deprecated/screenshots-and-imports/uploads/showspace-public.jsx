import { useState } from "react";

// ── Tokens ─────────────────────────────────────────────────────────────────
const RED    = "#C8270D";
const RED_LT = "#FFF0EE";
const GREEN  = "#2A7D4F";
const INK    = "#1A1A18";
const MUTED  = "#888";
const RULE   = "#EEECEA";

// ── Data ───────────────────────────────────────────────────────────────────
const UPCOMING = [
  { id: 42, artist: "Burial Hex",          date: "2025-05-02", doors: "8:00 PM", age: "21+",      price: "$12 adv / $15 door", genre: "Darkwave / Ritual Ambient",      desc: "Cole Coonce's long-running ritual electronics project. Expect heavy drones, processed vocals, and an immersive, ceremony-like performance. Support TBA.",    tickets: true,  soldOut: false },
  { id: 43, artist: "Moor Mother",          date: "2025-05-09", doors: "7:00 PM", age: "All Ages", price: "$15",                 genre: "Experimental / Noise Poetry",    desc: "Philadelphia-based poet, musician, and activist Camae Ayewa performing as Moor Mother. Raw, confrontational, essential.",                                    tickets: true,  soldOut: true  },
  { id: 44, artist: "Cygnus + Guests",      date: "2025-05-17", doors: "9:00 PM", age: "18+",      price: "$8",                  genre: "Techno",                          desc: "Cygnus brings his signature hybrid live/DJ set of hard techno and electro, joined by local guests TBA. Dance floor in full effect.",                         tickets: true,  soldOut: false },
  { id: 45, artist: "Open Mic Night",       date: "2025-05-23", doors: "7:00 PM", age: "All Ages", price: "Free",                genre: "Open Format",                     desc: "Monthly open mic. All formats welcome — music, spoken word, performance, whatever you've got. Sign up at the door from 6:30.",                             tickets: false, soldOut: false },
  { id: 46, artist: "Zola Jesus",           date: "2025-06-06", doors: "8:00 PM", age: "21+",      price: "$20",                 genre: "Art Pop / Darkwave",              desc: "Nika Roza Danilova returns to Providence on her headline tour. One of the most powerful live performers working today. Do not miss this one.",               tickets: true,  soldOut: false },
  { id: 47, artist: "Orphx",               date: "2025-07-04", doors: "9:00 PM", age: "18+",      price: "$12",                 genre: "EBM / Industrial",                desc: "Canadian EBM veterans Orphx make a rare US appearance. Driving beats, sharp synths, and a wall of sound that will leave you breathless.",                  tickets: true,  soldOut: false },
];

const ARCHIVE = [
  { id: 41, artist: "Planning for Burial",  date: "2025-03-14", genre: "Ambient",      draw: 34 },
  { id: 40, artist: "Actress",              date: "2025-02-28", genre: "Electronic",   draw: 61 },
  { id: 39, artist: "Container",            date: "2025-01-18", genre: "Noise",        draw: 55 },
  { id: 38, artist: "Burial Hex",           date: "2024-11-15", genre: "Darkwave",     draw: 55 },
  { id: 37, artist: "Moor Mother",          date: "2024-09-06", genre: "Experimental", draw: 94 },
  { id: 36, artist: "Pharmakon",            date: "2024-08-02", genre: "Industrial",   draw: 80 },
  { id: 35, artist: "Cygnus",              date: "2024-07-19", genre: "Techno",       draw: 88 },
  { id: 34, artist: "Actress",             date: "2024-05-10", genre: "Electronic",   draw: 72 },
  { id: 33, artist: "Planning for Burial", date: "2024-04-12", genre: "Ambient",      draw: 41 },
  { id: 32, artist: "Container",           date: "2024-02-23", genre: "Noise",        draw: 49 },
  { id: 31, artist: "Zola Jesus",          date: "2023-12-08", genre: "Art Pop",      draw: 148 },
  { id: 30, artist: "Orphx",              date: "2023-10-27", genre: "EBM",          draw: 77 },
];

const fmtFull  = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const fmtMed   = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtMonth = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short" }).toUpperCase();
const fmtDay   = d => new Date(d + "T00:00:00").getDate();
const fmtYear  = d => new Date(d + "T00:00:00").getFullYear();

// ── Shared ─────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Shows", "Archive", "Book us", "About"];

function TopNav({ active, setPage }) {
  return (
    <header style={{ background: "#fff", borderBottom: `1px solid ${RULE}`, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <button onClick={() => setPage("shows")} style={ghostBtn} >
          <span style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, letterSpacing: "-.02em", color: INK }}>ppxis</span>
        </button>
        <nav style={{ display: "flex", gap: 4 }}>
          {NAV_LINKS.map(l => {
            const id = l.toLowerCase().replace(" ", "-");
            const isActive = active === id || (active === "shows" && l === "Shows") || (active === "detail" && l === "Shows");
            return (
              <button key={l} onClick={() => setPage(id)} style={{ ...ghostBtn, fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? INK : MUTED, padding: "6px 12px", borderRadius: 7, background: isActive ? "#F7F6F3" : "transparent" }}>
                {l}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${RULE}`, marginTop: 60, padding: "32px 28px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>ppxis</div>
          <div style={{ fontSize: 12, color: MUTED, fontStyle: "italic", lineHeight: 1.6 }}>a music artist space<br />25 Manton Ave, Providence RI 02909</div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[["Instagram", "#"], ["Discord", "#"], ["Mailing list", "#"]].map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: 13, color: MUTED, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

const ghostBtn = { background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" };

// ── SHOWS ─────────────────────────────────────────────────────────────────
function ShowsPage({ onShowClick }) {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 28px 0" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: MUTED, textTransform: "uppercase", marginBottom: 10 }}>Providence, RI</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 42, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.1, margin: 0 }}>Upcoming shows</h1>
      </div>

      <div>
        {UPCOMING.map((show, i) => (
          <div key={show.id} onClick={() => onShowClick(show)} style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: "0 24px", alignItems: "center", padding: "20px 0", borderTop: `1px solid ${RULE}`, cursor: "pointer", borderBottom: i === UPCOMING.length - 1 ? `1px solid ${RULE}` : "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "#FAFAF9"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {/* Date block */}
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: MUTED, textTransform: "uppercase" }}>{fmtMonth(show.date)}</div>
              <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, color: INK, fontFamily: "Georgia, serif" }}>{fmtDay(show.date)}</div>
            </div>

            {/* Info */}
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.01em", fontFamily: "Georgia, serif", marginBottom: 4 }}>{show.artist}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{show.genre} &nbsp;·&nbsp; Doors {show.doors} &nbsp;·&nbsp; {show.age} &nbsp;·&nbsp; {show.price}</div>
            </div>

            {/* Ticket status */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {show.soldOut
                ? <span style={{ fontSize: 11, fontWeight: 600, color: "#A32D2D", background: "#FCEBEB", padding: "4px 10px", borderRadius: 20 }}>Sold out</span>
                : show.price === "Free"
                  ? <span style={{ fontSize: 11, fontWeight: 600, color: GREEN, background: "#EBF7F0", padding: "4px 10px", borderRadius: 20 }}>Free</span>
                  : show.tickets
                    ? <span style={{ fontSize: 11, fontWeight: 600, color: RED, background: RED_LT, padding: "4px 10px", borderRadius: 20 }}>Tickets →</span>
                    : null
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SHOW DETAIL ────────────────────────────────────────────────────────────
function ShowDetailPage({ show, onBack }) {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 28px 0" }}>
      <button onClick={onBack} style={{ ...ghostBtn, fontSize: 12, color: MUTED, marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>
        ← Back to shows
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 48, alignItems: "start" }}>
        {/* Left */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: MUTED, textTransform: "uppercase", marginBottom: 10 }}>{fmtFull(show.date)}</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 52, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1, margin: "0 0 8px" }}>{show.artist}</h1>
          <div style={{ fontSize: 14, color: MUTED, marginBottom: 32 }}>{show.genre}</div>

          <div style={{ fontSize: 15, color: "#444", lineHeight: 1.8, marginBottom: 36 }}>{show.desc}</div>

          <div style={{ display: "flex", gap: 10 }}>
            {!show.soldOut && show.tickets && (
              <button style={{ background: INK, color: "#fff", border: "none", borderRadius: 9, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Get tickets — {show.price}
              </button>
            )}
            {show.soldOut && (
              <button disabled style={{ background: "#E8E7E4", color: MUTED, border: "none", borderRadius: 9, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "not-allowed" }}>
                Sold out
              </button>
            )}
            {show.price === "Free" && !show.tickets && (
              <button style={{ background: INK, color: "#fff", border: "none", borderRadius: 9, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Free — just show up
              </button>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ background: "#FAFAF9", borderRadius: 14, border: `1px solid ${RULE}`, padding: 22, position: "sticky", top: 80 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Show info</div>
          {[
            ["Date",  fmtFull(show.date)],
            ["Doors", show.doors],
            ["Age",   show.age],
            ["Price", show.price],
            ["Venue", "ppxis — 25 Manton Ave, Providence RI"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: INK }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${RULE}`, paddingTop: 16, marginTop: 4 }}>
            <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.7 }}>
              Questions? <a href="mailto:hello@ppxis.com" style={{ color: RED }}>hello@ppxis.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ARCHIVE ────────────────────────────────────────────────────────────────
function ArchivePage() {
  const [search, setSearch] = useState("");
  const filtered = ARCHIVE.filter(s =>
    s.artist.toLowerCase().includes(search.toLowerCase()) ||
    s.genre.toLowerCase().includes(search.toLowerCase())
  );

  const byYear = filtered.reduce((acc, s) => {
    const y = fmtYear(s.date);
    if (!acc[y]) acc[y] = [];
    acc[y].push(s);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 28px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: MUTED, textTransform: "uppercase", marginBottom: 10 }}>Every show since day one</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 42, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.1, margin: 0 }}>Archive</h1>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search artists or genres…"
          style={{ fontSize: 13, padding: "9px 14px", border: `1px solid ${RULE}`, borderRadius: 9, width: 220, background: "#FAFAF9", color: INK, outline: "none" }}
        />
      </div>

      {Object.keys(byYear).sort((a, b) => b - a).map(year => (
        <div key={year} style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: MUTED, textTransform: "uppercase", marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${RULE}` }}>{year}</div>
          {byYear[year].map((s, i) => (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto auto", gap: "0 20px", alignItems: "center", padding: "14px 0", borderBottom: i < byYear[year].length - 1 ? `1px solid ${RULE}` : "none" }}>
              <div style={{ fontSize: 12, color: MUTED }}>{fmtMed(s.date)}</div>
              <div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{s.artist}</span>
                <span style={{ fontSize: 12, color: MUTED, marginLeft: 10 }}>{s.genre}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED, textAlign: "right" }}>{s.draw} attended</div>
            </div>
          ))}
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: MUTED, fontSize: 14 }}>No results for "{search}"</div>
      )}
    </div>
  );
}

// ── BOOKING FORM ───────────────────────────────────────────────────────────
function BookingPage() {
  const [form, setForm] = useState({ name: "", genre: "", date: "", draw: "", links: "", tech: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  if (submitted) {
    return (
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 28px 0", textAlign: "center" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Got it.</div>
        <div style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 32px" }}>
          We review every submission and will get back to you within a week. If your dates are flexible, mention that — it helps a lot.
        </div>
        <button onClick={() => setSubmitted(false)} style={{ background: "none", border: `1px solid ${RULE}`, borderRadius: 9, padding: "10px 22px", fontSize: 13, cursor: "pointer", color: MUTED }}>Submit another</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 28px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 56, alignItems: "start" }}>
        {/* Form */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: MUTED, textTransform: "uppercase", marginBottom: 10 }}>Play at ppxis</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 42, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.1, margin: "0 0 8px" }}>Book us</h1>
          <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.8, marginBottom: 36 }}>Fill this out and we'll be in touch. We're into most things — don't second-guess yourself.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <div style={{ gridColumn: "1/-1" }}>
              <PubField label="Artist / act name *" value={form.name} onChange={set("name")} placeholder="Your name or project" />
            </div>
            <PubField label="Genre / style" value={form.genre} onChange={set("genre")} placeholder="e.g. Noise, Jazz, Electronic" />
            <PubField label="Preferred date" value={form.date} onChange={set("date")} type="date" />
            <PubField label="Expected draw" value={form.draw} onChange={set("draw")} placeholder="Rough headcount" />
            <PubField label="Links *" value={form.links} onChange={set("links")} placeholder="Bandcamp, Instagram, etc." />
            <div style={{ gridColumn: "1/-1" }}>
              <PubField label="Tech rider / needs" value={form.tech} onChange={set("tech")} placeholder="PA, backline, anything specific" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Anything else</label>
              <textarea value={form.message} onChange={set("message")} rows={4} placeholder="Tell us about the project, the kind of show you're imagining, touring context, anything." style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: `1px solid ${RULE}`, fontSize: 13, background: "#FAFAF9", resize: "vertical", boxSizing: "border-box", color: INK, fontFamily: "inherit", outline: "none" }} />
            </div>
          </div>

          <button
            onClick={() => form.name && form.links && setSubmitted(true)}
            style={{ marginTop: 24, background: INK, color: "#fff", border: "none", borderRadius: 9, padding: "13px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: form.name && form.links ? 1 : .4 }}
          >
            Send inquiry
          </button>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 10 }}>* Required. We reply to every submission.</div>
        </div>

        {/* Sidebar info */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{ background: "#FAFAF9", borderRadius: 14, border: `1px solid ${RULE}`, padding: 22, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>The space</div>
            {[["Capacity", "~150 standing"], ["Stages", "1 main room"], ["Address", "25 Manton Ave, Providence RI 02909"], ["Ages", "Varies by show"]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: MUTED }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: INK, marginTop: 1 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#FAFAF9", borderRadius: 14, border: `1px solid ${RULE}`, padding: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>What to know</div>
            {[
              "We book shows 4–8 weeks out on average.",
              "Flexible on format — live, DJ, hybrid, performance art.",
              "We work with artists on door splits or flat guarantees depending on the show.",
              "Dates are soft-held until we confirm in writing.",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                <span style={{ color: RED, flexShrink: 0, marginTop: 1 }}>—</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PubField({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: `1px solid ${RULE}`, fontSize: 13, background: "#FAFAF9", boxSizing: "border-box", color: INK, fontFamily: "inherit", outline: "none" }} />
    </div>
  );
}

// ── ABOUT ──────────────────────────────────────────────────────────────────
function AboutPage({ setPage }) {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 28px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: MUTED, textTransform: "uppercase", marginBottom: 10 }}>Providence, RI</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 42, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.1, margin: "0 0 24px" }}>About</h1>
          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.9, marginBottom: 20 }}>
            ppxis is an independent artist space and venue on Manton Ave in Providence, Rhode Island. We host live music, DJ nights, performance art, and whatever else feels right.
          </p>
          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.9, marginBottom: 20 }}>
            We've been around since 2021. The focus has always been on underground and experimental work — things that don't fit neatly into the usual venues.
          </p>
          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.9, marginBottom: 36 }}>
            No bouncers. No bottle service. Bring your friends.
          </p>
          <button onClick={() => setPage("book-us")} style={{ background: INK, color: "#fff", border: "none", borderRadius: 9, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Book the space →</button>
        </div>

        <div>
          <div style={{ background: "#F7F6F3", borderRadius: 14, border: `1px solid ${RULE}`, overflow: "hidden" }}>
            <div style={{ background: "#E8E7E4", height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: MUTED, fontStyle: "italic" }}>[ venue photo ]</span>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>The space</div>
              {[["Address", "25 Manton Ave, Providence RI 02909"], ["Capacity", "~150 standing"], ["Email", "hello@ppxis.com"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${RULE}`, fontSize: 13 }}>
                  <span style={{ color: MUTED }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            {["Instagram", "Discord", "Mailing list"].map(l => (
              <button key={l} style={{ flex: 1, background: "none", border: `1px solid ${RULE}`, borderRadius: 8, padding: "9px 0", fontSize: 12, cursor: "pointer", color: MUTED }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]       = useState("shows");
  const [selectedShow, setSelectedShow] = useState(null);

  const handleShowClick = show => { setSelectedShow(show); setPage("detail"); };
  const handleBack      = ()   => { setPage("shows"); setSelectedShow(null); };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', -apple-system, sans-serif", color: INK }}>
      <TopNav active={page} setPage={p => { setPage(p); setSelectedShow(null); }} />

      <main style={{ paddingBottom: 60 }}>
        {page === "shows"   && <ShowsPage onShowClick={handleShowClick} />}
        {page === "detail"  && selectedShow && <ShowDetailPage show={selectedShow} onBack={handleBack} />}
        {page === "archive" && <ArchivePage />}
        {page === "book-us" && <BookingPage />}
        {page === "about"   && <AboutPage setPage={setPage} />}
      </main>

      <Footer />
    </div>
  );
}
