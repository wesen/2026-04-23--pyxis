import { useState } from "react";

const ACCENT = "#C8270D";
const ACCENT_LIGHT = "#FFF0EE";
const AMBER = "#E07B00";
const AMBER_LIGHT = "#FFF8EC";
const GREEN = "#2A7D4F";
const GREEN_LIGHT = "#EBF7F0";

const INITIAL_SHOWS = [
  { id: 42, artist: "Burial Hex", date: "2025-05-02", doors: "8:00 PM", age: "21+", price: "$12 adv / $15 door", status: "confirmed", genre: "Darkwave", draw: 70, messageId: "1234567890" },
  { id: 43, artist: "Moor Mother", date: "2025-05-09", doors: "7:00 PM", age: "All Ages", price: "$15", status: "confirmed", genre: "Experimental", draw: 120, messageId: "1234567891" },
  { id: 44, artist: "Cygnus + Guests", date: "2025-05-17", doors: "9:00 PM", age: "18+", price: "$8", status: "confirmed", genre: "Techno", draw: 90, messageId: "1234567892" },
  { id: 45, artist: "Open Mic Night", date: "2025-05-23", doors: "7:00 PM", age: "All Ages", price: "Free", status: "confirmed", genre: "Various", draw: 40, messageId: "1234567893" },
  { id: 46, artist: "Zola Jesus", date: "2025-06-06", doors: "8:00 PM", age: "21+", price: "$20", status: "confirmed", genre: "Darkwave", draw: 160, messageId: "1234567894" },
  { id: 40, artist: "Planning for Burial", date: "2025-03-14", doors: "8:00 PM", age: "18+", price: "$10", status: "archived", genre: "Ambient", draw: 34, messageId: null },
  { id: 41, artist: "Actress", date: "2025-02-28", doors: "9:00 PM", age: "21+", price: "$12", status: "archived", genre: "Electronic", draw: 61, messageId: null },
];

const INITIAL_SUBMISSIONS = [
  { id: 1, artist: "Pharmakon", date: "2025-06-14", genre: "Industrial", draw: 80, links: "pharmakon.bandcamp.com", status: "pending", submitted: "Apr 19" },
  { id: 2, artist: "Lust for Youth", date: "2025-06-21", genre: "Darkwave", draw: 120, links: "instagram.com/lustyouth", status: "pending", submitted: "Apr 20" },
  { id: 3, artist: "Orphx", date: "2025-07-04", genre: "EBM", draw: 60, links: "orphx.com", status: "approved", submitted: "Apr 18" },
  { id: 4, artist: "Arca", date: "2025-07-12", genre: "Experimental", draw: 200, links: "arca1000.com", status: "declined", submitted: "Apr 15" },
  { id: 5, artist: "Container", date: "2025-07-19", genre: "Noise", draw: 55, links: "container.bandcamp.com", status: "pending", submitted: "Apr 22" },
];

const INITIAL_LOG = [
  { id: 1, time: "Today 11:42", user: "jamie", action: "approved show #47 · Orphx · Jul 4", type: "approve" },
  { id: 2, time: "Today 11:39", user: "bot", action: "posted + pinned #47 in #upcoming-shows", type: "bot" },
  { id: 3, time: "Today 09:14", user: "sam", action: "declined submission · Arca · Jul 12", type: "decline" },
  { id: 4, time: "Apr 22 · 23:00", user: "bot", action: "auto-archived 2 past shows (Planning for Burial, Actress)", type: "bot" },
  { id: 5, time: "Apr 21 · 16:30", user: "jamie", action: "edited show #42 · updated doors time to 8:00 PM", type: "edit" },
  { id: 6, time: "Apr 20 · 10:05", user: "bot", action: "received new submission · Lust for Youth · Jun 21", type: "bot" },
  { id: 7, time: "Apr 19 · 09:55", user: "bot", action: "received new submission · Pharmakon · Jun 14", type: "bot" },
  { id: 8, time: "Apr 18 · 14:20", user: "sam", action: "added show #45 · Open Mic Night · May 23", type: "add" },
];

const fmtDate = d => { const dt = new Date(d + "T00:00:00"); return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }); };
const fmtShort = d => { const dt = new Date(d + "T00:00:00"); return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }); };

const StatusBadge = ({ status }) => {
  const map = {
    confirmed: { bg: GREEN_LIGHT, color: GREEN, label: "Confirmed" },
    archived:  { bg: "#F1EFE8", color: "#5F5E5A", label: "Archived" },
    cancelled: { bg: "#FCEBEB", color: "#A32D2D", label: "Cancelled" },
    pending:   { bg: AMBER_LIGHT, color: AMBER, label: "Pending" },
    approved:  { bg: GREEN_LIGHT, color: GREEN, label: "Approved" },
    declined:  { bg: "#FCEBEB", color: "#A32D2D", label: "Declined" },
  };
  const s = map[status] || map.pending;
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{s.label}</span>;
};

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ background: "#fff", borderRadius: 14, width: 520, maxWidth: "95vw", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0EFEC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888", lineHeight: 1 }}>×</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, value, onChange, type = "text", options }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>{label}</label>
    {options
      ? <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #E0DFDC", fontSize: 13, background: "#FAFAF9" }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #E0DFDC", fontSize: 13, background: "#FAFAF9", boxSizing: "border-box" }} />
    }
  </div>
);

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [shows, setShows] = useState(INITIAL_SHOWS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [log, setLog] = useState(INITIAL_LOG);
  const [modal, setModal] = useState(null); // null | { type, data }
  const [editShow, setEditShow] = useState(null);
  const [newShow, setNewShow] = useState({ artist: "", date: "", doors: "8:00 PM", age: "21+", price: "", genre: "", notes: "" });
  const [toast, setToast] = useState(null);

  const notify = msg => { setToast(msg); setTimeout(() => setToast(null), 2800); };
  const addLog = (user, action, type) => setLog(prev => [{ id: prev.length + 1, time: "Just now", user, action, type }, ...prev]);

  const upcomingShows = shows.filter(s => s.status === "confirmed").sort((a, b) => a.date.localeCompare(b.date));
  const archivedShows = shows.filter(s => s.status === "archived");
  const pendingCount = submissions.filter(s => s.status === "pending").length;

  const handleApprove = (subId) => {
    const sub = submissions.find(s => s.id === subId);
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: "approved" } : s));
    const newId = Math.max(...shows.map(s => s.id)) + 1;
    setShows(prev => [...prev, { id: newId, artist: sub.artist, date: sub.date, doors: "8:00 PM", age: "21+", price: "TBD", status: "confirmed", genre: sub.genre, draw: sub.draw, messageId: null }]);
    addLog("you", `approved submission · ${sub.artist} · ${fmtShort(sub.date)} → added as show #${newId}`, "approve");
    notify(`✓ ${sub.artist} approved and added to shows`);
  };

  const handleDecline = (subId) => {
    const sub = submissions.find(s => s.id === subId);
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: "declined" } : s));
    addLog("you", `declined submission · ${sub.artist} · ${fmtShort(sub.date)}`, "decline");
    notify(`Declined: ${sub.artist}`);
  };

  const handleCancelShow = (showId) => {
    const show = shows.find(s => s.id === showId);
    setShows(prev => prev.map(s => s.id === showId ? { ...s, status: "cancelled" } : s));
    addLog("you", `cancelled show #${showId} · ${show.artist} · ${fmtShort(show.date)}`, "decline");
    notify(`Show cancelled: ${show.artist}`);
    setModal(null);
  };

  const handleArchiveShow = (showId) => {
    const show = shows.find(s => s.id === showId);
    setShows(prev => prev.map(s => s.id === showId ? { ...s, status: "archived" } : s));
    addLog("you", `archived show #${showId} · ${show.artist}`, "edit");
    notify(`Archived: ${show.artist}`);
    setModal(null);
  };

  const handleSaveShow = () => {
    setShows(prev => prev.map(s => s.id === editShow.id ? editShow : s));
    addLog("you", `edited show #${editShow.id} · ${editShow.artist}`, "edit");
    notify("Show updated");
    setModal(null);
  };

  const handleAddShow = () => {
    if (!newShow.artist || !newShow.date) return;
    const id = Math.max(...shows.map(s => s.id)) + 1;
    setShows(prev => [...prev, { ...newShow, id, status: "confirmed", draw: 0, messageId: null }]);
    addLog("you", `added show #${id} · ${newShow.artist} · ${fmtShort(newShow.date)}`, "add");
    notify(`✓ ${newShow.artist} added`);
    setNewShow({ artist: "", date: "", doors: "8:00 PM", age: "21+", price: "", genre: "", notes: "" });
    setModal(null);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "shows",     label: "Shows",     icon: "◈" },
    { id: "bookings",  label: "Bookings",  icon: "✉", badge: pendingCount || null },
    { id: "log",       label: "Audit Log", icon: "≡" },
  ];

  const s = { // shared styles
    page: { display: "flex", height: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", background: "#F7F6F3", fontSize: 13, color: "#1A1A18" },
    sidebar: { width: 210, background: "#fff", borderRight: "1px solid #EEECEA", display: "flex", flexDirection: "column", flexShrink: 0 },
    main: { flex: 1, overflow: "auto", padding: 28 },
    card: { background: "#fff", borderRadius: 12, border: "1px solid #EEECEA", padding: "20px 22px", marginBottom: 20 },
    th: { fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: ".06em", padding: "0 12px 10px 0", textAlign: "left", whiteSpace: "nowrap" },
    td: { padding: "13px 12px 13px 0", borderTop: "1px solid #F3F2EF", verticalAlign: "middle" },
    btn: (color = ACCENT) => ({ background: color, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }),
    btnOutline: { background: "none", border: "1px solid #DDDBD8", borderRadius: 8, padding: "7px 14px", fontSize: 12, cursor: "pointer", color: "#555" },
    btnDanger: { background: "none", border: `1px solid #F7C1C1`, borderRadius: 8, padding: "7px 14px", fontSize: 12, cursor: "pointer", color: "#A32D2D" },
  };

  return (
    <div style={s.page}>
      {/* SIDEBAR */}
      <div style={s.sidebar}>
        <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid #EEECEA" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", color: "#1A1A18" }}>ppxis</div>
          <div style={{ fontSize: 11, color: "#AAA", marginTop: 2, fontStyle: "italic" }}>a music artist space<br />in providence, ri</div>
        </div>

        <nav style={{ padding: "12px 10px", flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#BBB", letterSpacing: ".1em", textTransform: "uppercase", padding: "6px 10px 8px" }}>Main</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === item.id ? 600 : 400, background: page === item.id ? ACCENT_LIGHT : "transparent", color: page === item.id ? ACCENT : "#444", marginBottom: 2, textAlign: "left" }}>
              <span style={{ fontSize: 15, opacity: .8 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ background: ACCENT, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid #EEECEA" }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>ppxis</div>
          <div style={{ fontSize: 11, color: "#AAA" }}>25 Manton Ave, Providence RI</div>
          <div style={{ fontSize: 11, color: ACCENT, marginTop: 6, cursor: "pointer" }}>View public site ↗</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={s.main}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.02em" }}>
              { { dashboard: "Dashboard", shows: "Shows", bookings: "Bookings", log: "Audit Log" }[page] }
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Welcome back, Admin</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {page === "shows" && <button style={s.btn()} onClick={() => setModal({ type: "addShow" })}>+ New show</button>}
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2C2C2A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 600 }}>AD</div>
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        {page === "dashboard" && <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
            {[
              { label: "Upcoming Shows", val: upcomingShows.length, sub: "Next 30 days", color: ACCENT },
              { label: "Pending Bookings", val: pendingCount, sub: "Awaiting review", color: AMBER },
              { label: "Total Shows", val: shows.length, sub: "All time", color: "#378ADD" },
              { label: "Archived", val: archivedShows.length, sub: "Past shows", color: "#888" },
            ].map(c => (
              <div key={c.label} style={{ ...s.card, marginBottom: 0, padding: "18px 20px" }}>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#1A1A18", lineHeight: 1 }}>{c.val}</div>
                <div style={{ fontSize: 11, color: c.color, marginTop: 6, fontWeight: 500 }}>{c.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Upcoming Shows</div>
                <button onClick={() => setPage("shows")} style={{ ...s.btnOutline, fontSize: 12 }}>View all →</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>
                  <th style={s.th}>Artist</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Doors</th>
                  <th style={s.th}>Status</th>
                </tr></thead>
                <tbody>
                  {upcomingShows.slice(0, 5).map(show => (
                    <tr key={show.id}>
                      <td style={s.td}><span style={{ fontWeight: 600 }}>{show.artist}</span><br /><span style={{ fontSize: 11, color: "#999" }}>{show.genre} · {show.age}</span></td>
                      <td style={s.td}>{fmtShort(show.date)}</td>
                      <td style={s.td}>{show.doors}</td>
                      <td style={s.td}><StatusBadge status={show.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Quick Actions</div>
              {[
                { label: "+ New Show", color: ACCENT, action: () => { setPage("shows"); setModal({ type: "addShow" }); } },
                { label: "+ Review Bookings", color: AMBER, action: () => setPage("bookings") },
                { label: "↗ View Audit Log", color: "#555", action: () => setPage("log"), outline: true },
              ].map(b => (
                <button key={b.label} onClick={b.action} style={{ width: "100%", marginBottom: 10, padding: "11px 16px", borderRadius: 9, border: b.outline ? "1px solid #DDDBD8" : "none", background: b.outline ? "transparent" : b.color, color: b.outline ? b.color : "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "center" }}>{b.label}</button>
              ))}

              <div style={{ marginTop: 8, borderTop: "1px solid #F3F2EF", paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Recent Log</div>
                {log.slice(0, 3).map(l => (
                  <div key={l.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: l.type === "approve" || l.type === "add" ? GREEN : l.type === "decline" ? ACCENT : AMBER }} />
                    <div style={{ fontSize: 11, color: "#777", lineHeight: 1.5 }}><strong style={{ color: "#333" }}>{l.user}</strong> {l.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {/* ── SHOWS ── */}
        {page === "shows" && <>
          <div style={s.card}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Confirmed Shows</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <th style={s.th}>#</th>
                <th style={s.th}>Artist</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Doors</th>
                <th style={s.th}>Age / Price</th>
                <th style={s.th}>Status</th>
                <th style={s.th}></th>
              </tr></thead>
              <tbody>
                {shows.filter(s => s.status !== "archived").sort((a,b) => a.date.localeCompare(b.date)).map(show => (
                  <tr key={show.id}>
                    <td style={{ ...s.td, color: "#BBB", fontSize: 11 }}>#{show.id}</td>
                    <td style={s.td}><span style={{ fontWeight: 600 }}>{show.artist}</span><br /><span style={{ fontSize: 11, color: "#999" }}>{show.genre}</span></td>
                    <td style={s.td}>{fmtDate(show.date)}</td>
                    <td style={s.td}>{show.doors}</td>
                    <td style={s.td}>{show.age}<br /><span style={{ color: "#999" }}>{show.price}</span></td>
                    <td style={s.td}><StatusBadge status={show.status} /></td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={s.btnOutline} onClick={() => { setEditShow({ ...show }); setModal({ type: "editShow" }); }}>Edit</button>
                        {show.status === "confirmed" && <button style={s.btnDanger} onClick={() => setModal({ type: "confirmCancel", show })}>Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {archivedShows.length > 0 && <div style={s.card}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: "#888" }}>Archived / Past</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <th style={s.th}>Artist</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Draw</th>
                <th style={s.th}>Status</th>
              </tr></thead>
              <tbody>
                {archivedShows.map(show => (
                  <tr key={show.id} style={{ opacity: .7 }}>
                    <td style={s.td}><span style={{ fontWeight: 500 }}>{show.artist}</span></td>
                    <td style={s.td}>{fmtDate(show.date)}</td>
                    <td style={s.td}>{show.draw} attended</td>
                    <td style={s.td}><StatusBadge status="archived" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
        </>}

        {/* ── BOOKINGS ── */}
        {page === "bookings" && <>
          <div style={s.card}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Submission Queue</div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>Artist booking requests — review and approve or decline</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <th style={s.th}>Artist</th>
                <th style={s.th}>Requested date</th>
                <th style={s.th}>Genre</th>
                <th style={s.th}>Est. draw</th>
                <th style={s.th}>Links</th>
                <th style={s.th}>Submitted</th>
                <th style={s.th}>Status</th>
                <th style={s.th}></th>
              </tr></thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id}>
                    <td style={s.td}><span style={{ fontWeight: 600 }}>{sub.artist}</span></td>
                    <td style={s.td}>{fmtDate(sub.date)}</td>
                    <td style={s.td}>{sub.genre}</td>
                    <td style={s.td}>~{sub.draw}</td>
                    <td style={s.td}><a href="#" style={{ color: "#378ADD", fontSize: 11 }}>{sub.links}</a></td>
                    <td style={s.td}>{sub.submitted}</td>
                    <td style={s.td}><StatusBadge status={sub.status} /></td>
                    <td style={s.td}>
                      {sub.status === "pending" && <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ ...s.btn(GREEN), padding: "6px 12px", fontSize: 12 }} onClick={() => handleApprove(sub.id)}>Approve</button>
                        <button style={s.btnDanger} onClick={() => handleDecline(sub.id)}>Decline</button>
                      </div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ── AUDIT LOG ── */}
        {page === "log" && <>
          <div style={s.card}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Audit Log</div>
            {log.map(l => (
              <div key={l.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "11px 0", borderBottom: "1px solid #F3F2EF" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: l.type === "approve" || l.type === "add" ? GREEN : l.type === "decline" ? ACCENT : l.type === "edit" ? "#378ADD" : AMBER }} />
                <div style={{ fontSize: 11, color: "#999", minWidth: 90, flexShrink: 0, marginTop: 1 }}>{l.time}</div>
                <div style={{ fontSize: 13, color: "#444" }}><strong style={{ color: "#1A1A18" }}>{l.user}</strong> {l.action}</div>
              </div>
            ))}
          </div>
        </>}
      </div>

      {/* ── MODALS ── */}
      {modal?.type === "addShow" && (
        <Modal title="Add new show" onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1/-1" }}><Field label="Artist / act name" value={newShow.artist} onChange={v => setNewShow(p => ({ ...p, artist: v }))} /></div>
            <Field label="Date" value={newShow.date} onChange={v => setNewShow(p => ({ ...p, date: v }))} type="date" />
            <Field label="Doors time" value={newShow.doors} onChange={v => setNewShow(p => ({ ...p, doors: v }))} />
            <Field label="Age restriction" value={newShow.age} onChange={v => setNewShow(p => ({ ...p, age: v }))} options={["All Ages", "18+", "21+"]} />
            <Field label="Price" value={newShow.price} onChange={v => setNewShow(p => ({ ...p, price: v }))} />
            <Field label="Genre" value={newShow.genre} onChange={v => setNewShow(p => ({ ...p, genre: v }))} />
            <div style={{ gridColumn: "1/-1" }}><Field label="Notes" value={newShow.notes} onChange={v => setNewShow(p => ({ ...p, notes: v }))} /></div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button style={s.btnOutline} onClick={() => setModal(null)}>Cancel</button>
            <button style={s.btn()} onClick={handleAddShow}>Add show</button>
          </div>
        </Modal>
      )}

      {modal?.type === "editShow" && editShow && (
        <Modal title={`Edit show #${editShow.id}`} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1/-1" }}><Field label="Artist" value={editShow.artist} onChange={v => setEditShow(p => ({ ...p, artist: v }))} /></div>
            <Field label="Date" value={editShow.date} onChange={v => setEditShow(p => ({ ...p, date: v }))} type="date" />
            <Field label="Doors time" value={editShow.doors} onChange={v => setEditShow(p => ({ ...p, doors: v }))} />
            <Field label="Age restriction" value={editShow.age} onChange={v => setEditShow(p => ({ ...p, age: v }))} options={["All Ages", "18+", "21+"]} />
            <Field label="Price" value={editShow.price} onChange={v => setEditShow(p => ({ ...p, price: v }))} />
            <Field label="Status" value={editShow.status} onChange={v => setEditShow(p => ({ ...p, status: v }))} options={["confirmed", "cancelled", "archived"]} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginTop: 8 }}>
            <button style={s.btnDanger} onClick={() => handleCancelShow(editShow.id)}>Cancel show</button>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={s.btnOutline} onClick={() => setModal(null)}>Discard</button>
              <button style={s.btn()} onClick={handleSaveShow}>Save changes</button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === "confirmCancel" && (
        <Modal title="Cancel show?" onClose={() => setModal(null)}>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 20 }}>
            Are you sure you want to cancel <strong>{modal.show.artist}</strong> on {fmtDate(modal.show.date)}?
            The Discord pin will be removed and a cancellation notice will be posted.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={s.btnOutline} onClick={() => setModal(null)}>Keep it</button>
            <button style={s.btn(ACCENT)} onClick={() => handleCancelShow(modal.show.id)}>Yes, cancel show</button>
          </div>
        </Modal>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#1A1A18", color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
