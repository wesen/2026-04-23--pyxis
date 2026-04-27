package discordbot

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/go-go-golems/go-go-goja/engine"
	"github.com/go-go-golems/pyxis/pkg/domain"
	"github.com/go-go-golems/pyxis/pkg/service"
)

// Deps contains the Pyxis services exposed to the JavaScript bot runtime.
type Deps struct {
	Shows    *service.ShowService
	Settings *service.SettingsService
	Audit    service.AuditService
}

// PyxisRegistrar registers the native require("pyxis") module for bot scripts.
type PyxisRegistrar struct {
	deps Deps
	ctx  context.Context
}

// NewPyxisRegistrar returns a runtime module registrar backed by Pyxis services.
func NewPyxisRegistrar(ctx context.Context, deps Deps) *PyxisRegistrar {
	if ctx == nil {
		ctx = context.Background()
	}
	return &PyxisRegistrar{ctx: ctx, deps: deps}
}

func (r *PyxisRegistrar) ID() string { return "pyxis" }

func (r *PyxisRegistrar) RegisterRuntimeModules(_ *engine.RuntimeModuleContext, reg *require.Registry) error {
	reg.RegisterNativeModule("pyxis", func(vm *goja.Runtime, moduleObj *goja.Object) {
		exports := moduleObj.Get("exports").ToObject(vm)
		exports.Set("shows", r.showsObject(vm))
		exports.Set("settings", r.settingsObject(vm))
	})
	return nil
}

func (r *PyxisRegistrar) showsObject(vm *goja.Runtime) *goja.Object {
	obj := vm.NewObject()
	_ = obj.Set("listUpcoming", func(call goja.FunctionCall) goja.Value {
		limit := intFromObject(call.Argument(0).ToObject(vm), "limit", 25)
		shows, err := r.deps.Shows.ListUpcoming(r.ctx)
		if err != nil {
			panic(vm.ToValue(err.Error()))
		}
		return vm.ToValue(limitShows(shows, limit))
	})
	_ = obj.Set("listPast", func(call goja.FunctionCall) goja.Value {
		limit := intFromObject(call.Argument(0).ToObject(vm), "limit", 5)
		shows, err := r.deps.Shows.ListAll(r.ctx)
		if err != nil {
			panic(vm.ToValue(err.Error()))
		}
		past := make([]domain.Show, 0)
		now := time.Now()
		for _, show := range shows {
			if show.Status == domain.StatusArchived || (!show.Date.IsZero() && show.Date.Before(startOfDay(now))) {
				past = append(past, show)
			}
		}
		return vm.ToValue(limitShows(past, limit))
	})
	_ = obj.Set("count", func() int {
		shows, err := r.deps.Shows.ListAll(r.ctx)
		if err != nil {
			return 0
		}
		return len(shows)
	})
	_ = obj.Set("get", func(call goja.FunctionCall) goja.Value {
		id, err := idFromValue(call.Argument(0))
		if err != nil {
			return goja.Null()
		}
		show, err := r.deps.Shows.GetByID(r.ctx, id)
		if err != nil || show == nil {
			return goja.Null()
		}
		return vm.ToValue(showDTO(*show))
	})
	_ = obj.Set("create", func(call goja.FunctionCall) goja.Value {
		show, err := showFromValue(vm, call.Argument(0))
		if err != nil {
			return resultError(vm, err)
		}
		actorName := actorNameFromValue(vm, call.Argument(1))
		created, err := r.deps.Shows.Create(r.ctx, show, 0, actorName)
		if err != nil {
			return resultError(vm, err)
		}
		return resultShow(vm, created)
	})
	_ = obj.Set("attachDiscordMessage", func(call goja.FunctionCall) goja.Value {
		id, err := idFromValue(call.Argument(0))
		if err != nil {
			return resultError(vm, err)
		}
		show, err := r.deps.Shows.AttachDiscordMessage(r.ctx, id, strings.TrimSpace(call.Argument(1).String()), strings.TrimSpace(call.Argument(2).String()))
		if err != nil {
			return resultError(vm, err)
		}
		return resultShow(vm, show)
	})
	_ = obj.Set("cancel", func(call goja.FunctionCall) goja.Value {
		id, err := idFromValue(call.Argument(0))
		if err != nil {
			return resultError(vm, err)
		}
		show, err := r.deps.Shows.Cancel(r.ctx, id, 0, actorNameFromValue(vm, call.Argument(1)))
		if err != nil {
			return resultError(vm, err)
		}
		return resultShow(vm, show)
	})
	_ = obj.Set("archive", func(call goja.FunctionCall) goja.Value {
		id, err := idFromValue(call.Argument(0))
		if err != nil {
			return resultError(vm, err)
		}
		actorName := actorNameFromValue(vm, call.Argument(1))
		show, _ := r.deps.Shows.GetByID(r.ctx, id)
		if err := r.deps.Shows.Archive(r.ctx, id, 0, actorName); err != nil {
			return resultError(vm, err)
		}
		if show != nil {
			show.Status = domain.StatusArchived
		}
		return resultShow(vm, show)
	})
	_ = obj.Set("archiveByDiscordMessage", func(call goja.FunctionCall) goja.Value {
		channelID := strings.TrimSpace(call.Argument(0).String())
		messageID := strings.TrimSpace(call.Argument(1).String())
		show, err := r.deps.Shows.GetByDiscordMessage(r.ctx, channelID, messageID)
		if err != nil {
			return resultError(vm, err)
		}
		if err := r.deps.Shows.Archive(r.ctx, show.ID, 0, "discord bot"); err != nil {
			return resultError(vm, err)
		}
		show.Status = domain.StatusArchived
		return resultShow(vm, show)
	})
	_ = obj.Set("archiveExpired", func(call goja.FunctionCall) goja.Value {
		ref := time.Now()
		if obj := call.Argument(0).ToObject(vm); obj != nil {
			if v := strings.TrimSpace(obj.Get("referenceDate").String()); v != "" && v != "undefined" {
				if parsed, err := time.Parse(time.DateOnly, v); err == nil {
					ref = parsed
				}
			}
		}
		expired, err := r.deps.Shows.ListExpiredConfirmed(r.ctx, ref)
		if err != nil {
			return resultError(vm, err)
		}
		archived := make([]map[string]any, 0, len(expired))
		for _, show := range expired {
			if err := r.deps.Shows.Archive(r.ctx, show.ID, 0, "discord bot"); err != nil {
				continue
			}
			show.Status = domain.StatusArchived
			archived = append(archived, showDTO(show))
		}
		return vm.ToValue(archived)
	})
	return obj
}

func (r *PyxisRegistrar) settingsObject(vm *goja.Runtime) *goja.Object {
	obj := vm.NewObject()
	_ = obj.Set("get", func() map[string]any {
		if r.deps.Settings == nil {
			return map[string]any{}
		}
		settings, err := r.deps.Settings.Get(r.ctx)
		if err != nil || settings == nil {
			return map[string]any{}
		}
		return map[string]any{
			"spaceName":              settings.SpaceName,
			"timeZone":               coalesce(settings.Timezone, "America/New_York"),
			"discordGuildId":         settings.DiscordGuildID,
			"upcomingShowsChannelId": settings.DiscordChUpcoming,
			"announcementsChannelId": settings.DiscordChAnnouncements,
			"staffChannelId":         settings.DiscordChStaff,
			"bookingsChannelId":      settings.DiscordChBookings,
			"discordPosting":         settings.DiscordPosting,
			"autoArchive":            settings.AutoArchive,
		}
	})
	return obj
}

func showFromValue(vm *goja.Runtime, value goja.Value) (*domain.Show, error) {
	obj := value.ToObject(vm)
	if obj == nil {
		return nil, fmt.Errorf("show input is required")
	}
	show := &domain.Show{
		Artist:           strings.TrimSpace(obj.Get("artist").String()),
		DoorsTime:        strings.TrimSpace(coalesceJS(obj.Get("doorsTime"), obj.Get("doors_time"))),
		Age:              strings.TrimSpace(coalesceJS(obj.Get("ageRestriction"), obj.Get("age"))),
		Price:            strings.TrimSpace(obj.Get("price").String()),
		Genre:            strings.TrimSpace(obj.Get("genre").String()),
		Notes:            strings.TrimSpace(obj.Get("notes").String()),
		Status:           coalesce(strings.TrimSpace(obj.Get("status").String()), domain.StatusConfirmed),
		DiscordChannelID: strings.TrimSpace(obj.Get("discordChannelId").String()),
		DiscordMessageID: strings.TrimSpace(obj.Get("discordMessageId").String()),
	}
	if show.Artist == "" {
		return nil, fmt.Errorf("artist is required")
	}
	dateText := strings.TrimSpace(coalesceJS(obj.Get("dateISO"), obj.Get("date")))
	if dateText == "" || dateText == "undefined" {
		return nil, fmt.Errorf("date is required")
	}
	date, err := time.Parse(time.DateOnly, dateText)
	if err != nil {
		return nil, fmt.Errorf("parse show date: %w", err)
	}
	show.Date = date
	return show, nil
}

func showDTO(show domain.Show) map[string]any {
	dateISO := ""
	displayDate := ""
	if !show.Date.IsZero() {
		dateISO = show.Date.Format(time.DateOnly)
		displayDate = show.Date.Format("Mon Jan 2, 2006")
	}
	return map[string]any{
		"id":               show.ID,
		"artist":           show.Artist,
		"dateISO":          dateISO,
		"displayDate":      displayDate,
		"doorsTime":        show.DoorsTime,
		"ageRestriction":   show.Age,
		"price":            show.Price,
		"genre":            show.Genre,
		"notes":            show.Notes,
		"status":           show.Status,
		"discordChannelId": show.DiscordChannelID,
		"discordMessageId": show.DiscordMessageID,
	}
}

func resultShow(vm *goja.Runtime, show *domain.Show) goja.Value {
	if show == nil {
		return resultError(vm, fmt.Errorf("show not found"))
	}
	return vm.ToValue(map[string]any{"ok": true, "show": showDTO(*show)})
}

func resultError(vm *goja.Runtime, err error) goja.Value {
	return vm.ToValue(map[string]any{"ok": false, "error": err.Error()})
}

func idFromValue(value goja.Value) (int, error) {
	text := strings.TrimSpace(value.String())
	id, err := strconv.Atoi(text)
	if err != nil || id <= 0 {
		return 0, fmt.Errorf("invalid show ID %q", text)
	}
	return id, nil
}

func intFromObject(obj *goja.Object, key string, fallback int) int {
	if obj == nil {
		return fallback
	}
	value := obj.Get(key)
	if goja.IsUndefined(value) || goja.IsNull(value) {
		return fallback
	}
	if i := int(value.ToInteger()); i > 0 {
		return i
	}
	return fallback
}

func actorNameFromValue(vm *goja.Runtime, value goja.Value) string {
	obj := value.ToObject(vm)
	if obj == nil {
		return "discord bot"
	}
	for _, key := range []string{"actorName", "discordUsername", "username", "userName"} {
		text := strings.TrimSpace(obj.Get(key).String())
		if text != "" && text != "undefined" {
			return text
		}
	}
	return "discord bot"
}

func limitShows(shows []domain.Show, limit int) []map[string]any {
	if limit <= 0 || limit > len(shows) {
		limit = len(shows)
	}
	ret := make([]map[string]any, 0, limit)
	for _, show := range shows[:limit] {
		ret = append(ret, showDTO(show))
	}
	return ret
}

func startOfDay(t time.Time) time.Time {
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())
}

func coalesce(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return ""
}

func coalesceJS(values ...goja.Value) string {
	for _, value := range values {
		if goja.IsUndefined(value) || goja.IsNull(value) {
			continue
		}
		text := strings.TrimSpace(value.String())
		if text != "" && text != "undefined" {
			return text
		}
	}
	return ""
}
