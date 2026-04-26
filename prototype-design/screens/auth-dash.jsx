// Login + Setup wizard + Dashboard screens
const C = window.PX.color, R = window.PX.radius;

function LoginScreen() {
  return (
    <div className="px-root" style={{ width: 1240, height: 760, background: C.bg, display: "flex", borderRadius: R.lg, border: `1px solid ${C.line}`, overflow: "hidden" }}>
      {/* Left: marquee */}
      <div style={{ flex: 1, background: C.ink, color: "#fff", padding: 48, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#fff" }}>
          <PyxisMark size={30} color="#fff" />
          <div className="px-serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}>pyxis</div>
        </div>

        {/* Big decorative mark */}
        <div style={{ position: "absolute", right: -120, top: -80, opacity: .08 }}>
          <PyxisMark size={640} color="#fff" />
        </div>

        <div style={{ position: "relative", maxWidth: 440 }}>
          <div className="px-serif" style={{ fontSize: 46, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 20 }}>
            The operations desk for a small-venue community.
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.7)", lineHeight: 1.6 }}>
            Confirm shows, review booking requests, and let a friendly bot handle the Discord posts, pins and archives — so the humans can focus on the music.
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", gap: 32, fontSize: 11.5, color: "rgba(255,255,255,.5)" }}>
          <div><span style={{ color: "#fff", fontWeight: 600 }}>v1.2.0</span> · est. 2025</div>
          <div>25 Manton Ave · Providence RI</div>
        </div>
      </div>

      {/* Right: auth panel */}
      <div style={{ width: 480, background: C.surface, padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Eyebrow>Staff portal</Eyebrow>
        <DisplayH size={32} style={{ marginTop: 10, marginBottom: 12 }}>Welcome back</DisplayH>
        <Muted style={{ marginBottom: 32, lineHeight: 1.6 }}>Access is invite-only. Sign in with the Discord account your admin has authorised.</Muted>

        <Btn variant="discord" size="lg" icon="discord" full>Continue with Discord</Btn>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0", color: C.ink3, fontSize: 11.5 }}>
          <div style={{ flex: 1, height: 1, background: C.line }} />
          OR
          <div style={{ flex: 1, height: 1, background: C.line }} />
        </div>

        <Field label="Email"><Input placeholder="you@venue.xyz" icon="mail" /></Field>
        <Field label="Magic link" hint="We'll email you a one-tap sign-in link."><Input placeholder="We'll send a link…" /></Field>

        <Btn variant="outline" size="lg" full style={{ marginTop: 8 }}>Email me a link</Btn>

        <div style={{ marginTop: 40, fontSize: 11.5, color: C.ink3, borderTop: `1px solid ${C.line}`, paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
          <span>Not on the list? <span style={{ color: C.accent, cursor: "pointer" }}>Ask an admin →</span></span>
          <span>Privacy</span>
        </div>
      </div>
    </div>
  );
}

function SetupScreen() {
  const step = 2; // show a meaty middle step
  return (
    <div className="px-root" style={{ width: 1240, height: 760, background: C.bg, borderRadius: R.lg, border: `1px solid ${C.line}`, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <PyxisMark size={28} />
        <div className="px-serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>pyxis</div>
      </div>
      <Eyebrow style={{ marginTop: 24 }}>Setup · 3 of 4</Eyebrow>
      <DisplayH size={34} style={{ marginTop: 10, marginBottom: 8 }}>Map your Discord channels</DisplayH>
      <Muted style={{ textAlign: "center", maxWidth: 520 }}>Tell the bot where to post. Right-click any channel in Discord and choose <b>Copy Channel ID</b> (requires Developer Mode).</Muted>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 28, marginBottom: 32 }}>
        {["Space","Server","Channels","Ready"].map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 84 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: i < step ? C.ink : i === step ? C.accent : C.muteLt, color: i <= step ? "#fff" : C.ink3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
                {i < step ? <Icon name="check" size={13} color="#fff" /> : i + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: i === step ? 600 : 500, color: i === step ? C.ink : C.ink3 }}>{s}</div>
            </div>
            {i < 3 && <div style={{ width: 50, height: 1, background: i < step ? C.ink : C.line, marginBottom: 18 }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <Card style={{ width: 640, padding: 0 }}>
        <div style={{ padding: "24px 28px 6px" }}>
          {[
            ["#upcoming-shows", "847392017483620355", "Public · bot posts + pins confirmed show announcements"],
            ["#announcements", "847392017483620356", "Public · broader space announcements and cancellations"],
            ["#staff", "847392017483620357", "Private · auto-archive notices, reminders, bot status"],
            ["#booking-requests", "847392017483620358", "Private · incoming artist submissions land here"],
          ].map(([name, id, hint]) => (
            <Field key={name} label={name} hint={hint}>
              <Input value={id} icon="compass" />
            </Field>
          ))}
        </div>
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", background: C.surface2 }}>
          <Btn variant="ghost" icon="chev" style={{ transform: "scaleX(-1)" }}>Back</Btn>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="outline">Skip for now</Btn>
            <Btn iconRight="chev">Continue</Btn>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 22, fontSize: 11.5, color: C.ink3 }}>You can change any of this later under Settings → Discord.</div>
    </div>
  );
}

function DashboardScreen() {
  const U = window.PX_UTIL, D = window.PX_DATA;
  const upcoming = D.shows.filter(s => s.status === "confirmed").sort((a,b) => a.date.localeCompare(b.date));
  const pending = D.submissions.filter(s => s.status === "pending");
  const today = new Date("2025-04-23T00:00:00");
  const next = upcoming[0];
  const daysAway = Math.round((new Date(next.date) - today) / 86400000);

  return (
    <Shell page="dashboard" onNav={() => {}} pendingCount={pending.length}
      title="Welcome back, Ada"
      subtitle="Wednesday, April 23 · 6 shows booked this month"
      breadcrumb="Home / Dashboard"
      actions={<>
        <IconBtn icon="search" />
        <IconBtn icon="bell" />
        <Btn icon="plus">New show</Btn>
      </>}
    >
      {/* Hero strip — next show */}
      <div data-section="dashboard-hero" style={{ background: C.ink, color: "#fff", borderRadius: R.lg, padding: 26, display: "flex", alignItems: "center", gap: 32, marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -60, top: -60, opacity: .1 }}><PyxisMark size={300} color="#fff" /></div>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.6)", marginBottom: 6, fontWeight: 600 }}>Next on stage · in {daysAway} days</div>
          <div className="px-serif" data-element="hero-artist" style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 6, lineHeight: 1.05 }}>{next.artist}</div>
          <div data-element="hero-date-line" style={{ fontSize: 13, color: "rgba(255,255,255,.7)", display: "flex", gap: 16 }}>
            <span data-element="hero-date">{U.fmtDate(next.date)}</span>
            <span data-element="hero-doors">Doors {next.doors}</span>
            <span data-element="hero-age">{next.age}</span>
            <span data-element="hero-price">{next.price}</span>
          </div>
        </div>
        <div data-element="hero-actions" style={{ display: "flex", gap: 8, position: "relative" }}>
          <Btn variant="outline" icon="ext" data-element="hero-discord-action" style={{ background: "rgba(255,255,255,.08)", color: "#fff", borderColor: "rgba(255,255,255,.2)" }}>View on Discord</Btn>
          <Btn data-element="hero-edit-action" style={{ background: "#fff", color: C.ink, borderColor: "#fff" }} icon="edit">Edit show</Btn>
        </div>
      </div>

      {/* Stats */}
      <div data-section="dashboard-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <Stat metricId="upcoming" label="Upcoming" value={upcoming.length} sub="Next 60 days" accent={C.accent} />
        <Stat metricId="pending-bookings" label="Pending bookings" value={pending.length} sub="Awaiting review" trend="2 new today" accent={C.amber} />
        <Stat metricId="avg-draw" label="Avg draw" value="84" sub="Last 6 shows" trend="↑ 12 vs. prior 6" accent={C.green} />
        <Stat metricId="capacity-use" label="Capacity use" value="56%" sub="May 2025" accent={C.blue} />
      </div>

      {/* Two-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <Card data-section="dashboard-upcoming">
          <CardHead title="Upcoming shows" subtitle="Pinned to #upcoming-shows" action={<Btn variant="outline" size="sm" iconRight="chev">View all</Btn>} />
          <Table
            cols={[
              { label: "Date", width: 120, render: r => <div><div style={{ fontWeight: 600 }}>{U.fmtShort(r.date)}</div><div style={{ fontSize: 11, color: C.ink3 }}>{U.fmtDay(r.date)}</div></div> },
              { label: "Artist", render: r => <div><div style={{ fontWeight: 600 }}>{r.artist}</div><div style={{ fontSize: 11, color: C.ink3 }}>{r.genre}</div></div> },
              { label: "Doors", render: r => <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.doors}</span> },
              { label: "Age", render: r => <Tag>{r.age}</Tag> },
              { label: "Status", render: r => <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Badge status={r.status} />{r.pinned && <Icon name="pin" size={13} color={C.ink3} />}</div> },
            ]}
            rows={upcoming.slice(0, 5)}
          />
        </Card>

        <div>
          <Card data-section="dashboard-quick-actions" style={{ marginBottom: 16, padding: 18 }}>
            <CardHead title="Quick actions" style={{ marginBottom: 12 }} />
            <Btn icon="plus" full style={{ marginBottom: 8 }}>Add a show</Btn>
            <Btn variant="outline" icon="mail" full style={{ marginBottom: 8 }}>Review bookings · {pending.length}</Btn>
            <Btn variant="ghost" icon="log" full>Open audit log</Btn>
          </Card>

          <Card data-section="dashboard-activity" style={{ padding: 18 }}>
            <CardHead title="Recent activity" action={<span style={{ fontSize: 11, color: C.ink3 }}>live</span>} style={{ marginBottom: 6 }} />
            {D.log.slice(0, 5).map(l => <LogRow key={l.id} {...l} />)}
          </Card>
        </div>
      </div>

      {/* Bot health + reminders strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Eyebrow>Bot status</Eyebrow>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <Icon name="discord" size={22} color={C.discord} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>pyxis-bot <Badge status="live">Online</Badge></div>
                  <div style={{ fontSize: 11.5, color: C.ink3 }}>Hollow Earth · 247 members · v1.2.0</div>
                </div>
              </div>
            </div>
            <Btn variant="outline" size="sm">Settings</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.line2}` }}>
            {[["Pinned", "3", "upcoming"], ["Last sync", "12m", "ago"], ["Uptime", "99.4%", "30 day"]].map(([l, v, s]) => (
              <div key={l}>
                <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>{l}</div>
                <div className="px-serif" style={{ fontSize: 22, fontWeight: 500, marginTop: 3 }}>{v}</div>
                <div style={{ fontSize: 11, color: C.ink3 }}>{s}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card data-section="dashboard-attention" style={{ padding: 18 }}>
          <CardHead title="Needs your attention" style={{ marginBottom: 12 }} />
          {[
            ["2 past shows need logging", "Planning for Burial · Mar 14 and Actress · Feb 28", "warn", C.amber],
            ["Zola Jesus · Jun 6", "Price still says $20 — is that right for a 160-draw headliner?", "sparkle", C.blue],
            ["Discord token expires in 14 days", "Reconnect to keep pinning and archival running", "warn", C.accent],
          ].map(([t, s, i, clr], idx) => (
            <div key={idx} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: idx ? `1px solid ${C.line2}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: R.sm, background: clr + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={i} size={14} color={clr} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
                <div style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>{s}</div>
              </div>
              <Icon name="chev" size={14} color={C.ink3} />
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}

Object.assign(window, { LoginScreen, SetupScreen, DashboardScreen });
