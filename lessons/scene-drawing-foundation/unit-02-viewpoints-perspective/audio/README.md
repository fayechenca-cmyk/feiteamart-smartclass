# Viewpoints step voice guide

AI-generated English narration using Microsoft en-US-AvaMultilingualNeural, rate -3%, matching the existing Foundation of Sketch intro. These are synthesized clips, not a human teacher recording.

65 sequential screens map to 30 deduplicated MP3 clips. Authored transcripts live in manifest.json and narration-data.js. No browser speech synthesis or runtime speech-service call is needed.

Learners enable audio with Listen or Voice on. Subsequent steps play automatically while enabled. Navigation stops the previous clip; teacher video playback, hiding the tab, and leaving the page stop narration. Every clip has an expandable text alternative. Missing/blocked audio leaves navigation available and offers the transcript.

Rebuild from the repository root:

1. `node scripts/build-viewpoints-narration-data.cjs`
2. In a Python environment with edge-tts 7.2.8: `python scripts/build-viewpoints-narration.py`

Regenerate the data whenever the journey order or narration copy changes. The generator reuses audio files with matching text hashes. Teacher-reference narration acknowledges that the reference may not yet be available.

Sentence synchronization: each clip now has matching `.timing.json` cues from the speech service. The generator writes `narration-timings.js` from these cues. VoiceMotion uses the media clock for sentence captions, target highlighting, and construction-stroke reveals. Pause holds the current state; restart and navigation clear it. Reduced-motion preferences keep static emphasis instead of pulsing or stroke motion.
