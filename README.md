# Daily Companion Dev Build v0.3

This version drops Expo Go. It is set up for a real Android **development build** installed on your phone.

## Why this setup

Expo Go is only a sandbox. A development build is your own custom version of Expo Go for this app, which means native config and notification behavior can be customized without depending on the Expo Go app version.

## Folder map

```text
App.js
src/DailyCompanionApp.js          Main screen / UI
src/data/projectQueue.js          Small hireability project ideas
src/services/planner.js           Daily plan logic
src/services/notifications.js     Android notification setup
src/services/storage.js           Local phone storage
src/services/date.js              Date helpers
src/styles/palette.js             Theme colors
eas.json                          Android dev/preview build profiles
scripts/                          Windows helper scripts
```

## First-time setup

Use PowerShell in this folder:

```powershell
npm install
npx expo install --fix
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile development
```

When EAS finishes, open the install link/QR on your Android phone. This installs **Daily Companion** as its own dev app.

## Daily editing flow after the dev app is installed

For normal JS/UI/text/planner edits:

```powershell
npx expo start --dev-client
```

Open the Daily Companion dev app on your phone. It connects to the dev server. Most future UI/text/task logic updates will show this way without rebuilding the APK.

## When you must rebuild

Rebuild only when we change native things, such as:

- new native package
- notification native config
- app permissions
- app icon/splash
- Android package name
- app.json plugin changes

Command:

```powershell
eas build --platform android --profile development
```

## Git commit for this setup

```powershell
git add .
git commit -m "feat: set up notification-first Android dev build"
```

## Current limitation

This is still local-first. It can schedule notifications from the app and remember your notes/preferences locally. For a true cloud AI companion that sends fresh AI-generated notifications even if you never open the app, we will later need a backend + push notification tokens + scheduled AI generation.
