```
POST /new-event
payload: {
  name: {string} (required)
  description: {string} (required)
  note: {string}
  what: []
  where: []
  when: [] (required)
  invitees: []  (required)
  is_poll: {boolean} (required)
  host_id: {string} (required)
  host_photo_url: {string} (required)
  event_id: {string} (required)
  has_edited: {boolean} (required) default: false
}
```
