export const defaultDailyPack = {
  "version": 2,
  "date": "2026-06-13",
  "notifications": {
    "morning": {
      "enabled": true,
      "time": "08:15",
      "title": "Daily Companion",
      "body": "Your brief is ready: one focused outcome, one useful update, one small reset."
    },
    "evening": {
      "enabled": true,
      "time": "20:45",
      "title": "Quick check-in",
      "body": "Drop one sentence so tomorrow can adjust."
    }
  },
  "brief": {
    "title": "Brief",
    "subtitle": "Your morning snapshot. Focus on what moves the needle today.",
    "greetingName": "Alex",
    "dateLabel": "Saturday, June 13",
    "direction": [
      {
        "icon": "target",
        "title": "Ship one high-impact outcome",
        "copy": "Finish the ticket tracker UI and commit."
      },
      {
        "icon": "people",
        "title": "Unblock and align",
        "copy": "Follow up on 2 pending conversations."
      },
      {
        "icon": "bolt",
        "title": "Keep the momentum",
        "copy": "Small consistent actions > big one-offs."
      }
    ]
  },
  "featured": {
    "id": "expo-100-seconds",
    "type": "youtube",
    "label": "YOUTUBE",
    "title": "Expo in 100 Seconds",
    "description": "Use this quick Expo refresher before testing today's Android build.",
    "duration": "2 min",
    "category": "React Native",
    "saved": true,
    "thumbnailKey": "ticketTracker",
    "thumbnailUrl": "https://img.youtube.com/vi/vFW_TxKLyrE/hqdefault.jpg",
    "url": "https://www.youtube.com/watch?v=vFW_TxKLyrE",
    "videoUrl": "https://www.youtube.com/watch?v=vFW_TxKLyrE",
    "openUrl": "https://www.youtube.com/watch?v=vFW_TxKLyrE",
    "detailsUrl": "https://docs.expo.dev/",
    "thumbnailSize": "main",
    "briefThumbnailSize": "small",
    "memoryThumbnailSize": "small",
    "thumbnailResizeMode": "cover",
    "thumbnailAspectRatio": 2.15,
    "cardStyle": "main",
    "briefCardStyle": "compact",
    "memoryCardStyle": "saved"
  },
  "buildStatus": {
    "id": "android-dev-build",
    "type": "activeProject",
    "label": "BUILD STATUS",
    "title": "Android dev build queue",
    "description": "No action needed. Keep reviewing visuals before touching the build.",
    "duration": "Active",
    "category": "Active project",
    "thumbnailKey": "buildQueue",
    "thumbnailSize": "small",
    "thumbnailResizeMode": "cover",
    "detailsUrl": "https://docs.expo.dev/build/introduction/",
    "progressUrl": "https://expo.dev/accounts/neuronjohn/projects/daily-companion"
  },
  "plan": {
    "title": "Today\u2019s plan",
    "subtitle": "A focused plan for steady progress without the pressure.",
    "mainTarget": {
      "label": "MAIN TARGET",
      "title": "Ship a clean ticket tracker UI",
      "copy": "Keep it small, clean, and commit-ready."
    },
    "tasks": [
      {
        "title": "Support-ticket mini demo",
        "copy": "Build the list, filters, and status flow with mock data.",
        "time": "60 min"
      },
      {
        "title": "Business nudge",
        "copy": "Send one useful update. No overthinking.",
        "time": "30 min"
      },
      {
        "title": "Stability reset",
        "copy": "Clear one small personal admin task.",
        "time": "20 min"
      }
    ]
  },
  "updates": [
    {
      "ref": "featured",
      "cardStyle": "main",
      "thumbnailAspectRatio": 2.15
    },
    {
      "ref": "buildStatus"
    }
  ],
  "memory": {
    "savedItems": [
      {
        "ref": "featured",
        "savedAt": "Saved",
        "duration": "2 min",
        "category": "React Native"
      }
    ],
    "preferences": [
      {
        "icon": "image",
        "text": "Prefer thumbnail-led updates",
        "color": "teal"
      },
      {
        "icon": "hide",
        "text": "Hide generic dashboard ideas",
        "color": "gold"
      },
      {
        "icon": "leaf",
        "text": "Keep daily nudges light",
        "color": "blue"
      }
    ],
    "tuneNotes": [],
    "notes": [
      {
        "icon": "note",
        "title": "Why this matters",
        "copy": "You saved a real Expo video task. Use it as a quick reference before testing today's build.",
        "date": "Saved May 10, 2025",
        "tag": "Context"
      }
    ]
  }
};
