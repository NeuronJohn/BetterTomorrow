# Daily Companion

Daily Companion is a React Native / Expo Android app that turns an imported daily JSON file into a personalized productivity dashboard. The app combines a daily brief, task plan, updates feed, saved memory, card actions, and active project progress tracking.

The project was built to demonstrate practical mobile app development, reusable UI components, data-driven rendering, local persistence, and real-device UX iteration.

## Features

* Import daily content from a JSON pack
* Render dynamic Brief, Plan, Updates, Memory, and Progress screens
* Display video, project, reminder, and saved-item cards from structured data
* Support remote thumbnails and imported image URLs
* Save cards to Memory
* Remove saved cards with confirmation
* Open external links from cards
* Tune/hide cards through a feedback overlay
* Track active project progress with checkable tasks
* Add local project progress updates
* Persist imported content, saved items, tune notes, and progress locally

## Screens

### Brief

Daily overview with a greeting, direction cards, featured content, and active project entry point.

### Plan

Simple daily task list with a main target, supporting tasks, and time estimates.

### Updates

Scrollable feed of useful content, including videos, reminders, small project cards, and active project cards.

### Memory

Saved items, remembered preferences, notes, and memory-management sheets.

### Progress

Dedicated active-project screen with task checkoffs, progress percentage, next step, and update logging.

## Technical Highlights

### Data-Driven UI

Most screen content is rendered from an imported JSON pack rather than hardcoded into the app. This allows the same UI system to support different users, goals, projects, cards, images, and progress tasks.

### Reusable Card System

The app uses reusable card components for:

* Featured video cards
* Compact update cards
* Active project cards
* Saved memory cards
* Notes
* Preferences
* Project options

Cards support consistent actions such as save, hide/tune, open, view progress, and see details.

### Local Persistence

The app stores user state locally using AsyncStorage, including:

* Current imported daily pack
* Saved items
* Tune notes
* Checked project tasks
* Progress updates

This allows progress and saved context to remain available between sessions.

### Progress Tracking

Active project cards can open an in-app Progress screen. Project tasks are defined in the imported JSON pack using stable task IDs, allowing task completion to persist across minor content updates.

### Mobile UX Iteration

The UI was refined through real Android device testing. Updates focused on spacing, touch targets, card layout, thumbnail sizing, saved states, bottom navigation, and overlay behavior.

## Import Pack Structure

A daily pack can define the app’s content and behavior for the day.

Example:

```json
{
  "version": 4,
  "date": "2026-06-13",
  "brief": {},
  "featured": {},
  "buildStatus": {},
  "plan": {},
  "updates": [],
  "memory": {}
}
```

### Active Project Example

```json
{
  "id": "sellready-proof-pack",
  "type": "activeProject",
  "label": "ACTIVE PROJECT",
  "title": "SellReady proof pack",
  "description": "Sharpen the offer, build one proof asset, and leave with something useful.",
  "progressUrl": "https://example.com/project",
  "detailsUrl": "https://example.com/details",
  "progress": {
    "summary": "Why this project matters right now.",
    "currentStep": "The next best step.",
    "tasks": [
      {
        "id": "stable-task-id",
        "title": "Task title",
        "copy": "Task description.",
        "time": "10 min",
        "category": "Proof"
      }
    ]
  }
}
```

## Project Structure

```text
src/
  components/
    AppShell.js
    AssetIcon.js
    BottomNav.js
    Buttons.js
    Cards.js
    ImportDailyPackModal.js

  data/
    assets.js
    defaultDailyPack.js

  hooks/
    useDailyPack.js

  screens/
    BriefScreen.js
    MemoryScreen.js
    PlanScreen.js
    ProgressScreen.js
    UpdatesScreen.js

  services/
    notifications.js

  theme/
    tokens.js
```

## Setup

Install dependencies:

```bash
npm install
```

Start the development client:

```bash
npm run start
```

Run on Android:

```bash
npm run android
```

Build Android development version:

```bash
npm run build:android:dev
```

## Recent Updates

### Progress Screen

Added an in-app progress screen for active projects. Users can check off tasks, view completion percentage, add progress notes, and open related project links.

### Memory Actions

Added saved-item management, memory sheets, remembered notes, and preference-management UI.

### Card Actions

Improved card behavior for save, unsave, hide/tune, open item, view progress, and project options.

### Daily Pack Import

Expanded the import format to support richer cards, remote images, saved items, memory notes, tune notes, and project progress tasks.

### Mobile UI Polish

Improved card spacing, thumbnail layouts, button padding, saved states, overlays, and Android phone fit.

## Skills Demonstrated

* React Native mobile development
* Expo development workflow
* Component-based UI architecture
* Data-driven rendering from JSON
* Local persistence with AsyncStorage
* Mobile UI/UX iteration
* Interactive card systems
* Progress tracking workflows
* State management across screens
* Real-device debugging and layout refinement

## Summary

Daily Companion is a working mobile app prototype focused on personalized daily productivity. It demonstrates how imported structured data can drive a mobile dashboard with saved memory, useful content, and active project progress tracking.
