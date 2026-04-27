---
Title: Evidence line references
Ticket: PYXIS-DISCORD-SHOW-MGMT
Status: active
Topics:
    - pyxis
    - discord-bot
    - show-management
    - goja
DocType: reference
Intent: short-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: "Generated source excerpts and line references for the Discord bot show-management design."
LastUpdated: 2026-04-26T23:58:00-04:00
WhatFor: "Use as evidence for the design guide."
WhenToUse: "When refreshing or reviewing source-backed claims in the ticket."
---

# Evidence line references

Generated: 2026-04-26T19:22:46-04:00

## Module paths
go.mod:module github.com/go-go-golems/pyxis
../corporate-headquarters/discord-bot/go.mod:module github.com/go-go-golems/discord-bot
../corporate-headquarters/go-go-goja/go.mod:module github.com/go-go-golems/go-go-goja

## Pyxis Cobra entrypoint

File: cmd/pyxis/main.go

### Lines 21,58
```text
    21	func run() error {
    22		rootCmd := &cobra.Command{
    23			Use:   "pyxis",
    24			Short: "Pyxis venue management backend",
    25			Long: `Pyxis is the backend for an independent music/arts venue.
    26	
    27	It serves both the public-facing show site and the staff management app
    28	from a single Go binary with PostgreSQL persistence.`,
    29			PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
    30				return logging.InitLoggerFromCobra(cmd)
    31			},
    32			SilenceUsage:  true,
    33			SilenceErrors: true,
    34		}
    35	
    36		if err := logging.AddLoggingSectionToRootCommand(rootCmd, "pyxis"); err != nil {
    37			return err
    38		}
    39	
    40		helpSystem := help.NewHelpSystem()
    41		help_cmd.SetupCobraRootCommand(helpSystem, rootCmd)
    42	
    43		commands, err := cmdtools.NewCommandGroup()
    44		if err != nil {
    45			return err
    46		}
    47	
    48		for _, cmd := range commands {
    49			cobraCmd, err := cli.BuildCobraCommandFromCommand(cmd)
    50			if err != nil {
    51				return err
    52			}
    53			rootCmd.AddCommand(cobraCmd)
    54		}
    55	
    56		ctx := context.Background()
    57		return rootCmd.ExecuteContext(ctx)
    58	}
```

## Pyxis serve command

File: cmd/pyxis/cmds/serve.go

### Lines 24,87
```text
    24	type ServeSettings struct {
    25		Bind  string `glazed:"bind"`
    26		DBURL string `glazed:"db-url"`
    27	}
    28	
    29	func NewServeCommand() (*ServeCommand, error) {
    30		glazedSection, err := settings.NewGlazedSchema()
    31		if err != nil {
    32			return nil, err
    33		}
    34	
    35		loggingSection, err := logging.NewLoggingSection()
    36		if err != nil {
    37			return nil, err
    38		}
    39	
    40		cmdDesc := cmds.NewCommandDescription(
    41			"serve",
    42			cmds.WithShort("Start the Pyxis HTTP server"),
    43			cmds.WithLong(`Start the HTTP server that serves the public API, staff API, and auth endpoints.`),
    44			cmds.WithFlags(
    45				fields.New(
    46					"bind",
    47					fields.TypeString,
    48					fields.WithDefault("0.0.0.0:8080"),
    49					fields.WithHelp("Address to bind the HTTP server"),
    50				),
    51				fields.New(
    52					"db-url",
    53					fields.TypeString,
    54					fields.WithDefault("postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable"),
    55					fields.WithHelp("PostgreSQL connection string"),
    56				),
    57			),
    58			cmds.WithSections(glazedSection, loggingSection),
    59		)
    60	
    61		return &ServeCommand{CommandDescription: cmdDesc}, nil
    62	}
    63	
    64	func (c *ServeCommand) RunIntoGlazeProcessor(
    65		ctx context.Context,
    66		vals *values.Values,
    67		gp middlewares.Processor,
    68	) error {
    69		s := &ServeSettings{}
    70		if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
    71			return err
    72		}
    73	
    74		database, err := db.Connect(ctx, s.DBURL)
    75		if err != nil {
    76			return fmt.Errorf("connect to database: %w", err)
    77		}
    78		defer database.Close()
    79	
    80		cfg := config.DefaultConfig()
    81		cfg.Bind = s.Bind
    82		cfg.DBURL = s.DBURL
    83	
    84		srv := server.New(cfg, database)
    85		log.Info().Str("bind", s.Bind).Msg("starting pyxis server")
    86		return srv.Start(ctx, s.Bind)
    87	}
```

## Pyxis server wiring

File: pkg/server/server.go

### Lines 18,31
```text
    18	// Server holds the HTTP handler and dependencies.
    19	type Server struct {
    20		cfg               *config.Config
    21		handler           http.Handler
    22		showService       *service.ShowService
    23		submissionService *service.SubmissionService
    24		artistService     *service.ArtistService
    25		calendarService   *service.CalendarService
    26		attendanceService *service.AttendanceService
    27		settingsService   *service.SettingsService
    28		auditService      service.AuditService
    29		authService       *service.AuthService
    30		flyerStore        storage.FlyerStore
    31	}
```

### Lines 33,68
```text
    33	// New creates a new Server with routes wired.
    34	func New(cfg *config.Config, database *db.Pool) *Server {
    35		s := &Server{cfg: cfg}
    36	
    37		// Repository layer
    38		queries := db.New(database.Pool)
    39		showRepo := postgres.NewShowRepo(queries)
    40		submissionRepo := postgres.NewSubmissionRepo(queries)
    41		artistRepo := postgres.NewArtistRepo(queries)
    42		auditRepo := postgres.NewAuditRepo(queries)
    43		calendarRepo := postgres.NewCalendarRepo(queries)
    44		attendanceRepo := postgres.NewAttendanceRepo(queries)
    45		settingsRepo := postgres.NewSettingsRepo(queries)
    46	
    47		// Storage layer
    48		s.flyerStore = storage.NewLocalFlyerStore("./data/flyers", "/flyers")
    49	
    50		// Service layer
    51		discordClient := discord.Client(&discord.NoOpClient{})
    52		s.auditService = service.NewAuditService(auditRepo)
    53		s.showService = service.NewShowService(showRepo, s.auditService, discordClient)
    54		s.artistService = service.NewArtistService(artistRepo)
    55		s.calendarService = service.NewCalendarService(calendarRepo)
    56		s.attendanceService = service.NewAttendanceService(attendanceRepo)
    57		s.settingsService = service.NewSettingsService(settingsRepo)
    58		s.submissionService = service.NewSubmissionService(
    59			submissionRepo, showRepo, artistRepo, s.auditService, database.Pool,
    60		)
    61	
    62		// Auth service (uses placeholder config; override in production)
    63		s.authService = service.NewAuthService(queries, service.DiscordOAuthConfig{
    64			ClientID:     cfg.DiscordClientID,
    65			ClientSecret: cfg.DiscordClientSecret,
    66			RedirectURL:  cfg.DiscordRedirectURL,
    67		})
    68	
```

### Lines 92,99
```text
    92		// Staff show endpoints
    93		mux.Handle("GET /api/app/shows", s.requireAuth(s.requireRole("admin", "booker", "door")(http.HandlerFunc(s.handleListAppShows))))
    94		mux.Handle("POST /api/app/shows", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleCreateShow))))
    95		mux.Handle("PATCH /api/app/shows/{id}", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleUpdateShow))))
    96		mux.Handle("PATCH /api/app/shows/{id}/cancel", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleCancelShow))))
    97		mux.Handle("PATCH /api/app/shows/{id}/archive", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleArchiveShow))))
    98		mux.Handle("POST /api/app/shows/{id}/announce", s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(s.handleAnnounceShow))))
    99	
```

### Lines 147,165
```text
   147	// Start runs the HTTP server.
   148	func (s *Server) Start(ctx context.Context, bind string) error {
   149		log.Info().Str("bind", bind).Msg("starting HTTP server")
   150		srv := &http.Server{
   151			Addr:    bind,
   152			Handler: s.handler,
   153		}
   154	
   155		go func() {
   156			<-ctx.Done()
   157			log.Info().Msg("shutting down HTTP server")
   158			_ = srv.Shutdown(context.Background())
   159		}()
   160	
   161		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
   162			return fmt.Errorf("server error: %w", err)
   163		}
   164		return nil
   165	}
```

## Pyxis show service

File: pkg/service/show_service.go

### Lines 12,25
```text
    12	// ShowService provides business logic for shows.
    13	type ShowService struct {
    14		shows   repository.ShowRepository
    15		audit   AuditService
    16		discord discord.Client
    17	}
    18	
    19	// NewShowService creates a new ShowService.
    20	func NewShowService(shows repository.ShowRepository, audit AuditService, discordClient discord.Client) *ShowService {
    21		if discordClient == nil {
    22			discordClient = &discord.NoOpClient{}
    23		}
    24		return &ShowService{shows: shows, audit: audit, discord: discordClient}
    25	}
```

### Lines 42,59
```text
    42	// Create creates a new show and logs the action.
    43	func (s *ShowService) Create(ctx context.Context, show *domain.Show, actorID int, actorName string) (*domain.Show, error) {
    44		if show.Status == "" {
    45			show.Status = "draft"
    46		}
    47		created, err := s.shows.Create(ctx, show)
    48		if err != nil {
    49			return nil, err
    50		}
    51	
    52		_ = s.audit.Log(ctx, actorID, actorName, "show.create", "show", &created.ID, map[string]interface{}{
    53			"artist": show.Artist,
    54			"date":   show.Date.Format("2006-01-02"),
    55			"status": show.Status,
    56		})
    57	
    58		return created, nil
    59	}
```

### Lines 77,113
```text
    77	// Cancel marks a show as cancelled and logs the action.
    78	func (s *ShowService) Cancel(ctx context.Context, id int, actorID int, actorName string) (*domain.Show, error) {
    79		show, err := s.shows.GetByID(ctx, id)
    80		if err != nil {
    81			return nil, err
    82		}
    83	
    84		show.Status = "cancelled"
    85		updated, err := s.shows.Update(ctx, show)
    86		if err != nil {
    87			return nil, err
    88		}
    89	
    90		_ = s.audit.Log(ctx, actorID, actorName, "show.cancel", "show", &id, map[string]interface{}{
    91			"artist": show.Artist,
    92		})
    93	
    94		return updated, nil
    95	}
    96	
    97	// Announce posts a show announcement to Discord.
    98	func (s *ShowService) Announce(ctx context.Context, id int, actorID int, actorName string) error {
    99		show, err := s.shows.GetByID(ctx, id)
   100		if err != nil {
   101			return err
   102		}
   103	
   104		if err := s.discord.AnnounceShow(ctx, id, show.Artist, show.Date.Format("2006-01-02")); err != nil {
   105			return fmt.Errorf("discord announce: %w", err)
   106		}
   107	
   108		_ = s.audit.Log(ctx, actorID, actorName, "show.announce", "show", &id, map[string]interface{}{
   109			"artist": show.Artist,
   110		})
   111	
   112		return nil
   113	}
```

### Lines 115,131
```text
   115	// Archive marks a show as archived and logs the action.
   116	func (s *ShowService) Archive(ctx context.Context, id int, actorID int, actorName string) error {
   117		show, err := s.shows.GetByID(ctx, id)
   118		if err != nil {
   119			return err
   120		}
   121	
   122		if err := s.shows.Archive(ctx, id); err != nil {
   123			return err
   124		}
   125	
   126		_ = s.audit.Log(ctx, actorID, actorName, "show.archive", "show", &id, map[string]interface{}{
   127			"artist": show.Artist,
   128		})
   129	
   130		return nil
   131	}
```

## Pyxis Discord client placeholder

File: pkg/discord/client.go

### Lines 1,31
```text
     1	package discord
     2	
     3	import "context"
     4	
     5	// Client is the interface for Discord interactions.
     6	// A NoOpClient is used until the real bot is implemented.
     7	type Client interface {
     8		AnnounceShow(ctx context.Context, showID int, artist string, date string) error
     9		UnpinAndNotifyCancellation(ctx context.Context, showID int, artist string) error
    10		NotifyArtist(ctx context.Context, discordID string, message string) error
    11		PostToChannel(ctx context.Context, channelID string, content string) error
    12	}
    13	
    14	// NoOpClient satisfies the Client interface without doing anything.
    15	type NoOpClient struct{}
    16	
    17	func (n *NoOpClient) AnnounceShow(ctx context.Context, showID int, artist string, date string) error {
    18		return nil
    19	}
    20	
    21	func (n *NoOpClient) UnpinAndNotifyCancellation(ctx context.Context, showID int, artist string) error {
    22		return nil
    23	}
    24	
    25	func (n *NoOpClient) NotifyArtist(ctx context.Context, discordID string, message string) error {
    26		return nil
    27	}
    28	
    29	func (n *NoOpClient) PostToChannel(ctx context.Context, channelID string, content string) error {
    30		return nil
    31	}
```

## Pyxis show schema

File: pkg/db/migrations/000001_init.up.sql

### Lines 39,59
```text
    39	CREATE TABLE shows (
    40	    id                 SERIAL PRIMARY KEY,
    41	    artist             TEXT NOT NULL,
    42	    date               DATE NOT NULL,
    43	    doors_time         TEXT,
    44	    start_time         TEXT,
    45	    age                TEXT,
    46	    price              TEXT,
    47	    genre              TEXT,
    48	    description        TEXT,
    49	    notes              TEXT,
    50	    status             TEXT NOT NULL DEFAULT 'confirmed',
    51	    flyer_url          TEXT,
    52	    discord_message_id TEXT,
    53	    discord_channel_id TEXT,
    54	    submission_id      INT REFERENCES submissions(id) ON DELETE SET NULL,
    55	    artist_id          INT REFERENCES artists(id) ON DELETE SET NULL,
    56	    created_by         INT REFERENCES users(id) ON DELETE SET NULL,
    57	    created_at         TIMESTAMPTZ DEFAULT NOW(),
    58	    updated_at         TIMESTAMPTZ DEFAULT NOW()
    59	);
```

### Lines 115,132
```text
   115	CREATE TABLE settings (
   116	    id                       INT PRIMARY KEY DEFAULT 1,
   117	    space_name               TEXT NOT NULL DEFAULT 'Pyxis',
   118	    tagline                  TEXT,
   119	    address                  TEXT,
   120	    capacity                 INT,
   121	    contact_email            TEXT,
   122	    website                  TEXT,
   123	    discord_guild_id         TEXT,
   124	    discord_ch_upcoming      TEXT,
   125	    discord_ch_announcements TEXT,
   126	    discord_ch_staff         TEXT,
   127	    discord_ch_bookings      TEXT,
   128	    setup_complete           BOOLEAN DEFAULT FALSE,
   129	    updated_at               TIMESTAMPTZ DEFAULT NOW(),
   130	    CONSTRAINT single_row CHECK (id = 1)
   131	);
   132	INSERT INTO settings DEFAULT VALUES;
```

## Pyxis settings fields

File: pkg/domain/settings.go

### Lines 5,25
```text
     5	// Settings is the single-row space configuration.
     6	type Settings struct {
     7		ID                     int
     8		SpaceName              string
     9		Tagline                string
    10		Address                string
    11		Capacity               *int
    12		Timezone               string
    13		ContactEmail           string
    14		BookingEmail           string
    15		Website                string
    16		AutoArchive            bool
    17		DiscordPosting         bool
    18		SafeSpaceRequired      bool
    19		DiscordGuildID         string
    20		DiscordChUpcoming      string
    21		DiscordChAnnouncements string
    22		DiscordChStaff         string
    23		DiscordChBookings      string
    24		SetupComplete          bool
    25		UpdatedAt              time.Time
```

## Pyxis proto show/settings

File: proto/pyxis/v1/show.proto

### Lines 26,68
```text
    26	message Show {
    27	  int32  id            = 1;
    28	  string artist        = 2;
    29	  string date          = 3;
    30	  string doors_time    = 4;
    31	  string start_time    = 5;
    32	  string age           = 6;
    33	  string price         = 7;
    34	  string genre         = 8;
    35	  string description   = 9;
    36	  string notes         = 17;
    37	  repeated LineupEntry lineup = 10;
    38	  string flyer_url     = 11;
    39	  int32  draw          = 18;
    40	  int32  capacity      = 19;
    41	  ShowStatus status    = 12;
    42	  int32  submission_id = 13;
    43	  int32  artist_id     = 14;
    44	  string created_at    = 15;
    45	  string updated_at    = 16;
    46	
    47	  message LineupEntry {
    48	    string artist     = 1;
    49	    string role       = 2;
    50	    string start_time = 3;
    51	    string end_time   = 4;
    52	  }
    53	}
    54	
    55	message AppShow {
    56	  int32  id       = 1;
    57	  string artist   = 2;
    58	  string date     = 3;
    59	  string doors    = 4;
    60	  string age      = 5;
    61	  string price    = 6;
    62	  ShowStatus status = 7;
    63	  string genre    = 8;
    64	  int32  draw     = 9;
    65	  int32  capacity = 10;
    66	  bool   pinned   = 11;
    67	  string notes    = 12;
    68	}
```

### Lines 209,233
```text
   209	message Settings {
   210	  int32  id                       = 1;
   211	  string space_name               = 2;
   212	  string tagline                  = 3;
   213	  string address                  = 4;
   214	  int32  capacity                 = 5;
   215	  string contact_email            = 6;
   216	  string website                  = 7;
   217	  string discord_guild_id         = 8;
   218	  string discord_ch_upcoming      = 9;
   219	  string discord_ch_announcements = 10;
   220	  string discord_ch_staff         = 11;
   221	  string discord_ch_bookings      = 12;
   222	  bool   setup_complete           = 13;
   223	  string updated_at               = 14;
   224	  string timezone                 = 15;
   225	  string booking_email            = 16;
   226	  bool   auto_archive             = 17;
   227	  bool   discord_posting          = 18;
   228	  bool   safe_space_required      = 19;
   229	}
   230	
   231	message SuccessResponse {
   232	  bool success = 1;
   233	}
```

## Pyxis frontend announce integration

File: web/packages/pyxis-app/src/pages/Pages.tsx

### Lines 174,245
```text
   174	export function ShowDetailPage() {
   175	  const id = parseRouteId(useParams().id);
   176	  const { data: show, isLoading, isError } = useGetShowQuery(id ?? 0, { skip: id === undefined });
   177	  const [cancelShow, cancelState] = useCancelShowMutation();
   178	  const [archiveShow, archiveState] = useArchiveShowMutation();
   179	  const [announceShow, announceState] = useAnnounceShowMutation();
   180	  const [actionError, setActionError] = useState<string | undefined>();
   181	  const [actionSuccess, setActionSuccess] = useState<string | undefined>();
   182	
   183	  const handleCancelShow = async () => {
   184	    if (!id) return;
   185	    setActionError(undefined);
   186	    setActionSuccess(undefined);
   187	    try {
   188	      await cancelShow(id).unwrap();
   189	      setActionSuccess('Show cancelled.');
   190	    } catch {
   191	      setActionError('Could not cancel this show. Check your session and backend logs.');
   192	    }
   193	  };
   194	
   195	  const handleArchiveShow = async () => {
   196	    if (!id) return;
   197	    setActionError(undefined);
   198	    setActionSuccess(undefined);
   199	    try {
   200	      await archiveShow(id).unwrap();
   201	      setActionSuccess('Show archived.');
   202	    } catch {
   203	      setActionError('Could not archive this show. Check your session and backend logs.');
   204	    }
   205	  };
   206	
   207	  const handleAnnounceShow = async () => {
   208	    if (!id) return;
   209	    setActionError(undefined);
   210	    setActionSuccess(undefined);
   211	    try {
   212	      await announceShow(id).unwrap();
   213	      setActionSuccess('Announcement requested.');
   214	    } catch {
   215	      setActionError('Could not announce this show. Check your session and backend logs.');
   216	    }
   217	  };
   218	
   219	  return (
   220	    <AppShell
   221	      page="show-detail"
   222	      title={show?.artist ?? 'Show detail'}
   223	      eyebrow="Shows / Detail"
   224	      action={<Button size="sm" iconLeft="edit" disabled={!show}>Edit</Button>}
   225	    >
   226	      {id === undefined ? (
   227	        <ErrorState label="Invalid show id in the route." />
   228	      ) : isLoading ? (
   229	        <LoadingState label="Loading show detail from the backend…" />
   230	      ) : isError || !show ? (
   231	        <ErrorState label="Show not found or unavailable." />
   232	      ) : (
   233	        <>
   234	          <ShowDetailHero show={appShowFromShow(show)} />
   235	          <div className="app-detail-grid">
   236	            <ShowDetailInfoPanel show={appShowFromShow(show)} />
   237	            <ShowDetailDiscordPanel />
   238	          </div>
   239	          {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
   240	          {actionSuccess && <div className="app-action-success" role="status">{actionSuccess}</div>}
   241	          <div className="app-detail-actions">
   242	            <Button variant="outline">Duplicate</Button>
   243	            <Button variant="outline" iconLeft="archive" onClick={handleArchiveShow} disabled={archiveState.isLoading}>Archive</Button>
   244	            <Button variant="outline" iconLeft="external" onClick={handleAnnounceShow} disabled={announceState.isLoading}>Announce</Button>
   245	            <Button variant="danger" iconLeft="trash" onClick={handleCancelShow} disabled={cancelState.isLoading}>Cancel show</Button>
```

### Lines 497,504
```text
   497	export function DiscordPage() {
   498	  return (
   499	    <AppShell page="discord" title="Discord" eyebrow="Home / Discord">
   500	      <Panel title="Channel mapping" section="discord-channel-mapping">
   501	        <DiscordMappingPanel mappings={seedMappings} />
   502	      </Panel>
   503	    </AppShell>
   504	  );
```

### Lines 507,535
```text
   507	export function SettingsPage() {
   508	  const { data: settings, isLoading, isError } = useGetSettingsQuery();
   509	  const [updateSettings, updateState] = useUpdateSettingsMutation();
   510	  const [actionError, setActionError] = useState<string | undefined>();
   511	  const [actionSuccess, setActionSuccess] = useState<string | undefined>();
   512	
   513	  const toggleSetting = async (key: 'autoArchive' | 'discordPosting' | 'safeSpaceRequired') => {
   514	    if (!settings) return;
   515	    setActionError(undefined);
   516	    setActionSuccess(undefined);
   517	    try {
   518	      await updateSettings({ ...settings, [key]: !settings[key] }).unwrap();
   519	      setActionSuccess('Settings updated.');
   520	    } catch {
   521	      setActionError('Could not update settings. Check your session and backend logs.');
   522	    }
   523	  };
   524	
   525	  return (
   526	    <AppShell page="settings" title="Settings" eyebrow="Home / Settings">
   527	      {isLoading ? (
   528	        <LoadingState />
   529	      ) : isError || !settings ? (
   530	        <ErrorState />
   531	      ) : (
   532	        <><ActionMessages error={actionError} success={actionSuccess} /><Panel title="Space info" section="settings-space-info"><SettingsPanel settings={settings} isUpdating={updateState.isLoading} onToggleAutoArchive={() => toggleSetting('autoArchive')} onToggleDiscordPosting={() => toggleSetting('discordPosting')} onToggleSafeSpaceRequired={() => toggleSetting('safeSpaceRequired')} /></Panel></>
   533	      )}
   534	    </AppShell>
   535	  );
```

## Discord framework embedding API

File: ../corporate-headquarters/discord-bot/pkg/framework/framework.go

### Lines 1,14
```text
     1	// Package framework provides a simple embedding API for running a single Discord bot
     2	// with a JavaScript authoring runtime inside any Go application.
     3	//
     4	// The main entrypoint is New(), which accepts functional options:
     5	//
     6	//	bot, err := framework.New(
     7	//	    framework.WithCredentialsFromEnv(),
     8	//	    framework.WithScript("./my-bot/index.js"),
     9	//	    framework.WithSyncOnStart(true),
    10	//	)
    11	//	bot.Run(ctx)
    12	//
    13	// For custom native modules, use WithRuntimeModuleRegistrars.
    14	package framework
```

### Lines 28,48
```text
    28	// Credentials holds the explicit Discord settings needed to run one bot.
    29	type Credentials struct {
    30		BotToken      string
    31		ApplicationID string
    32		GuildID       string
    33		PublicKey     string
    34		ClientID      string
    35		ClientSecret  string
    36	}
    37	
    38	// Option configures the public single-bot framework constructor.
    39	type Option func(*Config) error
    40	
    41	// Config describes the simple single-bot embedding path.
    42	type Config struct {
    43		Credentials             Credentials
    44		ScriptPath              string
    45		RuntimeConfig           map[string]any
    46		SyncOnStart             bool
    47		RuntimeModuleRegistrars []engine.RuntimeModuleRegistrar
    48	}
```

### Lines 56,97
```text
    56	// New creates one explicit bot instance without any repository scanning.
    57	func New(opts ...Option) (*Bot, error) {
    58		cfg := Config{
    59			RuntimeConfig: map[string]any{},
    60		}
    61		for _, opt := range opts {
    62			if opt == nil {
    63				continue
    64			}
    65			if err := opt(&cfg); err != nil {
    66				return nil, err
    67			}
    68		}
    69		cfg.ScriptPath = strings.TrimSpace(cfg.ScriptPath)
    70		if cfg.ScriptPath == "" {
    71			return nil, fmt.Errorf("framework script path is required; use framework.WithScript(...) or pass --bot-script to the standalone CLI")
    72		}
    73	
    74		settings := appconfig.Settings{
    75			BotToken:      strings.TrimSpace(cfg.Credentials.BotToken),
    76			ApplicationID: strings.TrimSpace(cfg.Credentials.ApplicationID),
    77			GuildID:       strings.TrimSpace(cfg.Credentials.GuildID),
    78			PublicKey:     strings.TrimSpace(cfg.Credentials.PublicKey),
    79			ClientID:      strings.TrimSpace(cfg.Credentials.ClientID),
    80			ClientSecret:  strings.TrimSpace(cfg.Credentials.ClientSecret),
    81			BotScript:     cfg.ScriptPath,
    82		}
    83		if err := settings.Validate(); err != nil {
    84			return nil, err
    85		}
    86	
    87		hostOpts := []jsdiscord.HostOption{}
    88		if len(cfg.RuntimeModuleRegistrars) > 0 {
    89			hostOpts = append(hostOpts, jsdiscord.WithRuntimeModuleRegistrars(cfg.RuntimeModuleRegistrars...))
    90		}
    91	
    92		inner, err := appbot.NewWithScript(settings, cfg.ScriptPath, cloneMap(cfg.RuntimeConfig), hostOpts...)
    93		if err != nil {
    94			return nil, err
    95		}
    96		return &Bot{cfg: cfg, inner: inner}, nil
    97	}
```

### Lines 115,147
```text
   115	// WithCredentialsFromEnv loads Discord credentials from the same env vars as the CLI.
   116	func WithCredentialsFromEnv() Option {
   117		return func(cfg *Config) error {
   118			cfg.Credentials = Credentials{
   119				BotToken:      os.Getenv("DISCORD_BOT_TOKEN"),
   120				ApplicationID: os.Getenv("DISCORD_APPLICATION_ID"),
   121				GuildID:       os.Getenv("DISCORD_GUILD_ID"),
   122				PublicKey:     os.Getenv("DISCORD_PUBLIC_KEY"),
   123				ClientID:      os.Getenv("DISCORD_CLIENT_ID"),
   124				ClientSecret:  os.Getenv("DISCORD_CLIENT_SECRET"),
   125			}
   126			return nil
   127		}
   128	}
   129	
   130	// WithRuntimeConfig injects arbitrary runtime config values into ctx.config.
   131	func WithRuntimeConfig(runtimeConfig map[string]any) Option {
   132		return func(cfg *Config) error {
   133			cfg.RuntimeConfig = cloneMap(runtimeConfig)
   134			return nil
   135		}
   136	}
   137	
   138	// WithSyncOnStart enables a command sync before opening the gateway session.
   139	func WithSyncOnStart(enabled bool) Option {
   140		return func(cfg *Config) error {
   141			cfg.SyncOnStart = enabled
   142			return nil
   143		}
   144	}
   145	
   146	// WithRuntimeModuleRegistrars appends custom per-runtime native module registrars.
   147	func WithRuntimeModuleRegistrars(registrars ...engine.RuntimeModuleRegistrar) Option {
```

### Lines 159,189
```text
   159	// Open optionally syncs commands, then opens the Discord gateway session.
   160	func (b *Bot) Open() error {
   161		if b == nil || b.inner == nil {
   162			return fmt.Errorf("framework bot is not initialized")
   163		}
   164		if b.cfg.SyncOnStart {
   165			if _, err := b.inner.SyncCommands(); err != nil {
   166				return err
   167			}
   168		}
   169		return b.inner.Open()
   170	}
   171	
   172	// SyncCommands manually syncs the bot's application commands.
   173	func (b *Bot) SyncCommands() error {
   174		if b == nil || b.inner == nil {
   175			return fmt.Errorf("framework bot is not initialized")
   176		}
   177		_, err := b.inner.SyncCommands()
   178		return err
   179	}
   180	
   181	// Run opens the session and blocks until the context is canceled.
   182	func (b *Bot) Run(ctx context.Context) error {
   183		if err := b.Open(); err != nil {
   184			return err
   185		}
   186		defer func() { _ = b.Close() }()
   187		<-ctx.Done()
   188		return nil
   189	}
```

## Discord botcli embedding API

File: ../corporate-headquarters/discord-bot/pkg/botcli/doc.go

### Lines 1,21
```text
     1	// Package botcli exposes the optional repo-driven Discord bot command layer.
     2	//
     3	// Use this package when a downstream Cobra application should discover named
     4	// bot scripts from one or more repositories and mount a `bots` subtree that
     5	// supports inventory, inspection, ordinary jsverbs, and host-managed bot runs.
     6	//
     7	// The public entrypoints are:
     8	//   - BuildBootstrap(...) to resolve repositories from raw argv / env / defaults
     9	//   - NewBotsCommand(...) to mount the repo-driven `bots` command tree
    10	//
    11	// Runtime customization has a deliberate "smallest hook first" shape:
    12	//   - Use WithAppName(...) when only the dynamic env prefix should change.
    13	//   - Use WithRuntimeModuleRegistrars(...) when bot scripts or ordinary jsverbs
    14	//     just need extra Go-native require() modules such as `require("app")`.
    15	//   - Use WithRuntimeFactory(...) only when ordinary jsverb runtime creation
    16	//     itself must change, for example custom module roots, require behavior,
    17	//     builder configuration, or a custom engine/runtime lifecycle.
    18	//
    19	// If the custom runtime behavior must also affect discovery and host-managed bot
    20	// runs, implement HostOptionsProvider on the runtime factory so the same choice
    21	// contributes jsdiscord host options as well.
```

## Discord runtime customization hooks

File: ../corporate-headquarters/discord-bot/pkg/botcli/options.go

### Lines 13,36
```text
    13	// RuntimeFactory customizes runtime creation for ordinary jsverb execution.
    14	//
    15	// Implement this only when the default runtime construction is not sufficient.
    16	// If you only need extra native require() modules, prefer
    17	// WithRuntimeModuleRegistrars(...).
    18	type RuntimeFactory interface {
    19		NewRuntimeForVerb(ctx context.Context, registry *jsverbs.Registry, verb *jsverbs.VerbSpec) (*engine.Runtime, error)
    20	}
    21	
    22	// RuntimeFactoryFunc adapts a function into RuntimeFactory.
    23	type RuntimeFactoryFunc func(ctx context.Context, registry *jsverbs.Registry, verb *jsverbs.VerbSpec) (*engine.Runtime, error)
    24	
    25	func (f RuntimeFactoryFunc) NewRuntimeForVerb(ctx context.Context, registry *jsverbs.Registry, verb *jsverbs.VerbSpec) (*engine.Runtime, error) {
    26		return f(ctx, registry, verb)
    27	}
    28	
    29	// HostOptionsProvider lets a RuntimeFactory also contribute jsdiscord host
    30	// options used for discovery and host-managed bot runs.
    31	//
    32	// Implement this when runtime customization must stay consistent across all
    33	// runtime touchpoints, not only ordinary jsverb execution.
    34	type HostOptionsProvider interface {
    35		HostOptions() []jsdiscord.HostOption
    36	}
```

### Lines 75,121
```text
    75	// WithRuntimeModuleRegistrars appends custom runtime-scoped native module registrars.
    76	//
    77	// This is the first hook to reach for when scripts just need extra Go-native
    78	// require() modules and the default runtime construction is otherwise correct.
    79	// Prefer this over WithRuntimeFactory(...) unless runtime creation itself must
    80	// change.
    81	func WithRuntimeModuleRegistrars(registrars ...engine.RuntimeModuleRegistrar) CommandOption {
    82		return func(cfg *commandOptions) error {
    83			for i, registrar := range registrars {
    84				if registrar == nil {
    85					return fmt.Errorf("runtime module registrar at index %d is nil", i)
    86				}
    87			}
    88			cfg.runtimeModuleRegistrars = append(cfg.runtimeModuleRegistrars, registrars...)
    89			return nil
    90		}
    91	}
    92	
    93	// WithRuntimeFactory overrides ordinary jsverbs runtime creation.
    94	//
    95	// Use this only when WithRuntimeModuleRegistrars(...) is not enough and the
    96	// runtime creation process itself must change, for example custom module roots,
    97	// require behavior, builder configuration, or runtime lifecycle details.
    98	//
    99	// If the same customization should also affect discovery and host-managed bot
   100	// runs, implement HostOptionsProvider on the factory so it can contribute the
   101	// matching jsdiscord host options as well.
   102	func WithRuntimeFactory(factory RuntimeFactory) CommandOption {
   103		return func(cfg *commandOptions) error {
   104			if factory == nil {
   105				return fmt.Errorf("runtime factory is nil")
   106			}
   107			cfg.runtimeFactory = factory
   108			return nil
   109		}
   110	}
   111	
   112	func (cfg commandOptions) hostOptions() []jsdiscord.HostOption {
   113		ret := []jsdiscord.HostOption{}
   114		if len(cfg.runtimeModuleRegistrars) > 0 {
   115			ret = append(ret, jsdiscord.WithRuntimeModuleRegistrars(cfg.runtimeModuleRegistrars...))
   116		}
   117		if provider, ok := cfg.runtimeFactory.(HostOptionsProvider); ok {
   118			ret = append(ret, provider.HostOptions()...)
   119		}
   120		return ret
   121	}
```

## Goja host loads bot script

File: ../corporate-headquarters/discord-bot/internal/jsdiscord/host.go

### Lines 21,59
```text
    21	func NewHost(ctx context.Context, scriptPath string, opts ...HostOption) (*Host, error) {
    22		if strings.TrimSpace(scriptPath) == "" {
    23			return nil, fmt.Errorf("discord bot script path is empty")
    24		}
    25		absScript, err := filepath.Abs(scriptPath)
    26		if err != nil {
    27			return nil, fmt.Errorf("resolve script path: %w", err)
    28		}
    29		hostOpts, err := applyHostOptions(opts...)
    30		if err != nil {
    31			return nil, err
    32		}
    33		runtimeRegistrars := []engine.RuntimeModuleRegistrar{NewRegistrar(Config{}), &UIRegistrar{}}
    34		runtimeRegistrars = append(runtimeRegistrars, hostOpts.runtimeModuleRegistrars...)
    35		factory, err := engine.NewBuilder(
    36			engine.WithModuleRootsFromScript(absScript, engine.DefaultModuleRootsOptions()),
    37		).WithModules(engine.DefaultRegistryModules()).
    38			WithRuntimeModuleRegistrars(runtimeRegistrars...).
    39			WithRequireOptions(require.WithGlobalFolders(filepath.Dir(absScript), filepath.Join(filepath.Dir(absScript), "node_modules"))).
    40			Build()
    41		if err != nil {
    42			return nil, fmt.Errorf("build js runtime: %w", err)
    43		}
    44		rt, err := factory.NewRuntime(ctx)
    45		if err != nil {
    46			return nil, fmt.Errorf("create js runtime: %w", err)
    47		}
    48		value, err := rt.Require.Require(absScript)
    49		if err != nil {
    50			_ = rt.Close(context.Background())
    51			return nil, fmt.Errorf("load js bot script: %w", err)
    52		}
    53		handle, err := CompileBot(rt.VM, value)
    54		if err != nil {
    55			_ = rt.Close(context.Background())
    56			return nil, fmt.Errorf("compile js bot: %w", err)
    57		}
    58		return &Host{scriptPath: absScript, runtime: rt, handle: handle, runtimeConfig: map[string]any{}}, nil
    59	}
```

### Lines 75,100
```text
    75	func (h *Host) Describe(ctx context.Context) (map[string]any, error) {
    76		if h == nil || h.handle == nil {
    77			return nil, fmt.Errorf("discord js host is nil")
    78		}
    79		return h.handle.Describe(ctx)
    80	}
    81	
    82	func (h *Host) ApplicationCommands(ctx context.Context) ([]*discordgo.ApplicationCommand, error) {
    83		desc, err := h.Describe(ctx)
    84		if err != nil {
    85			return nil, err
    86		}
    87		rawCommands := commandSnapshots(desc["commands"])
    88		commands := make([]*discordgo.ApplicationCommand, 0, len(rawCommands))
    89		for _, raw := range rawCommands {
    90			snapshot, ok := raw.(map[string]any)
    91			if !ok {
    92				continue
    93			}
    94			command, err := applicationCommandFromSnapshot(snapshot)
    95			if err != nil {
    96				return nil, err
    97			}
    98			commands = append(commands, command)
    99		}
   100		return commands, nil
```

## Show-space runtime config and commands

File: ../corporate-headquarters/discord-bot/examples/discord-bots/show-space/index.js

### Lines 270,349
```text
   270	function hasDatabase(ctx) {
   271	  return store.ensure(ctx.config)
   272	}
   273	
   274	function repoListUpcoming(ctx, limit) {
   275	  if (hasDatabase(ctx)) {
   276	    return store.listUpcoming(ctx.config, limit)
   277	  }
   278	  return catalog.listUpcoming(limit)
   279	}
   280	
   281	function repoListPast(ctx, limit) {
   282	  if (hasDatabase(ctx)) {
   283	    return store.listPast(ctx.config, limit)
   284	  }
   285	  return catalog.listPast(limit)
   286	}
   287	
   288	function repoGetShow(ctx, id) {
   289	  if (hasDatabase(ctx)) {
   290	    return store.getShow(ctx.config, id)
   291	  }
   292	  return catalog.getShow(id)
   293	}
   294	
   295	function repoCreateShow(ctx, rawShow) {
   296	  if (hasDatabase(ctx)) {
   297	    return store.createShow(ctx.config, rawShow)
   298	  }
   299	  return catalog.addShow(rawShow)
   300	}
   301	
   302	function repoAttachDiscordMessage(ctx, id, channelId, messageId) {
   303	  if (hasDatabase(ctx)) {
   304	    return store.attachDiscordMessage(ctx.config, id, channelId, messageId)
   305	  }
   306	  return catalog.attachDiscordMessage(id, channelId, messageId)
   307	}
   308	
   309	function repoCancelShow(ctx, id) {
   310	  if (hasDatabase(ctx)) {
   311	    return store.cancelShow(ctx.config, id)
   312	  }
   313	  return catalog.cancelShow(id)
   314	}
   315	
   316	function repoArchiveShow(ctx, id) {
   317	  if (hasDatabase(ctx)) {
   318	    return store.archiveShow(ctx.config, id)
   319	  }
   320	  return catalog.archiveShow(id)
   321	}
   322	
   323	function repoArchiveByDiscordMessage(ctx, channelId, messageId) {
   324	  if (hasDatabase(ctx)) {
   325	    return store.archiveByDiscordMessage(ctx.config, channelId, messageId)
   326	  }
   327	  return catalog.archiveByDiscordMessage(channelId, messageId)
   328	}
   329	
   330	function repoArchiveExpiredShows(ctx, referenceDate) {
   331	  if (hasDatabase(ctx)) {
   332	    return store.archiveExpiredShows(ctx.config, referenceDate)
   333	  }
   334	  return catalog.markExpiredArchived(referenceDate)
   335	}
   336	
   337	function buildAnnouncementInput(ctx, args) {
   338	  return normalizeShow({
   339	    artist: args.artist,
   340	    date: args.date,
   341	    doors_time: args.doors_time,
   342	    age_restriction: args.age_restriction || args.age,
   343	    price: args.price,
   344	    notes: args.notes,
   345	    source: "announcement",
   346	  }, {
   347	    timeZone: configValue(ctx, "timeZone"),
   348	    referenceDate: new Date(),
   349	  })
```

### Lines 383,408
```text
   383	async function postAnnouncement(ctx, rawShow) {
   384	  const channelId = configChannelId(ctx, "upcomingShowsChannelId")
   385	  if (!channelId) {
   386	    return { ok: false, error: "upcomingShowsChannelId is not configured." }
   387	  }
   388	
   389	  const saved = repoCreateShow(ctx, rawShow)
   390	  if (!saved.ok) {
   391	    return { ok: false, error: saved.error }
   392	  }
   393	
   394	  await ctx.discord.channels.send(channelId, showAnnouncementPayload(saved.show))
   395	  const recent = await ctx.discord.messages.list(channelId, { limit: 5 })
   396	  const matched = findAnnouncementMessage(recent, saved.show)
   397	  if (!matched) {
   398	    return { ok: false, error: "Posted the announcement, but could not find the message to pin." }
   399	  }
   400	  await ctx.discord.messages.pin(channelId, matched.id)
   401	
   402	  const attached = repoAttachDiscordMessage(ctx, saved.show.id, channelId, matched.id)
   403	  if (!attached.ok) {
   404	    return { ok: false, error: attached.error }
   405	  }
   406	
   407	  return { ok: true, show: attached.show || saved.show, messageId: matched.id }
   408	}
```

### Lines 443,461
```text
   443	module.exports = defineBot(({ command, component, event, configure }) => {
   444	  configure({
   445	    name: "show-space",
   446	    description: "Venue operations bot for upcoming shows and pinned announcements",
   447	    category: "venues",
   448	    run: {
   449	      fields: {
   450	        upcomingShowsChannelId: { type: "string", help: "Public channel for show announcements and pins", default: "" },
   451	        announcementsChannelId: { type: "string", help: "Public channel for general announcements", default: "" },
   452	        staffChannelId: { type: "string", help: "Private staff channel for summaries", default: "" },
   453	        adminRoleId: { type: "string", help: "Discord role ID for admins", default: "" },
   454	        bookerRoleId: { type: "string", help: "Discord role ID for bookers", default: "" },
   455	        timeZone: { type: "string", help: "IANA timezone for display formatting", default: "America/New_York" },
   456	        dbPath: { type: "string", help: "SQLite database path for phase-2 persistence", default: "" },
   457	        seedFromJson: { type: "bool", help: "Seed the database from shows.json when empty", default: true },
   458	        debug: { type: "bool", help: "Enable debug-only helper commands like role lookup", default: false },
   459	      },
   460	    },
   461	  })
```

### Lines 593,660
```text
   593	  command("announce", {
   594	    description: "Post and pin a show announcement in #upcoming-shows",
   595	    options: {
   596	      artist: { type: "string", description: "Artist or band name", required: true },
   597	      date: { type: "string", description: "Show date", required: true },
   598	      doors_time: { type: "string", description: "Doors time", required: true },
   599	      age_restriction: { type: "string", description: "Age restriction", required: true },
   600	      price: { type: "string", description: "Ticket price", required: true },
   601	      notes: { type: "string", description: "Optional notes", required: false },
   602	    },
   603	  }, async (ctx) => {
   604	    if (!canManageShows(ctx)) {
   605	      return permissionDenied(ctx, {
   606	        requiredRoleIds: [ctx.config && ctx.config.adminRoleId, ctx.config && ctx.config.bookerRoleId],
   607	        requirementLabel: "adminRoleId or bookerRoleId",
   608	      })
   609	    }
   610	    const normalized = buildAnnouncementInput(ctx, ctx.args)
   611	    if (!normalized.ok) {
   612	      return commandError(normalized.error)
   613	    }
   614	    const posted = await postAnnouncement(ctx, normalized.show)
   615	    if (!posted.ok) {
   616	      return commandError(posted.error)
   617	    }
   618	    return {
   619	      content: "✅ Posted and pinned in #upcoming-shows",
   620	      ephemeral: true,
   621	    }
   622	  })
   623	
   624	  command("add-show", {
   625	    description: "Save a show, post the announcement, and store the Discord message ID",
   626	    options: {
   627	      artist: { type: "string", description: "Artist or band name", required: true },
   628	      date: { type: "string", description: "Show date", required: true },
   629	      doors_time: { type: "string", description: "Doors time", required: true },
   630	      age: { type: "string", description: "Age restriction", required: true },
   631	      price: { type: "string", description: "Ticket price", required: true },
   632	      notes: { type: "string", description: "Optional notes", required: false },
   633	    },
   634	  }, async (ctx) => {
   635	    if (!canManageShows(ctx)) {
   636	      return permissionDenied(ctx, {
   637	        requiredRoleIds: [ctx.config && ctx.config.adminRoleId, ctx.config && ctx.config.bookerRoleId],
   638	        requirementLabel: "adminRoleId or bookerRoleId",
   639	      })
   640	    }
   641	    const normalized = buildAnnouncementInput(ctx, {
   642	      artist: ctx.args.artist,
   643	      date: ctx.args.date,
   644	      doors_time: ctx.args.doors_time,
   645	      age_restriction: ctx.args.age,
   646	      price: ctx.args.price,
   647	      notes: ctx.args.notes,
   648	    })
   649	    if (!normalized.ok) {
   650	      return commandError(normalized.error)
   651	    }
   652	    const posted = await postAnnouncement(ctx, normalized.show)
   653	    if (!posted.ok) {
   654	      return commandError(posted.error)
   655	    }
   656	    return {
   657	      content: `✅ Show added — ID #${String(posted.show.id)}. Posted and pinned.`,
   658	      ephemeral: true,
   659	    }
   660	  })
```

### Lines 678,750
```text
   678	  command("cancel-show", {
   679	    description: "Cancel a show, unpin the original announcement, and post a cancellation notice",
   680	    options: {
   681	      id: { type: "string", description: "Show ID", required: true },
   682	    },
   683	  }, async (ctx) => {
   684	    if (!canManageShows(ctx)) {
   685	      return permissionDenied(ctx, {
   686	        requiredRoleIds: [ctx.config && ctx.config.adminRoleId, ctx.config && ctx.config.bookerRoleId],
   687	        requirementLabel: "adminRoleId or bookerRoleId",
   688	      })
   689	    }
   690	    const show = repoGetShow(ctx, ctx.args.id)
   691	    if (!show) {
   692	      return commandError(`No show found for ID ${JSON.stringify(String(ctx.args.id || ""))}.`)
   693	    }
   694	    const cancelled = repoCancelShow(ctx, ctx.args.id)
   695	    if (!cancelled.ok) {
   696	      return commandError(cancelled.error)
   697	    }
   698	    if (trimText(show.discordChannelId) && trimText(show.discordMessageId)) {
   699	      try {
   700	        await ctx.discord.messages.unpin(show.discordChannelId, show.discordMessageId)
   701	      } catch (err) {
   702	        // Keep the cancellation flow moving even if the pin is already gone.
   703	      }
   704	    }
   705	    const announceChannelId = configChannelId(ctx, "upcomingShowsChannelId") || trimText(show.discordChannelId)
   706	    if (announceChannelId) {
   707	      try {
   708	        await ctx.discord.channels.send(announceChannelId, cancellationNotice(cancelled.show || show))
   709	      } catch (err) {
   710	        // The record is still cancelled even if the cancellation notice fails.
   711	      }
   712	    }
   713	    return {
   714	      content: `✅ Show #${String((cancelled.show && cancelled.show.id) || ctx.args.id)} cancelled and unpinned.`,
   715	      ephemeral: true,
   716	    }
   717	  })
   718	
   719	  command("archive-show", {
   720	    description: "Archive a completed show and unpin its announcement",
   721	    options: {
   722	      id: { type: "string", description: "Show ID", required: true },
   723	    },
   724	  }, async (ctx) => {
   725	    if (!canAdminOnly(ctx)) {
   726	      return permissionDenied(ctx, {
   727	        requiredRoleIds: [ctx.config && ctx.config.adminRoleId],
   728	        requirementLabel: "adminRoleId",
   729	      })
   730	    }
   731	    const show = repoGetShow(ctx, ctx.args.id)
   732	    if (!show) {
   733	      return commandError(`No show found for ID ${JSON.stringify(String(ctx.args.id || ""))}.`)
   734	    }
   735	    const archived = repoArchiveShow(ctx, ctx.args.id)
   736	    if (!archived.ok) {
   737	      return commandError(archived.error)
   738	    }
   739	    if (trimText(show.discordChannelId) && trimText(show.discordMessageId)) {
   740	      try {
   741	        await ctx.discord.messages.unpin(show.discordChannelId, show.discordMessageId)
   742	      } catch (err) {
   743	        // Ignore already-unpinned messages.
   744	      }
   745	    }
   746	    return {
   747	      content: `✅ Show #${String((archived.show && archived.show.id) || ctx.args.id)} archived and unpinned.`,
   748	      ephemeral: true,
   749	    }
   750	  })
```

### Lines 762,811
```text
   762	  command("unpin-old", {
   763	    description: "Unpin expired show announcements from #upcoming-shows",
   764	  }, async (ctx) => {
   765	    if (!canAdminOnly(ctx)) {
   766	      return permissionDenied(ctx, {
   767	        requiredRoleIds: [ctx.config && ctx.config.adminRoleId],
   768	        requirementLabel: "adminRoleId",
   769	      })
   770	    }
   771	    const channelId = configChannelId(ctx, "upcomingShowsChannelId")
   772	    if (!channelId) {
   773	      return commandError("upcomingShowsChannelId is not configured.")
   774	    }
   775	    const pinned = await ctx.discord.messages.listPinned(channelId)
   776	    const nowISO = localDateISO(new Date())
   777	    let removed = 0
   778	    for (const message of Array.isArray(pinned) ? pinned : []) {
   779	      const parsed = parsePinnedShowMessage(message)
   780	      if (!parsed || !parsed.dateISO || parsed.dateISO >= nowISO) {
   781	        continue
   782	      }
   783	      try {
   784	        await ctx.discord.messages.unpin(channelId, message.id)
   785	        removed += 1
   786	        repoArchiveByDiscordMessage(ctx, channelId, message.id)
   787	      } catch (err) {
   788	        // Keep going if one pin is already gone.
   789	      }
   790	    }
   791	    return {
   792	      content: `Removed ${removed} expired pin(s).`,
   793	      ephemeral: true,
   794	    }
   795	  })
   796	
   797	  command("archive-expired", {
   798	    description: "Archive expired shows and post a quiet staff summary",
   799	  }, async (ctx) => {
   800	    if (!canAdminOnly(ctx)) {
   801	      return permissionDenied(ctx, {
   802	        requiredRoleIds: [ctx.config && ctx.config.adminRoleId],
   803	        requirementLabel: "adminRoleId",
   804	      })
   805	    }
   806	    const result = await archiveExpiredShows(ctx, { logStaff: true })
   807	    return {
   808	      content: `Archived ${result.archived} expired show(s) and unpinned ${result.unpinned}.`,
   809	      ephemeral: true,
   810	    }
   811	  })
```

## Show-space store

File: ../corporate-headquarters/discord-bot/examples/discord-bots/show-space/lib/store.js

### Lines 1,73
```text
     1	const database = require("database")
     2	const { loadSeedShows, normalizeShow } = require("./shows")
     3	const { formatDisplayDate, localDateISO, todayISO, compareDateISO } = require("./dates")
     4	
     5	function trimText(value) {
     6	  return String(value || "").trim()
     7	}
     8	
     9	function boolValue(value, fallback) {
    10	  if (typeof value === "boolean") {
    11	    return value
    12	  }
    13	  if (value === undefined || value === null || value === "") {
    14	    return Boolean(fallback)
    15	  }
    16	  const text = String(value).trim().toLowerCase()
    17	  if (["1", "true", "yes", "y", "on"].includes(text)) {
    18	    return true
    19	  }
    20	  if (["0", "false", "no", "n", "off"].includes(text)) {
    21	    return false
    22	  }
    23	  return Boolean(fallback)
    24	}
    25	
    26	function createShowStore() {
    27	  let configuredPath = ""
    28	  let initialized = false
    29	
    30	  function ensure(config) {
    31	    const dbPath = trimText(config && (config.dbPath || config.db_path))
    32	    if (!dbPath) {
    33	      return false
    34	    }
    35	    if (initialized && configuredPath === dbPath) {
    36	      return true
    37	    }
    38	
    39	    try {
    40	      database.close()
    41	    } catch (err) {
    42	      // ignored; the module may not have been initialized yet
    43	    }
    44	
    45	    database.configure("sqlite3", dbPath)
    46	    configuredPath = dbPath
    47	    initialized = true
    48	    ensureSchema()
    49	    seedIfNeeded(config)
    50	    return true
    51	  }
    52	
    53	  function ensureSchema() {
    54	    database.exec(`
    55	      CREATE TABLE IF NOT EXISTS shows (
    56	        id INTEGER PRIMARY KEY AUTOINCREMENT,
    57	        artist TEXT NOT NULL,
    58	        date TEXT NOT NULL,
    59	        doors_time TEXT NOT NULL DEFAULT '',
    60	        age TEXT NOT NULL DEFAULT '',
    61	        price TEXT NOT NULL DEFAULT '',
    62	        notes TEXT NOT NULL DEFAULT '',
    63	        status TEXT NOT NULL DEFAULT 'confirmed',
    64	        discord_message_id TEXT NOT NULL DEFAULT '',
    65	        discord_channel_id TEXT NOT NULL DEFAULT '',
    66	        created_at TEXT NOT NULL,
    67	        updated_at TEXT NOT NULL
    68	      )
    69	    `)
    70	    database.exec(`CREATE INDEX IF NOT EXISTS idx_shows_date ON shows(date ASC, id ASC)`)
    71	    database.exec(`CREATE INDEX IF NOT EXISTS idx_shows_status ON shows(status, date ASC)`)
    72	    database.exec(`CREATE INDEX IF NOT EXISTS idx_shows_message ON shows(discord_channel_id, discord_message_id)`)
    73	  }
```

### Lines 102,149
```text
   102	  function showFromRow(row, config) {
   103	    if (!row) {
   104	      return null
   105	    }
   106	    const dateISO = trimText(row.date)
   107	    const date = dateISO ? new Date(`${dateISO}T00:00:00`) : new Date()
   108	    return {
   109	      id: row.id,
   110	      artist: trimText(row.artist),
   111	      dateISO,
   112	      displayDate: formatDisplayDate(date, config && config.timeZone),
   113	      doorsTime: trimText(row.doors_time),
   114	      ageRestriction: trimText(row.age),
   115	      price: trimText(row.price),
   116	      notes: trimText(row.notes),
   117	      status: trimText(row.status) || "confirmed",
   118	      discordChannelId: trimText(row.discord_channel_id),
   119	      discordMessageId: trimText(row.discord_message_id),
   120	      source: "database",
   121	      createdAt: trimText(row.created_at),
   122	      updatedAt: trimText(row.updated_at),
   123	    }
   124	  }
   125	
   126	  function insertShowRecord(show, patch) {
   127	    const now = new Date().toISOString()
   128	    const current = { ...show, ...(patch || {}), createdAt: trimText(show.createdAt) || now, updatedAt: now }
   129	    database.exec(
   130	      `
   131	        INSERT INTO shows (
   132	          artist, date, doors_time, age, price, notes, status, discord_message_id, discord_channel_id, created_at, updated_at
   133	        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   134	      `,
   135	      trimText(current.artist),
   136	      trimText(current.dateISO),
   137	      trimText(current.doorsTime),
   138	      trimText(current.ageRestriction),
   139	      trimText(current.price),
   140	      trimText(current.notes),
   141	      trimText(current.status) || "confirmed",
   142	      trimText(current.discordMessageId),
   143	      trimText(current.discordChannelId),
   144	      current.createdAt,
   145	      current.updatedAt,
   146	    )
   147	    const inserted = querySingle(`SELECT last_insert_rowid() AS id`, [])
   148	    return getShowByRowID(inserted.id)
   149	  }
```

### Lines 202,252
```text
   202	  function listUpcoming(config, limit) {
   203	    ensure(config)
   204	    const today = todayISO(new Date())
   205	    const max = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 25
   206	    const rows = database.query(
   207	      `SELECT * FROM shows WHERE status = 'confirmed' AND date >= ? ORDER BY date ASC, id ASC LIMIT ?`,
   208	      today,
   209	      max,
   210	    )
   211	    return (Array.isArray(rows) ? rows : []).map((row) => showFromRow(row, config))
   212	  }
   213	
   214	  function listPast(config, limit) {
   215	    ensure(config)
   216	    const today = todayISO(new Date())
   217	    const max = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 5
   218	    const rows = database.query(
   219	      `
   220	        SELECT * FROM shows
   221	        WHERE status = 'archived' OR date < ?
   222	        ORDER BY date DESC, id DESC
   223	        LIMIT ?
   224	      `,
   225	      today,
   226	      max,
   227	    )
   228	    return (Array.isArray(rows) ? rows : []).map((row) => showFromRow(row, config))
   229	  }
   230	
   231	  function getShow(config, id) {
   232	    ensure(config)
   233	    const numericID = Number(id)
   234	    if (!Number.isFinite(numericID)) {
   235	      return null
   236	    }
   237	    const row = querySingle(`SELECT * FROM shows WHERE id = ? LIMIT 1`, [numericID])
   238	    return row && row.id ? showFromRow(row, config) : null
   239	  }
   240	
   241	  function createShow(config, raw) {
   242	    ensure(config)
   243	    const normalized = normalizeShow(raw, { timeZone: config && config.timeZone, referenceDate: new Date() })
   244	    if (!normalized.ok) {
   245	      return normalized
   246	    }
   247	    const inserted = insertShowRecord(normalized.show, { status: normalized.show.status || "confirmed" })
   248	    if (!inserted) {
   249	      return { ok: false, error: "Failed to insert show." }
   250	    }
   251	    return { ok: true, show: inserted }
   252	  }
```

### Lines 254,325
```text
   254	  function attachDiscordMessage(config, id, channelId, messageId) {
   255	    return updateShowRecord(config, id, {
   256	      discordChannelId: trimText(channelId),
   257	      discordMessageId: trimText(messageId),
   258	    })
   259	  }
   260	
   261	  function cancelShow(config, id) {
   262	    return updateShowRecord(config, id, { status: "cancelled" })
   263	  }
   264	
   265	  function archiveShow(config, id) {
   266	    return updateShowRecord(config, id, { status: "archived" })
   267	  }
   268	
   269	  function archiveByDiscordMessage(config, channelId, messageId) {
   270	    ensure(config)
   271	    const row = querySingle(
   272	      `SELECT * FROM shows WHERE discord_channel_id = ? AND discord_message_id = ? LIMIT 1`,
   273	      [trimText(channelId), trimText(messageId)],
   274	    )
   275	    if (!row || !row.id) {
   276	      return { ok: false, error: "No show found for the pinned Discord message." }
   277	    }
   278	    return archiveShow(config, row.id)
   279	  }
   280	
   281	  function findExpiredShows(config, referenceDate) {
   282	    ensure(config)
   283	    const today = localDateISO(referenceDate instanceof Date ? referenceDate : new Date())
   284	    const rows = database.query(
   285	      `SELECT * FROM shows WHERE status = 'confirmed' AND date < ? ORDER BY date ASC, id ASC`,
   286	      today,
   287	    )
   288	    return (Array.isArray(rows) ? rows : []).map((row) => showFromRow(row, config))
   289	  }
   290	
   291	  function archiveExpiredShows(config, referenceDate) {
   292	    const expired = findExpiredShows(config, referenceDate)
   293	    const archived = []
   294	    for (const show of expired) {
   295	      const result = archiveShow(config, show.id)
   296	      if (result && result.ok) {
   297	        archived.push(result.show)
   298	      }
   299	    }
   300	    return archived
   301	  }
   302	
   303	  function countShows(config) {
   304	    ensure(config)
   305	    const row = querySingle(`SELECT COUNT(1) AS count FROM shows`, [])
   306	    return Number(row.count || 0)
   307	  }
   308	
   309	  return {
   310	    ensure,
   311	    isEnabled() {
   312	      return initialized
   313	    },
   314	    countShows,
   315	    listUpcoming,
   316	    listPast,
   317	    getShow,
   318	    createShow,
   319	    attachDiscordMessage,
   320	    cancelShow,
   321	    archiveShow,
   322	    archiveByDiscordMessage,
   323	    findExpiredShows,
   324	    archiveExpiredShows,
   325	  }
```

## Show-space rendering

File: ../corporate-headquarters/discord-bot/examples/discord-bots/show-space/lib/render.js

### Lines 12,35
```text
    12	function showAnnouncementPayload(show) {
    13	  const title = `🎵 ${showLabel(show)}`
    14	  const fields = [
    15	    { name: "Artist", value: trimText(show.artist) || "TBD", inline: true },
    16	    { name: "Date", value: trimText(show.displayDate) || trimText(show.dateISO) || "TBD", inline: true },
    17	    { name: "Doors", value: trimText(show.doorsTime) || "TBD", inline: true },
    18	    { name: "Age", value: trimText(show.ageRestriction) || "TBD", inline: true },
    19	    { name: "Price", value: trimText(show.price) || "TBD", inline: true },
    20	  ]
    21	  if (trimText(show.notes)) {
    22	    fields.push({ name: "Notes", value: trimText(show.notes), inline: false })
    23	  }
    24	  return {
    25	    content: "",
    26	    embeds: [
    27	      {
    28	        title,
    29	        description: `Doors: ${trimText(show.doorsTime) || "TBD"}`,
    30	        color: 0x5865f2,
    31	        fields,
    32	      },
    33	    ],
    34	  }
    35	}
```

### Lines 55,86
```text
    55	function cancellationNotice(show) {
    56	  return {
    57	    content: `⚠️ ${trimText(show.artist) || "A show"} on ${trimText(show.displayDate) || trimText(show.dateISO) || "an upcoming date"} has been cancelled.`,
    58	  }
    59	}
    60	
    61	function showDetailPayload(show) {
    62	  const fields = [
    63	    { name: "ID", value: `#${trimText(show.id) || "(unknown)"}`, inline: true },
    64	    { name: "Artist", value: trimText(show.artist) || "TBD", inline: true },
    65	    { name: "Date", value: trimText(show.displayDate) || trimText(show.dateISO) || "TBD", inline: true },
    66	    { name: "Doors", value: trimText(show.doorsTime) || "TBD", inline: true },
    67	    { name: "Age", value: trimText(show.ageRestriction) || "TBD", inline: true },
    68	    { name: "Price", value: trimText(show.price) || "TBD", inline: true },
    69	    { name: "Status", value: trimText(show.status) || "confirmed", inline: true },
    70	  ]
    71	  if (trimText(show.discordMessageId)) {
    72	    fields.push({ name: "Discord Message", value: `#${trimText(show.discordMessageId)}`, inline: false })
    73	  }
    74	  if (trimText(show.notes)) {
    75	    fields.push({ name: "Notes", value: trimText(show.notes), inline: false })
    76	  }
    77	  return {
    78	    content: "",
    79	    embeds: [{
    80	      title: `🎵 ${showLabel(show)}`,
    81	      description: "Show record details",
    82	      color: 0x57f287,
    83	      fields,
    84	    }],
    85	  }
    86	}
```

### Lines 88,122
```text
    88	function pastShowsText(shows) {
    89	  const list = Array.isArray(shows) ? shows : []
    90	  if (list.length === 0) {
    91	    return "🗂 Past Shows\n\nNo archived shows found."
    92	  }
    93	  const lines = ["🗂 Past Shows", ""]
    94	  list.forEach((show) => {
    95	    lines.push(`#${trimText(show.id) || "?"} — ${trimText(show.artist) || "Unknown artist"} — ${trimText(show.displayDate) || trimText(show.dateISO) || "TBD"}`)
    96	    lines.push(`${trimText(show.status) || "archived"} | ${trimText(show.doorsTime) || "TBD"} | ${trimText(show.price) || "TBD"}`)
    97	    if (trimText(show.notes)) {
    98	      lines.push(trimText(show.notes))
    99	    }
   100	    lines.push("")
   101	  })
   102	  return lines.join("\n").trim()
   103	}
   104	
   105	function parseShowTitle(title) {
   106	  const text = trimText(title)
   107	  const match = text.match(/^🎵\s*(.*?)\s*[—-]\s*(.+)$/)
   108	  if (!match) {
   109	    return { artist: "", dateText: "" }
   110	  }
   111	  return { artist: trimText(match[1]), dateText: trimText(match[2]) }
   112	}
   113	
   114	module.exports = {
   115	  showLabel,
   116	  showAnnouncementPayload,
   117	  upcomingShowsText,
   118	  cancellationNotice,
   119	  showDetailPayload,
   120	  pastShowsText,
   121	  parseShowTitle,
   122	}
```

## Show-space permissions

File: ../corporate-headquarters/discord-bot/examples/discord-bots/show-space/lib/permissions.js

### Lines 1,28
```text
     1	function cleanRoleList(ctx) {
     2	  const roles = ctx && ctx.member && Array.isArray(ctx.member.roles) ? ctx.member.roles : []
     3	  return roles.map((role) => String(role || "").trim()).filter(Boolean)
     4	}
     5	
     6	function normalizeRoleIds(roleIds) {
     7	  const list = Array.isArray(roleIds) ? roleIds : [roleIds]
     8	  return list.map((roleId) => String(roleId || "").trim()).filter(Boolean)
     9	}
    10	
    11	function currentUserId(ctx) {
    12	  return String((ctx && ctx.user && ctx.user.id) || (ctx && ctx.member && ctx.member.id) || "").trim()
    13	}
    14	
    15	function currentMemberId(ctx) {
    16	  return String((ctx && ctx.member && ctx.member.id) || "").trim()
    17	}
    18	
    19	function hasAnyRole(ctx, roleIds) {
    20	  const roles = cleanRoleList(ctx)
    21	  const allowed = normalizeRoleIds(roleIds)
    22	  return allowed.some((roleId) => roles.includes(roleId))
    23	}
    24	
    25	function canManageShows(ctx) {
    26	  const config = ctx && ctx.config ? ctx.config : {}
    27	  return hasAnyRole(ctx, [config.adminRoleId, config.bookerRoleId])
    28	}
```

### Lines 35,58
```text
    35	function permissionDenied(ctx, options) {
    36	  const memberRoles = cleanRoleList(ctx)
    37	  const config = ctx && ctx.config ? ctx.config : {}
    38	  const requiredRoles = normalizeRoleIds((options && options.requiredRoleIds) || [config.adminRoleId, config.bookerRoleId])
    39	  const matchingRoles = requiredRoles.filter((roleId) => memberRoles.includes(roleId))
    40	  const missingRoles = requiredRoles.filter((roleId) => !memberRoles.includes(roleId))
    41	  const requirementLabel = String((options && options.requirementLabel) || "configured allowed role IDs").trim() || "configured allowed role IDs"
    42	
    43	  let content = "❌ You don't have permission to use this command."
    44	  content += `\n\nRequirement checked: ${requirementLabel}.`
    45	  content += `\nUser ID: ${currentUserId(ctx) || "(unknown)"}.`
    46	  content += `\nMember ID: ${currentMemberId(ctx) || "(none)"}.`
    47	  content += `\nThe bot sees your member role IDs: ${memberRoles.length > 0 ? memberRoles.join(", ") : "(none)"}.`
    48	  content += `\nRequired role IDs for this command: ${requiredRoles.length > 0 ? requiredRoles.join(", ") : "(not configured)"}.`
    49	  content += `\nExact matching role IDs: ${matchingRoles.length > 0 ? matchingRoles.join(", ") : "(none)"}.`
    50	  content += `\nRequired role IDs not seen on your member object: ${missingRoles.length > 0 ? missingRoles.join(", ") : "(none)"}.`
    51	  content += matchingRoles.length > 0
    52	    ? "\nWhy denied: the bot does see at least one required role ID here, so if this command still failed the next thing to verify is the specific gate for this command and the live runtime config."
    53	    : "\nWhy denied: none of the required role IDs for this command appear on your member object, so the role gate rejected the request."
    54	  content += "\nIf the role names look correct but this still fails, double-check that the configured IDs match the real Discord role IDs."
    55	  content += "\nIf you started the bot with --debug, /debug, /debug-my-roles, and /debug-roles can help you compare what the bot sees against the configured role IDs."
    56	
    57	  return { content, ephemeral: true }
    58	}
```

## Discord JS API reference

File: ../corporate-headquarters/discord-bot/pkg/doc/topics/discord-js-bot-api-reference.md

### Lines 33,45
```text
    33	This repository lets you write Discord bots in JavaScript while the Go host handles Discord connectivity, slash-command sync, event dispatch, and outbound operations. The JavaScript side stays small and expressive:
    34	
    35	- you declare one bot with `defineBot(...)`
    36	- you register commands, events, components, modals, and autocomplete handlers
    37	- you use the provided context object to reply, defer, edit, log, persist small state, and call Discord operations
    38	
    39	The main idea is simple: the bot repository owns the process, but the bot behavior lives in JavaScript.
    40	
    41	> ⚠️ **Runtime Environment**
    42	> Bot scripts run inside a Goja JavaScript engine embedded in Go, **not Node.js**.
    43	> - **Available modules:** `require("discord")`, `require("timer")`, `require("database")`, `require("ui")`
    44	> - **Unavailable:** `fs`, `path`, `http`, `fetch`, `process`, npm packages, or any Node.js standard library
    45	> - **No file system access from JS.** Deliver generated content as Discord file attachments via `ctx.discord.channels.send()` with `files: [...]`
```

### Lines 64,84
```text
    64	## Quick API summary
    65	
    66	| Helper | Purpose |
    67	| --- | --- |
    68	| `defineBot(builderFn)` | Create one bot from a builder callback |
    69	| `configure(options)` | Set bot metadata and runtime config fields |
    70	| `command(name, spec?, handler)` | Register a slash command |
    71	| `userCommand(name, handler)` | Register a user context menu command |
    72	| `messageCommand(name, handler)` | Register a message context menu command |
    73	| `subcommand(rootName, name, spec?, handler)` | Register a subcommand handler |
    74	| `event(name, handler)` | Register a gateway/event handler |
    75	| `component(customId, handler)` | Handle button or select-menu interactions |
    76	| `modal(customId, handler)` | Handle modal submissions |
    77	| `autocomplete(commandName, optionName, handler)` | Return autocomplete choices |
    78	| `require("ui")` | Go-side fluent builders for Discord messages, embeds, components, modals, and screen helpers |
    79	
    80	## `require("ui")` — Go-side UI DSL builders
    81	
    82	`require("ui")` exposes a native builder DSL implemented in Go and surfaced through Goja Proxy traps. This module exists for cases where you want JavaScript to keep the fluent authoring experience, but you want the host to own validation, type checks, and response-shape control.
    83	
    84	The most important design rule is that `ui` returns **typed builders**, not plain JS objects. Call `.build()` at the end of a chain to get a typed Discord payload or the host's `normalizedResponse` fast path.
```

### Lines 208,229
```text
   208	### Runtime config fields
   209	
   210	Each field under `run.fields` becomes a CLI flag when you run the bot through `bots <bot> run`.
   211	
   212	Rules to remember:
   213	
   214	- field names become the keys inside `ctx.config`
   215	- field names are also converted into kebab-case CLI flags
   216	- the help text from `help` is shown in `bots help <bot>`
   217	- default values are exposed to the CLI and to `ctx.config`
   218	
   219	For example, the field `index_path` becomes the flag `--index-path` and is read in JavaScript as `ctx.config.index_path`.
   220	
   221	Supported runtime field types are:
   222	
   223	- `string`
   224	- `bool` / `boolean`
   225	- `int` / `integer`
   226	- `number` / `float`
   227	- `string_list` / `string-list` / `string[]`
   228	
   229	## `command(name, spec?, handler)`
```

### Lines 277,335
```text
   277	### Supported option types
   278	
   279	The framework supports Discord's application command option types with these JavaScript-friendly names:
   280	
   281	| Framework type | Discord API type | Value | What the user sees |
   282	| --- | --- | --- | --- |
   283	| `string` | `STRING` | 3 | Free text input |
   284	| `int`, `integer` | `INTEGER` | 4 | Whole number input |
   285	| `bool`, `boolean` | `BOOLEAN` | 5 | True/false toggle |
   286	| `number`, `float` | `NUMBER` | 10 | Decimal number input |
   287	| `user` | `USER` | 6 | @mention picker for users |
   288	| `channel` | `CHANNEL` | 7 | #channel picker |
   289	| `role` | `ROLE` | 8 | @role picker |
   290	| `mentionable` | `MENTIONABLE` | 9 | User or role picker |
   291	| `sub_command` | `SUB_COMMAND` | 1 | Nested command |
   292	| `sub_command_group` | `SUB_COMMAND_GROUP` | 2 | Nested command group |
   293	
   294	**Not yet supported:** `attachment` (Discord type 11, value 11) — file upload as a command option.
   295	
   296	**Does not exist in Discord's API:** There are no date, datetime, calendar, time-range, or date-picker option types. If you need time-based selection, use a `string` (ISO date), `integer` (relative hours), or a message ID as an anchor point.
   297	
   298	### Supported option fields
   299	
   300	| Field | Meaning | Valid for types |
   301	| --- | --- | --- |
   302	| `type` | Option type (see table above) | all |
   303	| `description` | Option description shown in Discord | all |
   304	| `required` | Marks the option as required | all except `sub_command` / `sub_command_group` |
   305	| `autocomplete` | Enables autocomplete for that option | `string`, `integer`, `number` |
   306	| `choices` | Static choices for the option | `string`, `integer`, `number` |
   307	| `minLength` | Minimum length for string options | `string` |
   308	| `maxLength` | Maximum length for string options | `string` |
   309	| `minValue` | Minimum numeric value | `integer`, `number` |
   310	| `maxValue` | Maximum numeric value | `integer`, `number` |
   311	| `channel_types` | Restrict channel picker to specific types | `channel` |
   312	
   313	Important rules:
   314	
   315	- `autocomplete: true` cannot be combined with static `choices`
   316	- required options should be defined before optional ones in your source data
   317	- the host preserves a sensible order when it syncs commands to Discord
   318	
   319	### What the command handler gets
   320	
   321	The handler receives a context object. For slash commands, the most important fields are:
   322	
   323	- `ctx.args` — parsed option values keyed by option name
   324	- `ctx.options` — alias of `ctx.args`
   325	- `ctx.config` — runtime config values from `configure({ run: ... })`
   326	- `ctx.reply(...)` — send the initial response
   327	- `ctx.defer(...)` — acknowledge the interaction and finish later
   328	- `ctx.edit(...)` — edit the deferred or initial response
   329	- `ctx.followUp(...)` — send an additional follow-up
   330	- `ctx.showModal(...)` — open a modal
   331	- `ctx.discord` — call Discord operations directly
   332	- `ctx.log` — structured logger for this bot context
   333	- `ctx.store` — per-runtime in-memory state
   334	
   335	If your command does work that might take longer than Discord likes, call `await ctx.defer({ ephemeral: true })`, do the work, and then `await ctx.edit(...)` with the result.
```

### Lines 650,697
```text
   650	`ctx.discord` exposes outbound Discord operations for when a command or event needs to do more than answer the original interaction. The same namespace is available from command, event, component, modal, and autocomplete handlers.
   651	
   652	### Discord operations by namespace
   653	
   654	#### `ctx.discord.guilds`
   655	
   656	| Operation | Purpose |
   657	| --- | --- |
   658	| `ctx.discord.guilds.fetch(guildId)` | Fetch a guild snapshot |
   659	
   660	#### `ctx.discord.roles`
   661	
   662	| Operation | Purpose |
   663	| --- | --- |
   664	| `ctx.discord.roles.list(guildId)` | List roles in a guild |
   665	| `ctx.discord.roles.fetch(guildId, roleId)` | Fetch one role by ID |
   666	
   667	#### `ctx.discord.threads`
   668	
   669	| Operation | Purpose |
   670	| --- | --- |
   671	| `ctx.discord.threads.fetch(threadId)` | Fetch a thread snapshot |
   672	| `ctx.discord.threads.join(threadId)` | Join a thread |
   673	| `ctx.discord.threads.leave(threadId)` | Leave a thread |
   674	| `ctx.discord.threads.start(channelId, payload)` | Start a thread from a channel or source message |
   675	
   676	#### `ctx.discord.channels`
   677	
   678	| Operation | Purpose |
   679	| --- | --- |
   680	| `ctx.discord.channels.send(channelId, payload)` | Send a normal message to a channel |
   681	| `ctx.discord.channels.fetch(channelId)` | Fetch a channel snapshot |
   682	| `ctx.discord.channels.setTopic(channelId, topic)` | Update a channel topic |
   683	| `ctx.discord.channels.setSlowmode(channelId, seconds)` | Update channel slowmode |
   684	
   685	#### `ctx.discord.messages`
   686	
   687	| Operation | Purpose |
   688	| --- | --- |
   689	| `ctx.discord.messages.fetch(channelId, messageId)` | Fetch one channel message |
   690	| `ctx.discord.messages.list(channelId, payload)` | List recent channel messages with `before`, `after`, `around`, and `limit` options |
   691	| `ctx.discord.messages.edit(channelId, messageId, payload)` | Edit an existing channel message |
   692	| `ctx.discord.messages.delete(channelId, messageId)` | Delete a channel message |
   693	| `ctx.discord.messages.react(channelId, messageId, emoji)` | Add a reaction to a channel message |
   694	| `ctx.discord.messages.pin(channelId, messageId)` | Pin a message |
   695	| `ctx.discord.messages.unpin(channelId, messageId)` | Unpin a message |
   696	| `ctx.discord.messages.listPinned(channelId)` | List pinned messages in a channel |
   697	| `ctx.discord.messages.bulkDelete(channelId, messageIds)` | Bulk-delete a list of messages |
```

### Lines 870,883
```text
   870	| A slash command never appears in Discord | Commands were not synced after editing the bot | Run with `--sync-on-start` or use the sync command path |
   871	| A component or modal interaction says no handler exists | The `customId` does not match the registered `component(...)` or `modal(...)` key | Keep `customId` values stable and unique |
   872	| `ctx.config` is missing expected fields | The bot did not declare `configure({ run: ... })` fields or the flags were omitted | Add the run schema and pass the generated flags to `bots run` |
   873	| A message/channel moderation helper fails | The bot lacks the required channel permissions | Check message-management, channel-management, and read/history permissions for the target channel |
   874	
   875	## See Also
   876	
   877	- `build-and-run-discord-js-bots` — step-by-step tutorial for creating and running bots
   878	- `go-side-ui-dsl-for-discord-bots` — tutorial for the Go-backed `require("ui")` DSL and in-place interaction updates
   879	- `examples/discord-bots/ping/index.js` — button, select, modal, autocomplete, and outbound ops showcase
   880	- `examples/discord-bots/poker/index.js` — a richer bot with game state and action advice
   881	- `examples/discord-bots/knowledge-base/index.js` — runtime config and docs-search example
   882	- `examples/discord-bots/show-space/index.js` — venue operations bot with show announcements, DB-backed records, pin cleanup, and debug role-troubleshooting tools
   883	- `examples/discord-bots/README.md` — repository-level usage notes and command examples
```

