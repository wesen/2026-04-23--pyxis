// Shared sample data for all screens.
window.PX_DATA = {
  shows: [
    { id: 42, artist: "Burial Hex", date: "2025-05-02", doors: "8:00 PM", age: "21+", price: "$12 adv / $15 door", status: "confirmed", genre: "Darkwave", draw: 70, capacity: 150, pinned: true },
    { id: 43, artist: "Moor Mother", date: "2025-05-09", doors: "7:00 PM", age: "All Ages", price: "$15", status: "confirmed", genre: "Experimental", draw: 120, capacity: 150, pinned: true },
    { id: 44, artist: "Cygnus + Guests", date: "2025-05-17", doors: "9:00 PM", age: "18+", price: "$8", status: "confirmed", genre: "Techno", draw: 90, capacity: 150, pinned: true },
    { id: 45, artist: "Open Mic Night", date: "2025-05-23", doors: "7:00 PM", age: "All Ages", price: "Free", status: "confirmed", genre: "Various", draw: 40, capacity: 150 },
    { id: 46, artist: "Zola Jesus", date: "2025-06-06", doors: "8:00 PM", age: "21+", price: "$20", status: "confirmed", genre: "Darkwave", draw: 160, capacity: 150 },
    { id: 47, artist: "Basement Frequencies", date: "2025-05-30", doors: "10:00 PM", age: "21+", price: "$10", status: "confirmed", genre: "Techno", draw: 85, capacity: 150 },
    { id: 40, artist: "Planning for Burial", date: "2025-03-14", doors: "8:00 PM", age: "18+", price: "$10", status: "archived", genre: "Ambient", draw: 34, capacity: 150 },
    { id: 41, artist: "Actress", date: "2025-02-28", doors: "9:00 PM", age: "21+", price: "$12", status: "archived", genre: "Electronic", draw: 61, capacity: 150 },
  ],
  submissions: [
    { id: 1, artist: "Pharmakon", date: "2025-06-14", genre: "Industrial", draw: 80, links: "pharmakon.bandcamp.com", status: "pending", submitted: "Apr 19" },
    { id: 2, artist: "Lust for Youth", date: "2025-06-21", genre: "Darkwave", draw: 120, links: "instagram.com/lustyouth", status: "pending", submitted: "Apr 20" },
    { id: 5, artist: "Container", date: "2025-07-19", genre: "Noise", draw: 55, links: "container.bandcamp.com", status: "pending", submitted: "Apr 22" },
    { id: 3, artist: "Orphx", date: "2025-07-04", genre: "EBM", draw: 60, links: "orphx.com", status: "approved", submitted: "Apr 18" },
    { id: 4, artist: "Arca", date: "2025-07-12", genre: "Experimental", draw: 200, links: "arca1000.com", status: "declined", submitted: "Apr 15" },
  ],
  artists: [
    { id: 1, name: "Burial Hex", genre: "Darkwave", shows: 3, lastShow: "2025-05-02", links: "burialvault.com", avgDraw: 58, notes: "Great draw, always professional. Prefers no opener." },
    { id: 2, name: "Moor Mother", genre: "Experimental", shows: 2, lastShow: "2025-05-09", links: "moormotherpoet.com", avgDraw: 106, notes: "" },
    { id: 3, name: "Planning for Burial", genre: "Ambient", shows: 4, lastShow: "2025-03-14", links: "planningforburial.com", avgDraw: 36, notes: "Headliner material." },
    { id: 4, name: "Actress", genre: "Electronic", shows: 1, lastShow: "2025-02-28", links: "theactrss.com", avgDraw: 61, notes: "" },
    { id: 5, name: "Container", genre: "Noise", shows: 2, lastShow: "2025-01-18", links: "container.bandcamp.com", avgDraw: 52, notes: "Very loud — warn neighbours about 10pm curfew." },
    { id: 6, name: "Pharmakon", genre: "Industrial", shows: 0, lastShow: null, links: "pharmakon.bandcamp.com", avgDraw: null, notes: "Pending booking Jun 14." },
    { id: 7, name: "Cygnus", genre: "Techno", shows: 3, lastShow: "2025-05-17", links: "cygnus.bandcamp.com", avgDraw: 75, notes: "" },
    { id: 8, name: "Orphx", genre: "EBM", shows: 1, lastShow: "2025-07-04", links: "orphx.com", avgDraw: null, notes: "" },
  ],
  log: [
    { id: 1, time: "Today · 11:42", user: "jamie", action: "approved show #47 · Orphx · Jul 4", type: "approve" },
    { id: 2, time: "Today · 11:39", user: "bot", action: "posted + pinned #47 in #upcoming-shows", type: "bot" },
    { id: 3, time: "Today · 09:14", user: "sam", action: "declined submission · Arca · Jul 12", type: "decline" },
    { id: 4, time: "Apr 22 · 23:00", user: "bot", action: "auto-archived 2 past shows (Planning for Burial, Actress)", type: "archive" },
    { id: 5, time: "Apr 21 · 16:30", user: "jamie", action: "edited show #42 · updated doors to 8:00 PM", type: "edit" },
    { id: 6, time: "Apr 20 · 10:05", user: "bot", action: "received new submission · Lust for Youth · Jun 21", type: "bot" },
    { id: 7, time: "Apr 19 · 09:55", user: "bot", action: "received new submission · Pharmakon · Jun 14", type: "bot" },
    { id: 8, time: "Apr 18 · 14:20", user: "sam", action: "added show #45 · Open Mic Night · May 23", type: "add" },
    { id: 9, time: "Apr 17 · 18:02", user: "bot", action: "reminder sent to staff: log Actress (Feb 28)", type: "bot" },
    { id: 10, time: "Apr 16 · 12:47", user: "ada", action: "updated channel mapping · #booking-requests → 847392017483620358", type: "edit" },
  ],
  calEvents: [
    { date: "2025-05-02", label: "Burial Hex", status: "confirmed" },
    { date: "2025-05-09", label: "Moor Mother", status: "confirmed" },
    { date: "2025-05-14", label: "Hold — TBD", status: "hold" },
    { date: "2025-05-17", label: "Cygnus + Guests", status: "confirmed" },
    { date: "2025-05-23", label: "Open Mic", status: "confirmed" },
    { date: "2025-05-26", label: "Closed", status: "blocked" },
    { date: "2025-05-30", label: "Basement Freq.", status: "confirmed" },
  ],
  pastForLogging: [
    { id: 40, artist: "Planning for Burial", date: "2025-03-14", logged: false },
    { id: 41, artist: "Actress", date: "2025-02-28", logged: true, draw: 61, notes: "Good energy, no issues." },
    { id: 38, artist: "Burial Hex", date: "2024-11-15", logged: true, draw: 55, notes: "" },
    { id: 39, artist: "Cygnus", date: "2024-08-01", logged: true, draw: 74, notes: "" },
  ],
};

window.PX_UTIL = {
  fmtDate: d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
  fmtShort: d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  fmtDay: d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" }),
};
