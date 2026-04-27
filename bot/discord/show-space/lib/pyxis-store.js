const { parseShowDate } = require("./dates")
const pyxis = require("pyxis")

function trimText(value) {
  return String(value || "").trim()
}

function normalizeShow(raw, options) {
  const value = raw || {}
  const displayDateSource = trimText(value.dateDisplay || value.displayDate || value.dateISO)
  const dateInput = trimText(value.date || value.dateISO || displayDateSource)
  const parsed = parseShowDate(dateInput, options)
  if (!parsed.ok) {
    return { ok: false, error: parsed.error }
  }
  const artist = trimText(value.artist)
  if (!artist) {
    return { ok: false, error: "Artist is required." }
  }
  return {
    ok: true,
    show: {
      id: value.id || 0,
      artist,
      dateISO: parsed.dateISO,
      displayDate: parsed.displayDate,
      doorsTime: trimText(value.doors_time || value.doorsTime),
      ageRestriction: trimText(value.age_restriction || value.age || value.ageRestriction),
      price: trimText(value.price),
      genre: trimText(value.genre),
      notes: trimText(value.notes),
      status: trimText(value.status) || "confirmed",
      discordChannelId: trimText(value.discord_channel_id || value.discordChannelId),
      discordMessageId: trimText(value.discord_message_id || value.discordMessageId),
      source: trimText(value.source) || "pyxis",
      createdAt: trimText(value.createdAt) || new Date().toISOString(),
      updatedAt: trimText(value.updatedAt) || new Date().toISOString(),
    },
  }
}

function actorFromContext(ctx) {
  return {
    discordUserId: trimText(ctx && ctx.user && ctx.user.id),
    discordUsername: trimText(
      (ctx && ctx.user && (ctx.user.username || ctx.user.globalName)) ||
      (ctx && ctx.member && ctx.member.nick)
    ),
  }
}

function createPyxisShowStore() {
  function ensure() {
    return Boolean(pyxis && pyxis.shows)
  }

  function settings(config) {
    const fromPyxis = pyxis.settings && typeof pyxis.settings.get === "function" ? pyxis.settings.get() : {}
    return { ...(fromPyxis || {}), ...(config || {}) }
  }

  return {
    ensure,
    settings,
    countShows() {
      return pyxis.shows.count()
    },
    listUpcoming(config, limit) {
      void config
      return pyxis.shows.listUpcoming({ limit: limit || 25 })
    },
    listPast(config, limit) {
      void config
      return pyxis.shows.listPast({ limit: limit || 5 })
    },
    getShow(config, id) {
      void config
      return pyxis.shows.get(id)
    },
    get(config, id) {
      void config
      return pyxis.shows.get(id)
    },
    createShow(ctx, raw) {
      const normalized = normalizeShow(raw, { timeZone: settings(ctx && ctx.config).timeZone, referenceDate: new Date() })
      if (!normalized.ok) {
        return normalized
      }
      return pyxis.shows.create(normalized.show, actorFromContext(ctx))
    },
    create(config, raw) {
      void config
      return pyxis.shows.create(raw, {})
    },
    attachDiscordMessage(config, id, channelId, messageId) {
      void config
      return pyxis.shows.attachDiscordMessage(id, channelId, messageId)
    },
    cancelShow(ctx, id) {
      return pyxis.shows.cancel(id, actorFromContext(ctx))
    },
    cancel(config, id) {
      void config
      return pyxis.shows.cancel(id, {})
    },
    archiveShow(ctx, id) {
      return pyxis.shows.archive(id, actorFromContext(ctx))
    },
    archive(config, id) {
      void config
      return pyxis.shows.archive(id, {})
    },
    archiveByDiscordMessage(config, channelId, messageId) {
      void config
      return pyxis.shows.archiveByDiscordMessage(channelId, messageId)
    },
    archiveExpiredShows(config, referenceDate) {
      void config
      return pyxis.shows.archiveExpired({ referenceDate: referenceDate ? referenceDate.toISOString().slice(0, 10) : "" })
    },
  }
}

module.exports = {
  createPyxisShowStore,
  normalizeShow,
  actorFromContext,
}
