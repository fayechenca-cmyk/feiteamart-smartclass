export const studentAccessCodes = [
  { id: "FAYE-00", displayName: "Faye", isLiveClass: true, isAdmin: true },
  { id: "REGINA-16", displayName: "Regina" },
  { id: "JOJO-10", displayName: "Jojo", isLiveClass: true },
  { id: "SERENA-09", displayName: "Serena" },
  { id: "A7Q9-FOX", displayName: "Amy", isLiveClass: true },
  { id: "BELLA-16", displayName: "Bella" },
  { id: "Katy-06", displayName: "Katy" },
  { id: "AMY-11", displayName: "Amy G" },
  { id: "ELSA-09", displayName: "Elsa" },
  { id: "REBECCA-20", displayName: "Rebecca" },
  { id: "MELODY-21", displayName: "Melody" },
  { id: "WALLACE-49X8", displayName: "Wallace" },
  { id: "CHLOE-01", displayName: "Chloe" },
  { id: "CAMERON-11", displayName: "Cameron" },
  { id: "JUDY-07", displayName: "Judy" },
  { id: "XINYUE-12", displayName: "Xinyue" },
  { id: "KAILYNN-15", displayName: "Kailynn" },
  { id: "ADRIAN-22", displayName: "Adrian" },
  { id: "SERENA-13", displayName: "Serena" },
  { id: "TEMP-09", displayName: "Temp" },
  { id: "CODY-22", displayName: "Cody" },
  { id: "SAM-18", displayName: "Sam" },
  { id: "ALISSIE-05", displayName: "Alissie" },
  { id: "NATALIE-17", displayName: "Natalie" },
  { id: "RAINIE-08", displayName: "Rainie" },
  { id: "SELENA-23", displayName: "Selena", isLiveClass: true },
  { id: "XIDA-25", displayName: "Xida", isLiveClass: true },
  // Oct 2026 — same full-access tier as FAYE-00 (isAdmin:true), not a
  // new flag. See core/access.js's isAdmin handling for what this
  // grants: unrestricted on every course, including the Creation
  // 3-lesson cap.
  { id: "DAWN-16", displayName: "Dawn", isLiveClass: true, isAdmin: true },
  // Plain student codes, no isAdmin/isLiveClass. Their Foundation Step 1
  // 5-lesson preview lives in core/access.js (RESTRICTED_LEGACY_CODES /
  // EXTENDED_PREVIEW_SKILLS) — not here, this file only says who they
  // are, not what they can open. They are NOT exempt from the new
  // Creation 3-lesson cap; that applies to them like any other student.
  { id: "Coraline-12", displayName: "Coraline" },
  { id: "Alicia-11", displayName: "Alicia" },
];
