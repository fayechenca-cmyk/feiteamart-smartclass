/**
 * FEI TeamArt · Foundation of Sketch · Step 1 "Form and Structure"
 * — single source of truth for the 11-lesson order and level grouping.
 *
 * Oct 2026 — replaces 3 independently-drifted copies of this same
 * data that had grown out of sync with each other: index.html's own
 * FOUNDATION_A_PATH, each lesson's local FOUNDATION_IDS array, and
 * the hardcoded "Lesson N" numbers in each lesson's own markup (none
 * of which agreed with each other or with this real order). One real
 * list now; every consuming file reads this instead of keeping its
 * own copy.
 *
 * Lesson ids are the stable identity — completedLessons, the badge
 * registry, core/access.js's FOUNDATION_A_STEP1_SKILLS, and students'
 * saved progress all key on these. Never renamed here even when
 * title, level, or position changes.
 *
 * level groups the path into two displayed sections (see
 * FOUNDATION_A_LEVELS below for the section labels) — purely a
 * display grouping, not a gating mechanism; access/order logic
 * elsewhere (core/access.js, the sequential "current" lesson on the
 * map) reads the flat array position, not level.
 */
(function (global) {
  'use strict';

  const FOUNDATION_A_PATH = [
    {
      id: 'preparation',
      title: 'Preparation',
      subtitle: 'Before you draw',
      emoji: '✏️',
      href: 'lessons/preparation/',
      ready: true,
      level: 1
    },
    {
      id: 'cube',
      title: 'The Cube',
      subtitle: 'Geometric form',
      emoji: '◧',
      href: 'lessons/lesson-3-cube/',
      ready: true,
      level: 1
    },
    {
      id: 'sphere',
      title: 'The Sphere',
      subtitle: 'Geometric form',
      emoji: '⬤',
      href: 'lessons/lesson-1-sphere/',
      ready: true,
      level: 1
    },
    {
      id: 'cylinder',
      title: 'The Cylinder',
      subtitle: 'Geometric form',
      emoji: '◗',
      href: 'lessons/lesson-5-cylinder/',
      ready: true,
      level: 1
    },
    {
      id: 'cone',
      title: 'The Cone',
      subtitle: 'Geometric form',
      emoji: '🔺',
      href: 'lessons/lesson-7-cone/',
      ready: true,
      level: 1
    },
    {
      id: 'intersecting',
      title: 'Intersecting Geometry',
      subtitle: 'Two forms, one space',
      emoji: '💎',
      href: 'lessons/lesson-9-intersecting/',
      ready: true,
      level: 1
    },
    {
      id: 'box',
      title: 'Gift Box',
      subtitle: 'Cube · gift box',
      emoji: '🎁',
      href: 'lessons/lesson-4-giftbox/',
      ready: true,
      level: 2
    },
    {
      id: 'cup',
      title: 'The Cup',
      subtitle: 'Cylinder · real world',
      emoji: '☕',
      href: 'lessons/lesson-6-cup/',
      ready: true,
      level: 2
    },
    {
      id: 'apple',
      title: 'The Apple',
      subtitle: 'Sphere · real world',
      emoji: '🍎',
      href: 'lessons/lesson-2-sphere-realworld/',
      ready: true,
      level: 2
    },
    {
      id: 'papercrane',
      title: 'Paper Crane',
      subtitle: 'Intersecting planes',
      emoji: '🕊️',
      href: 'lessons/lesson-10-papercrane/',
      ready: true,
      level: 2
    },
    {
      id: 'icecream',
      title: 'The Ice Cream',
      subtitle: 'Cone · real world',
      emoji: '🍦',
      href: 'lessons/lesson-8-icecream/',
      ready: true,
      level: 2
    }
  ];

  const FOUNDATION_A_LEVELS = [
    { level: 1, label: 'Level 1 · Basic Forms' },
    { level: 2, label: 'Level 2 · Forms in Real Objects' }
  ];

  global.FOUNDATION_A_PATH = FOUNDATION_A_PATH;
  global.FOUNDATION_A_LEVELS = FOUNDATION_A_LEVELS;
})(window);
