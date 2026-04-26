// Artists + Calendar + Post-show log screens
const C = window.PX.color, R = window.PX.radius;

function ArtistsScreen() {
  const U = window.PX_UTIL, D = window.PX_DATA;
  return (
    <Shell page="artists" onNav={() => {}} pendingCount={3}
      title="Artists" subtitle={`${D.artists.length} in roster · 6 played this year`}
      breadcrumb="Home / Artists"
      actions={<><Input placeholder="Search by name, genre…" icon="search" style={{ width: 260 }} /><Btn icon="plus">Add artist</Btn></>}
    >
      {/* Featured row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
        {D.artists.slice(0, 3).map((a, i) => (
          <Card key={a.id} style={{ padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -30, top: -30, opacity: .05 }}><PyxisMark size={160} /></div>
            <Eyebrow style={{ color: [C.accent, C.blue, C.green][i] }}>Frequent · {a.shows} shows</Eyebrow>
            <div className="px-serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 8, marginBottom: 4 }}>{a.name}</div>
            <div style={{ fontSize: 12, color: C.ink3, marginBottom: 14 }}>{a.genre} · avg draw {a.avgDraw}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" size="sm">Open profile</Btn>
              <Btn variant="ghost" size="sm" icon="plus">Book</Btn>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line2}`, display: "flex", alignItems: "center", gap: 10 }}>
          <SectionH>All artists</SectionH>
          <div style={{ fontSize: 11.5, color: C.ink3 }}>({D.artists.length})</div>
          <div style={{ flex: 1 }} />
          {["All", "Darkwave", "Techno", "Experimental", "Ambient"].map((t, i) => (
            <div key={t} style={{ fontSize: 12, padding: "4px 10px", borderRadius: R.pill, background: i === 0 ? C.ink : "transparent", color: i === 0 ? "#fff" : C.ink2, cursor: "pointer", fontWeight: 500, border: `1px solid ${i === 0 ? C.ink : C.line}` }}>{t}</div>
          ))}
        </div>
        <div style={{ padding: "4px 22px 8px" }}>
          <Table
            cols={[
              { label: "Artist", render: r => <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={r.name} size={34} tone={r.shows ? C.ink : C.muteLt} />
                <div><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: C.ink3 }}>{r.links}</div></div>
              </div> },
              { label: "Genre", render: r => <Tag>{r.genre}</Tag> },
              { label: "Shows", render: r => <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{r.shows}</span> },
              { label: "Avg draw", render: r => r.avgDraw ? <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.avgDraw}</span> : <span style={{ color: C.ink4 }}>—</span> },
              { label: "Last show", render: r => r.lastShow ? U.fmtShort(r.lastShow) : <span style={{ color: C.ink4 }}>—</span> },
              { label: "Notes", render: r => <span style={{ fontSize: 12, color: C.ink2 }}>{r.notes ? r.notes.slice(0, 40) + (r.notes.length > 40 ? "…" : "") : <span style={{ color: C.ink4 }}>—</span>}</span> },
              { label: "", align: "right", render: () => <Icon name="chev" size={14} color={C.ink3} /> },
            ]}
            rows={D.artists}
            onRowClick={() => {}}
          />
        </div>
      </Card>
    </Shell>
  );
}

function CalendarScreen() {
  const D = window.PX_DATA;
  const year = 2025, month = 4;
  const monthName = "May 2025";
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = 31;
  const eventsOnDay = day => {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return D.calEvents.filter(e => e.date === iso);
  };
  const colorOf = st => ({ confirmed: [C.greenLt, C.green], hold: [C.blueLt, C.blue], blocked: [C.muteLt, C.mute] })[st] || [C.amberLt, C.amber];
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Shell page="calendar" onNav={() => {}} pendingCount={3}
      title="Calendar" subtitle="Plan the room · holds, confirms, and off-nights"
      breadcrumb="Home / Calendar"
      actions={<>
        <div style={{ display: "flex", background: C.surface, border: `1px solid ${C.line}`, borderRadius: R.sm, padding: 2 }}>
          {["Month", "Week", "List"].map((v, i) => (
            <div key={v} style={{ padding: "5px 12px", fontSize: 12, fontWeight: 500, borderRadius: R.xs, background: i === 0 ? C.ink : "transparent", color: i === 0 ? "#fff" : C.ink2, cursor: "pointer" }}>{v}</div>
          ))}
        </div>
        <Btn icon="plus">Add</Btn>
      </>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        <Card data-section="calendar-month" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div className="px-serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em" }}>{monthName}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <IconBtn icon="chev" style={{ transform: "scaleX(-1)" }} />
              <Btn variant="outline" size="sm">Today</Btn>
              <IconBtn icon="chev" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 6 }}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 600, color: C.ink3, padding: "2px 0", letterSpacing: ".08em", textTransform: "uppercase" }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
            {cells.map((day, i) => {
              const evs = day ? eventsOnDay(day) : [];
              const isToday = day === 2;
              return (
                <div key={i} style={{ minHeight: 82, borderRadius: R.sm, padding: "6px 8px",
                  background: day ? (isToday ? C.accentLt : C.surface2) : "transparent",
                  border: isToday ? `1.5px solid ${C.accent}` : `1px solid ${C.line2}`,
                  cursor: day ? "pointer" : "default" }}>
                  {day && (
                    <>
                      <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 500, color: isToday ? C.accent : C.ink2, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>{day}</div>
                      {evs.map((e, j) => {
                        const [bg, fg] = colorOf(e.status);
                        return <div key={j} style={{ background: bg, color: fg, fontSize: 10.5, borderRadius: 3, padding: "2px 5px", marginBottom: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontWeight: 500 }}>{e.label}</div>;
                      })}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.line2}` }}>
            {[["Confirmed", C.greenLt, C.green], ["Hold", C.blueLt, C.blue], ["Blocked", C.muteLt, C.mute]].map(([l, bg, fg]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: C.ink2 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1px solid ${fg}` }} />{l}
              </div>
            ))}
          </div>
        </Card>

        <div data-section="calendar-agenda">
          <Card style={{ padding: 18, marginBottom: 14 }}>
            <CardHead title="May at a glance" style={{ marginBottom: 14 }} />
            {[["Confirmed", 5, C.green], ["Hold", 1, C.blue], ["Blocked", 1, C.mute], ["Open nights", 24, C.ink3]].map(([l, v, clr]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: `1px solid ${C.line2}`, fontSize: 13 }}>
                <span style={{ color: C.ink2 }}>{l}</span>
                <span style={{ fontWeight: 600, color: clr }}>{v}</span>
              </div>
            ))}
          </Card>

          <Card style={{ padding: 18 }}>
            <CardHead title="Today · May 2" style={{ marginBottom: 10 }} />
            <div style={{ padding: 12, borderRadius: R.sm, background: C.accentLt, border: `1px solid ${C.accent}22` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>Burial Hex</div>
                <Badge status="confirmed" />
              </div>
              <div style={{ fontSize: 11.5, color: C.ink2, lineHeight: 1.6 }}>
                Doors 8:00 PM · 21+ · $12 adv<br />
                Expected draw: ~70 / 150
              </div>
              <div style={{ marginTop: 10 }}><Btn size="sm" full>Open show</Btn></div>
            </div>
            <Btn variant="outline" icon="plus" full style={{ marginTop: 10 }}>Add to today</Btn>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function AttendanceScreen() {
  const U = window.PX_UTIL, D = window.PX_DATA;
  return (
    <Shell page="attendance" onNav={() => {}} pendingCount={3}
      title="Post-show log" subtitle="Record headcount and notes after the night."
      breadcrumb="Home / Post-show log"
    >
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
        <Stat label="Waiting to log" value="2" sub="Oldest: Feb 28" accent={C.amber} />
        <Stat label="Logged this year" value="14" sub="out of 16 past shows" accent={C.green} />
        <Stat label="Avg draw" value="58" sub="Last 6 logged" accent={C.blue} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
        <Card style={{ padding: 0 }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line2}` }}>
            <SectionH>Past shows</SectionH>
            <Muted style={{ marginTop: 3 }}>Log headcount, energy notes, and incidents.</Muted>
          </div>
          <div style={{ padding: "4px 22px 8px" }}>
            <Table
              cols={[
                { label: "Show", render: r => <div><div style={{ fontWeight: 600 }}>{r.artist}</div><div style={{ fontSize: 11, color: C.ink3 }}>#{r.id}</div></div> },
                { label: "Date", render: r => U.fmtDate(r.date) },
                { label: "Draw", render: r => r.logged ? <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{r.draw}</span> : <span style={{ color: C.ink4 }}>—</span> },
                { label: "Notes", render: r => <span style={{ fontSize: 12, color: C.ink2 }}>{r.notes || <span style={{ color: C.ink4 }}>—</span>}</span> },
                { label: "Status", render: r => <Badge status={r.logged ? "logged" : "needslog"} /> },
                { label: "", align: "right", render: r => r.logged ? <Btn variant="ghost" size="sm">Edit</Btn> : <Btn size="sm">Log</Btn> },
              ]}
              rows={D.pastForLogging}
            />
          </div>
        </Card>

        {/* Inline editor preview */}
        <Card style={{ padding: 22 }}>
          <Eyebrow>Logging</Eyebrow>
          <div className="px-serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 6, marginBottom: 2 }}>Planning for Burial</div>
          <Muted style={{ marginBottom: 18 }}>Fri, Mar 14, 2025 · Doors 8:00 PM</Muted>

          <Field label="Attendance">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Input value="34" type="number" style={{ width: 90, textAlign: "center", fontSize: 16, fontWeight: 600 }} />
              <div style={{ fontSize: 12, color: C.ink3 }}>of 150 capacity · 23%</div>
            </div>
          </Field>

          <Field label="How did it go?">
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {["Quiet", "Steady", "Great", "Packed"].map((t, i) => (
                <div key={t} style={{ padding: "6px 10px", fontSize: 12, borderRadius: R.pill, border: `1px solid ${C.line}`, background: i === 1 ? C.ink : C.surface, color: i === 1 ? "#fff" : C.ink2, cursor: "pointer", fontWeight: 500 }}>{t}</div>
              ))}
            </div>
            <Textarea rows={3} placeholder="Any notable moments, issues, or shout-outs…" value="Small crowd but engaged. Sound was dialled in; artist was happy with monitors." />
          </Field>

          <Field>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: C.ink2 }}>
              <input type="checkbox" style={{ accentColor: C.accent }} />
              <span>Incident to note</span>
            </label>
          </Field>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Btn variant="outline" full>Save draft</Btn>
            <Btn full icon="check">Log show</Btn>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

Object.assign(window, { ArtistsScreen, CalendarScreen, AttendanceScreen });
