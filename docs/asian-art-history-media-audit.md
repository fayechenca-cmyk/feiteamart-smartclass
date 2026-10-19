# Asian Art History — media and curriculum review

Reviewed 15 October 2026. The art-history courses are permanently free and open to everyone, per Faye's instruction. This implementation adds no payment, account, or lesson-completion gate to video or resource access.

## Curriculum

34 lessons follow a single chronological timeline: all 20 original Chinese topics plus 14 additional lessons about Japan, Korea, India, Indonesia, Cambodia, and Iran. Dates overlap; this is a selection of Asian histories, not a comprehensive account of every country. The original Chinese data remains in `curriculum.js`; the runtime archive preserves the complete original track. Its creative missions and five-question Challenges remain unchanged.

The added topics include Jōmon ceramics, Sanchi, Nara, Borobudur, Chola bronzes, Goryeo celadon, Angkor, Japanese folding screens (byōbu), Safavid manuscript painting, Oribe tea bowls, Japanese calligraphy, Mughal architecture, ukiyo-e, and Nam June Paik. Chinese calligraphy and Japanese kana/kanji receive a comparison guide. The Buddhist-art guide compares Sanchi, a fifth-century Sarnath Buddha, and Longmen, with attention to different dates, workshops, patrons, and uses instead of national stereotypes.

Each new lesson includes an original guide, observation prompt, creative activity, reflection, and five-question Challenge. Video notes distinguish focused examples from period surveys. The Chinese Republic lesson uses an extended university lecture; Yang Yongliang's interview is Chinese with English subtitles. Most other selected videos are English educational presentations. Some videos cover a narrower or later portion of the lesson's era; notes explain this explicitly.

## Videos: basis and limits

All 34 primary video URLs returned successful YouTube oEmbed responses, including publisher identity and an embed player. Responses are recorded in `asian-art-history-media-audit.json`. Publishers include Smarthistory, UNESCO, museums, universities/public broadcasters, The Art Assignment, Creators, and AbeBooks (identified as a collector-oriented source for the poster lesson).

Videos remain in official YouTube players with visible attribution and original-page links. They are not downloaded, rehosted, or presented as FEI-produced videos. The basis for using the player is YouTube's service-enabled embedding feature, not an assumption that free education removes copyright:

- https://www.youtube.com/t/terms
- https://support.google.com/youtube/answer/171780

UNESCO/NHK videos remain all-rights-reserved; the site uses the official YouTube player, not the downloadable UNESCO files. No claim is made that the embedded videos, their music, or depicted artworks are open-license assets. oEmbed success is a technical signal, not a legal opinion or a guarantee of playback in every browser/region. Publishers can change availability. The original publisher link remains visible as a fallback.

## Images

28 unique historical photographs/reproductions are saved locally, based on individual Public Domain, CC0, CC BY, or CC BY-SA image records. One photograph is reused in the Buddhist comparison, for 29 photographic gallery placements. Every source record, license URL, creator attribution, and local SHA-256 is in `asian-art-history-image-rights.json`. Local previews are unaltered, and the gallery and path preserve image proportions.

Seven original SVG teaching diagrams illustrate modern studio practice, printing, ink, text, urban growth, networks, and electronic screens. They do not reproduce living artists' faces or specific protected artworks, and are labeled as diagrams. They have not been assigned a third-party open license. Museum, artist, and publisher links supply access to original protected works. Historical images and modern diagrams are never labeled interchangeably.

The learner-facing source index is `art-theory/media-notes.html`, with image credits also displayed beside each gallery image.

## Progress and compatibility

All lessons can be opened for free viewing and studio activities. Challenge credit progresses in sequence; previewing a later lesson cannot skip that sequence. Old Chinese local completion records migrate by `sourceChineseId`, preserving the original stored record. Existing Western progress and the 36-lesson global Art History badge are unchanged. The Asian path has its own local completion badge and progress display; it does not claim to award the Western global badge. Progress remains browser-local, as stated in the interface.

## Verification

- `node tests/art-history-media.cjs`: Western media and original lesson preservation.
- `node tests/asian-art-history.cjs`: chronology, all 20 Chinese topics preserved, concrete video URLs matched to oEmbed records, image files and licenses, new quizzes, requested Japanese topics, and Buddhist comparison.
- Browser checks cover desktop/mobile presentation, free preview, disabled out-of-sequence Challenge submission, gallery loading, and sampled official player playback. These are samples, not a claim that all 34 videos were watched end to end. The screen and calligraphy videos showed advancing English captions; the ukiyo-e player was also sampled. All 35 unique local gallery files were served successfully and photographic files decoded. Mobile players have a minimum height of 200px; the four lesson tabs use a two-column layout to avoid clipping. Switching away from Lecture pauses its YouTube player through the official player command.
