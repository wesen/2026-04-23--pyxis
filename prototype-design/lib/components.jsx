// Pyxis component library — pure, stateless atoms + small molecules.
// All tokens read from window.PX.

const C = window.PX.color;
const F = window.PX.font;
const R = window.PX.radius;
const S = window.PX.shadow;

/* ─────────── ICONS (thin, custom-drawn) ─────────── */

const Icon = ({ name, size = 16, color = "currentColor", stroke = 1.6 }) => {
  const paths = {
    home:     <><path d="M3 10.5 10 4l7 6.5V17a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1v-6.5Z"/></>,
    calendar: <><rect x="3" y="4.5" width="14" height="13" rx="1.5"/><path d="M3 8h14M7 3v3M13 3v3"/><circle cx="7" cy="11" r=".8" fill="currentColor"/><circle cx="10" cy="11" r=".8" fill="currentColor"/><circle cx="13" cy="11" r=".8" fill="currentColor"/></>,
    ticket:   <><path d="M3 7.5V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1.5a1.5 1.5 0 0 0 0 3V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3.5a1.5 1.5 0 0 0 0-3Z"/><path d="M8.5 6v8" strokeDasharray="1 1.4"/></>,
    mail:     <><rect x="3" y="5" width="14" height="10" rx="1.2"/><path d="m3.5 6 6.5 5 6.5-5"/></>,
    users:    <><circle cx="7" cy="8" r="2.4"/><circle cx="13.5" cy="8.5" r="1.9"/><path d="M3 16c.4-2.2 2.1-3.5 4-3.5s3.6 1.3 4 3.5M12 16c.3-1.7 1.6-2.7 3-2.7s2.4 1 2.7 2.7"/></>,
    log:      <><path d="M4 5h12M4 9h12M4 13h8M4 17h5"/></>,
    cog:      <><circle cx="10" cy="10" r="2.3"/><path d="M10 3.5v1.8M10 14.7v1.8M16.5 10h-1.8M5.3 10H3.5M14.6 5.4l-1.3 1.3M6.7 13.3l-1.3 1.3M14.6 14.6l-1.3-1.3M6.7 6.7 5.4 5.4"/></>,
    search:   <><circle cx="8.5" cy="8.5" r="4.5"/><path d="m12 12 4 4"/></>,
    chev:     <><path d="m7.5 5 5 5-5 5"/></>,
    plus:     <><path d="M10 4v12M4 10h12"/></>,
    check:    <><path d="m4 10.5 4 4 8-9"/></>,
    x:        <><path d="m5 5 10 10M15 5 5 15"/></>,
    bell:     <><path d="M5.5 14V9a4.5 4.5 0 0 1 9 0v5M3.5 14.5h13M8.5 17a1.5 1.5 0 0 0 3 0"/></>,
    pin:      <><path d="M12.5 3.5 16.5 7.5M11.8 4.2 7 9l-2.2-.5c-.6-.2-1 .5-.6.9l6.4 6.4c.4.4 1.1 0 .9-.6L11 13l4.8-4.8"/><path d="m7.5 12.5-3 3"/></>,
    door:     <><rect x="5" y="3" width="10" height="14" rx=".5"/><path d="M12.5 10.5v.5"/></>,
    music:    <><path d="M8 14V5l8-1.5V13"/><circle cx="6.5" cy="14.5" r="1.6"/><circle cx="14.5" cy="13" r="1.6"/></>,
    discord:  <><path d="M15.3 5.7a12.7 12.7 0 0 0-3.1-.9l-.2.4a10 10 0 0 0-3.5 0l-.2-.4a12.7 12.7 0 0 0-3.1.9C3 9 2.5 12 2.8 15a12.9 12.9 0 0 0 3.8 1.9l.8-1.2a8 8 0 0 1-1.2-.6l.2-.2c2.5 1.1 5.3 1.1 7.7 0l.2.2a8 8 0 0 1-1.2.6l.8 1.2a12.9 12.9 0 0 0 3.8-1.9c.4-3.2-.3-6.2-2.4-9.3Z" fill="currentColor" stroke="none"/><circle cx="7.5" cy="11" r="1.1" fill={C.bg} stroke="none"/><circle cx="12.5" cy="11" r="1.1" fill={C.bg} stroke="none"/></>,
    edit:     <><path d="M4 16h3l8-8-3-3-8 8v3ZM12 5l3 3"/></>,
    trash:    <><path d="M4 6h12M8 6V4.5A1 1 0 0 1 9 3.5h2a1 1 0 0 1 1 1V6M6 6l.8 10a1 1 0 0 0 1 1h4.4a1 1 0 0 0 1-1L14 6"/></>,
    ext:      <><path d="M8 4H4v12h12v-4M11 4h5v5M10 10l6-6"/></>,
    archive:  <><rect x="3" y="4.5" width="14" height="3" rx=".8"/><path d="M4 7.5V16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7.5M8.5 11h3"/></>,
    filter:   <><path d="M3 5h14l-5 6v5l-4-2v-3L3 5Z"/></>,
    sparkle:  <><path d="M10 3v3M10 14v3M3 10h3M14 10h3M5 5l2 2M13 13l2 2M15 5l-2 2M7 13l-2 2"/></>,
    dot:      <circle cx="10" cy="10" r="3" fill="currentColor" stroke="none"/>,
    compass:  <><circle cx="10" cy="10" r="7"/><path d="m7.5 12.5 1.8-4.6L13.5 6.5 11.7 11 7.5 12.5Z" fill="currentColor" stroke="none" fillOpacity=".15"/><circle cx="10" cy="10" r="1" fill="currentColor" stroke="none"/></>,
    warn:     <><path d="M10 3 18 16H2L10 3ZM10 8v4"/><circle cx="10" cy="14.5" r=".8" fill="currentColor" stroke="none"/></>,
    copy:     <><rect x="6" y="6" width="10" height="10" rx="1.2"/><path d="M4 14V5a1 1 0 0 1 1-1h9"/></>,
    reset:    <><path d="M4 10a6 6 0 1 0 2-4.5M4 4v3h3"/></>,
    play:     <><path d="M6 4v12l10-6-10-6Z" fill="currentColor" stroke="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle" }}>
      {paths[name]}
    </svg>
  );
};

/* ─────────── LOGO ─────────── */

const PyxisMark = ({ size = 28, color = C.ink }) => (
  // "Pyxis" — a mariner's compass-box. Drawn as a stylised compass rose
  // inscribed in a square — lovely as both a favicon and a header mark.
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="3.5" width="25" height="25" rx="2"/>
    <circle cx="16" cy="16" r="8"/>
    <path d="M16 5.5v21M5.5 16h21" strokeOpacity=".25"/>
    <path d="m16 9 2.4 5 4.6 2-4.6 2-2.4 5-2.4-5-4.6-2 4.6-2L16 9Z" fill={color} fillOpacity=".08"/>
    <circle cx="16" cy="16" r="1.3" fill={color} stroke="none"/>
  </svg>
);

const PyxisLogo = ({ size = 28, color = C.ink, stack = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <PyxisMark size={size} color={color} />
    <div style={{ lineHeight: 1 }}>
      <div className="px-serif" style={{ fontSize: size * .95, fontWeight: 500, letterSpacing: "-0.02em", color }}>pyxis</div>
      {stack && <div style={{ fontSize: 10, color: C.ink3, marginTop: 3, letterSpacing: ".08em", textTransform: "uppercase" }}>staff portal</div>}
    </div>
  </div>
);

/* ─────────── TYPE ─────────── */

const DisplayH = ({ children, size = 34, style }) => (
  <h1 className="px-serif" style={{ fontSize: size, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1, color: C.ink, ...style }}>{children}</h1>
);
const SectionH = ({ children, style }) => (
  <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: C.ink, letterSpacing: "-0.01em", ...style }}>{children}</h2>
);
const Eyebrow = ({ children, color = C.ink3, style }) => (
  <div style={{ fontSize: 10.5, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: ".09em", ...style }}>{children}</div>
);
const Muted = ({ children, style }) => <div style={{ fontSize: 12.5, color: C.ink2, ...style }}>{children}</div>;

/* ─────────── BADGES ─────────── */

const Badge = ({ status, children }) => {
  const m = {
    confirmed: [C.greenLt, C.green, "Confirmed"],
    pending:   [C.amberLt, C.amber, "Pending"],
    approved:  [C.greenLt, C.green, "Approved"],
    declined:  [C.accentLt, C.accent, "Declined"],
    cancelled: [C.accentLt, C.accent, "Cancelled"],
    archived:  [C.muteLt, C.mute, "Archived"],
    hold:      [C.blueLt, C.blue, "Hold"],
    blocked:   [C.muteLt, C.mute, "Blocked"],
    live:      [C.greenLt, C.green, "Live"],
    draft:     [C.muteLt, C.mute, "Draft"],
    needslog:  [C.amberLt, C.amber, "Needs log"],
    logged:    [C.greenLt, C.green, "Logged"],
  };
  const [bg, fg, label] = m[status] || [C.muteLt, C.mute, status || "—"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: bg, color: fg, fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: R.pill, whiteSpace: "nowrap", lineHeight: 1.6 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: fg }} />
      {children || label}
    </span>
  );
};

const Tag = ({ children, color = C.ink2 }) => (
  <span style={{ fontSize: 11, color, background: C.surface2, border: `1px solid ${C.line}`, padding: "2px 8px", borderRadius: R.xs, whiteSpace: "nowrap" }}>{children}</span>
);

/* ─────────── BUTTONS ─────────── */

const Btn = ({ variant = "primary", size = "md", icon, iconRight, onClick, children, disabled, full, style, ...rest }) => {
  const pads = size === "sm" ? "6px 12px" : size === "lg" ? "11px 22px" : "8px 16px";
  const fs   = size === "sm" ? 12 : 13;
  const variants = {
    primary: { bg: C.accent, fg: "#fff", bd: C.accent },
    dark:    { bg: C.ink,    fg: "#fff", bd: C.ink },
    outline: { bg: "transparent", fg: C.ink2, bd: C.line },
    ghost:   { bg: "transparent", fg: C.ink2, bd: "transparent" },
    danger:  { bg: "transparent", fg: C.accent, bd: "#F3C7BE" },
    success: { bg: C.green, fg: "#fff", bd: C.green },
    discord: { bg: C.discord, fg: "#fff", bd: C.discord },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button className="px-btn" onClick={onClick} disabled={disabled} {...rest} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
      background: v.bg, color: v.fg, border: `1px solid ${v.bd}`, borderRadius: R.md,
      padding: pads, fontSize: fs, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .5 : 1, width: full ? "100%" : "auto", whiteSpace: "nowrap",
      transition: "filter .15s, transform .05s", lineHeight: 1.2,
      ...style,
    }}>
      {icon && <Icon name={icon} size={fs + 2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={fs + 2} />}
    </button>
  );
};

const IconBtn = ({ icon, onClick, size = 30, tooltip, style }) => (
  <button className="px-btn" title={tooltip} onClick={onClick} style={{
    background: "transparent", border: `1px solid ${C.line}`, borderRadius: R.sm,
    width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: C.ink2, ...style,
  }}>
    <Icon name={icon} size={15} />
  </button>
);

/* ─────────── CARD ─────────── */

const Card = ({ children, padding = 22, style, interactive, ...rest }) => (
  <div {...rest} style={{
    background: C.surface, borderRadius: R.lg, border: `1px solid ${C.line}`,
    padding, boxShadow: S.sm, cursor: interactive ? "pointer" : "default",
    transition: "box-shadow .2s, transform .15s",
    ...style,
  }}>{children}</div>
);

const CardHead = ({ title, action, subtitle, style }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: subtitle ? "flex-start" : "center", marginBottom: 16, gap: 16, ...style }}>
    <div>
      <SectionH>{title}</SectionH>
      {subtitle && <Muted style={{ marginTop: 3, fontSize: 12 }}>{subtitle}</Muted>}
    </div>
    {action}
  </div>
);

/* ─────────── STAT TILE ─────────── */

const Stat = ({ label, value, sub, trend, accent = C.accent, metricId }) => (
  <Card
    padding={18}
    data-pyxis-component="metric-card"
    data-pyxis-part="root"
    data-metric-card={metricId}
    style={{ position: "relative", overflow: "hidden" }}
  >
    <div data-pyxis-component="metric-card" data-pyxis-part="accent" style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 2, background: accent, borderRadius: R.pill }} />
    <div style={{ paddingLeft: 8 }}>
      <Eyebrow data-pyxis-component="metric-card" data-pyxis-part="label">{label}</Eyebrow>
      <div data-pyxis-component="metric-card" data-pyxis-part="value" className="px-serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1, marginTop: 6, letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div data-pyxis-component="metric-card" data-pyxis-part="caption" style={{ fontSize: 11.5, color: C.ink2, marginTop: 6 }}>{sub}</div>}
      {trend && <div data-pyxis-component="metric-card" data-pyxis-part="trend" style={{ fontSize: 11, color: accent, marginTop: 4, fontWeight: 500 }}>{trend}</div>}
    </div>
  </Card>
);

/* ─────────── FIELDS ─────────── */

const fldBase = {
  width: "100%", padding: "8px 11px", borderRadius: R.sm,
  border: `1px solid ${C.line}`, fontSize: 13, background: C.surface2,
  color: C.ink, outline: "none",
};

const Field = ({ label, hint, children, style }) => (
  <div style={{ marginBottom: 14, ...style }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.ink2, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>{label}</label>}
    {children}
    {hint && <div style={{ fontSize: 11, color: C.ink3, marginTop: 5 }}>{hint}</div>}
  </div>
);
const Input = ({ value = "", onChange = () => {}, placeholder, type = "text", icon, style }) => (
  <div style={{ position: "relative" }}>
    {icon && <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.ink3 }}><Icon name={icon} size={14} /></div>}
    <input className="px-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type}
      style={{ ...fldBase, paddingLeft: icon ? 32 : 11, ...style }} />
  </div>
);
const Select = ({ value, onChange = () => {}, options, style }) => (
  <select className="px-input" value={value} onChange={e => onChange(e.target.value)} style={{ ...fldBase, ...style }}>
    {options.map(o => {
      const v = typeof o === "string" ? o : o.value;
      const l = typeof o === "string" ? o : o.label;
      return <option key={v} value={v}>{l}</option>;
    })}
  </select>
);
const Textarea = ({ value = "", onChange = () => {}, placeholder, rows = 3, style }) => (
  <textarea className="px-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ ...fldBase, resize: "vertical", fontFamily: "inherit", ...style }} />
);

/* ─────────── AVATAR ─────────── */

const Avatar = ({ name = "AD", size = 32, tone = C.ink }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: tone, color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * .4, fontWeight: 600, letterSpacing: ".02em", flexShrink: 0 }}>{initials}</div>
  );
};

/* ─────────── TABLE ─────────── */

const Table = ({ cols, rows, rowStyle = () => ({}), onRowClick }) => (
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr>{cols.map((c, i) => (
        <th key={i} style={{ fontSize: 10.5, fontWeight: 600, color: C.ink3, textTransform: "uppercase",
          letterSpacing: ".08em", padding: "0 12px 11px 0", textAlign: c.align || "left", whiteSpace: "nowrap",
          width: c.width }}>{c.label}</th>
      ))}</tr>
    </thead>
    <tbody>
      {rows.map((r, ri) => (
        <tr key={ri} onClick={() => onRowClick && onRowClick(r)} style={{ cursor: onRowClick ? "pointer" : "default", ...rowStyle(r) }}>
          {cols.map((c, ci) => (
            <td key={ci} style={{ padding: "13px 12px 13px 0", borderTop: ri === 0 ? "none" : `1px solid ${C.line2}`, verticalAlign: "middle", textAlign: c.align || "left" }}>
              {c.render ? c.render(r) : r[c.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

/* ─────────── NAV ITEM ─────────── */

const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "8px 10px",
    borderRadius: R.sm, border: "none", cursor: "pointer", fontSize: 13,
    fontWeight: active ? 600 : 500,
    background: active ? C.accentLt : "transparent",
    color: active ? C.accent : C.ink2,
    marginBottom: 1, textAlign: "left", fontFamily: "inherit",
    position: "relative",
  }}>
    {active && <span style={{ position: "absolute", left: -10, top: 8, bottom: 8, width: 2, background: C.accent, borderRadius: R.pill }} />}
    <Icon name={icon} size={15} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge && <span style={{ background: C.accent, color: "#fff", borderRadius: R.pill, fontSize: 10, fontWeight: 700, padding: "1px 7px", minWidth: 17, textAlign: "center" }}>{badge}</span>}
  </button>
);

/* ─────────── SIDEBAR (full) ─────────── */

const Sidebar = ({ page, onNav, pendingCount = 0 }) => {
  const sections = [
    { heading: "Program", items: [
      { id: "dashboard", icon: "home",     label: "Dashboard" },
      { id: "shows",     icon: "music",    label: "Shows" },
      { id: "calendar",  icon: "calendar", label: "Calendar" },
      { id: "bookings",  icon: "mail",     label: "Bookings", badge: pendingCount || null },
    ]},
    { heading: "Roster", items: [
      { id: "artists",    icon: "users", label: "Artists" },
      { id: "attendance", icon: "check", label: "Post-show log" },
    ]},
    { heading: "Operate", items: [
      { id: "log",      icon: "log",     label: "Audit log" },
      { id: "discord",  icon: "discord", label: "Discord" },
      { id: "settings", icon: "cog",     label: "Settings" },
    ]},
  ];
  return (
    <aside style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", flexShrink: 0, height: "100%" }}>
      <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${C.line}` }}>
        <PyxisLogo size={26} stack />
      </div>
      <nav className="px-scroll" style={{ padding: "14px 12px", flex: 1, overflowY: "auto" }}>
        {sections.map((sec, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <Eyebrow style={{ padding: "4px 10px 7px", fontSize: 9.5, color: C.ink4 }}>{sec.heading}</Eyebrow>
            {sec.items.map(it => (
              <NavItem key={it.id} {...it} active={page === it.id} onClick={() => onNav(it.id)} />
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name="Ada Dove" size={30} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Ada Dove</div>
          <div style={{ fontSize: 10.5, color: C.ink3 }}>admin · online</div>
        </div>
        <Icon name="chev" size={14} color={C.ink3} />
      </div>
    </aside>
  );
};

/* ─────────── TOP BAR ─────────── */

const TopBar = ({ title, subtitle, actions, breadcrumb }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 28px", borderBottom: `1px solid ${C.line}`, background: C.surface }}>
    <div style={{ minWidth: 0 }}>
      {breadcrumb && <div style={{ fontSize: 11.5, color: C.ink3, marginBottom: 4 }}>{breadcrumb}</div>}
      <DisplayH size={24}>{title}</DisplayH>
      {subtitle && <Muted style={{ marginTop: 3 }}>{subtitle}</Muted>}
    </div>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>{actions}</div>
  </div>
);

/* ─────────── APP SHELL ─────────── */

const Shell = ({ page, onNav, title, subtitle, breadcrumb, actions, pendingCount, children, width = 1240, height = 760 }) => (
  <div className="px-root" style={{ display: "flex", width, height, background: C.bg, overflow: "hidden", borderRadius: R.lg, border: `1px solid ${C.line}` }}>
    <Sidebar page={page} onNav={onNav} pendingCount={pendingCount} />
    <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
      <TopBar title={title} subtitle={subtitle} breadcrumb={breadcrumb} actions={actions} />
      <div className="px-scroll" style={{ flex: 1, overflow: "auto", padding: 26 }}>
        {children}
      </div>
    </main>
  </div>
);

/* ─────────── MODAL ─────────── */

const Modal = ({ title, subtitle, onClose, children, width = 520, footer }) => (
  <div style={{ position: "absolute", inset: 0, background: "rgba(26,24,22,0.35)", backdropFilter: "blur(2px)",
    zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: R.lg }}>
    <div style={{ background: C.surface, borderRadius: R.lg, width, maxWidth: "92%", boxShadow: S.xl, overflow: "hidden", border: `1px solid ${C.line}` }}>
      <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <SectionH>{title}</SectionH>
          {subtitle && <Muted style={{ marginTop: 2, fontSize: 12 }}>{subtitle}</Muted>}
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.ink3, padding: 4, borderRadius: R.xs, display: "flex" }}>
          <Icon name="x" size={18} />
        </button>
      </div>
      <div className="px-scroll" style={{ padding: 22, maxHeight: 500, overflowY: "auto" }}>{children}</div>
      {footer && <div style={{ padding: "14px 22px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10, background: C.surface2 }}>{footer}</div>}
    </div>
  </div>
);

/* ─────────── TIMELINE ITEM ─────────── */

const LogRow = ({ time, user, action, type }) => {
  const tone = { approve: C.green, add: C.green, decline: C.accent, edit: C.blue, bot: C.amber, archive: C.mute }[type] || C.mute;
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 0", borderBottom: `1px solid ${C.line2}` }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0, background: tone, boxShadow: `0 0 0 3px ${tone}22` }} />
      <div style={{ fontSize: 11.5, color: C.ink3, minWidth: 110, flexShrink: 0, marginTop: 1, fontVariantNumeric: "tabular-nums" }}>{time}</div>
      <div style={{ fontSize: 13, color: C.ink2, flex: 1 }}>
        <strong style={{ color: C.ink, fontWeight: 600 }}>{user}</strong> {action}
      </div>
    </div>
  );
};

/* ─────────── EMPTY STATE ─────────── */

const Empty = ({ icon = "sparkle", title, sub, action }) => (
  <div style={{ textAlign: "center", padding: "40px 20px", color: C.ink3 }}>
    <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.muteLt, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
      <Icon name={icon} size={18} color={C.ink3} />
    </div>
    <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>{title}</div>
    {sub && <div style={{ fontSize: 12.5, marginBottom: 14 }}>{sub}</div>}
    {action}
  </div>
);

/* ─────────── EXPORTS ─────────── */

Object.assign(window, {
  Icon, PyxisMark, PyxisLogo,
  DisplayH, SectionH, Eyebrow, Muted,
  Badge, Tag, Btn, IconBtn,
  Card, CardHead, Stat,
  Field, Input, Select, Textarea, fldBase,
  Avatar, Table, NavItem, Sidebar, TopBar, Shell,
  Modal, LogRow, Empty,
});
