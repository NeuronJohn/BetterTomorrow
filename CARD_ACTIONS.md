# Card actions

## Save
Adds the card to Memory. The button turns green and says `Saved`.

## Saved / Memory bookmark
Opens the confirmation overlay. Confirming removes the item from Memory/saved state only. It does not hide or delete the card from Brief/Updates.

## Hide
Opens the Tune overlay. The card is hidden only if the user chooses `Too much` or `Not useful` inside Tune.

## Open item
Opens `url`, `videoUrl`, `youtubeUrl`, or `openUrl`.

## Active project card three dots
The `•••` button opens Project options:
- Save / Saved
- Tune / Hide
- View progress
- See details

Active projects should come from import data with:
```json
{
  "ref": "buildStatus",
  "id": "android-dev-build",
  "type": "activeProject",
  "title": "Android dev build queue",
  "description": "No action needed. Keep reviewing visuals before touching the build.",
  "thumbnailUrl": "https://example.com/project-thumb.png",
  "progressUrl": "https://example.com/progress",
  "detailsUrl": "https://example.com/details"
}
```

## Memory buttons
- Saved items `See all` opens all saved items.
- Remembered preferences `Manage` opens preferences and backend tune-memory summary.
- Remembered notes `See all` opens all notes.
