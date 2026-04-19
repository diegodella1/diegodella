# Subscribe to Updates

Use this skill when an agent needs to subscribe a reader to low-frequency update emails from Narrative Mechanics.

## Endpoint

`POST https://diegodella.ar/api/subscribe`

## Request body

```json
{
  "email": "reader@example.com"
}
```

## Result

The API returns success for new subscriptions and may also return success when the email already exists.
