# Thumbnail card data options

Cards with thumbnails now use explicit data-driven sizing.

## Thumbnail source

Use either:

```json
"thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg"
```

or a bundled key:

```json
"thumbnailKey": "ticketTracker"
```

For YouTube videos, send the actual video thumbnail URL in `thumbnailUrl`.

## Thumbnail size options

Use this on a card or update entry:

```json
"thumbnailSize": "main"
```

or

```json
"thumbnailSize": "small"
```

### main
Large focus card. Best for the first Updates card or the main daily video.

### small
Side-by-side compact card. Best for Brief, saved items, and secondary updates.

## Per-screen override

The same item can be large on Updates and small on Brief/Memory:

```json
{
  "id": "video-1",
  "type": "youtube",
  "label": "YOUTUBE",
  "title": "Video title",
  "description": "Why it matters today.",
  "duration": "10 min",
  "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  "thumbnailSize": "main",
  "briefThumbnailSize": "small",
  "memoryThumbnailSize": "small"
}
```

## Aspect ratio

Default is `1.777` (16:9). For a slightly wider/shorter focus card:

```json
"thumbnailAspectRatio": 1.9
```

## Resize mode

Default is cover. You can use contain only when you must show the full image without crop:

```json
"thumbnailResizeMode": "contain"
```
