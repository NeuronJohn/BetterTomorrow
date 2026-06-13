# Card action behavior

The v1.30 package includes working card actions driven by the daily pack data.

## Fields

```json
{
  "url": "https://www.youtube.com/watch?v=vFW_TxKLyrE",
  "videoUrl": "https://www.youtube.com/watch?v=vFW_TxKLyrE",
  "openUrl": "https://www.youtube.com/watch?v=vFW_TxKLyrE",
  "detailsUrl": "https://docs.expo.dev/",
  "progressUrl": "https://expo.dev/accounts"
}
```

## Buttons

- Save: saves the card to Memory for the current session.
- Hide: hides the card from Brief/Updates for the current session.
- Open item: opens `url`, `videoUrl`, `youtubeUrl`, or `openUrl`.
- View progress: opens `progressUrl`.
- See details: opens `detailsUrl`.
- Memory bookmark: unsaves the item.

The Brief tab build-status `View progress` and `See details` buttons use teal text/icons only. The button backgrounds stay secondary/dark.


## v1.32 Hide behavior

- `Hide` on thumbnail cards opens the Tune overlay.
- `Too much` and `Not useful` inside Tune call the hide action.
- This keeps personalization decisions inside the daily tuning flow.
