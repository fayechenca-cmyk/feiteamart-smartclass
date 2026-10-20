const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = path.join(__dirname, '../lessons/lesson-2-sphere-realworld/guided');
const flow = JSON.parse(fs.readFileSync(path.join(base, 'flow.json'), 'utf8'));
const durations = JSON.parse(fs.readFileSync(path.join(base, 'video-durations.json'), 'utf8'));
const ids = new Set(flow.map(step => step.id));
assert.equal(ids.size, flow.length, 'Every guided step has a unique identity');
assert.equal(flow[0].kind, 'photo');
assert.equal(flow[1].kind, 'appleRotate');
assert.equal(flow[2].kind, 'appleNotice');
assert.equal(flow.filter(step => step.analysis).length, 30, 'All original key moments remain');
assert.equal(flow.filter(step => step.kind === 'draw').length, 38);
assert.equal(flow.filter(step => step.coreComplete).length, 1);
assert.equal(flow.at(-1).id, 'complete');
for (const step of flow) {
  assert.ok(step.title && step.say && step.hint, `${step.id} has meaningful guidance`);
  assert.ok(step.audio && fs.statSync(path.join(base, step.audio)).size > 1000, `${step.id} has voice`);
  assert.ok(step.captions?.length, `${step.id} has timed captions`);
  if (step.analysis) assert.match(step.analysis, /^https:\/\/imagedelivery\.net\//);
}
for (const [uid, duration] of Object.entries(durations)) {
  const clips = flow.filter(step => step.uid === uid);
  assert.ok(clips.length, `${uid} appears in the guided lesson`);
  assert.equal(clips[0].start, 0);
  for (let i = 1; i < clips.length; i++) assert.ok(Math.abs(clips[i-1].clipEnd - clips[i].start) < .01, `${uid} has no gap at ${clips[i].id}`);
  assert.ok(duration - clips.at(-1).clipEnd < .3, `${uid} reaches its last frame`);
}
const ui = fs.readFileSync(path.join(base, 'studio.js'), 'utf8');
assert.match(ui, /jumpToStep\(target\)/);
assert.match(ui, /appleRotate'\|\|s.kind==='appleNotice'/);
assert.match(ui, /APPLE_REFERENCE/);
assert.match(ui, /GuidedPlatform\.restore\('apple'/);
assert.match(ui, /controls=true&preload=auto/, 'Cloudflare native controls remain available on touch devices');
assert.match(ui, /function showNativePlayHint\(/, 'Autoplay rejection gives a usable play path');
assert.match(ui, /function introMusic\(/, 'Opening guidance has gentle music');
const css = fs.readFileSync(path.join(base, 'studio.css'), 'utf8');
assert.match(css, /#media iframe\{pointer-events:auto\}/, 'The iframe must receive taps');
assert.match(css, /#videoTap\{display:none!important\}/, 'No transparent button covers the iframe');
assert.match(fs.readFileSync(path.join(base, 'apple-intro.js'), 'utf8'), /showSphere/);
assert.match(fs.readFileSync(path.join(__dirname, '../core/foundation-a-path.js'), 'utf8'), /id: 'apple'[\s\S]*?href: 'lessons\/lesson-2-sphere-realworld\/guided\/'/);
console.log(`Apple guided: ${flow.length} stages, 30 original analyses, 5 full teacher videos, voice on every stage`);
