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
