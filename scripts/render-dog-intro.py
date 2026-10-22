"""Render the Dog guided studio's short animated intro, round 3:
real dog -> drawing in one crossfade (photo held briefly, static, no
zoom -- the previous zoom on a low-res photo read as jitter), then a
quick real-clip montage of the drawing being made, ending held on the
finished drawing. One continuous narration passage with ~0.25s
breaths between sentences, continuous music underneath. Usage:
python render-dog-intro.py --media-dir <scratch inputs with clipA.mp4,
clipEyes.mp4, clipFur.mp4>. See intro/README.md.
"""
from pathlib import Path
import argparse, json, re, subprocess, math, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps
import imageio_ffmpeg

ap = argparse.ArgumentParser(); ap.add_argument('--media-dir', type=Path, required=True); P = ap.parse_args().media_dir
R = Path(__file__).resolve().parents[1]; O = R / 'lessons/still-life-4a-dog-structure/intro'; O.mkdir(exist_ok=True)
ff = imageio_ffmpeg.get_ffmpeg_exe(); W, H, FPS = 1280, 720, 24

LINES = [
    "Today, let's draw a dog!",
    "Do you have a cute puppy at home?",
    "You can draw along with us -- or grab a photo of your own dog.",
    "Once you've learned how, try drawing yours, and tell us what was tricky -- or whether you've caught your puppy's spirit.",
    "Let's start with this little one!",
]
GAP = 0.25  # seconds of silence between narration lines -- a breath, not a pause.

import asyncio, edge_tts
async def _tts(text, path):
    for attempt in range(4):
        try:
            await edge_tts.Communicate(text, 'en-US-AvaMultilingualNeural', rate='+2%').save(str(path))
            return
        except Exception:
            if attempt == 3:
                raise
            await asyncio.sleep(2)

def duration_of(path):
    text = subprocess.run([ff, '-i', str(path)], capture_output=True, text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', text); h, mi, s = map(float, m.groups())
    return h * 3600 + mi * 60 + s

async def build_voice():
    for i, t in enumerate(LINES):
        await _tts(t, P / f'line-{i}.mp3')
asyncio.run(build_voice())

# One continuous spoken passage: decode each line and the generated
# silence gaps, then use the audio concat filter (not the concat
# demuxer, which chokes on mixed mp3/generated-silence codecs).
n = len(LINES)
inputs = []
for i in range(n):
    inputs += ['-i', str(P / f'line-{i}.mp3')]
filt = ''.join(f'[{i}:a]' + (f'apad=pad_dur={GAP}[s{i}];' if i < n - 1 else f'anull[s{i}];') for i in range(n))
filt += ''.join(f'[s{i}]' for i in range(n)) + f'concat=n={n}:v=0:a=1[out]'
subprocess.run([ff, '-loglevel', 'error', '-y', *inputs, '-filter_complex', filt, '-map', '[out]', '-c:a', 'aac', '-b:a', '128k', str(P / 'narration-voice.m4a')], check=True)
narration_dur = duration_of(P / 'narration-voice.m4a')

# -- Timeline. Segments crossfade into each other over XF seconds, so
# total runtime is the sum of each segment's own length minus the
# overlaps. The photo and the first "reveal" of the finished drawing
# are short and held static -- no camera motion on either, since a
# slow zoom on the low-resolution reference photo read as jitter.
XF = 0.5
PHOTO_DUR = 2.0
REVEAL_DUR = 1.6
CLIP_DUR = 3.5
LEAD, TAIL = 0.3, 0.8

fixed_segments = [('photo', PHOTO_DUR), ('reveal', REVEAL_DUR), ('outline', CLIP_DUR), ('eyes', CLIP_DUR), ('fur', CLIP_DUR)]
fixed_starts = [0.0]
for i in range(1, len(fixed_segments)):
    fixed_starts.append(fixed_starts[-1] + fixed_segments[i - 1][1] - XF)
final_start = fixed_starts[-1] + fixed_segments[-1][1] - XF
# Hold on the finished drawing at least long enough to let the whole
# narration passage finish with a short tail, but don't force the
# video short of a natural ~20-25s feel either.
final_dur = max(3.0, 22.0 - final_start, LEAD + narration_dur + TAIL - final_start)
segments = fixed_segments + [('final', final_dur)]
starts = fixed_starts + [final_start]
total = starts[-1] + segments[-1][1]
print('segment starts', list(zip([s[0] for s in segments], starts)), 'total', total, 'narration_dur', narration_dur, flush=True)

# -- Source stills and clips.
photo = Image.open(O / 'dog-reference-head.jpg').convert('RGB')
finished = Image.open(R / 'assets/sketch-support/finals/dog.jpg').convert('RGB')
# Same centring fraction for both -- "real dog" and "drawing" fill the
# frame the same way, so the crossfade reads as one shape becoming
# another rather than a cut to an unrelated composition.
FOCUS = (0.5, 0.42)
photo_fit = ImageOps.fit(photo, (W, H), centering=FOCUS)
finished_fit = ImageOps.fit(finished, (W, H), centering=FOCUS)

def load_clip_frames(name, scale='960:540'):
    raw = subprocess.check_output([ff, '-loglevel', 'error', '-i', str(P / f'{name}.mp4'), '-vf', f'scale={scale},fps={FPS}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'])
    h = int(scale.split(':')[1]); w = int(scale.split(':')[0])
    return np.frombuffer(raw, dtype=np.uint8).reshape(-1, h, w, 3)
clip_frames = {'outline': load_clip_frames('clipA'), 'eyes': load_clip_frames('clipEyes'), 'fur': load_clip_frames('clipFur')}

fonts = {(s, b): ImageFont.truetype('/System/Library/Fonts/Supplemental/' + ('Arial Bold.ttf' if b else 'Arial.ttf'), s) for s in [18, 24] for b in [False, True]}
def txt(im, xy, s, n=18, c='#302b40', b=True, anchor=None): ImageDraw.Draw(im).text(xy, s, font=fonts[n, b], fill=c, anchor=anchor)

def ken_burns_array(arr_frame, t, dur, z0=1.03, z1=1.16, cx=0.5, cy=0.46):
    """Clip footage already has real motion (a hand drawing) -- this
    just adds a gentle continuous push-in on top, never a static frame."""
    img = Image.fromarray(arr_frame)
    z = z0 + (z1 - z0) * min(1, max(0, t / dur))
    iw, ih = img.size; dst_ar = W / H
    win_h = ih / z; win_w = win_h * dst_ar
    cxp, cyp = cx * iw, cy * ih
    x0 = min(max(0, cxp - win_w / 2), iw - win_w)
    y0 = min(max(0, cyp - win_h / 2), ih - win_h)
    return img.crop((x0, y0, x0 + win_w, y0 + win_h)).resize((W, H), Image.LANCZOS)

def render_segment(name, local_t, dur):
    if name == 'photo':
        return photo_fit.copy()
    if name in ('reveal', 'final'):
        return finished_fit.copy()
    arr = clip_frames[name]
    idx = min(len(arr) - 1, int(local_t * FPS))
    im = ken_burns_array(arr[idx], local_t, dur)
    label = {'outline': 'OUTLINE', 'eyes': 'EYES', 'fur': 'FUR AND TONE'}[name]
    txt(im, (36, 30), 'FROM THE LESSON', 18, '#1262ff')
    txt(im, (36, 56), label, 24, '#ffffff')
    return im

def frame_at(t):
    for i, (name, dur) in enumerate(segments):
        seg_start = starts[i]
        if t < seg_start + dur - 1e-6 or i == len(segments) - 1:
            local_t = t - seg_start
            base = render_segment(name, local_t, dur)
            if i + 1 < len(segments):
                xf_start = seg_start + dur - XF
                if t >= xf_start:
                    alpha = min(1.0, (t - xf_start) / XF)
                    nxt_name, nxt_dur = segments[i + 1]
                    nxt_local = t - starts[i + 1]
                    nxt = render_segment(nxt_name, max(0, nxt_local), nxt_dur)
                    base = Image.blend(base, nxt, alpha)
            return base
    return render_segment(segments[-1][0], 0, segments[-1][1])

# -- Render the whole thing as ONE continuous frame stream (no
# per-scene files to concat) so crossfades are real, not cuts.
nframes = int(total * FPS)
proc = subprocess.Popen([ff, '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p', str(P / 'video-only.mp4')], stdin=subprocess.PIPE)
for f in range(nframes):
    t = f / FPS
    proc.stdin.write(frame_at(t).tobytes())
    if f % (FPS * 2) == 0: print('frame', f, '/', nframes, flush=True)
proc.stdin.close(); assert proc.wait() == 0

# -- Narration track: one continuous passage starting just after the
# photo appears. Silence everywhere else.
# NOTE: `-t` must precede the `-i` it limits -- placed after the
# anullsrc `-i` instead, it silently applies to the *next* input,
# leaving the lavfi silence source genuinely infinite and hanging.
narration_at = LEAD
narration_track = P / 'narration-track.mp3'
subprocess.run([ff, '-loglevel', 'error', '-y', '-f', 'lavfi', '-t', str(total), '-i', 'anullsrc=r=44100:cl=stereo',
                '-i', str(P / 'narration-voice.m4a'),
                '-filter_complex', f'[1:a]adelay={int(narration_at*1000)}|{int(narration_at*1000)}[a1];[0:a][a1]amix=inputs=2:duration=first:normalize=0[a]',
                '-map', '[a]', str(narration_track)], check=True)

# Original lively, cheerful music -- continuous under the whole film,
# bright major-key pluck/bell loop at 128 BPM, built entirely from
# synthesized tones (no external samples or licensed audio).
sr = 44100; music = np.zeros((math.ceil(total * sr), 2)); beat = 60 / 128
progression = [[60, 64, 67, 72], [65, 69, 72, 77], [67, 71, 74, 79], [60, 64, 67, 72]]
for j, at in enumerate(np.arange(0, total, beat / 2)):
    chord = progression[(j // 8) % 4]
    midi = chord[j % 4] + (12 if j % 4 == 0 else 0)
    n2 = min(int(.55 * sr), len(music) - int(at * sr))
    t = np.arange(n2) / sr; freq = 440 * 2 ** ((midi - 69) / 12)
    tone = (np.sin(2 * np.pi * freq * t) + .3 * np.sin(4 * np.pi * freq * t) + .15 * np.sin(6 * np.pi * freq * t)) * np.exp(-t * 7) * (1 - np.exp(-t * 90)) * .085
    music[int(at * sr):int(at * sr) + n2] += tone[:, None] * np.array([.82, 1] if j % 2 else [1, .82])
t = np.arange(len(music)) / sr
music *= (np.minimum(1, t / .4) * np.minimum(1, np.maximum(0, (total - t) / 1.0)))[:, None]
with wave.open(str(P / 'music.wav'), 'wb') as wav:
    wav.setnchannels(2); wav.setsampwidth(2); wav.setframerate(sr); wav.writeframes((music * 32767).astype('<i2').tobytes())

subprocess.run([ff, '-loglevel', 'error', '-y', '-i', str(P / 'video-only.mp4'), '-i', str(narration_track), '-i', str(P / 'music.wav'),
                '-filter_complex', '[1:a]loudnorm=I=-17:TP=-2:LRA=7[v];[2:a]loudnorm=I=-29:TP=-8:LRA=5[m];[v][m]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[a]',
                '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', str(O / 'meet-the-dog.mp4')], check=True)
frame_at(1.0).save(O / 'poster.jpg', quality=88)

def stamp(sec):
    ms = round(sec * 1000); return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02}.{ms % 1000:03}'
vtt = 'WEBVTT\n\n'
cursor = narration_at
for i, line in enumerate(LINES):
    d = duration_of(P / f'line-{i}.mp3')
    vtt += f'{stamp(cursor)} --> {stamp(cursor + d)}\n{line}\n\n'; cursor += d + GAP
(O / 'captions.vtt').write_text(vtt)
(O / 'scenes.json').write_text(json.dumps({'segments': [{'name': n, 'start': s, 'duration': d} for (n, d), s in zip(segments, starts)], 'total_seconds': total}, indent=2))
print('Total seconds', total, flush=True)
