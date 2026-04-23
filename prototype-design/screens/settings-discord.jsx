// Discord + Settings + Modals screens
const C = window.PX.color, R = window.PX.radius;

function DiscordScreen() {
  return (
    <Shell page="discord" onNav={() => {}} pendingCount={3}
      title="Discord" subtitle="The bot that does the boring bits"
      breadcrumb="Home / Discord"
      actions={<><Btn variant="outline" icon="reset">Reconnect bot</Btn></>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div>
          <Card style={{ padding: 22, marginBottom: 16 }}>
            <CardHead title="Server connection" subtitle="The Discord server your bot operates in." />
            <Field label="Server (Guild) ID" hint="Right-click the server name → Copy Server ID (Developer Mode required)">
              <Input value="847392017483620352" icon="compass" />
            </Field>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Btn variant="discord" icon="check">Test connection</Btn>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.green, fontWeight: 500 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} /> Connected · bot is online
              </div>
            </div>
          </Card>

          <Card style={{ padding: 22, marginBottom: 16 }}>
            <CardHead title="Channel mapping" subtitle="Each purpose routes to one channel." />
            {[
              ["#upcoming-shows", "847392017483620355", "Public · posts + pins confirmed shows", C.green],
              ["#announcements", "847392017483620356", "Public · broader space announcements", C.green],
              ["#staff", "847392017483620357", "Private · auto-archive, reminders, bot status", C.blue],
              ["#booking-requests", "847392017483620358", "Private · incoming artist submissions", C.amber],
            ].map(([name, id, hint, clr]) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 16, padding: "14px 0", borderTop: `1px solid ${C.line2}`, alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: clr }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{name}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.ink3, marginTop: 3 }}>{hint}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Input value={id} icon="compass" />
                  <IconBtn icon="copy" />
                </div>
              </div>
            ))}
          </Card>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="ghost">Discard</Btn>
            <Btn icon="check">Save changes</Btn>
          </div>
        </div>

        {/* Right sidebar */}
        <div>
          <Card style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: R.md, background: C.discord, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="discord" size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>pyxis-bot</div>
                <div style={{ fontSize: 11.5, color: C.green, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} /> Online · v1.2.0
                </div>
              </div>
            </div>
            {[["Server", "Hollow Earth"], ["Members", "247"], ["Pinned shows", "3"], ["Last sync", "12 min ago"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: `1px solid ${C.line2}`, fontSize: 12.5 }}>
                <span style={{ color: C.ink3 }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </Card>

          <Card style={{ padding: 20 }}>
            <CardHead title="What the bot does" style={{ marginBottom: 14 }} />
            {[
              ["pin", "Pins shows", "When you confirm a show, it's posted + pinned to #upcoming-shows."],
              ["archive", "Archives past shows", "Every night at 23:00, unpins yesterday's shows."],
              ["mail", "Forwards submissions", "Booking-form posts appear in #booking-requests."],
              ["bell", "Nags staff", "Pings when shows need post-logs or holds are stale."],
            ].map(([i, t, d]) => (
              <div key={t} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <Icon name={i} size={15} color={C.ink3} />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{t}</div>
                  <div style={{ fontSize: 11.5, color: C.ink3, lineHeight: 1.5, marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function SettingsScreen() {
  return (
    <Shell page="settings" onNav={() => {}} pendingCount={3}
      title="Settings" subtitle="Space info, staff access, and data"
      breadcrumb="Home / Settings"
    >
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 26 }}>
        {/* Tabs */}
        <div>
          {[
            ["Space", "cog", true],
            ["Staff & roles", "users"],
            ["Public site", "ext"],
            ["Notifications", "bell"],
            ["Billing", "ticket"],
            ["Import / export", "archive"],
            ["Danger zone", "warn"],
          ].map(([l, i, sel]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: R.sm, background: sel ? C.accentLt : "transparent", color: sel ? C.accent : C.ink2, fontSize: 13, fontWeight: sel ? 600 : 500, cursor: "pointer", marginBottom: 2 }}>
              <Icon name={i} size={15} /> {l}
            </div>
          ))}
        </div>

        <div>
          <Card style={{ padding: 24, marginBottom: 16 }}>
            <CardHead title="Space info" subtitle="Shown on the public site and in Discord bot messages." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
              <Field label="Space name" style={{ gridColumn: "1 / -1" }}><Input value="pyxis" /></Field>
              <Field label="Tagline" style={{ gridColumn: "1 / -1" }}><Input value="a music artist space in providence, ri" /></Field>
              <Field label="Address" style={{ gridColumn: "1 / -1" }}><Input value="25 Manton Ave, Providence RI 02909" /></Field>
              <Field label="Capacity"><Input value="150" type="number" /></Field>
              <Field label="Contact email"><Input value="hello@pyxis.xyz" icon="mail" /></Field>
              <Field label="Public website" style={{ gridColumn: "1 / -1" }}><Input value="pyxis.xyz" /></Field>
            </div>
          </Card>

          <Card style={{ padding: 24, marginBottom: 16 }}>
            <CardHead title="Staff & roles" subtitle="Who can sign in, and what they can do." action={<Btn size="sm" icon="plus">Invite</Btn>} />
            <Table
              cols={[
                { label: "Member", render: r => <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={r.name} size={30} tone={r.tone} /><div><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: C.ink3 }}>{r.email}</div></div>
                </div> },
                { label: "Role", render: r => <Tag color={r.role === "Admin" ? C.accent : C.ink2}>{r.role}</Tag> },
                { label: "Last seen", render: r => <span style={{ color: C.ink3 }}>{r.seen}</span> },
                { label: "Status", render: r => <Badge status={r.status} /> },
                { label: "", align: "right", render: () => <IconBtn icon="edit" /> },
              ]}
              rows={[
                { name: "Ada Dove", email: "ada@pyxis.xyz", role: "Admin", seen: "now", status: "live", tone: C.ink },
                { name: "Jamie Quinn", email: "jamie@pyxis.xyz", role: "Booker", seen: "2h ago", status: "live", tone: C.blue },
                { name: "Sam Reyes", email: "sam@pyxis.xyz", role: "Booker", seen: "yesterday", status: "live", tone: C.green },
                { name: "Robin Cho", email: "robin@pyxis.xyz", role: "Volunteer", seen: "3d ago", status: "pending", tone: C.amber },
              ]}
            />
          </Card>

          <Card style={{ padding: 24, border: `1px solid ${C.accent}33` }}>
            <CardHead title={<span style={{ color: C.accent }}>Danger zone</span>} subtitle="Irreversible, nuclear actions. Be sure." />
            {[
              ["Export all data", "Download shows, artists, bookings as CSV.", "Export", "outline"],
              ["Disconnect Discord bot", "Removes the bot from your server. Mappings are preserved.", "Disconnect", "outline"],
              ["Delete all shows", "Permanently deletes every show record.", "Delete", "danger"],
            ].map(([t, s, b, v]) => (
              <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: `1px solid ${C.line2}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
                  <div style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>{s}</div>
                </div>
                <Btn variant={v} size="sm">{b}</Btn>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

// ── Modal states — presented as overlays over a stilled dashboard ──
function ModalShowcase() {
  const U = window.PX_UTIL, D = window.PX_DATA;
  return (
    <div style={{ position: "relative" }}>
      <Shell page="shows" onNav={() => {}} pendingCount={3}
        title="Shows" subtitle="All confirmed and archived events" breadcrumb="Home / Shows"
        actions={<><IconBtn icon="search" /><Btn icon="plus">New show</Btn></>}
      >
        <Card style={{ padding: 0 }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line2}` }}><SectionH>Confirmed · 6</SectionH></div>
          <div style={{ padding: "4px 22px 8px" }}>
            <Table
              cols={[
                { label: "Date", render: r => U.fmtShort(r.date) },
                { label: "Artist", render: r => <span style={{ fontWeight: 600 }}>{r.artist}</span> },
                { label: "Status", render: r => <Badge status={r.status} /> },
              ]}
              rows={D.shows.filter(s => s.status === "confirmed").slice(0, 4)}
            />
          </div>
        </Card>
      </Shell>

      <Modal title="Add new show" subtitle="Will be posted to #upcoming-shows on confirmation" onClose={() => {}}
        footer={<><Btn variant="ghost">Cancel</Btn><Btn variant="outline">Save as hold</Btn><Btn>Confirm &amp; post</Btn></>}>
        <Field label="Artist / act name"><Input value="Pharmakon" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Date"><Input value="2025-06-14" type="date" /></Field>
          <Field label="Doors"><Input value="8:00 PM" /></Field>
          <Field label="Age"><Select value="21+" options={["All Ages","18+","21+"]} /></Field>
          <Field label="Price"><Input value="$15 / $18" /></Field>
        </div>
        <Field label="Genre"><Input value="Industrial" /></Field>
        <Field label="Notes" hint="Visible to staff only"><Textarea rows={2} value="Very loud — warn neighbours about curfew." /></Field>
      </Modal>
    </div>
  );
}

Object.assign(window, { DiscordScreen, SettingsScreen, ModalShowcase });
