// ── Component System page — the living style guide ──
const C = window.PX.color, R = window.PX.radius, S = window.PX.shadow;

function SystemPage() {
  const Swatch = ({ name, value, hex }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ width: "100%", height: 58, borderRadius: R.md, background: value, border: `1px solid ${C.line}` }} />
      <div style={{ fontSize: 11.5, fontWeight: 600 }}>{name}</div>
      <div className="px-mono" style={{ fontSize: 10.5, color: C.ink3 }}>{hex || value}</div>
    </div>
  );

  const TypeRow = ({ label, sample, cls, style }) => (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr auto", alignItems: "baseline", padding: "14px 0", borderTop: `1px solid ${C.line2}`, gap: 16 }}>
      <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>{label}</div>
      <div className={cls} style={style}>{sample}</div>
      <div className="px-mono" style={{ fontSize: 10.5, color: C.ink3 }}>{style?.fontSize || 13}px / {style?.fontWeight || 400}</div>
    </div>
  );

  return (
    <div style={{ width: 1240, background: C.bg, padding: 32, fontFamily: window.PX.font.sans, color: C.ink }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, gap: 24 }}>
        <div style={{ flex: 1 }}>
          <Eyebrow>Design system · v1.2</Eyebrow>
          <DisplayH size={56} style={{ marginTop: 10 }}>Pyxis</DisplayH>
          <Muted style={{ marginTop: 10, maxWidth: 580, fontSize: 14, lineHeight: 1.55 }}>
            A component system for a small-venue staff tool. Warm paper neutrals, a single crimson accent, and a serif display face give operations work a human, craft-feeling surface.
          </Muted>
        </div>
        <PyxisLogo size={44} />
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Colors */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <CardHead title="Color" subtitle="Warm paper canvas with one chromatic accent and three semantic tones." />
          <Eyebrow style={{ marginBottom: 10 }}>Surface</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 22 }}>
            <Swatch name="bg" value={C.bg} />
            <Swatch name="surface" value={C.surface} />
            <Swatch name="surface2" value={C.surface2} />
            <Swatch name="line" value={C.line} />
            <Swatch name="ink" value={C.ink} />
            <Swatch name="ink2" value={C.ink2} />
          </div>
          <Eyebrow style={{ marginBottom: 10 }}>Semantic</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 14 }}>
            <Swatch name="accent" value={C.accent} />
            <Swatch name="accentLt" value={C.accentLt} />
            <Swatch name="amber" value={C.amber} />
            <Swatch name="amberLt" value={C.amberLt} />
            <Swatch name="green" value={C.green} />
            <Swatch name="greenLt" value={C.greenLt} />
            <Swatch name="blue" value={C.blue} />
            <Swatch name="discord" value={C.discord} />
          </div>
        </Card>

        {/* Type */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <CardHead title="Typography" subtitle="Fraunces for display · Inter for UI · JetBrains Mono for data." />
          <TypeRow label="Display" sample="A show worth pinning." cls="px-serif" style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05 }} />
          <TypeRow label="Headline" sample="Confirmed Shows" cls="px-serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em" }} />
          <TypeRow label="Section" sample="Upcoming this week" style={{ fontSize: 15, fontWeight: 600 }} />
          <TypeRow label="Body" sample="Artist booking requests — review and approve or decline." style={{ fontSize: 13 }} />
          <TypeRow label="Small" sample="Apr 22 · 23:00" style={{ fontSize: 11.5, color: C.ink3 }} />
          <TypeRow label="Eyebrow" sample="ROSTER" style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".09em", textTransform: "uppercase", color: C.ink3 }} />
          <TypeRow label="Mono" sample="847 392 017 483 620 352" cls="px-mono" style={{ fontSize: 12, color: C.ink2 }} />
        </Card>

        {/* Badges & Tags */}
        <Card>
          <CardHead title="Badges" subtitle="Status is color-coded with a leading dot." />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge status="confirmed" />
            <Badge status="pending" />
            <Badge status="approved" />
            <Badge status="declined" />
            <Badge status="cancelled" />
            <Badge status="archived" />
            <Badge status="hold" />
            <Badge status="logged" />
            <Badge status="needslog" />
          </div>
          <div style={{ height: 20 }} />
          <Eyebrow style={{ marginBottom: 10 }}>Tags</Eyebrow>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag>Darkwave</Tag><Tag>Techno</Tag><Tag>Experimental</Tag><Tag>21+</Tag><Tag>All Ages</Tag>
          </div>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHead title="Buttons" subtitle="Six variants, three sizes, icon-left supported." />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <Btn>Confirm show</Btn>
            <Btn variant="dark">Save draft</Btn>
            <Btn variant="outline" icon="plus">New show</Btn>
            <Btn variant="ghost">Cancel</Btn>
            <Btn variant="danger" icon="trash">Remove</Btn>
            <Btn variant="success" icon="check">Approve</Btn>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Btn size="sm">Small</Btn>
            <Btn>Medium</Btn>
            <Btn size="lg">Large</Btn>
            <IconBtn icon="edit" />
            <IconBtn icon="trash" />
            <IconBtn icon="copy" />
          </div>
        </Card>

        {/* Form */}
        <Card>
          <CardHead title="Form fields" subtitle="Warm cream well, one-line hints." />
          <Field label="Artist / act name"><Input value="Pharmakon" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Date"><Input value="2025-06-14" type="date" /></Field>
            <Field label="Age"><Select value="21+" options={["All Ages","18+","21+"]} /></Field>
          </div>
          <Field label="Notes" hint="Visible to staff only."><Textarea rows={2} value="Very loud — warn neighbours." /></Field>
        </Card>

        {/* Stat tiles */}
        <Card>
          <CardHead title="Stats" subtitle="Serif numeral, left rule in accent." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Stat label="Upcoming" value="6" sub="Next 30 days" accent={C.accent} />
            <Stat label="Pending" value="3" sub="Awaiting review" accent={C.amber} />
            <Stat label="Artists" value="42" sub="In roster" accent={C.blue} />
            <Stat label="Avg draw" value="84" sub="Last 6 shows" accent={C.green} />
          </div>
        </Card>

        {/* Icons */}
        <Card>
          <CardHead title="Icons" subtitle="Custom thin-stroke set, 20×20 canvas." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 10, rowGap: 16 }}>
            {["home","calendar","ticket","mail","users","log","cog","search","chev","plus","check","x","bell","pin","door","music","discord","edit","trash","ext","archive","filter","sparkle","compass","warn","copy","reset","play"].map(n => (
              <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, color: C.ink2 }}>
                <div style={{ width: 36, height: 36, borderRadius: R.sm, border: `1px solid ${C.line}`, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={n} size={16} />
                </div>
                <div className="px-mono" style={{ fontSize: 10, color: C.ink3 }}>{n}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Radii + shadows */}
        <Card>
          <CardHead title="Radii & elevation" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 22 }}>
            {[["xs",R.xs],["sm",R.sm],["md",R.md],["lg",R.lg],["xl",R.xl]].map(([n,v]) => (
              <div key={n} style={{ textAlign: "center" }}>
                <div style={{ height: 44, background: C.surface, border: `1px solid ${C.line}`, borderRadius: v, marginBottom: 6 }} />
                <div style={{ fontSize: 11, fontWeight: 600 }}>{n}</div>
                <div className="px-mono" style={{ fontSize: 10, color: C.ink3 }}>{v}px</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {Object.entries(S).map(([n, v]) => (
              <div key={n} style={{ textAlign: "center" }}>
                <div style={{ height: 44, background: C.surface, borderRadius: R.md, boxShadow: v, margin: 6 }} />
                <div style={{ fontSize: 11, fontWeight: 600 }}>shadow.{n}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Nav preview */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.line}` }}>
            <CardHead title="Navigation" subtitle="Sidebar with active rail accent." />
          </div>
          <div style={{ display: "flex", height: 320, background: C.bg }}>
            <Sidebar page="shows" onNav={() => {}} pendingCount={3} />
            <div style={{ flex: 1 }} />
          </div>
        </Card>

        {/* Log preview */}
        <Card>
          <CardHead title="Log rows" subtitle="Coloured dot = type. Monospaced time." />
          {window.PX_DATA.log.slice(0, 4).map(l => <LogRow key={l.id} {...l} />)}
        </Card>

        {/* Empty */}
        <Card>
          <CardHead title="Empty state" />
          <Empty icon="mail" title="No pending submissions" sub="You'll see new booking requests here the moment they arrive in #booking-requests." action={<Btn variant="outline" icon="ext">Open Discord</Btn>} />
        </Card>

      </div>

      {/* Principles */}
      <div style={{ marginTop: 30 }}>
        <DisplayH size={22} style={{ marginBottom: 14 }}>Principles</DisplayH>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            ["Paper over pixel", "The canvas is warm off-white, not cold grey. Surfaces are distinguished by a hairline, never a drop-shadow."],
            ["One voice of accent", "Crimson carries all primary actions and selection state. Amber, green and blue are reserved for status semantics only."],
            ["Small, honest data", "A venue with ~6 shows a month doesn't need dashboards. Numbers are shown once, in serif, without sparklines."],
          ].map(([t, s]) => (
            <Card key={t} style={{ padding: 18 }}>
              <SectionH>{t}</SectionH>
              <Muted style={{ marginTop: 8, lineHeight: 1.55 }}>{s}</Muted>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

window.SystemPage = SystemPage;
