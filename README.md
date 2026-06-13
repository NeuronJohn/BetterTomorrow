# Daily Companion Component UI v1.1

This is a real component-based UI package with data-driven daily content.

## What changed

- Replaced weak text symbols with generated PNG icon assets.
- Kept generated artwork only for small UI assets and 16:9 thumbnails.
- Added an **Import daily pack** button to the Brief tab.
- Added a JSON daily-pack system that controls:
  - Brief greeting/direction
  - Featured video/update
  - Plan tasks
  - Updates tab cards
  - Memory saved items/preferences/notes
  - Morning/evening notification copy
- The app stores imported JSON with AsyncStorage.
- No fake time/battery text is rendered; the app leaves top safe-area space for the phone OS.
- No new native dependencies.

## Daily pack import

Use the button on Brief: **Import daily pack**.

A template is included:

```text
daily_pack_template.json
```

Paste that JSON into the import modal, edit it, or ask ChatGPT for a new daily pack.

## Thumbnail support

The current build supports local thumbnail keys:

```json
"thumbnailKey": "ticketTracker"
```

or remote thumbnails:

```json
"thumbnailUrl": "https://example.com/thumbnail.jpg"
```

Remote URLs use React Native's built-in Image support.

## Build safety

This update uses only React Native components and bundled assets:

- `View`
- `Text`
- `Image`
- `Pressable`
- `ScrollView`
- `Modal`
- `TextInput`
- `AsyncStorage` already present in the project


## Morning / evening notifications

Daily pack JSON includes:

```json
"notifications": {
  "morning": { "enabled": true, "time": "08:15", "title": "Daily Companion", "body": "Your brief is ready." },
  "evening": { "enabled": true, "time": "20:45", "title": "Quick check-in", "body": "Drop one sentence so tomorrow can adjust." }
}
```

When a daily pack is imported, the app requests notification permission and schedules the morning/evening reminders from that JSON.


## Phone-fit note

This version is a device-fit test for Galaxy S24 Ultra / Pixel-class Android screens.

The previous generated preview images were static visual previews, not true Android emulator captures. This pass makes the real React Native layout safer by:
- disabling system font scaling for app UI text,
- making thumbnails use contain sizing instead of cropping,
- replacing absolute Memory layouts with normal flex rows,
- making preference cards horizontally scrollable instead of squeezing three cards into a narrow phone width.
