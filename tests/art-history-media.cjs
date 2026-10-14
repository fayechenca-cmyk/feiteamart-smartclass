// Run: node tests/art-history-media.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({ window: {} });
const run = name => vm.runInContext(fs.readFileSync(path.join(root, 'art-theory', name), 'utf8'), context);
run('curriculum.js');
const before = JSON.parse(JSON.stringify(context.window.FEI_ART_HISTORY_TRACKS));
run('western-media.js');
const after = JSON.parse(JSON.stringify(context.window.FEI_ART_HISTORY_TRACKS));
assert.equal(before.china.lessons.length, 20);
assert.deepEqual(after.china, before.china, 'Chinese track must remain unchanged');
assert.equal(after.western.lessons.length, 36);
let count = 0;
for (const [index, lesson] of after.western.lessons.entries()) {
  for (const field of ['id', 'title', 'era', 'lecture', 'mission', 'criticalThinking', 'quiz']) {
    assert.deepEqual(lesson[field], before.western.lessons[index][field], `Lesson ${lesson.id}: ${field} changed`);
  }
  assert.match(lesson.videoUrl, /^https:\/\/www.youtube.com\/embed\/[\w-]{11}(\?start=\d+)?$/);
  assert.ok(lesson.videoSource.channel && lesson.videoSource.watchUrl);
  assert.ok(lesson.images.length, `Lesson ${lesson.id}: no gallery images`);
  for (const item of lesson.images) {
    assert.ok(item.title && item.credit && item.sourceUrl && item.licenseUrl);
    assert.match(item.license, /^(Public domain|CC0|CC BY)/);
    const bytes = fs.readFileSync(path.join(root, 'art-theory', item.src));
    assert.equal(bytes[0], 0xff, `${item.src} is not a JPEG`);
    assert.equal(bytes[1], 0xd8, `${item.src} is not a JPEG`);
    count++;
  }
}
assert.match(after.western.lessons[14].videoUrl, /start=383$/);
assert.ok(after.western.lessons[26].companionVideos.length);
console.log(`36 lessons, ${count} images, concrete video IDs and attribution validated; lecture, challenge, and Chinese track unchanged.`);
