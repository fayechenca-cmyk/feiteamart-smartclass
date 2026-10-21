/* Aggregate-only, opt-in analytics. No identity, free text, URLs or student artwork. */
(() => {
  const names = new Set(('creation_entry_selected creation_space_entered creation_space_switched project_opened project_saved project_unsaved project_started project_resumed project_completed artwork_uploaded experiment_opened experiment_started experiment_completed experiment_revisited discovery_saved creation_search_used creation_filter_selected creation_continue_clicked').split(' '));
  let sessionId=crypto.randomUUID(), prior=[];
  try { sessionId=sessionStorage.getItem('feiCreation.analyticsSession')||sessionId; sessionStorage.setItem('feiCreation.analyticsSession',sessionId); prior=JSON.parse(sessionStorage.getItem('feiCreation.eventIds')||'[]'); } catch {}
  const seen = new Set(Array.isArray(prior)?prior:[]);
  function track(eventName, properties = {}, eventId = crypto.randomUUID()) {
    if (!names.has(eventName) || seen.has(eventId)) return;
    seen.add(eventId);
    try { sessionStorage.setItem('feiCreation.eventIds',JSON.stringify([...seen].slice(-200))); } catch {}
    const event = {eventName, eventId, timestamp:new Date().toISOString(), sessionId};
    for (const key of ['creationSpace','projectId','experimentId','category','entrySource','completionStatus']) {
      if (typeof properties[key] === 'string' && /^[a-z0-9_-]{1,80}$/i.test(properties[key])) event[key]=properties[key];
    }
    // Host must resolve its guardian-consent policy before explicitly enabling export.
    if (window.FEICreationAnalyticsConsent === true && typeof window.gtag === 'function') {
      const {eventName: name, ...payload}=event;
      window.gtag('event', name, payload);
    }
    return event;
  }
  window.FEICreationEvents = {track};
})();
