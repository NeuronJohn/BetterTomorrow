# Import schema for repeatable cards

A daily pack can recreate the exact card styles by sending content plus style hints.

## Main video/update card

```json
{
  "id": "youtube-task-1",
  "type": "youtube",
  "label": "YOUTUBE",
  "title": "Video title",
  "description": "Why it matters today.",
  "duration": "8 min",
  "category": "Skill",
  "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "cardStyle": "main",
  "thumbnailAspectRatio": 2.15
}
```

## Compact Brief card

```json
{
  "ref": "featured",
  "briefCardStyle": "compact"
}
```

## Active project/build card

```json
{
  "id": "android-dev-build",
  "type": "activeProject",
  "label": "BUILD STATUS",
  "title": "Android dev build queue",
  "description": "No action needed. Keep reviewing visuals before touching the build.",
  "thumbnailUrl": "https://example.com/project-thumb.png",
  "duration": "Active",
  "category": "Active project",
  "progressUrl": "https://example.com/progress",
  "detailsUrl": "https://example.com/details"
}
```

Add saved active projects to memory:

```json
"memory": {
  "savedItems": [
    { "ref": "buildStatus", "id": "android-dev-build", "duration": "Active", "category": "Active project" }
  ]
}
```

## Tune memory

Tune choices are stored under `memory.tuneNotes` at runtime and in AsyncStorage. Daily imports may also include prior tuneNotes if you want to carry them forward.
