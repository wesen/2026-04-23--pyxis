import { useState } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────
const ACCENT      = "#C8270D";
const ACCENT_LT   = "#FFF0EE";
const AMBER       = "#E07B00";
const AMBER_LT    = "#FFF8EC";
const GREEN       = "#2A7D4F";
const GREEN_LT    = "#EBF7F0";
const DISCORD_CLR = "#5865F2";

// ── Shared micro-components ───────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    confirmed: [GREEN_LT,  GREEN,   "Confirmed"],
    pending:   [AMBER_LT,  AMBER,   "Pending"],
    archived:  ["#F1EFE8", "#5F5E5A","Archived"],
    cancelled: ["#FCEBEB", "#A32D2D","Cancelled"],
    hold:      ["#E6F1FB", "#185FA5","Hold"],
    blocked:   ["#F1EFE8", "#5F5E5A","Blocked"],
  };
  const [bg, fg, label] = map[status] || map.pending;
  return <span style={{ background: bg, color: fg, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{label}</span>;
};

const Modal = ({ title, onClose, children, width = 520 }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ background: "#fff", borderRadius: 14, width, maxWidth: "96vw", boxShadow: "0 8px 40px rgba(0,0,0,.18)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0EFEC", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#AAA", lineHeight: 1 }}>×</button>
      </div>
      <div style={{ padding: 24, overflowY: "auto" }}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, value, onChange, type = "text", options, hint, placeholder = "" }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>{label}</label>
    {options
      ? <select value={value} onChange={e => onChange(e.target.value)} style={fldStyle}>{options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select>
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={fldStyle} />}
    {hint && <div style={{ fontSize: 11, color: "#AAA", marginTop: 4 }}>{hint}</div>}
  </div>
);
const fldStyle = { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #E0DFDC", fontSize: 13, background: "#FAFAF9", boxSizing: "border-box", color: "#1A1A18" };

const SectionHead = ({ children }) => <div style={{ fontSize: 11, fontWeight: 700, color: "#BBB", letterSpacing: ".1em", textTransform: "uppercase", padding: "6px 10px 8px" }}>{children}</div>;

// ── Sample data ───────────────────────────────────────────────────────────
const ARTISTS = [
  { id: 1, name: "Burial Hex",        genre: "Darkwave",    shows: 3, lastShow: "2025-05-02", links: "burialvault.com",      notes: "Great draw, always professional" },
  { id: 2, name: "Moor Mother",       genre: "Experimental",shows: 2, lastShow: "2025-05-09", links: "moormotherpoet.com",   notes: "" },
  { id: 3, name: "Planning for Burial",genre: "Ambient",    shows: 4, lastShow: "2025-03-14", links: "planningforburial.com",notes: "Headliner material" },
  { id: 4, name: "Actress",           genre: "Electronic",  shows: 1, lastShow: "2025-02-28", links: "theactrss.com",        notes: "" },
  { id: 5, name: "Container",         genre: "Noise",       shows: 2, lastShow: "2025-01-18", links: "container.bandcamp.com",notes: "Very loud – warn neighbours" },
  { id: 6, name: "Pharmakon",         genre: "Industrial",  shows: 0, lastShow: null,          links: "pharmakon.bandcamp.com",notes: "Pending booking Jun 14" },
  { id: 7, name: "Cygnus",            genre: "Techno",      shows: 3, lastShow: "2025-05-17", links: "cygnus.bandcamp.com",  notes: "" },
  { id: 8, name: "Orphx",             genre: "EBM",         shows: 1, lastShow: "2025-07-04", links: "orphx.com",            notes: "" },
];

const PAST_SHOWS_BY_ARTIST = {
  1: [{ id: 42, date: "2025-05-02", draw: 72 }, { id: 38, date: "2024-11-15", draw: 55 }, { id: 31, date: "2024-07-20", draw: 48 }],
  2: [{ id: 43, date: "2025-05-09", draw: 118 }, { id: 35, date: "2024-09-06", draw: 94 }],
  3: [{ id: 40, date: "2025-03-14", draw: 34 }, { id: 33, date: "2024-08-22", draw: 29 }, { id: 27, date: "2024-04-11", draw: 41 }, { id: 20, date: "2023-12-01", draw: 38 }],
  4: [{ id: 41, date: "2025-02-28", draw: 61 }],
  5: [{ id: 36, date: "2024-10-04", draw: 55 }, { id: 22, date: "2024-01-19", draw: 49 }],
  7: [{ id: 44, date: "2025-05-17", draw: 88 }, { id: 32, date: "2024-08-01", draw: 74 }, { id: 19, date: "2023-11-10", draw: 62 }],
  8: [{ id: 47, date: "2025-07-04", draw: 0 }],
};

const CAL_EVENTS = [
  { date: "2025-05-02", label: "Burial Hex",         status: "confirmed" },
  { date: "2025-05-09", label: "Moor Mother",         status: "confirmed" },
  { date: "2025-05-14", label: "Hold — TBD",          status: "hold" },
  { date: "2025-05-17", label: "Cygnus + Guests",     status: "confirmed" },
  { date: "2025-05-23", label: "Open Mic Night",      status: "confirmed" },
  { date: "2025-05-26", label: "Closed",              status: "blocked" },
  { date: "2025-05-30", label: "Basement Frequencies",status: "confirmed" },
  { date: "2025-06-06", label: "Zola Jesus",          status: "confirmed" },
  { date: "2025-06-14", label: "Hold — Pharmakon",    status: "hold" },
];

const PAST_FOR_LOGGING = [
  { id: 40, artist: "Planning for Burial", date: "2025-03-14", logged: false },
  { id: 41, artist: "Actress",             date: "2025-02-28", logged: true,  draw: 61, notes: "Good energy, no issues." },
  { id: 38, artist: "Burial Hex",          date: "2024-11-15", logged: true,  draw: 55, notes: "" },
];

const fmtDate = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
const fmtShort = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

// ══════════════════════════════════════════════════════════════════════════
// VIEWS
// ══════════════════════════════════════════════════════════════════════════

// ── LOGIN ─────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ textAlign: "center", width: 360 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 42, fontWeight: 700, letterSpacing: "-.02em", marginBottom: 6 }}>ppxis</div>
        <div style={{ fontSize: 13, color: "#AAA", fontStyle: "italic", marginBottom: 40 }}>a music artist space in providence, ri</div>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EEECEA", padding: "32px 28px", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Staff login</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 28, lineHeight: 1.6 }}>Access is invite-only. Sign in with the Discord account your admin has authorised.</div>
          <button onClick={onLogin} style={{ width: "100%", padding: "13px 0", background: DISCORD_CLR, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            Continue with Discord
          </button>
          <div style={{ fontSize: 11, color: "#BBB", marginTop: 16 }}>Not on the list? Ask an admin to invite you.</div>
        </div>
      </div>
    </div>
  );
}

// ── SETUP WIZARD ──────────────────────────────────────────────────────────
function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "ppxis", tagline: "a music artist space in providence, ri", address: "25 Manton Ave, Providence RI 02909", capacity: "150", guildId: "", chAnnouncements: "", chUpcoming: "", chStaff: "", chBookingRequests: "" });
  const set = k => v => setData(p => ({ ...p, [k]: v }));

  const steps = [
    {
      title: "Your space", sub: "Basic info shown on the public site and staff dashboard.",
      body: <><Field label="Space name" value={data.name} onChange={set("name")} /><Field label="Tagline" value={data.tagline} onChange={set("tagline")} placeholder="a music artist space in…" /><Field label="Address" value={data.address} onChange={set("address")} /><Field label="Capacity" value={data.capacity} onChange={set("capacity")} type="number" /></>
    },
    {
      title: "Discord server", sub: "Connect your Discord server so the bot knows where to post.",
      body: <><Field label="Server (Guild) ID" value={data.guildId} onChange={set("guildId")} placeholder="e.g. 123456789012345678" hint="Settings → Advanced → Developer Mode, then right-click your server name → Copy ID" /></>
    },
    {
      title: "Channel mapping", sub: "Tell the bot which channel to use for each purpose.",
      body: <>
        <Field label="#upcoming-shows channel ID" value={data.chUpcoming} onChange={set("chUpcoming")} placeholder="Channel ID" hint="Public — bot posts and pins show announcements here" />
        <Field label="#announcements channel ID" value={data.chAnnouncements} onChange={set("chAnnouncements")} placeholder="Channel ID" hint="Public — broader space announcements" />
        <Field label="#staff channel ID" value={data.chStaff} onChange={set("chStaff")} placeholder="Channel ID" hint="Private — staff pings, auto-archive notices" />
        <Field label="#booking-requests channel ID" value={data.chBookingRequests} onChange={set("chBookingRequests")} placeholder="Channel ID" hint="Private — incoming artist submissions appear here" />
      </>
    },
    {
      title: "You're all set", sub: null,
      body: <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{data.name} is ready.</div>
        <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>Bot is connected to your Discord server.<br />You can change any of these settings later under <strong>Settings</strong>.</div>
      </div>
    },
  ];

  const cur = steps[step];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ width: 480 }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
          {steps.map((_, i) => <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? ACCENT : i < step ? "#CCC" : "#E8E7E4", transition: "all .25s" }} />)}
        </div>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EEECEA", overflow: "hidden" }}>
          <div style={{ padding: "28px 28px 0" }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{cur.title}</div>
            {cur.sub && <div style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>{cur.sub}</div>}
          </div>
          <div style={{ padding: "16px 28px 28px" }}>{cur.body}</div>
          <div style={{ padding: "16px 28px 24px", borderTop: "1px solid #F0EFEC", display: "flex", justifyContent: "space-between" }}>
            {step > 0 ? <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "1px solid #DDDBD8", borderRadius: 8, padding: "9px 18px", fontSize: 13, cursor: "pointer", color: "#555" }}>Back</button> : <div />}
            {step < steps.length - 1
              ? <button onClick={() => setStep(s => s + 1)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Continue</button>
              : <button onClick={onComplete} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Go to dashboard</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ARTISTS ───────────────────────────────────────────────────────────────
function ArtistsPage() {
  const [search, setSearch] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [editing, setEditing] = useState(false);

  const filtered = ARTISTS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.genre.toLowerCase().includes(search.toLowerCase()));

  const openArtist = a => { setSelectedArtist(a); setEditNotes(a.notes); setEditing(false); };

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EEECEA", padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or genre…" style={{ ...fldStyle, flex: 1, margin: 0 }} />
          <div style={{ fontSize: 12, color: "#AAA", whiteSpace: "nowrap" }}>{filtered.length} artists</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>
            {["Artist", "Genre", "Shows played", "Last show", ""].map(h => <th key={h} style={thS}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => openArtist(a)}>
                <td style={tdS}><span style={{ fontWeight: 600 }}>{a.name}</span></td>
                <td style={tdS}>{a.genre}</td>
                <td style={tdS}>{a.shows}</td>
                <td style={tdS}>{a.lastShow ? fmtShort(a.lastShow) : <span style={{ color: "#BBB" }}>—</span>}</td>
                <td style={tdS}><button style={{ background: "none", border: "1px solid #DDDBD8", borderRadius: 7, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#555" }}>View →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedArtist && (
        <Modal title={selectedArtist.name} onClose={() => setSelectedArtist(null)} width={560}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {[["Genre", selectedArtist.genre], ["Shows at ppxis", selectedArtist.shows], ["Last show", selectedArtist.lastShow ? fmtDate(selectedArtist.lastShow) : "—"], ["Links", selectedArtist.links]].map(([k, v]) => (
              <div key={k} style={{ background: "#FAFAF9", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 13, color: k === "Links" ? "#378ADD" : "#1A1A18" }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Show history</div>
            {(PAST_SHOWS_BY_ARTIST[selectedArtist.id] || []).length === 0
              ? <div style={{ fontSize: 13, color: "#BBB" }}>No shows yet.</div>
              : (PAST_SHOWS_BY_ARTIST[selectedArtist.id] || []).map(s => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F2EF", fontSize: 13 }}>
                  <span>{fmtDate(s.date)}</span>
                  <span style={{ color: "#888" }}>{s.draw > 0 ? `${s.draw} attended` : "—"}</span>
                </div>
              ))}
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: ".06em" }}>Internal notes</div>
              {!editing && <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", fontSize: 12, color: ACCENT, cursor: "pointer" }}>Edit</button>}
            </div>
            {editing
              ? <><textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} style={{ ...fldStyle, minHeight: 80, resize: "vertical" }} /><div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}><button onClick={() => setEditing(false)} style={{ background: "none", border: "1px solid #DDDBD8", borderRadius: 7, padding: "6px 14px", fontSize: 12, cursor: "pointer", color: "#555" }}>Cancel</button><button onClick={() => setEditing(false)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>Save</button></div></>
              : <div style={{ fontSize: 13, color: editNotes ? "#444" : "#BBB", background: "#FAFAF9", borderRadius: 8, padding: "10px 14px", minHeight: 40 }}>{editNotes || "No notes yet."}</div>}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── CALENDAR ─────────────────────────────────────────────────────────────
function CalendarPage() {
  const [year, setYear]   = useState(2025);
  const [month, setMonth] = useState(4); // 0-indexed → May
  const [modal, setModal] = useState(null);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsThisMonth = CAL_EVENTS.filter(e => {
    const d = new Date(e.date + "T00:00:00");
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const eventsOnDay = day => {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return eventsThisMonth.filter(e => e.date === iso);
  };

  const colorOf = status => ({
    confirmed: [GREEN_LT, GREEN],
    hold:      ["#E6F1FB", "#185FA5"],
    blocked:   ["#F1EFE8", "#5F5E5A"],
  })[status] || [AMBER_LT, AMBER];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EEECEA", padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{monthName}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={prev} style={navBtnS}>‹</button>
            <button onClick={next} style={navBtnS}>›</button>
            <button onClick={() => setModal({ type: "addEvent" })} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", marginLeft: 6 }}>+ Add</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#AAA", padding: "4px 0" }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
          {cells.map((day, i) => {
            const evs = day ? eventsOnDay(day) : [];
            const isToday = day === 2 && month === 4 && year === 2025;
            return (
              <div key={i} onClick={() => day && setModal({ type: "day", day, evs })} style={{ minHeight: 72, borderRadius: 8, padding: "6px 8px", background: day ? (isToday ? "#FFF0EE" : "#FAFAF9") : "transparent", border: isToday ? `1.5px solid ${ACCENT}` : "1px solid #F0EFEC", cursor: day ? "pointer" : "default" }}>
                {day && <>
                  <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? ACCENT : "#555", marginBottom: 4 }}>{day}</div>
                  {evs.map((e, j) => {
                    const [bg, fg] = colorOf(e.status);
                    return <div key={j} style={{ background: bg, color: fg, fontSize: 10, borderRadius: 4, padding: "2px 5px", marginBottom: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontWeight: 500 }}>{e.label}</div>;
                  })}
                </>}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 16, paddingTop: 14, borderTop: "1px solid #F0EFEC" }}>
          {[["Confirmed", GREEN_LT, GREEN], ["Hold", "#E6F1FB", "#185FA5"], ["Blocked", "#F1EFE8", "#5F5E5A"]].map(([l, bg, fg]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#777" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: bg, border: `1px solid ${fg}` }} />{l}
            </div>
          ))}
        </div>
      </div>

      {modal?.type === "day" && (
        <Modal title={`${monthName.split(" ")[0]} ${modal.day}`} onClose={() => setModal(null)} width={400}>
          {modal.evs.length === 0
            ? <div style={{ fontSize: 13, color: "#AAA", marginBottom: 20 }}>Nothing scheduled.</div>
            : modal.evs.map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F0EFEC" }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{e.label}</span>
                <Badge status={e.status} />
              </div>
            ))}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "9px 0", background: ACCENT, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>+ Add show</button>
            <button style={{ flex: 1, padding: "9px 0", background: "none", border: "1px solid #DDDBD8", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#888" }}>Block date</button>
          </div>
        </Modal>
      )}
      {modal?.type === "addEvent" && (
        <Modal title="Add to calendar" onClose={() => setModal(null)} width={400}>
          <Field label="Date" value="" onChange={() => {}} type="date" />
          <Field label="Type" value="confirmed" onChange={() => {}} options={[{ value: "confirmed", label: "Show" }, { value: "hold", label: "Hold" }, { value: "blocked", label: "Block / Close" }]} />
          <Field label="Label" value="" onChange={() => {}} placeholder="Artist name or note" />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button style={{ background: "none", border: "1px solid #DDDBD8", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", color: "#555" }} onClick={() => setModal(null)}>Cancel</button>
            <button style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }} onClick={() => setModal(null)}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── DISCORD SETTINGS ──────────────────────────────────────────────────────
function DiscordPage() {
  const [cfg, setCfg] = useState({ guildId: "847392017483620352", chUpcoming: "847392017483620355", chAnnouncements: "847392017483620356", chStaff: "847392017483620357", chBookingRequests: "847392017483620358", botStatus: "online" });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const set = k => v => { setCfg(p => ({ ...p, [k]: v })); setSaved(false); };

  const save = () => setSaved(true);
  const test = () => { setTesting(true); setTestResult(null); setTimeout(() => { setTesting(false); setTestResult("success"); }, 1400); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" }}>
      <div>
        <div style={cardS}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Server connection</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>The bot uses this to know which Discord server to operate in.</div>
          <Field label="Server (Guild) ID" value={cfg.guildId} onChange={set("guildId")} hint="Right-click your server → Copy Server ID (requires Developer Mode)" />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={test} style={{ background: DISCORD_CLR, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>{testing ? "Testing…" : "Test connection"}</button>
            {testResult === "success" && <span style={{ fontSize: 12, color: GREEN, fontWeight: 500 }}>✓ Connected — bot is online</span>}
          </div>
        </div>

        <div style={cardS}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Channel mapping</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Map each purpose to the right channel. Right-click any channel in Discord → Copy Channel ID.</div>
          {[
            ["chUpcoming",        "#upcoming-shows",      "Public — bot posts and pins confirmed show announcements here"],
            ["chAnnouncements",   "#announcements",       "Public — broader space announcements and cancellations"],
            ["chStaff",          "#staff",               "Private — auto-archive notices, reminders, bot status messages"],
            ["chBookingRequests", "#booking-requests",    "Private — incoming artist submissions appear here for staff review"],
          ].map(([key, name, hint]) => (
            <Field key={key} label={name} value={cfg[key]} onChange={set(key)} hint={hint} placeholder="Channel ID" />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={save} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            {saved ? "✓ Saved" : "Save changes"}
          </button>
        </div>
      </div>

      <div>
        <div style={cardS}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Bot status</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
            <span style={{ fontSize: 13, color: GREEN, fontWeight: 500 }}>Online</span>
          </div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7 }}>
            <div style={{ marginBottom: 6 }}>Server: <strong style={{ color: "#333" }}>Hollow Earth</strong></div>
            <div style={{ marginBottom: 6 }}>Members: <strong style={{ color: "#333" }}>247</strong></div>
            <div>Bot version: <strong style={{ color: "#333" }}>v1.2.0</strong></div>
          </div>
        </div>

        <div style={cardS}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>What the bot does</div>
          {[
            ["Posts show announcements", "When you confirm a show, bot posts an embed to #upcoming-shows and pins it."],
            ["Unpins past shows", "Each night, bot unpins shows whose date has passed and archives them."],
            ["Forwards submissions", "Artist booking form submissions appear in #booking-requests."],
            ["Posts cancellations", "When you cancel a show, bot unpins the message and posts a notice."],
          ].map(([title, desc]) => (
            <div key={title} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{title}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── POST-SHOW LOGGING ─────────────────────────────────────────────────────
function AttendancePage() {
  const [shows, setShows] = useState(PAST_FOR_LOGGING);
  const [logging, setLogging] = useState(null);
  const [form, setForm] = useState({ draw: "", notes: "", incident: false, incidentNotes: "" });

  const submit = () => {
    setShows(prev => prev.map(s => s.id === logging.id ? { ...s, logged: true, draw: Number(form.draw), notes: form.notes } : s));
    setLogging(null);
    setForm({ draw: "", notes: "", incident: false, incidentNotes: "" });
  };

  const open = show => { setLogging(show); setForm({ draw: show.draw || "", notes: show.notes || "", incident: false, incidentNotes: "" }); };

  return (
    <div>
      <div style={cardS}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Post-show logging</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Log headcount and notes after each show. Feeds into the archive and history.</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>
            {["Show", "Date", "Attended", "Status", ""].map(h => <th key={h} style={thS}>{h}</th>)}
          </tr></thead>
          <tbody>
            {shows.map(s => (
              <tr key={s.id}>
                <td style={tdS}><span style={{ fontWeight: 600 }}>{s.artist}</span></td>
                <td style={tdS}>{fmtDate(s.date)}</td>
                <td style={tdS}>{s.logged ? s.draw : <span style={{ color: "#BBB" }}>—</span>}</td>
                <td style={tdS}><span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: s.logged ? GREEN_LT : AMBER_LT, color: s.logged ? GREEN : AMBER }}>{s.logged ? "Logged" : "Needs log"}</span></td>
                <td style={tdS}><button onClick={() => open(s)} style={{ background: s.logged ? "none" : ACCENT, color: s.logged ? "#555" : "#fff", border: s.logged ? "1px solid #DDDBD8" : "none", borderRadius: 7, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>{s.logged ? "Edit" : "Log now"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logging && (
        <Modal title={`Log: ${logging.artist}`} onClose={() => setLogging(null)} width={440}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>{fmtDate(logging.date)}</div>
          <Field label="Attendance" value={form.draw} onChange={v => setForm(p => ({ ...p, draw: v }))} type="number" placeholder="Headcount" />
          <Field label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="How did it go? Anything notable?" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={form.incident} onChange={e => setForm(p => ({ ...p, incident: e.target.checked }))} />
              <span style={{ fontSize: 13, color: "#444" }}>Incident to note</span>
            </label>
            {form.incident && <textarea value={form.incidentNotes} onChange={e => setForm(p => ({ ...p, incidentNotes: e.target.value }))} placeholder="Briefly describe what happened…" style={{ ...fldStyle, marginTop: 10, minHeight: 70, resize: "vertical" }} />}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={{ background: "none", border: "1px solid #DDDBD8", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", color: "#555" }} onClick={() => setLogging(null)}>Cancel</button>
            <button style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }} onClick={submit}>Save log</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────────────────
function SettingsPage() {
  const [info, setInfo] = useState({ name: "ppxis", tagline: "a music artist space in providence, ri", address: "25 Manton Ave, Providence RI 02909", capacity: "150", email: "hello@ppxis.com", website: "ppxis.com" });
  const [saved, setSaved] = useState(false);
  const [danger, setDanger] = useState(null);
  const set = k => v => { setInfo(p => ({ ...p, [k]: v })); setSaved(false); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
      <div>
        <div style={cardS}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Space info</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Shown on the public site and in Discord bot messages.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1/-1" }}><Field label="Space name" value={info.name} onChange={set("name")} /></div>
            <div style={{ gridColumn: "1/-1" }}><Field label="Tagline" value={info.tagline} onChange={set("tagline")} /></div>
            <div style={{ gridColumn: "1/-1" }}><Field label="Address" value={info.address} onChange={set("address")} /></div>
            <Field label="Capacity" value={info.capacity} onChange={set("capacity")} type="number" />
            <Field label="Contact email" value={info.email} onChange={set("email")} type="email" />
            <div style={{ gridColumn: "1/-1" }}><Field label="Public website" value={info.website} onChange={set("website")} /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setSaved(true)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              {saved ? "✓ Saved" : "Save changes"}
            </button>
          </div>
        </div>

        <div style={{ ...cardS, border: "1px solid #F7C1C1" }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#A32D2D", marginBottom: 4 }}>Danger zone</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 18, lineHeight: 1.6 }}>These actions are irreversible. Be sure before proceeding.</div>
          {[
            { label: "Export all data", sub: "Download all shows, artists, and bookings as a CSV file.", btn: "Export CSV", color: "#555", outline: true },
            { label: "Disconnect Discord bot", sub: "Removes the bot from your server. Channel mappings are preserved.", btn: "Disconnect", color: AMBER, outline: true },
            { label: "Delete all shows", sub: "Permanently deletes every show record. Cannot be undone.", btn: "Delete shows", color: "#A32D2D", outline: false },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F3F2EF" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{item.sub}</div>
              </div>
              <button onClick={() => setDanger(item.label)} style={{ background: item.outline ? "none" : item.color, color: item.outline ? item.color : "#fff", border: `1px solid ${item.color === "#555" ? "#DDDBD8" : item.color}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>{item.btn}</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={cardS}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>App info</div>
          {[["Version", "v1.2.0"], ["Database", "PostgreSQL"], ["Last deploy", "Apr 22, 2025"], ["Environment", "Production"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F3F2EF", fontSize: 13 }}>
              <span style={{ color: "#888" }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {danger && (
        <Modal title="Are you sure?" onClose={() => setDanger(null)} width={400}>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 20 }}>You're about to: <strong>{danger}</strong>. This cannot be undone.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={{ background: "none", border: "1px solid #DDDBD8", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", color: "#555" }} onClick={() => setDanger(null)}>Cancel</button>
            <button style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }} onClick={() => setDanger(null)}>Confirm</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Shared table styles ───────────────────────────────────────────────────
const thS  = { fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: ".06em", padding: "0 12px 10px 0", textAlign: "left", whiteSpace: "nowrap" };
const tdS  = { padding: "12px 12px 12px 0", borderTop: "1px solid #F3F2EF", verticalAlign: "middle" };
const cardS = { background: "#fff", borderRadius: 12, border: "1px solid #EEECEA", padding: "20px 22px", marginBottom: 20 };
const navBtnS = { background: "none", border: "1px solid #DDDBD8", borderRadius: 7, width: 30, height: 30, cursor: "pointer", fontSize: 16, color: "#555", display: "flex", alignItems: "center", justifyContent: "center" };

// ══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen]   = useState("login"); // login | setup | app
  const [page, setPage]       = useState("artists");

  if (screen === "login")   return <LoginPage onLogin={() => setScreen("setup")} />;
  if (screen === "setup")   return <SetupWizard onComplete={() => setScreen("app")} />;

  const navItems = [
    { id: "artists",    label: "Artists",          icon: "♪", section: "MAIN" },
    { id: "calendar",   label: "Calendar",          icon: "◻" },
    { id: "attendance", label: "Post-show log",     icon: "✓" },
    { id: "discord",    label: "Discord settings",  icon: "⬡", section: "CONFIGURE" },
    { id: "settings",   label: "Settings",          icon: "◌" },
  ];

  const titles = { artists: "Artists", calendar: "Calendar", attendance: "Post-show log", discord: "Discord settings", settings: "Settings" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", background: "#F7F6F3", fontSize: 13, color: "#1A1A18" }}>
      {/* SIDEBAR */}
      <div style={{ width: 210, background: "#fff", borderRight: "1px solid #EEECEA", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid #EEECEA" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, letterSpacing: "-.02em" }}>ppxis</div>
          <div style={{ fontSize: 11, color: "#AAA", marginTop: 2, fontStyle: "italic" }}>a music artist space<br />in providence, ri</div>
        </div>
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          {navItems.map((item, i) => <>
            {item.section && <SectionHead key={"s" + i}>{item.section}</SectionHead>}
            <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === item.id ? 600 : 400, background: page === item.id ? ACCENT_LT : "transparent", color: page === item.id ? ACCENT : "#444", marginBottom: 2, textAlign: "left" }}>
              <span style={{ fontSize: 14, opacity: .8 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </>)}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #EEECEA" }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>ppxis</div>
          <div style={{ fontSize: 11, color: "#AAA" }}>25 Manton Ave, Providence RI</div>
          <div style={{ fontSize: 11, color: ACCENT, marginTop: 4, cursor: "pointer" }} onClick={() => setScreen("login")}>← Sign out</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.02em" }}>{titles[page]}</div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>ppxis staff portal</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2C2C2A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 600 }}>AD</div>
        </div>

        {page === "artists"    && <ArtistsPage />}
        {page === "calendar"   && <CalendarPage />}
        {page === "attendance" && <AttendancePage />}
        {page === "discord"    && <DiscordPage />}
        {page === "settings"   && <SettingsPage />}
      </div>
    </div>
  );
}
