# Progress screen import schema

`View progress` opens an in-app progress screen instead of leaving the app.

Attach progress data to an active project card:

```json
"buildStatus": {
  "id": "android-dev-build",
  "type": "activeProject",
  "label": "BUILD STATUS",
  "title": "Android dev build queue",
  "description": "No action needed. Keep reviewing visuals before touching the build.",
  "progressUrl": "https://expo.dev/accounts/neuronjohn/projects/daily-companion",
  "detailsUrl": "https://docs.expo.dev/build/introduction/",
  "progress": {
    "summary": "Track the dev build until the UI is clean enough to keep moving.",
    "currentStep": "Test the newest build and check off what actually works on your phone.",
    "tasks": [
      {
        "id": "install-test-build",
        "title": "Install and open the latest dev build",
        "copy": "Confirm it launches cleanly and the bottom nav still feels right.",
        "time": "10 min",
        "category": "Testing"
      }
    ]
  }
}
```

Runtime state:
- Checked tasks are stored locally by project id.
- Progress updates are stored locally by project id.
- Imports can replace task text while keeping local completion by matching stable task ids.

Button behavior:
- `View progress` opens the in-app progress screen.
- `Open project` inside Progress opens `progressUrl`.
- `Details` inside Progress opens `detailsUrl`.
