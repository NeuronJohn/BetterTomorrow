# Card style + thumbnail data options

Daily pack data now maps to stable card styles, instead of one thumbnail layout trying to fit every tab.

## Core thumbnail fields

Use a real URL whenever possible:

```json
"thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg"
```

Bundled fallback:

```json
"thumbnailKey": "ticketTracker"
```

YouTube videos should use the actual video thumbnail URL. The app will render it into the selected card style.

## Card styles

### `main`

Large focus card for the Updates tab. It uses a full-width media band, then text/meta underneath.

```json
{
  "label": "YOUTUBE",
  "title": "Build a clean ticket tracker UI",
  "description": "Use it as a fast AI-assisted project and commit the result today.",
  "duration": "10 min",
  "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  "cardStyle": "main"
}
```

### `compact`

Side-by-side layout for Brief and secondary cards. Thumbnail is larger than before but stays inside the card.

```json
{
  "label": "YOUTUBE",
  "title": "Build a clean ticket tracker UI",
  "description": "Use it as a fast AI-assisted project and commit the result today.",
  "duration": "10 min",
  "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  "cardStyle": "compact"
}
```

### `buildStatus`

Used automatically when an update entry references `buildStatus`.

### `saved`

Used by Memory saved cards. It gets its own layout so the bookmark, text, and thumbnail do not fight each other.

## Per-tab overrides

The same item can render differently on each tab:

```json
{
  "id": "video-1",
  "type": "youtube",
  "label": "YOUTUBE",
  "title": "Video title",
  "description": "Why it matters today.",
  "duration": "10 min",
  "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  "cardStyle": "main",
  "briefCardStyle": "compact",
  "memoryCardStyle": "saved"
}
```

## Updates array

The Updates tab reads the `updates` array directly:

```json
"updates": [
  {
    "ref": "featured",
    "cardStyle": "main"
  },
  {
    "id": "quick-video",
    "type": "youtube",
    "label": "YOUTUBE",
    "title": "A shorter useful video",
    "description": "One sentence explaining why it helps today.",
    "duration": "8 min",
    "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
    "cardStyle": "compact"
  },
  {
    "ref": "buildStatus"
  }
]
```

## Aspect ratio

Default is `16 / 9` (`1.777`). For a wider/shorter focus thumbnail:

```json
"thumbnailAspectRatio": 1.9
```

## Resize mode

Default is `cover`. Use `contain` only when cropping would ruin the thumbnail:

```json
"thumbnailResizeMode": "contain"
```


## v1.28 fit notes

The app now treats thumbnail cards as dense card compositions:
- `main` cards use a wide/short thumbnail band to avoid huge dead space.
- `compact` cards use a larger right-side thumbnail while keeping text readable.
- Build status cards use a bigger thumbnail and shorter action buttons.
- Memory saved cards use a bigger left thumbnail and a smaller bookmark button inside the label row.

Recommended defaults:
```json
{
  "cardStyle": "main",
  "briefCardStyle": "compact",
  "memoryCardStyle": "saved",
  "thumbnailAspectRatio": 2.05,
  "thumbnailResizeMode": "cover"
}
```
