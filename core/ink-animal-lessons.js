/* ============================================================
 * FEI TeamArt · core/ink-animal-lessons.js
 *
 * Ink Animal Studio — single source of truth for the 10-animal path.
 * Edit ONLY this file to add real content for animals 02-10 — every
 * animal after Rabbit is a placeholder (locked, no video, no real
 * material list yet) until its own lesson is actually built.
 *
 * HOW TO ADD REAL CONTENT FOR THE NEXT ANIMAL:
 * 1. Find its entry in the `lessons` array below.
 * 2. Fill in teacherVideoUrl, and adjust materials/personalityOptions
 *    if this animal needs anything different from the shared set.
 * 3. Do NOT flip `locked` here — that's a purchase check
 *    (see core/ink-animal-access.js), not a content-readiness flag.
 * ============================================================ */

const INK_ANIMAL_LESSONS = {
  courseId: 'ink-animal-studio',

  lessons: [
    {
      lessonId: 'rabbit-01', order: 1, animalName: 'Rabbit', chineseCharacter: '兔',
      free: true, locked: false,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '', // TODO(Faye): paste the real Rabbit teacher video URL/ID here
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    },
    {
      lessonId: 'rooster-02', order: 2, animalName: 'Rooster', chineseCharacter: '鸡',
      free: false, locked: true,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '',
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    },
    {
      lessonId: 'pig-03', order: 3, animalName: 'Pig', chineseCharacter: '猪',
      free: false, locked: true,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '',
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    },
    {
      lessonId: 'tiger-04', order: 4, animalName: 'Tiger', chineseCharacter: '虎',
      free: false, locked: true,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '',
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    },
    {
      lessonId: 'horse-05', order: 5, animalName: 'Horse', chineseCharacter: '马',
      free: false, locked: true,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '',
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    },
    {
      lessonId: 'monkey-06', order: 6, animalName: 'Monkey', chineseCharacter: '猴',
      free: false, locked: true,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '',
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    },
    {
      lessonId: 'goat-07', order: 7, animalName: 'Goat', chineseCharacter: '羊',
      free: false, locked: true,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '',
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    },
    {
      lessonId: 'ox-08', order: 8, animalName: 'Ox', chineseCharacter: '牛',
      free: false, locked: true,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '',
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    },
    {
      lessonId: 'dog-09', order: 9, animalName: 'Dog', chineseCharacter: '狗',
      free: false, locked: true,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '',
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    },
    {
      lessonId: 'dragon-10', order: 10, animalName: 'Dragon', chineseCharacter: '龙',
      free: false, locked: true,
      personalityOptions: ['Sleepy', 'Proud', 'Angry', 'Shy', 'Curious', 'Silly'],
      teacherVideoUrl: '',
      materials: ['Ink stick or bottled ink', 'Water brush or soft brush', 'Rice paper (or absorbent paper)', 'Water cup', 'Small plate for mixing', 'Paper towel']
    }
  ],

  getLesson(lessonId) {
    return this.lessons.find(l => l.lessonId === lessonId) || null;
  },

  getByOrder(order) {
    return this.lessons.find(l => l.order === order) || null;
  },

  getFreeLessons() {
    return this.lessons.filter(l => l.free);
  },

  // Content-readiness, not purchase state — a locked-but-content-ready
  // animal is still "locked" for a non-paying student. Purchase state
  // itself lives in core/ink-animal-access.js (course_purchases table),
  // not here.
  isLockedByDefault(lessonId) {
    const lesson = this.getLesson(lessonId);
    return lesson ? lesson.locked : true;
  }
};

window.INK_ANIMAL_LESSONS = INK_ANIMAL_LESSONS;
