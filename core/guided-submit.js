/* In-lesson submission. A selected file is not a submitted assignment. */
(() => {
 'use strict';
 const drafts=new Map();
 const config=()=>({url:FEIProgress.SUPABASE_URL,key:FEIProgress.SUPABASE_KEY});
 async function request(path,options={}) {
  const {url,key}=config(), controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),45000);
  try {
   const session=await window.FEIAuth?.getSession();
   const headers={apikey:key,...(session?.access_token?{Authorization:'Bearer '+session.access_token}:{}),...options.headers};
   const response=await fetch(url+path,{...options,headers,signal:controller.signal});
   if(!response.ok)throw new Error('Could not save ('+response.status+'). Please try again.');
   return response.status===204?null:await response.json();
  } finally {clearTimeout(timeout);}
 }
 async function send(draft,options,onStatus) {
  const profile=window.GuidedPlatform?.profile;
  if(!profile)throw new Error('Your account is not available. Please sign in before sending.');
  if(!draft.file)throw new Error('Choose a photo first.');
  if(!draft.imageUrl) {
   onStatus('Uploading your photo…');
   const extension={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[draft.file.type];
   draft.storageKey ||= 'guided/'+crypto.randomUUID()+'.'+extension;
   await request('/storage/v1/object/student-artwork/'+draft.storageKey,{method:'POST',headers:{'Content-Type':draft.file.type,'x-upsert':'true'},body:draft.file});
   draft.imageUrl=config().url+'/storage/v1/object/public/student-artwork/'+draft.storageKey;
  }
  if(!draft.record) {
   onStatus('Saving your submission…');
   draft.id ||= crypto.randomUUID();
   // Stable id makes retry safe if the server saved the row but the response was lost.
   const rows=await request('/rest/v1/student_submissions?on_conflict=id',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=representation'},body:JSON.stringify({
    id:draft.id,student_code:profile.studentCode||null,user_name:profile.name||null,user_email:profile.email||null,
    ...(profile.supabaseUserId?{user_id:profile.supabaseUserId}:{}),course_id:options.courseId||'foundation-a',lesson_id:options.lessonId,lesson_title:options.title,image_url:draft.imageUrl,status:'submitted'
   })});
   draft.record=rows?.[0]||{id:draft.id};
  }
  return draft.record;
 }
 async function mount(container,options) {
  const access=await window.FEIAccess?.getStatus();
  const aiOnly=access?.membershipType==='ai_feedback';
  const draft=drafts.get(options.lessonId)||{};drafts.set(options.lessonId,draft);
  container.innerHTML='<section class="submission-panel"><label class="primary" for="guided-photo">Choose your artwork photo</label><input id="guided-photo" type="file" accept="image/jpeg,image/png,image/webp"><img class="submission-preview" alt="Your artwork preview" hidden><p class="submission-status" role="status" aria-live="polite"></p><button class="primary" data-send disabled>Send to teacher →</button><p data-result></p></section>';
  const input=container.querySelector('input'), preview=container.querySelector('img'), status=container.querySelector('[role=status]'), button=container.querySelector('[data-send]'), result=container.querySelector('[data-result]');
  const update=message=>{status.textContent=message;};
  const show=()=>{if(draft.preview){preview.src=draft.preview;preview.hidden=false;}button.disabled=aiOnly||!draft.file||draft.busy||draft.sent;button.textContent=aiOnly?'AI feedback not available yet':draft.sent?'✓ Submitted':draft.busy?'Sending…':'Send to teacher →';};
  show();if(aiOnly){result.textContent='AI artwork feedback is not available yet. You can continue your lesson and come back later.';}update(draft.sent?'Sent! Your teacher can now see your artwork.':draft.file?'Photo ready. Tap Send to teacher to submit.':'JPG, PNG or WebP · Up to 10 MB');
  input.onchange=()=>{
   const file=input.files?.[0];if(!file)return;
   if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){update('Please choose a JPG, PNG or WebP photo under 10 MB.');input.value='';return;}
   if(draft.preview)URL.revokeObjectURL(draft.preview);
   Object.keys(draft).forEach(key=>delete draft[key]);draft.file=file;draft.preview=URL.createObjectURL(file);options.onPhoto?.(draft.preview);show();update(aiOnly?'Photo selected. AI feedback is not available yet.':'Photo ready. Tap Send to teacher to submit.');if(!aiOnly)result.textContent='';
  };
  button.onclick=async()=>{
   if(aiOnly||draft.busy||draft.sent)return;draft.busy=true;input.disabled=true;show();
   try {await send(draft,options,update);draft.sent=true;update('✓ Submitted successfully');result.textContent='Your artwork is in your teacher’s review queue. You can continue your lesson.';}
   catch(error){update(error.name==='AbortError'?'The connection took too long. Your photo is still here — tap to retry.':error.message);}
   finally{draft.busy=false;input.disabled=false;show();}
  };
 }
 window.GuidedSubmit={mount,send};
})();
