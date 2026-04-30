Returns events on the specified calendar. [Try it now](https://developers.google.com/calendar/api/v3/reference/events/list#try-it).

## Request

### HTTP request

```
GET https://www.googleapis.com/calendar/v3/calendars/calendarId/events
```

### Parameters

<table><thead><tr><th>Parameter name</th><th>Value</th><th>Description</th></tr></thead><tbody><tr><td colspan="3"><b>Path parameters</b></td></tr><tr><td><code>calendarId</code></td><td><code>string</code></td><td>Calendar identifier. To retrieve calendar IDs call the <a href="https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list">calendarList.list</a> method. If you want to access the primary calendar of the currently logged in user, use the " <code>primary</code> " keyword.</td></tr><tr><td colspan="3"><b>Optional query parameters</b></td></tr><tr><td><code>alwaysIncludeEmail</code></td><td><code>boolean</code></td><td>Deprecated and ignored.</td></tr><tr><td><code>eventTypes</code></td><td><code>string</code></td><td>Event types to return. Optional. This parameter can be repeated multiple times to return events of different types. If unset, returns all event types.<br><br>Acceptable values are:<ul><li>" <code>birthday</code> ": Special all-day events with an annual recurrence.</li><li>" <code>default</code> ": Regular events.</li><li>" <code>focusTime</code> ": Focus time events.</li><li>" <code>fromGmail</code> ": Events from Gmail.</li><li>" <code>outOfOffice</code> ": Out of office events.</li><li>" <code>workingLocation</code> ": Working location events.</li></ul></td></tr><tr><td><code>iCalUID</code></td><td><code>string</code></td><td>Specifies an event ID in the iCalendar format to be provided in the response. Optional. Use this if you want to search for an event by its iCalendar ID.</td></tr><tr><td><code>maxAttendees</code></td><td><code>integer</code></td><td>The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.</td></tr><tr><td><code>maxResults</code></td><td><code>integer</code></td><td>Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty <code>nextPageToken</code> field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.</td></tr><tr><td><code>orderBy</code></td><td><code>string</code></td><td>The order of the events returned in the result. Optional. The default is an unspecified, stable order.<br><br>Acceptable values are:<ul><li>" <code>startTime</code> ": Order by the start date/time (ascending). This is only available when querying single events (i.e. the parameter <code>singleEvents</code> is True)</li><li>" <code>updated</code> ": Order by last modification time (ascending).</li></ul></td></tr><tr><td><code>pageToken</code></td><td><code>string</code></td><td>Token specifying which result page to return. Optional.</td></tr><tr><td><code>privateExtendedProperty</code></td><td><code>string</code></td><td>Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints.</td></tr><tr><td><code>q</code></td><td><code>string</code></td><td>Free text search terms to find events that match these terms in the following fields:<br><ul><li><code>summary</code></li><li><code>description</code></li><li><code>location</code></li><li>attendee's <code>displayName</code></li><li>attendee's <code>email</code></li><li>organizer's <code>displayName</code></li><li>organizer's <code>email</code></li><li><code>workingLocationProperties.officeLocation.buildingId</code></li><li><code>workingLocationProperties.officeLocation.deskId</code></li><li><code>workingLocationProperties.officeLocation.label</code></li><li><code>workingLocationProperties.customLocation.label</code></li></ul><p>These search terms also match predefined keywords against all display title translations of working location, out-of-office, and focus-time events. For example, searching for "Office" or "Bureau" returns working location events of type <code>officeLocation</code>, whereas searching for "Out of office" or "Abwesend" returns out-of-office events. Optional.</p></td></tr><tr><td><code>sharedExtendedProperty</code></td><td><code>string</code></td><td>Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.</td></tr><tr><td><code>showDeleted</code></td><td><code>boolean</code></td><td>Whether to include deleted events (with <code>status</code> equals " <code>cancelled</code> ") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if <code>showDeleted</code> and <code>singleEvents</code> are both False. If <code>showDeleted</code> and <code>singleEvents</code> are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.</td></tr><tr><td><code>showHiddenInvitations</code></td><td><code>boolean</code></td><td>Whether to include hidden invitations in the result. Optional. The default is False.</td></tr><tr><td><code>singleEvents</code></td><td><code>boolean</code></td><td>Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.</td></tr><tr><td><code>syncToken</code></td><td><code>string</code></td><td>Token obtained from the <code>nextSyncToken</code> field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All events deleted since the previous list request will always be in the result set and it is not allowed to set <code>showDeleted</code> to False.<br>There are several query parameters that cannot be specified together with <code>nextSyncToken</code> to ensure consistency of the client state.<br><br>These are:<ul><li><code>iCalUID</code></li><li><code>orderBy</code></li><li><code>privateExtendedProperty</code></li><li><code>q</code></li><li><code>sharedExtendedProperty</code></li><li><code>timeMin</code></li><li><code>timeMax</code></li><li><code>updatedMin</code></li></ul>All other query parameters should be the same as for the initial synchronization to avoid undefined behavior. If the <code>syncToken</code> expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any <code>syncToken</code>.<br><a href="https://developers.google.com/workspace/calendar/api/guides/sync">Learn more</a> about incremental synchronization.<br>Optional. The default is to return all entries.</td></tr><tr><td><code>timeMax</code></td><td><code>datetime</code></td><td>Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If <code>timeMin</code> is set, <code>timeMax</code> must be greater than <code>timeMin</code>.</td></tr><tr><td><code>timeMin</code></td><td><code>datetime</code></td><td>Lower bound (exclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If <code>timeMax</code> is set, <code>timeMin</code> must be smaller than <code>timeMax</code>.</td></tr><tr><td><code>timeZone</code></td><td><code>string</code></td><td>Time zone used in the response. Optional. The default is the time zone of the calendar.</td></tr><tr><td><code>updatedMin</code></td><td><code>datetime</code></td><td>Lower bound for an event's last modification time (as a <a href="https://tools.ietf.org/html/rfc3339">RFC3339</a> timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of <code>showDeleted</code>. Optional. The default is not to filter by last modification time.</td></tr></tbody></table>

### Authorization

This request allows authorization with at least one of the following scopes:

Scope`https://www.googleapis.com/auth/calendar.readonly``https://www.googleapis.com/auth/calendar``https://www.googleapis.com/auth/calendar.events.readonly``https://www.googleapis.com/auth/calendar.events``https://www.googleapis.com/auth/calendar.app.created``https://www.googleapis.com/auth/calendar.events.freebusy``https://www.googleapis.com/auth/calendar.events.owned``https://www.googleapis.com/auth/calendar.events.owned.readonly``https://www.googleapis.com/auth/calendar.events.public.readonly`

For more information, see the [authentication and authorization](https://developers.google.com/workspace/guides/configure-oauth-consent) page.

### Request body

Do not supply a request body with this method.

## Response

If successful, this method returns a response body with the following structure:

```
{
  "kind": "calendar#events",
  "etag": etag,
  "summary": string,
  "description": string,
  "updated": datetime,
  "timeZone": string,
  "accessRole": string,
  "defaultReminders": [
    {
      "method": string,
      "minutes": integer
    }
  ],
  "nextPageToken": string,
  "nextSyncToken": string,
  "items": [
    events Resource
  ]
}
```

| Property name | Value | Description | Notes |
| --- | --- | --- | --- |
| `kind` | `string` | Type of the collection (" `calendar#events` "). |  |
| `etag` | `etag` | ETag of the collection. |  |
| `summary` | `string` | Title of the calendar. Read-only. |  |
| `description` | `string` | Description of the calendar. Read-only. |  |
| `updated` | `datetime` | Last modification time of the calendar (as a [RFC3339](https://tools.ietf.org/html/rfc3339) timestamp). Read-only. |  |
| `timeZone` | `string` | The time zone of the calendar. Read-only. |  |
| `accessRole` | `string` | The user's access role for this calendar. Read-only. Possible values are: - " `none` " - The user has no access. - " `freeBusyReader` " - The user has read access to free/busy information. - " `reader` " - The user has read access to the calendar. Private events will appear to users with reader access, but event details will be hidden. - " `writer` " - The user has read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible. - " `owner` " - The user has manager access to the calendar. This role has all of the permissions of the writer role with the additional ability to see and modify access levels of other users. |  |
| `defaultReminders[]` | `list` | The default reminders on the calendar for the authenticated user. These reminders apply to all events on this calendar that do not explicitly override them (i.e. do not have `reminders.useDefault` set to True). |  |
| `defaultReminders[].method` | `string` | The method used by this reminder. Possible values are: - " `email` " - Reminders are sent via email. - " `popup` " - Reminders are sent via a UI popup.  Required when adding a reminder. | writable |
| `defaultReminders[].minutes` | `integer` | Number of minutes before the start of the event when the reminder should trigger. Valid values are between 0 and 40320 (4 weeks in minutes).  Required when adding a reminder. | writable |
| `nextPageToken` | `string` | Token used to access the next page of this result. Omitted if no further results are available, in which case `nextSyncToken` is provided. |  |
| `items[]` | `list` | List of events on the calendar. |  |
| `nextSyncToken` | `string` | Token used at a later point in time to retrieve only the entries that have changed since this result was returned. Omitted if further results are available, in which case `nextPageToken` is provided. |  |

## Try it!

Use the APIs Explorer below to call this method on live data and see the response.