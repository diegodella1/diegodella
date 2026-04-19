# Contact Diego

Use this skill when an agent needs to open or use the contact flow on diegodella.ar.

## Endpoint

`POST https://diegodella.ar/api/contact`

## Request body

```json
{
  "mode": "conversation",
  "name": "Reader Name",
  "email": "reader@example.com",
  "subject": "Work with Diego",
  "message": "Context and request details."
}
```

## Modes

- `conversation` for direct outreach
- `updates` to request low-frequency update emails
