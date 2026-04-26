// Shows + Bookings + Audit log screens
const C = window.PX.color, R = window.PX.radius;

function ShowsScreen() {
  const U = window.PX_UTIL, D = window.PX_DATA;
  const upcoming = D.shows.filter(s => s.status === "confirmed").sort((a,b) => a.date.localeCompare(b.date));
  const archived = D.shows.filter(s => s.status === "archived");

  return (
    <Shell page="shows" onNav={() => {}} pendingCount={3}
      title="Shows" subtitle="All confirmed and archived events" breadcrumb="Home / Shows"
      actions={<>
        <IconBtn icon="filter" />
        <IconBtn icon="search" />
        <Btn icon="plus">New show</Btn>
      </>}
    >
      {/* Filter chips */}
      <div data-section="shows-filters" style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        {["All", "Confirmed", "Hold", "Cancelled", "Archived"].map((f, i) => (
          <div key={f} style={{ padding: "6px 12px", borderRadius: R.pill, fontSize: 12, fontWeight: 500,
            background: i === 1 ? C.ink : C.surface, color: i === 1 ? "#fff" : C.ink2,
            border: `1px solid ${i === 1 ? C.ink : C.line}`, cursor: "pointer" }}>
            {f} {i === 1 && <span style={{ opacity: .6, marginLeft: 4 }}>6</span>}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11.5, color: C.ink3 }}>Sort: <strong style={{ color: C.ink2 }}>Date ascending</strong></div>
      </div>

      <Card data-section="shows-confirmed" style={{ padding: 0 }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line2}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SectionH>Confirmed · {upcoming.length}</SectionH>
          <div style={{ fontSize: 11.5, color: C.ink3 }}>Pinned shows appear in #upcoming-shows</div>
        </div>
        <div style={{ padding: "4px 22px 8px" }}>
          <Table
            cols={[
              { label: "#", width: 50, render: r => <span className="px-mono" style={{ color: C.ink4, fontSize: 11.5 }}>#{r.id}</span> },
              { label: "Date", width: 130, render: r => <div><div style={{ fontWeight: 600 }}>{U.fmtShort(r.date)}</div><div style={{ fontSize: 11, color: C.ink3 }}>{U.fmtDay(r.date)}</div></div> },
              { label: "Artist", render: r => <div><div style={{ fontWeight: 600 }}>{r.artist}</div><div style={{ fontSize: 11, color: C.ink3 }}>{r.genre}</div></div> },
              { label: "Doors", width: 90, render: r => <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.doors}</span> },
              { label: "Age", width: 100, render: r => <Tag>{r.age}</Tag> },
              { label: "Price", width: 150, render: r => <span style={{ fontSize: 12 }}>{r.price}</span> },
              { label: "Draw", width: 120, render: r => <div style={{ width: 90 }}>
                <div style={{ fontSize: 11, color: C.ink3, marginBottom: 3, fontVariantNumeric: "tabular-nums" }}>{r.draw}/{r.capacity}</div>
                <div style={{ height: 3, background: C.line2, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, r.draw/r.capacity*100)}%`, height: "100%", background: r.draw > r.capacity ? C.accent : C.green }} />
                </div>
              </div> },
              { label: "Status", width: 110, render: r => <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Badge status={r.status} />{r.pinned && <Icon name="pin" size={12} color={C.ink3} />}</div> },
              { label: "", width: 60, align: "right", render: () => <IconBtn icon="edit" /> },
            ]}
            rows={upcoming}
          />
        </div>
      </Card>

      <div style={{ marginTop: 20 }}>
        <Card data-section="shows-archived" style={{ padding: 0 }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line2}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="archive" size={15} color={C.ink3} />
              <SectionH style={{ color: C.ink2 }}>Archived · {archived.length}</SectionH>
            </div>
            <Btn variant="ghost" size="sm" iconRight="chev">See all past shows</Btn>
          </div>
          <div style={{ padding: "4px 22px 8px", opacity: .75 }}>
            <Table
              cols={[
                { label: "Date", width: 130, render: r => U.fmtDate(r.date) },
                { label: "Artist", render: r => <span style={{ fontWeight: 500 }}>{r.artist}</span> },
                { label: "Genre", render: r => r.genre },
                { label: "Draw", render: r => <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.draw} attended</span> },
                { label: "Status", render: r => <Badge status="archived" /> },
              ]}
              rows={archived}
            />
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function BookingsScreen() {
  const U = window.PX_UTIL, D = window.PX_DATA;
  const pending = D.submissions.filter(s => s.status === "pending");
  const processed = D.submissions.filter(s => s.status !== "pending");

  return (
    <Shell page="bookings" onNav={() => {}} pendingCount={pending.length}
      title="Bookings" subtitle="Submissions from #booking-requests"
      breadcrumb="Home / Bookings"
      actions={<><Btn variant="outline" icon="ext">Open form</Btn><Btn icon="sparkle">Auto-review</Btn></>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div>
          {/* Pending queue */}
          <Card data-section="bookings-queue" style={{ marginBottom: 16 }}>
            <CardHead title={`Awaiting review · ${pending.length}`} subtitle="Review each request, then approve to add the show or decline with a reason." />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pending.map(sub => (
                <div key={sub.id} style={{ border: `1px solid ${C.line}`, borderRadius: R.md, padding: 16, background: C.surface2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <div className="px-serif" style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>{sub.artist}</div>
                        <Badge status={sub.status} />
                      </div>
                      <div style={{ display: "flex", gap: 18, fontSize: 12, color: C.ink2, flexWrap: "wrap", marginBottom: 10 }}>
                        <span><Icon name="calendar" size={12} color={C.ink3} /> {U.fmtDate(sub.date)}</span>
                        <span><Icon name="music" size={12} color={C.ink3} /> {sub.genre}</span>
                        <span><Icon name="users" size={12} color={C.ink3} /> ~{sub.draw} est. draw</span>
                        <span><Icon name="ext" size={12} color={C.ink3} /> <a style={{ color: C.blue }}>{sub.links}</a></span>
                      </div>
                      <div style={{ fontSize: 12, color: C.ink3, display: "flex", gap: 10 }}>
                        <span>Submitted {sub.submitted}</span>
                        <span>·</span>
                        <span>Date is available</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn variant="ghost" size="sm">Hold</Btn>
                      <Btn variant="danger" size="sm" icon="x">Decline</Btn>
                      <Btn variant="success" size="sm" icon="check">Approve</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Processed */}
          <Card data-section="bookings-processed">
            <CardHead title="Recently processed" action={<Btn variant="ghost" size="sm">View archive</Btn>} />
            <Table
              cols={[
                { label: "Artist", render: r => <span style={{ fontWeight: 600 }}>{r.artist}</span> },
                { label: "Requested", render: r => U.fmtShort(r.date) },
                { label: "Genre", render: r => r.genre },
                { label: "Submitted", render: r => r.submitted },
                { label: "Status", render: r => <Badge status={r.status} /> },
              ]}
              rows={processed}
            />
          </Card>
        </div>

        {/* Right: insights */}
        <div>
          <Card style={{ padding: 18, marginBottom: 14 }}>
            <CardHead title="Inbox rhythm" style={{ marginBottom: 14 }} />
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 70, marginBottom: 10 }}>
              {[2, 4, 1, 3, 5, 2, 6, 3, 4, 7, 5, 3].map((v, i) => (
                <div key={i} style={{ flex: 1, background: i === 9 ? C.accent : C.muteLt, height: `${v * 10}px`, borderRadius: 2 }} />
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: C.ink3 }}>Submissions, last 12 weeks</div>
            <div style={{ marginTop: 14, padding: 12, background: C.surface2, borderRadius: R.sm }}>
              <div style={{ fontSize: 11.5, color: C.ink2, lineHeight: 1.5 }}>
                Avg response time: <strong>2.1 days</strong>. Goal is under 3 — you're in good shape.
              </div>
            </div>
          </Card>

          <Card style={{ padding: 18 }}>
            <CardHead title="Decline templates" subtitle="One click, friendly reply." style={{ marginBottom: 12 }} />
            {["Not a fit right now", "Double-booked that night", "Too soon — try next season", "Need more info"].map(t => (
              <div key={t} style={{ padding: "10px 12px", borderRadius: R.sm, border: `1px solid ${C.line}`, marginBottom: 6, fontSize: 12.5, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                {t} <Icon name="chev" size={13} color={C.ink3} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function AuditLogScreen() {
  const D = window.PX_DATA;
  return (
    <Shell page="log" onNav={() => {}} pendingCount={3}
      title="Audit log" subtitle="Everything that happens, in order"
      breadcrumb="Home / Audit log"
      actions={<><Btn variant="outline" icon="ext">Export CSV</Btn></>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
        {/* Filters column */}
        <div>
          <Card style={{ padding: 18 }}>
            <Eyebrow style={{ marginBottom: 10 }}>Who</Eyebrow>
            {[["All users", 42, true], ["jamie", 12], ["sam", 8], ["ada", 6], ["bot", 16]].map(([u, n, sel]) => (
              <div key={u} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", borderRadius: R.xs, background: sel ? C.accentLt : "transparent", color: sel ? C.accent : C.ink2, fontSize: 12.5, marginBottom: 2, cursor: "pointer", fontWeight: sel ? 600 : 500 }}>
                <span>{u}</span><span style={{ opacity: .6 }}>{n}</span>
              </div>
            ))}
            <div style={{ height: 16 }} />
            <Eyebrow style={{ marginBottom: 10 }}>What</Eyebrow>
            {[["approve", C.green], ["decline", C.accent], ["edit", C.blue], ["add", C.green], ["archive", C.mute], ["bot", C.amber]].map(([t, clr]) => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", fontSize: 12.5, color: C.ink2, cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: C.accent }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: clr }} />
                {t}
              </label>
            ))}
            <div style={{ height: 16 }} />
            <Eyebrow style={{ marginBottom: 10 }}>When</Eyebrow>
            {["Today", "This week", "This month", "Custom…"].map((w, i) => (
              <div key={w} style={{ padding: "6px 8px", fontSize: 12.5, color: i === 1 ? C.accent : C.ink2, fontWeight: i === 1 ? 600 : 500, cursor: "pointer" }}>{w}</div>
            ))}
          </Card>
        </div>

        <Card>
          <CardHead title="Activity" subtitle="Newest first · click any entry to see the before/after snapshot." action={<Input placeholder="Search log…" icon="search" style={{ width: 220 }} />} />
          <div>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".09em", color: C.ink3, fontWeight: 600, padding: "10px 0 6px", borderBottom: `1px solid ${C.line2}` }}>Today</div>
            {D.log.slice(0, 3).map(l => <LogRow key={l.id} {...l} />)}
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".09em", color: C.ink3, fontWeight: 600, padding: "18px 0 6px", borderBottom: `1px solid ${C.line2}` }}>Earlier this week</div>
            {D.log.slice(3).map(l => <LogRow key={l.id} {...l} />)}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

Object.assign(window, { ShowsScreen, BookingsScreen, AuditLogScreen });
