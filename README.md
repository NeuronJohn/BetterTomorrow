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


## v1.22 card width pass

This pass only widens the main page cards by reducing the global screen horizontal padding.


## v1.23 reference layout correction

This version reverts the bad hard-lock thumbnail approach:
- Updates uses a large top thumbnail again, matching the reference, but with shorter aspect ratio.
- Brief uses a large side thumbnail again, matching the reference, but bounded to phone width.
- Import pack is part of the header layout instead of an absolute overlay.


## v1.24 non-plan density pass

Plan is intentionally preserved. This pass targets the screens that looked too large on the phone:
- Brief morning card now has proper internal padding/flex layout.
- Memory card layout matches the compact reference more closely.
- Brief/Updates feature cards are slightly denser while preserving the v1.23 reference direction.


## v1.25 thumbnail-card-only pass

This update is intentionally limited to `src/components/Cards.js`.

It fixes only the cards with thumbnails:
- Brief feature card
- Updates feature card
- Build status card
- Tune preview thumbnail card keeps compatible sizing

Unchanged:
- Plan screen
- Memory screen
- App shell/header/nav
- Bottom nav
- Button component styling


## v1.26 thumbnail card system

This pass fixes thumbnail cards by making them data-driven instead of guessing layout from one placeholder image.

Use these fields in the daily pack:
- `thumbnailUrl`: actual remote thumbnail URL, e.g. a YouTube video thumbnail.
- `thumbnailSize`: `"main"` or `"small"`.
- `briefThumbnailSize`: optional override for Brief.
- `memoryThumbnailSize`: optional override for Memory saved items.
- `thumbnailAspectRatio`: optional, default 1.777.
- `thumbnailResizeMode`: `"cover"` by default, `"contain"` when needed.

See `THUMBNAIL_CARD_DATA.md`.


## v1.27 tab-aware card styles

Cards with thumbnails now have tab-aware styles:
- Updates focus card: `cardStyle: "main"`
- Brief card: `briefCardStyle: "compact"`
- Memory saved card: `memoryCardStyle: "saved"`
- Secondary update cards: `cardStyle: "compact"`

Use actual video thumbnails via `thumbnailUrl`. See `THUMBNAIL_CARD_DATA.md`.


## v1.28 thumbnail card fit pass

This pass focuses only on cards with thumbnails:
- Updates main card
- Brief compact card
- Build status card
- Memory saved card

It keeps the app-wide nav/header/button system intact and makes the card compositions denser, with bigger thumbnails and less dead space.


## v1.29 visible thumbnail composition reset

This pass makes the thumbnail-card change visually obvious:
- Main cards no longer use the old lower two-column metadata layout.
- Buttons are only locally tightened inside thumbnail cards.
- Compact cards and saved cards use larger thumbnails with less dead space.


## v1.30 functional cards

This build includes a real preloaded daily pack and working card actions.

Included pack files:
- `daily_pack_today.json`
- `daily_pack_2026-06-13.json`

The featured task uses a real YouTube video and actual YouTube thumbnail URL for `Expo in 100 Seconds`. Save, Hide, Open item, View progress, See details, and Memory unsave now work from the preloaded/imported daily pack data.

Requested color tweak: the Brief tab build-status buttons `View progress` and `See details` use the same teal as the Open item button for text/icons only.


## v1.31 saved confirmation polish

Saved state is now clearer:
- Saved = green text + green bookmark icon.
- Save = muted text + muted bookmark icon.
- Pressing Saved or a Memory bookmark opens a confirmation overlay before unsaving.
- Time chips include the clock icon inside the chip.


## v1.32 Hide opens Tune overlay

Hide now opens the Tune overlay instead of immediately hiding. The actual hide happens from the Tune overlay options like "Too much" or "Not useful."


## v1.33 Tune overlay + memory backend

Hide opens a real modal Tune overlay now. Swipe down from the handle to close it, or tap outside.

Tune decisions are stored in backend-only memory state:
- `memory.tuneNotes`
- persisted locally with AsyncStorage

Unsaving only removes the saved Memory item and flips saved buttons back to Save. It does not hide the card.


## v1.34 Action UI + Memory sheets

Interactive polish added:
- `See all` and `Manage` buttons now open real bottom-sheet UI.
- Build status `•••` opens active project options.
- Imported data can replicate the same card look using the schema in `IMPORT_SCHEMA.md`.


## v1.35 link fix

The app now opens web links directly with `Linking.openURL` and normalizes missing protocols.

Build progress URL:
`https://expo.dev/accounts/neuronjohn/projects/daily-companion`

This should fix:
- Open item not opening YouTube.
- View progress not opening the Expo project.


## v1.36 Progress screen

`View progress` now opens an in-app screen where the user can:
- check off project tasks,
- see percent complete,
- add progress updates,
- open the external Expo project link from inside the progress screen.

See `PROGRESS_SCHEMA.md` for import format.
