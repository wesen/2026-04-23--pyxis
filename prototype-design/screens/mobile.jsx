// Mobile Pyxis — iPhone screens: Login, Home, Shows, Show detail, Bookings,
// Booking review, Calendar, Artists, Artist detail, Post-show log, Settings.
// Uses window.PX tokens + a slim mobile component kit.

const MC = window.PX.color, MR = window.PX.radius;

/* ───────── mobile primitives ───────── */

function MPhone({ children, label, dark = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <IOSDevice dark={dark}>{children}</IOSDevice>
      {label && <div style={{ fontSize: 11, color: "rgba(60,50,40,.6)", fontFamily: "-apple-system, system-ui", fontWeight: 500 }}>{label}</div>}
    </div>
  );
}

function MScreen({ children, bg = MC.bg, hideStatus = false, dark = false }) {
  return (
    <div style={{ width: "100%", height: "100%", background: bg, fontFamily: window.PX.font.sans, color: MC.ink, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {!hideStatus && <IOSStatusBar dark={dark} />}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );
}

// Mobile nav bar — serif title, leading/trailing slots
function MNav({ title, back, lead, trail, subtitle }) {
  return (
    <div style={{ padding: "8px 18px 10px", display: "flex", alignItems: "center", gap: 10, minHeight: 44 }}>
      {back && <div style={{ display: "flex", alignItems: "center", gap: 2, color: MC.accent, fontSize: 15, fontWeight: 500 }}>
        <Icon name="chev" size={16} color={MC.accent} style={{ transform: "scaleX(-1)" }} /> {back}
      </div>}
      {lead}
      <div style={{ flex: 1 }}>
        <div className="px-serif" style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: MC.ink3, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {trail}
    </div>
  );
}

// Large serif header used on scroll tops
function MHero({ eyebrow, title, sub, trail }) {
  return (
    <div style={{ padding: "6px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && <div style={{ fontSize: 10.5, color: MC.ink3, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 600, marginBottom: 6 }}>{eyebrow}</div>}
        <div className="px-serif" style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.02 }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: MC.ink2, marginTop: 6 }}>{sub}</div>}
      </div>
      {trail}
    </div>
  );
}

// Bottom tab bar
function MTabBar({ active }) {
  const tabs = [
    { id: "home",     icon: "home",     label: "Home" },
    { id: "shows",    icon: "music",    label: "Shows" },
    { id: "bookings", icon: "mail",     label: "Bookings", badge: 3 },
    { id: "artists",  icon: "users",    label: "Artists" },
    { id: "more",     icon: "cog",      label: "More" },
  ];
  return (
    <div style={{ borderTop: `1px solid ${MC.line}`, background: "rgba(255,255,255,.92)", backdropFilter: "blur(10px)", padding: "8px 8px 26px", display: "flex", justifyContent: "space-around" }}>
      {tabs.map(t => (
        <div key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active === t.id ? MC.accent : MC.ink3, flex: 1, position: "relative" }}>
          <div style={{ position: "relative" }}>
            <Icon name={t.icon} size={20} color={active === t.id ? MC.accent : MC.ink3} stroke={active === t.id ? 1.9 : 1.5} />
            {t.badge && <span style={{ position: "absolute", top: -4, right: -8, background: MC.accent, color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 8, minWidth: 14, textAlign: "center" }}>{t.badge}</span>}
          </div>
          <div style={{ fontSize: 10, fontWeight: active === t.id ? 600 : 500 }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

// Card list group (iOS-style grouped rows)
function MGroup({ title, action, children, style, section }) {
  return (
    <div data-section={section} style={{ marginBottom: 20, ...style }}>
      {title && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 22px 8px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: MC.ink3, textTransform: "uppercase", letterSpacing: ".09em" }}>{title}</div>
        {action}
      </div>}
      <div style={{ margin: "0 14px", background: MC.surface, border: `1px solid ${MC.line}`, borderRadius: MR.lg, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}
function MRow({ icon, iconColor = MC.ink2, iconBg, title, sub, trail, onClick, last }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: last ? "none" : `1px solid ${MC.line2}` }}>
      {icon && <div style={{ width: 30, height: 30, borderRadius: MR.sm, background: iconBg || MC.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={15} color={iconColor} />
      </div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: MC.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: MC.ink3, marginTop: 2 }}>{sub}</div>}
      </div>
      {trail}
    </div>
  );
}

// Round pill button for the phone
function MBtn({ variant = "primary", icon, full, size = "md", children, style }) {
  const v = {
    primary: { bg: MC.accent, fg: "#fff", bd: MC.accent },
    dark:    { bg: MC.ink,    fg: "#fff", bd: MC.ink },
    outline: { bg: "transparent", fg: MC.ink, bd: MC.line },
    discord: { bg: MC.discord, fg: "#fff", bd: MC.discord },
    success: { bg: MC.green, fg: "#fff", bd: MC.green },
    danger:  { bg: "transparent", fg: MC.accent, bd: "#F3C7BE" },
    ghost:   { bg: "transparent", fg: MC.ink2, bd: "transparent" },
  }[variant];
  const pad = size === "lg" ? "14px 22px" : size === "sm" ? "8px 14px" : "11px 18px";
  const fs  = size === "lg" ? 15 : size === "sm" ? 12.5 : 14;
  return (
    <button style={{ background: v.bg, color: v.fg, border: `1px solid ${v.bd}`, borderRadius: MR.pill, padding: pad, fontSize: fs, fontWeight: 600, fontFamily: "inherit", width: full ? "100%" : "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, cursor: "pointer", ...style }}>
      {icon && <Icon name={icon} size={fs + 2} />}{children}
    </button>
  );
}

/* ───────── SCREENS ───────── */

function MLogin() {
  return (
    <MScreen dark bg={MC.ink}>
      {/* Decorative mark */}
      <div style={{ position: "absolute", right: -120, top: 40, opacity: .07 }}>
        <PyxisMark size={420} color="#fff" />
      </div>

      <div style={{ flex: 1, padding: "18px 28px 0", color: "#fff", position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 32 }}>
          <PyxisMark size={24} color="#fff" />
          <div className="px-serif" style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em" }}>pyxis</div>
        </div>

        <div style={{ flex: 1 }} />

        <div className="px-serif" style={{ fontSize: 38, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.02, marginBottom: 14 }}>
          Run the room<br/>from your pocket.
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,.65)", lineHeight: 1.55, marginBottom: 32 }}>
          Confirm shows, review bookings, and keep the Discord humming — wherever you are.
        </div>

        <div style={{ position: "relative", paddingBottom: 32 }}>
          <MBtn variant="discord" icon="discord" size="lg" full>Continue with Discord</MBtn>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", textAlign: "center", marginTop: 16 }}>
            Invite-only · Not on the list? Ask an admin.
          </div>
        </div>
      </div>
    </MScreen>
  );
}

function MHome() {
  const U = window.PX_UTIL, D = window.PX_DATA;
  const upcoming = D.shows.filter(s => s.status === "confirmed").sort((a,b) => a.date.localeCompare(b.date));
  const next = upcoming[0];
  return (
    <MScreen>
      <MNav title="pyxis" subtitle="Wed, Apr 23"
        trail={<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Icon name="bell" size={19} color={MC.ink2} />
          <Avatar name="Ada Dove" size={30} />
        </div>}
      />

      <div className="px-scroll" style={{ flex: 1, overflow: "auto", paddingBottom: 10 }}>
        <MHero eyebrow="Welcome back" title="Good morning, Ada." sub="6 shows booked · 3 need your eye." />

        {/* Next show hero */}
        <div data-section="dashboard-hero" style={{ margin: "6px 14px 20px", background: MC.ink, color: "#fff", borderRadius: MR.lg, padding: 18, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, top: -40, opacity: .12 }}><PyxisMark size={200} color="#fff" /></div>
          <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.6)", fontWeight: 600, marginBottom: 8 }}>Next on stage · in 9 days</div>
          <div className="px-serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 4 }}>{next.artist}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginBottom: 14 }}>{U.fmtDate(next.date)} · Doors {next.doors} · {next.age}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <MBtn size="sm" style={{ background: "#fff", color: MC.ink, borderColor: "#fff" }}>Open show</MBtn>
            <MBtn size="sm" variant="ghost" icon="ext" style={{ color: "rgba(255,255,255,.8)" }}>Discord</MBtn>
          </div>
        </div>

        {/* Stats */}
        <div data-section="dashboard-metrics" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 14px 20px" }}>
          {[
            ["Upcoming", "6", "next 60 days", MC.accent],
            ["Pending", "3", "review needed", MC.amber],
            ["Avg draw", "84", "last 6 shows", MC.green],
            ["Capacity", "56%", "May 2025", MC.blue],
          ].map(([l, v, s, clr]) => (
            <div key={l} style={{ background: MC.surface, border: `1px solid ${MC.line}`, borderRadius: MR.lg, padding: 14, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 12, bottom: 12, width: 2, background: clr, borderRadius: MR.pill }} />
              <div style={{ paddingLeft: 8 }}>
                <div style={{ fontSize: 10, color: MC.ink3, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>{l}</div>
                <div className="px-serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 4 }}>{v}</div>
                <div style={{ fontSize: 10.5, color: MC.ink3, marginTop: 2 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>

        <MGroup title="Needs your attention" section="dashboard-attention" action={<span style={{ fontSize: 11, color: MC.accent, fontWeight: 600 }}>3</span>}>
          <MRow icon="warn" iconColor={MC.amber} iconBg={MC.amberLt}
            title="2 past shows need logging" sub="Planning for Burial · Actress"
            trail={<Icon name="chev" size={14} color={MC.ink3} />} />
          <MRow icon="sparkle" iconColor={MC.blue} iconBg={MC.blueLt}
            title="Zola Jesus · Jun 6" sub="Check price for a 160-draw headliner"
            trail={<Icon name="chev" size={14} color={MC.ink3} />} />
          <MRow icon="warn" iconColor={MC.accent} iconBg={MC.accentLt}
            title="Discord token expires in 14d" sub="Reconnect to keep pinning working"
            trail={<Icon name="chev" size={14} color={MC.ink3} />} last />
        </MGroup>

        <MGroup title="Recent activity" section="dashboard-activity" action={<span style={{ fontSize: 11, color: MC.ink3 }}>Today</span>}>
          {D.log.slice(0, 3).map((l, i) => (
            <MRow key={l.id} icon={l.type === "bot" ? "compass" : l.type === "approve" ? "check" : "edit"}
              iconColor={l.type === "approve" ? MC.green : l.type === "decline" ? MC.accent : MC.blue}
              iconBg={l.type === "approve" ? MC.greenLt : l.type === "decline" ? MC.accentLt : MC.blueLt}
              title={<><strong style={{ fontWeight: 600 }}>{l.user}</strong> <span style={{ color: MC.ink2, fontWeight: 400 }}>{l.action}</span></>}
              sub={l.time} last={i === 2} />
          ))}
        </MGroup>
      </div>

      <MTabBar active="home" />
    </MScreen>
  );
}

function MShows() {
  const U = window.PX_UTIL, D = window.PX_DATA;
  const upcoming = D.shows.filter(s => s.status === "confirmed").sort((a,b) => a.date.localeCompare(b.date));
  return (
    <MScreen>
      <MNav title="Shows" trail={<div style={{ display: "flex", gap: 10 }}><Icon name="search" size={18} color={MC.ink2} /><Icon name="plus" size={20} color={MC.accent} /></div>} />
      <MHero title="Confirmed" sub="6 upcoming · May 2025" />

      {/* Filter chips */}
      <div className="px-scroll" style={{ padding: "4px 20px 14px", display: "flex", gap: 8, overflowX: "auto" }}>
        {["All", "Confirmed", "Hold", "Archived"].map((f, i) => (
          <div key={f} style={{ padding: "6px 14px", borderRadius: MR.pill, fontSize: 12, fontWeight: 500, background: i === 1 ? MC.ink : MC.surface, color: i === 1 ? "#fff" : MC.ink2, border: `1px solid ${i === 1 ? MC.ink : MC.line}`, whiteSpace: "nowrap" }}>{f}</div>
        ))}
      </div>

      <div className="px-scroll" style={{ flex: 1, overflow: "auto", paddingBottom: 10 }}>
        {upcoming.map((s, i) => {
          const d = new Date(s.date + "T00:00:00");
          return (
            <div key={s.id} style={{ margin: "0 14px 10px", background: MC.surface, border: `1px solid ${MC.line}`, borderRadius: MR.lg, padding: 14, display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 54, textAlign: "center", flexShrink: 0, background: i === 0 ? MC.accentLt : MC.surface2, padding: "8px 0", borderRadius: MR.sm, border: `1px solid ${i === 0 ? MC.accent + "33" : MC.line2}` }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: i === 0 ? MC.accent : MC.ink3, textTransform: "uppercase", letterSpacing: ".08em" }}>{d.toLocaleDateString("en", { month: "short" })}</div>
                <div className="px-serif" style={{ fontSize: 22, fontWeight: 500, color: i === 0 ? MC.accent : MC.ink, lineHeight: 1, marginTop: 2 }}>{d.getDate()}</div>
                <div style={{ fontSize: 9.5, color: MC.ink3, marginTop: 2 }}>{d.toLocaleDateString("en", { weekday: "short" })}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.artist}</div>
                <div style={{ fontSize: 11.5, color: MC.ink3, marginBottom: 6 }}>{s.genre} · Doors {s.doors} · {s.age}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Badge status={s.status} />
                  {s.pinned && <Icon name="pin" size={11} color={MC.ink3} />}
                  <span style={{ fontSize: 11, color: MC.ink3, marginLeft: 4 }}>~{s.draw}/{s.capacity}</span>
                </div>
              </div>
              <Icon name="chev" size={14} color={MC.ink3} />
            </div>
          );
        })}
      </div>

      <MTabBar active="shows" />
    </MScreen>
  );
}

function MShowDetail() {
  const next = window.PX_DATA.shows[0];
  return (
    <MScreen>
      <MNav back="Shows" title="" trail={<Icon name="edit" size={18} color={MC.accent} />} />

      <div className="px-scroll" style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "0 22px 18px" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <Badge status="confirmed" />
            <Tag>Darkwave</Tag>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MC.ink3 }}>
              <Icon name="pin" size={11} color={MC.ink3} /> pinned
            </div>
          </div>
          <div className="px-serif" style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.02 }}>{next.artist}</div>
          <div style={{ fontSize: 13, color: MC.ink2, marginTop: 6 }}>Fri, May 2, 2025 · Doors 8:00 PM · 21+</div>
        </div>

        {/* Image placeholder */}
        <div style={{ margin: "0 14px 18px", height: 160, borderRadius: MR.lg, background: `repeating-linear-gradient(135deg, ${MC.muteLt} 0px, ${MC.muteLt} 10px, ${MC.surface2} 10px, ${MC.surface2} 20px)`, border: `1px solid ${MC.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: MC.ink3, fontFamily: window.PX.font.mono, fontSize: 11 }}>
          poster · 1080×1080
        </div>

        <MGroup title="Details">
          <MRow icon="door" title="Doors" trail={<span style={{ fontSize: 13, color: MC.ink2, fontVariantNumeric: "tabular-nums" }}>8:00 PM</span>} />
          <MRow icon="ticket" title="Price" trail={<span style={{ fontSize: 13, color: MC.ink2 }}>$12 adv / $15 door</span>} />
          <MRow icon="users" title="Expected draw" trail={<span style={{ fontSize: 13, color: MC.ink2 }}>70 / 150</span>} />
          <MRow icon="music" title="Genre" trail={<Tag>Darkwave</Tag>} last />
        </MGroup>

        <MGroup title="Posted to Discord">
          <MRow icon="pin" iconColor={MC.discord} iconBg={MC.blueLt}
            title="#upcoming-shows" sub="Pinned · 4 days ago · 12 reactions"
            trail={<Icon name="ext" size={14} color={MC.ink3} />} last />
        </MGroup>

        <div style={{ padding: "4px 14px 22px", display: "flex", gap: 10 }}>
          <MBtn variant="outline" full>Duplicate</MBtn>
          <MBtn variant="danger" full icon="trash">Cancel show</MBtn>
        </div>
      </div>
    </MScreen>
  );
}

function MBookings() {
  const U = window.PX_UTIL, D = window.PX_DATA;
  const pending = D.submissions.filter(s => s.status === "pending");
  return (
    <MScreen>
      <MNav title="Bookings" trail={<Icon name="sparkle" size={18} color={MC.accent} />} />
      <MHero title="Inbox" sub={`${pending.length} awaiting review · 2 new today`} />

      {/* Segmented */}
      <div style={{ margin: "0 14px 16px", background: MC.surface2, borderRadius: MR.md, padding: 3, display: "flex", border: `1px solid ${MC.line}` }}>
        {[["Pending", 3, true], ["Approved", 1], ["Declined", 1]].map(([l, n, sel]) => (
          <div key={l} style={{ flex: 1, padding: "7px 0", textAlign: "center", fontSize: 12.5, fontWeight: sel ? 600 : 500, background: sel ? MC.surface : "transparent", color: sel ? MC.ink : MC.ink3, borderRadius: MR.sm, boxShadow: sel ? "0 1px 2px rgba(0,0,0,.06)" : "none" }}>
            {l} <span style={{ opacity: .5, marginLeft: 3 }}>{n}</span>
          </div>
        ))}
      </div>

      <div className="px-scroll" style={{ flex: 1, overflow: "auto", paddingBottom: 10 }}>
        {pending.map(sub => (
          <div key={sub.id} style={{ margin: "0 14px 12px", background: MC.surface, border: `1px solid ${MC.line}`, borderRadius: MR.lg, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div className="px-serif" style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-0.01em" }}>{sub.artist}</div>
              <Badge status="pending" />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 11.5, color: MC.ink2, marginBottom: 12 }}>
              <span><Icon name="calendar" size={11} color={MC.ink3} /> {U.fmtShort(sub.date)}</span>
              <span><Icon name="music" size={11} color={MC.ink3} /> {sub.genre}</span>
              <span><Icon name="users" size={11} color={MC.ink3} /> ~{sub.draw}</span>
            </div>
            <div style={{ fontSize: 11, color: MC.blue, marginBottom: 12 }}>{sub.links}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <MBtn variant="danger" size="sm" icon="x">Decline</MBtn>
              <MBtn variant="ghost" size="sm">Hold</MBtn>
              <MBtn variant="success" size="sm" icon="check" style={{ marginLeft: "auto" }}>Approve</MBtn>
            </div>
          </div>
        ))}
      </div>

      <MTabBar active="bookings" />
    </MScreen>
  );
}

function MBookingReview() {
  return (
    <MScreen>
      <MNav back="Bookings" title="" trail={<Icon name="ext" size={17} color={MC.ink2} />} />
      <div className="px-scroll" style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "0 22px 16px" }}>
          <Badge status="pending" />
          <div className="px-serif" style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.02, marginTop: 10 }}>Pharmakon</div>
          <div style={{ fontSize: 13, color: MC.ink2, marginTop: 6 }}>Submitted Apr 19 · Industrial</div>
        </div>

        <MGroup title="Request">
          <MRow icon="calendar" title="Preferred date" trail={<span style={{ fontSize: 13, color: MC.ink2 }}>Sat, Jun 14</span>} />
          <MRow icon="users" title="Expected draw" trail={<span style={{ fontSize: 13, color: MC.ink2 }}>~80</span>} />
          <MRow icon="ext" title="Links" sub="pharmakon.bandcamp.com" trail={<Icon name="chev" size={13} color={MC.ink3} />} last />
        </MGroup>

        <div style={{ margin: "0 14px 16px", padding: 14, background: MC.greenLt, border: `1px solid ${MC.green}33`, borderRadius: MR.md }}>
          <div style={{ fontSize: 12.5, color: MC.green, fontWeight: 600, marginBottom: 3 }}>✓ Date is available</div>
          <div style={{ fontSize: 11.5, color: MC.ink2 }}>Jun 14 is an open night. Nearest show: Zola Jesus on Jun 6.</div>
        </div>

        <MGroup title="Artist note">
          <div style={{ padding: "14px 16px", fontSize: 13, color: MC.ink2, lineHeight: 1.55 }}>
            "Hi! Touring the east coast in June, would love to play Pyxis. Happy to work with any lineup you'd suggest."
          </div>
        </MGroup>

        <div style={{ padding: "4px 14px 24px", display: "flex", gap: 10 }}>
          <MBtn variant="danger" icon="x" full>Decline</MBtn>
          <MBtn variant="success" icon="check" full>Approve</MBtn>
        </div>
      </div>
    </MScreen>
  );
}

function MCalendar() {
  const year = 2025, month = 4;
  const firstDay = new Date(year, month, 1).getDay();
  const daysIn = 31;
  const evs = window.PX_DATA.calEvents;
  const onDay = d => evs.filter(e => e.date === `${year}-05-${String(d).padStart(2,"0")}`);
  const colorOf = st => ({ confirmed: MC.green, hold: MC.blue, blocked: MC.mute })[st] || MC.amber;
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(d);

  return (
    <MScreen>
      <MNav title="Calendar" trail={<Icon name="plus" size={20} color={MC.accent} />} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 22px 14px" }}>
        <div>
          <div className="px-serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}>May 2025</div>
          <div style={{ fontSize: 11.5, color: MC.ink3, marginTop: 2 }}>5 confirmed · 1 hold · 24 open</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 30, height: 30, borderRadius: MR.sm, border: `1px solid ${MC.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="chev" size={14} style={{ transform: "scaleX(-1)" }} color={MC.ink2} /></div>
          <div style={{ width: 30, height: 30, borderRadius: MR.sm, border: `1px solid ${MC.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="chev" size={14} color={MC.ink2} /></div>
        </div>
      </div>

      <div style={{ padding: "0 14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
          {["S","M","T","W","T","F","S"].map((d,i) => <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: MC.ink3, padding: "4px 0" }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
          {cells.map((day, i) => {
            const es = day ? onDay(day) : [];
            const isToday = day === 2;
            return (
              <div key={i} style={{ aspectRatio: "1/1.05", borderRadius: MR.sm, background: day ? (isToday ? MC.accentLt : MC.surface) : "transparent", border: isToday ? `1.5px solid ${MC.accent}` : day ? `1px solid ${MC.line2}` : "none", padding: "4px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {day && <>
                  <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 500, color: isToday ? MC.accent : MC.ink2, fontVariantNumeric: "tabular-nums" }}>{day}</div>
                  <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {es.slice(0, 3).map((e, j) => <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: colorOf(e.status) }} />)}
                  </div>
                </>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "16px 22px 8px", fontSize: 11, color: MC.ink3, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 600 }}>This week</div>
      <div className="px-scroll" style={{ flex: 1, overflow: "auto" }}>
        {evs.slice(0, 3).map(e => (
          <div key={e.date} style={{ margin: "0 14px 8px", padding: "12px 14px", background: MC.surface, border: `1px solid ${MC.line}`, borderRadius: MR.md, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 4, height: 34, borderRadius: 2, background: colorOf(e.status) }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{e.label}</div>
              <div style={{ fontSize: 11, color: MC.ink3 }}>{new Date(e.date+"T00:00:00").toLocaleDateString("en",{weekday:"long",month:"short",day:"numeric"})}</div>
            </div>
            <Badge status={e.status} />
          </div>
        ))}
      </div>

      <MTabBar active="shows" />
    </MScreen>
  );
}

function MArtists() {
  const D = window.PX_DATA;
  return (
    <MScreen>
      <MNav title="Artists" trail={<Icon name="plus" size={20} color={MC.accent} />} />
      <div style={{ padding: "0 14px 14px" }}>
        <div style={{ background: MC.surface2, border: `1px solid ${MC.line}`, borderRadius: MR.md, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="search" size={14} color={MC.ink3} />
          <div style={{ fontSize: 13, color: MC.ink3 }}>Search by name or genre…</div>
        </div>
      </div>

      <div className="px-scroll" style={{ flex: 1, overflow: "auto", paddingBottom: 10 }}>
        <div style={{ padding: "0 22px 8px", fontSize: 11, color: MC.ink3, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 600 }}>Roster · {D.artists.length}</div>
        {D.artists.map((a, i) => (
          <div key={a.id} style={{ margin: "0 14px 6px", padding: "10px 14px", background: MC.surface, border: `1px solid ${MC.line}`, borderRadius: MR.md, display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={a.name} size={38} tone={a.shows ? MC.ink : MC.muteLt} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
              <div style={{ fontSize: 11, color: MC.ink3, marginTop: 2 }}>{a.genre} · {a.shows} shows{a.avgDraw ? ` · avg ${a.avgDraw}` : ""}</div>
            </div>
            <Icon name="chev" size={14} color={MC.ink3} />
          </div>
        ))}
      </div>

      <MTabBar active="artists" />
    </MScreen>
  );
}

function MArtistDetail() {
  const a = window.PX_DATA.artists[0];
  return (
    <MScreen>
      <MNav back="Artists" title="" trail={<Icon name="edit" size={18} color={MC.accent} />} />
      <div className="px-scroll" style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "0 22px 18px", display: "flex", gap: 14, alignItems: "center" }}>
          <Avatar name={a.name} size={64} tone={MC.ink} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="px-serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05 }}>{a.name}</div>
            <div style={{ fontSize: 12, color: MC.ink3, marginTop: 4 }}>{a.genre} · {a.links}</div>
          </div>
        </div>

        <div style={{ margin: "0 14px 18px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[["Shows", a.shows], ["Avg draw", a.avgDraw], ["Last show", "May 2"]].map(([l, v]) => (
            <div key={l} style={{ background: MC.surface, border: `1px solid ${MC.line}`, borderRadius: MR.md, padding: 10, textAlign: "center" }}>
              <div className="px-serif" style={{ fontSize: 20, fontWeight: 500 }}>{v}</div>
              <div style={{ fontSize: 10.5, color: MC.ink3, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        <MGroup title="Show history">
          {[["May 2, 2025", "72 attended"], ["Nov 15, 2024", "55 attended"], ["Jul 20, 2024", "48 attended"]].map(([d, v], i, arr) => (
            <MRow key={d} icon="music" title={d} trail={<span style={{ fontSize: 12, color: MC.ink3 }}>{v}</span>} last={i === arr.length - 1} />
          ))}
        </MGroup>

        <MGroup title="Internal notes">
          <div style={{ padding: "14px 16px", fontSize: 13, color: MC.ink2, lineHeight: 1.55 }}>
            {a.notes}
          </div>
        </MGroup>

        <div style={{ padding: "4px 14px 24px" }}>
          <MBtn variant="primary" icon="plus" full>Book a show</MBtn>
        </div>
      </div>
    </MScreen>
  );
}

function MPostShow() {
  return (
    <MScreen>
      <MNav back="Shows" title="Log show" trail={<span style={{ fontSize: 13, color: MC.accent, fontWeight: 600 }}>Save</span>} />
      <div className="px-scroll" style={{ flex: 1, overflow: "auto", padding: "0 0 20px" }}>
        <div style={{ padding: "0 22px 16px" }}>
          <div className="px-serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05 }}>Planning for Burial</div>
          <div style={{ fontSize: 12, color: MC.ink3, marginTop: 4 }}>Fri, Mar 14, 2025 · #40</div>
        </div>

        <MGroup title="Attendance">
          <div style={{ padding: "20px 16px", textAlign: "center" }}>
            <div className="px-serif" style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1 }}>34</div>
            <div style={{ fontSize: 12, color: MC.ink3, marginTop: 6 }}>of 150 capacity · 23%</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14 }}>
              <MBtn variant="outline" size="sm">−5</MBtn>
              <MBtn variant="outline" size="sm">−1</MBtn>
              <MBtn variant="outline" size="sm">+1</MBtn>
              <MBtn variant="outline" size="sm">+5</MBtn>
            </div>
          </div>
        </MGroup>

        <MGroup title="How did it go?">
          <div style={{ padding: "12px 14px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[["Quiet", false], ["Steady", true], ["Great", false], ["Packed", false]].map(([t, sel]) => (
              <div key={t} style={{ padding: "7px 14px", fontSize: 12.5, borderRadius: MR.pill, background: sel ? MC.ink : MC.surface2, color: sel ? "#fff" : MC.ink2, border: `1px solid ${sel ? MC.ink : MC.line}`, fontWeight: 500 }}>{t}</div>
            ))}
          </div>
        </MGroup>

        <MGroup title="Notes">
          <div style={{ padding: "14px 16px", fontSize: 13, color: MC.ink2, lineHeight: 1.55, minHeight: 70 }}>
            Small crowd but engaged. Sound was dialled in; artist was happy with the monitors.
          </div>
        </MGroup>

        <MGroup title="Incident">
          <MRow icon="warn" iconColor={MC.amber} iconBg={MC.amberLt}
            title="None to report" trail={<div style={{ width: 36, height: 22, borderRadius: 11, background: MC.muteLt, padding: 2 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
            </div>} last />
        </MGroup>
      </div>
    </MScreen>
  );
}

function MSettings() {
  return (
    <MScreen>
      <MNav title="More" />
      <MHero title="Ada Dove" sub="admin · ada@pyxis.xyz"
        trail={<Avatar name="Ada Dove" size={52} />} />

      <div className="px-scroll" style={{ flex: 1, overflow: "auto", paddingBottom: 10 }}>
        <MGroup title="Venue">
          <MRow icon="cog" title="Space info" sub="Name, address, capacity" trail={<Icon name="chev" size={13} color={MC.ink3} />} />
          <MRow icon="users" title="Staff & roles" sub="4 members · 1 pending" trail={<Icon name="chev" size={13} color={MC.ink3} />} />
          <MRow icon="ext" title="Public site" sub="pyxis.xyz" trail={<Icon name="chev" size={13} color={MC.ink3} />} last />
        </MGroup>

        <MGroup title="Integrations">
          <MRow icon="discord" iconColor="#fff" iconBg={MC.discord}
            title="Discord · Connected"
            sub="Hollow Earth · 247 members"
            trail={<Badge status="live" />} />
          <MRow icon="bell" title="Notifications" sub="Push, email, digest" trail={<Icon name="chev" size={13} color={MC.ink3} />} last />
        </MGroup>

        <MGroup title="History">
          <MRow icon="log" title="Audit log" trail={<Icon name="chev" size={13} color={MC.ink3} />} />
          <MRow icon="archive" title="Import / export" trail={<Icon name="chev" size={13} color={MC.ink3} />} last />
        </MGroup>

        <MGroup>
          <MRow icon="x" iconColor={MC.accent} iconBg={MC.accentLt} title={<span style={{ color: MC.accent }}>Sign out</span>} last />
        </MGroup>

        <div style={{ textAlign: "center", fontSize: 10.5, color: MC.ink4, padding: "10px 0 20px" }}>
          pyxis · v1.2.0
        </div>
      </div>

      <MTabBar active="more" />
    </MScreen>
  );
}

Object.assign(window, {
  MPhone, MLogin, MHome, MShows, MShowDetail,
  MBookings, MBookingReview, MCalendar,
  MArtists, MArtistDetail, MPostShow, MSettings,
});
