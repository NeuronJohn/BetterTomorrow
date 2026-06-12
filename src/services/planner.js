import { PROJECT_QUEUE } from '../data/projectQueue';

export const defaultSettings = {
  notificationLoopEnabled: false,
  morningEnabled: true,
  eveningEnabled: true,
  morningHour: 8,
  morningMinute: 45,
  eveningHour: 21,
  eveningMinute: 10
};

export const emptyState = {
  settings: defaultSettings,
  preferences: { notInterested: [] },
  notificationLog: [],
  days: {}
};

export function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalize(text) {
  return String(text || '').toLowerCase();
}

function getPreviousDay(state, currentKey) {
  const keys = Object.keys(state.days || {}).filter((key) => key < currentKey).sort();
  return keys.length ? state.days[keys[keys.length - 1]] : null;
}

export function dislikesTopic(topic, preferences) {
  const blocked = preferences?.notInterested || [];
  return blocked.some((item) => item.topic === topic || normalize(item.reason).includes(topic));
}

function pickProject(dateKey, state) {
  const previous = getPreviousDay(state, dateKey);
  const text = normalize(`${previous?.notes || ''} ${previous?.reflection || ''}`);
  const usable = PROJECT_QUEUE.filter((project) => !dislikesTopic(project.topic, state.preferences));
  const list = usable.length ? usable : PROJECT_QUEUE;

  const match = list.find((project) => {
    if ((text.includes('support') || text.includes('ticket') || text.includes('bug')) && project.topic === 'support') return true;
    if ((text.includes('data') || text.includes('csv') || text.includes('spreadsheet')) && project.topic === 'automation') return true;
    if ((text.includes('sql') || text.includes('database')) && project.topic === 'sql') return true;
    if ((text.includes('ui') || text.includes('button') || text.includes('ugly') || text.includes('spacing')) && project.topic === 'ui') return true;
    if ((text.includes('github') || text.includes('resume') || text.includes('hire')) && project.topic === 'github') return true;
    if ((text.includes('sellready') || text.includes('clearhouse') || text.includes('business')) && project.topic === 'business') return true;
    return false;
  });

  if (match) return match;

  const seed = dateKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return list[seed % list.length];
}

export function generateDay(state, dateKey) {
  const previous = getPreviousDay(state, dateKey);
  const previousText = normalize(`${previous?.notes || ''} ${previous?.reflection || ''}`);
  const lowEnergy = ['tired', 'burned', 'burnt', 'overwhelmed', 'bad day', 'exhausted', 'sick'].some((word) =>
    previousText.includes(word)
  );

  const project = pickProject(dateKey, state);
  const rawTasks = [
    {
      id: makeId('task'),
      topic: 'business',
      section: 'Direction',
      title: 'One business nudge',
      detail: 'Message, post, improve one offer section, or follow up once for SellReady/ClearHouse.',
      reason: 'Keeps the business moving without turning the day into a giant project.',
      done: false
    },
    {
      id: makeId('task'),
      topic: project.topic,
      section: 'Hireability Project',
      title: project.title,
      detail: project.detail,
      reason: project.why,
      finishLine: project.finishLine,
      done: false
    },
    {
      id: makeId('task'),
      topic: 'life',
      section: 'Stability',
      title: lowEnergy ? 'Minimum viable reset' : 'One stability reset',
      detail: lowEnergy
        ? 'Smallest useful reset: shower, food/water, trash, or clear one surface.'
        : 'Handle one practical thing: food, water, laundry, car, inbox, bills, calendar, or paperwork.',
      reason: 'Less chaos makes tomorrow easier.',
      done: false
    }
  ];

  const tasks = rawTasks.filter((task) => !dislikesTopic(task.topic, state.preferences));

  return {
    date: dateKey,
    createdAt: new Date().toISOString(),
    greeting: lowEnergy ? 'Good morning. Keep it light, but keep it real.' : 'Good morning. Small plan, real direction.',
    brief: previous ? 'Built from your last notes/reflection.' : 'No previous note yet. Tonight, leave one sentence and tomorrow gets smarter.',
    tasks: tasks.length ? tasks : rawTasks,
    notes: '',
    reflection: '',
    skipped: false
  };
}

export function notificationBodyForDay(day) {
  const project = day.tasks.find((task) => task.section === 'Hireability Project') || day.tasks[0];
  if (!project) return 'Open your small plan. No pressure spiral.';
  return `${project.title}. Finish line: ${project.finishLine || project.detail}`;
}

export function addLog(state, title, body) {
  return [
    {
      id: makeId('log'),
      title,
      body,
      createdAt: new Date().toISOString()
    },
    ...(state.notificationLog || [])
  ].slice(0, 20);
}
