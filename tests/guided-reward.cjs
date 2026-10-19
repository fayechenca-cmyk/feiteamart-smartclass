const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const data={};const c={window:{},localStorage:{getItem:k=>data[k]||null,setItem:(k,v)=>data[k]=v}};
vm.runInNewContext(fs.readFileSync('core/foundation-a-path.js','utf8'),c);vm.runInNewContext(fs.readFileSync('core/guided-reward.js','utf8'),c);
const reward=c.window.GuidedReward;assert.equal(reward.record('preparation').after,1);assert.equal(reward.record('preparation').added,false);assert.equal(reward.record('cube').after,2);const s=reward.record('sphere');assert.equal(s.before,2);assert.equal(s.after,3);assert.equal(s.total,11);assert.equal(reward.record('unknown').after,3);
vm.runInNewContext(fs.readFileSync('core/guided-reward.js','utf8'),c);assert.equal(c.window.GuidedReward.read().length,3);
console.log('PASS: unique course rewards persist; repeats do not double-count; total follows the 11-course path.');
