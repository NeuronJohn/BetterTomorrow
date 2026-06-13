# v1.1

- Added generated PNG icon assets for navigation, buttons, direction rows, memory cards, and import.
- Added data-driven daily pack.
- Added Brief tab import button and import modal.
- Added AsyncStorage persistence for imported daily content.
- Updated Brief/Plan/Updates/Memory to read from the daily pack.
- Added daily_pack_template.json.
- Tightened card spacing and reduced dead space in the preview screens.


# v1.2

- Added notification scheduling service for the imported daily pack.
- Morning and evening notification time/title/body now come from daily_pack_template.json.
- Importing a daily pack schedules the morning/evening notifications if permission is granted.


# v1.3

- Enlarged all PNG icons in nav, buttons, cards, tune sheet, and direction rows.
- Increased button heights from compact to touch-friendly.
- Increased bottom nav height and active tab height.
- Reworked text containers to avoid clipping and overlap.
- Added numberOfLines/minWidth guards to important text blocks.
- Tightened dead space while keeping cards breathable.


# v1.4

- Bottom nav icons enlarged only; nav dimensions/layout left unchanged.
- Every other button made taller.
- Button icons enlarged significantly.
- Button text set to shrink safely instead of overflowing.
- Tune option buttons now use safer two-column spacing instead of cramped wrap math.
- Added row min-heights so taller buttons do not overlap card content.


# v1.5

- Rebuilt spacing and padding across cards, buttons, sheet, memory, plan, and brief.
- Added stronger padding in every direction so content no longer sits against edges.
- Replaced bookmark with a cleaner custom ribbon icon.
- Reworked text blocks with smaller safe type, line caps, shrink-to-fit, and minimum widths.
- Made all non-nav buttons taller with larger icons.
- Rebalanced Tune sheet spacing so options, reason field, and bottom actions do not overlap.
- Reworked Memory card layout to avoid text/meta collisions.


# v1.6

- Removed top-right bookmark from normal Updates cards; Save is now the only save control there.
- Kept the Memory card bookmark control so saved items can be unsaved from Memory later.
- Fixed Save / Hide / Open item overlap with safer flex proportions and preview layout.
- Moved Brief import button to the top-right header area and kept phone safe-area spacing.
- Reduced dead space under the main thumbnail/details block.


# v1.7

- Moved Brief import button higher/right, above the description area without touching the header copy.
- Memory saved-card bookmark is now a true square button with the icon centered.
- Preference cards now start text beside the icon and wrap below cleanly without sitting on the icon.
- Added more space between video length pill and action buttons.
- Fixed Brief video card text so it stays in its own column with padding from the thumbnail.


# v1.8

- Renamed Brief import button from “Import daily pack” to “Import pack”.
- Reduced the Brief import button width so the label fits cleanly.


# v1.11

- Rebuilt from v1.8 base.
- Removed only the actual thumbnail overlay play circle from Brief video cards.
- Removed only the actual thumbnail overlay duration badge from Brief video cards.
- Kept the clean UI duration bubble (`10 min`) and the `Open item` button.
- Regenerated the Brief preview from scratch instead of pasting a second thumbnail over the old screenshot.


# v1.12

- Widened the Brief `Import pack` button so the text fits cleanly with the import icon.
- Kept the icon and overall button styling unchanged.


# v1.13

- Widened the Brief `Import pack` button a bit more so the label has visible padding from the right border.
- Kept the import icon and overall styling unchanged.


# v1.14

- Locked the Brief header text above the green background glow.
- Added z-index/elevation guards so background glow layers stay behind content.
- Kept the corrected `Import pack` button sizing from v1.13.


# v1.17 S24/Pixel targeted fix

- Based on v1.14.
- Did not modify MemoryScreen.js or PlanScreen.js.
- Moved Brief `Import pack` to a Brief-only absolute header overlay so it is not below the description.
- Added a compact card-only thumbnail for Brief/Updates cards; Memory keeps the original saved-item thumbnail behavior.
- Tuned Save / Hide / Open item / View progress / See details button sizing so labels do not collapse into tiny text on Android.


# v1.18 S24/Pixel compact thumbnail fix

- Did not modify MemoryScreen.js or PlanScreen.js.
- Removed the giant full-width Updates thumbnail layout.
- Updates now uses the same compact side-by-side thumbnail structure as Brief.
- Brief thumbnail/text split was tightened so the image cannot dominate the card.
- Action buttons were tuned down into compact pills so labels do not get smushed.


# v1.19 S24/Pixel targeted fix

- Restored Remembered preferences to horizontal sideways scroll cards.
- Fixed Updates thumbnail layout by hard-capping thumbnail width; it can no longer become a giant card image.
- Fixed Brief thumbnail layout with a fixed thumbnail width so it cannot dominate the card.
- Added inner horizontal padding to Updates/Brief/Build action button rows so buttons do not sit on card edges.


# v1.20 device-fit reset

- Dissected the actual issue: thumbnail frames were still allowed to grow into giant sections.
- Rewrote Brief and Updates video cards into a shared fixed-thumbnail layout.
- Right-side thumbnail is now a hard 156x88 frame and can no longer grow into a giant image.
- Build thumbnail is fixed to a compact frame.
- Action rows now have inner horizontal padding so buttons do not touch card edges.
- Restored Remembered preferences to horizontal scrolling cards.


# v1.21 reference-match pass

- Fixed the import button: it now scrolls with the Brief header instead of floating over cards.
- Replaced the hard-tiny thumbnail lock with a responsive thumbnail: large enough like the good reference, but bounded so it cannot become a giant image.
- Brief and Updates share the same card geometry so they feel identical.
- Action buttons keep the good compact look and have inner row padding.
- Remembered preferences remain a horizontal sideways scroller with readable card text.


# v1.22 card width pass

- Reduced page side gutters so the main cards sit closer to the screen edge without touching it.
- Kept the rest of the layout logic the same.


# v1.23 reference layout correction

- Main cards remain wider from v1.22.
- Header import button is now layout-based inside the title row, not absolute/floating over card content.
- Updates card returns to the good reference structure: large top thumbnail, but with a shorter 2.05:1 ratio so it is not too tall.
- Brief card keeps the side-by-side structure, with a larger responsive right thumbnail instead of the hard-tiny thumbnail.
- Buttons retain inner row padding and readable text.


# v1.24 non-plan density pass

- PlanScreen.js, AppShell, and BottomNav were left unchanged because Plan looks good.
- Fixed Brief morning card by adding the missing internal layout/padding and reducing only Brief content density.
- Rebuilt Memory into the compact reference style: smaller saved card, compact thumbnail asset, readable sideways preference cards, compact notes.
- Reduced Brief/Updates/Build card vertical density slightly without changing the overall visual direction.


# v1.25 thumbnail-card-only pass

- Only thumbnail card components were changed.
- Brief video card, Updates video card, and Build status card were rebuilt to remove dead space and bad thumbnail/text placement.
- No changes to PlanScreen.js, MemoryScreen.js, AppShell.js, BottomNav.js, or Buttons.js.
- Updates thumbnail keeps the large reference-style top layout but with a shorter, cleaner media band.
- Brief thumbnail keeps the side-by-side layout but uses card-relative sizing instead of window-based hard sizing.
- Build status card thumbnail/text row is tightened without changing the button style.


# v1.26 thumbnail system pass

- Rebuilt thumbnail cards around two explicit data-driven variants: `thumbnailSize: "main"` and `thumbnailSize: "small"`.
- Main thumbnail cards are for focus updates/videos.
- Small thumbnail cards are for Brief, saved items, and secondary cards.
- Cards now support actual YouTube thumbnail URLs through `thumbnailUrl`.
- Added per-screen overrides: `briefThumbnailSize`, `memoryThumbnailSize`, and update-entry `thumbnailSize`.
- Updates screen now resolves the `updates` array instead of hardcoding only the featured/build cards, so daily JSON can build thumbnail cards directly.
- Saved item thumbnail source now uses the same card-thumbnail source logic as Brief/Updates.
- Added THUMBNAIL_CARD_DATA.md with JSON examples.


# v1.27 tab-aware card style pass

- Added tab-aware card styles so imported data can render differently in Brief, Updates, and Memory while keeping the same look and feel.
- Rebuilt thumbnail cards into stable style variants: `main`, `compact`, `buildStatus`, and Memory `saved`.
- Larger thumbnails, less dead space, and cleaner text placement inside thumbnail cards.
- Memory saved thumbnail card now has its own layout: bigger thumbnail, bookmark in a label row, no title overlap.
- Updated daily pack template and THUMBNAIL_CARD_DATA.md with exact JSON options.


# v1.28 thumbnail card fit pass

- Focused only on cards that contain thumbnails.
- Reduced dead space in main/compact/build thumbnail cards.
- Made thumbnails larger where they were floating too small, but kept them bounded inside the card.
- Shortened card action buttons inside thumbnail cards without changing the global Button component.
- Main focus thumbnails now clamp to a wider/shorter aspect ratio so old imported 16:9 data does not create a too-tall card.
- Memory saved card thumbnail is larger and the bookmark is smaller inside the label row.
