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


## v1.17 S24/Pixel targeted fix

This version intentionally does **not** modify:
- `src/screens/MemoryScreen.js`
- `src/screens/PlanScreen.js`

The update is only for:
- Brief import button placement,
- Brief/Updates thumbnail fit,
- Brief/Updates/Build action button sizing.


## v1.18 targeted note

This version only changes:
- Updates card thumbnail layout,
- Brief card thumbnail sizing,
- Brief/Updates/Build action button sizing.

It does not modify Plan or Memory screen files.


## v1.19 note

This patch keeps Plan unchanged. Memory is only touched to restore the Remembered preferences horizontal scroller.
The thumbnail fix is now layout-based: the right-side thumbnail has a fixed width so it cannot expand into a giant image on S24/Pixel.


## v1.20 device-fit note

The thumbnail issue is fixed at the layout level:
- Brief/Updates video thumbnails use a fixed 156x88 frame.
- The image can no longer decide the card height.
- Action buttons have dedicated padding inside the card.

Remembered preferences are back to horizontal scroll.


## v1.21 reference-match pass

This pass dissects the difference between the desired phone screenshots and the broken phone render:
- Broken: thumbnail either becomes a giant hero image or gets hard-locked too small.
- Fixed: thumbnail width is responsive and bounded using device width.
- Broken: import button was fixed absolute and appeared over cards while scrolling.
- Fixed: import button is now part of the Brief header and scrolls naturally.
- Broken: preferences either squeezed or oversized.
- Fixed: preferences are a horizontal scroller again.
