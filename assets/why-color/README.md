# Color Practice · "Why Color?" course introduction

Used by `color-lab/why-film.js` (the "Why Color?" stop on the Color Practice course map).

## voice.mp3
English narration generated in ElevenLabs, voice "Dan – Captivating, Engaging and Inviting".
77.98 s. The start/end time of each spoken line is stored in `VOICE_CUES` inside
`color-lab/why-film.js` (measured from the pauses between lines). If the voice is
regenerated, re-measure those times (e.g. `ffmpeg -i voice.mp3 -af silencedetect=noise=-38dB:d=0.3 -f null -`).

Script (14 lines, one scene each):
1. Why do we study color?
2. Because color is not simply something we add after we finish a drawing.
3. Color is a visual language of its own, and learning color can be just as important as learning drawing or sketching.
4. Artists have spent their entire lives exploring what color can do.
5. Mondrian used simple primary colors to create images that feel bold, balanced, and surprisingly expressive.
6. His paintings later influenced everything from graphic design to fashion.
7. Kandinsky explored how colors could create movement, energy, and emotion.
8. Pollock showed us that color, gesture, and rhythm could become the artwork itself.
9. And Rothko created large fields of color that can make us feel calm, tension, depth, or even something difficult to put into words.
10. Color can create shape without outlines.
11. It can create space, movement, mood, and meaning.
12. Even when we remove the lines, color can still speak.
13. That is why we study color:
14. not just to make art colorful, but to learn a whole new visual language.

Background music is generated in the browser with Web Audio (no audio file).

## mondrian-composition-ii-1930.jpg
Piet Mondrian, "Composition II in Red, Blue, and Yellow", 1930. Kunsthaus Zürich.
Source: https://commons.wikimedia.org/wiki/File:Piet_Mondriaan,_1930_-_Mondrian_Composition_II_in_Red,_Blue,_and_Yellow.jpg
Public domain (Mondrian d. 1944; life+70 expired; published 1930, public domain in the US
since 2026). Resized to 1200 px for web use.

## Kandinsky
Reuses `lessons/kandinsky-music-into-shape/assets/kandinsky-several-circles.jpg`
(public domain; see that folder's README).

## Pollock and Rothko
Their works are still in copyright, so no images of their paintings are used.
The film shows original animations about their ideas (poured lines; soft color fields),
labelled as such on screen.
