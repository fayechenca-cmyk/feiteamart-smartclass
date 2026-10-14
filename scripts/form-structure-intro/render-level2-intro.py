# Form and Structure — Level 1 -> Level 2 transition intro film (1280x720, 30fps)
import math, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

REPO = Path(__file__).resolve().parents[2]
FIN = REPO / 'assets/sketch-support/finals'
W, H, FPS = 1280, 720, 30
OFF = 1.5                     # music lead-in before narration
TOTAL = 92.8
INK = (48, 43, 64); MUTED = (117, 106, 130); BG = (250, 247, 241)
LILAC = (150, 110, 210); MINT = (60, 170, 160); PEACH = (223, 148, 122); GOLD = (232, 176, 60)
PB = '/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf'
PS = '/usr/share/fonts/truetype/google-fonts/Poppins-SemiBold.ttf'
_f = {}
def font(size, path=PB):
    k = (size, path)
    if k not in _f: _f[k] = ImageFont.truetype(path, size)
    return _f[k]

def load(n):
    return Image.open(FIN / f'{n}.jpg').convert('RGB')
IM = {n: load(n) for n in ['cube','sphere','cylinder','cone','intersecting','box','cup','apple','papercrane','icecream','dog']}
IM['swan'] = Image.open(REPO / 'assets/sketch-intro/swan-teacher-study.jpg').convert('RGB')

def ease(x): x = max(0, min(1, x)); return x*x*(3-2*x)
def back(x):
    x = max(0, min(1, x)); c = 1.7; return 1 + (c+1)*(x-1)**3 + c*(x-1)**2
def T(x): return x + OFF       # narration time -> film time

_cache = {}
def fit(name, w, h, zoom=1.0, cx=.5, cy=.5):
    """cover-crop image into w x h with zoom around (cx,cy)."""
    src = IM[name]; sw, sh = src.size
    s = max(w/sw, h/sh) * zoom
    cw, ch = min(w/s, sw), min(h/s, sh)
    x0 = max(0, min(max(cx*sw - cw/2, 0), sw-cw)); y0 = max(0, min(max(cy*sh - ch/2, 0), sh-ch))
    return src.resize((w, h), Image.BICUBIC, box=(x0, y0, x0+cw, y0+ch))

def mapper(name, box, zoom=1.0, cx=.5, cy=.5):
    sw, sh = IM[name].size; x, y, w, h = box
    sc = max(w/sw, h/sh)*zoom; cw, ch = min(w/sc, sw), min(h/sc, sh)
    x0 = max(0, min(max(cx*sw-cw/2, 0), sw-cw)); y0 = max(0, min(max(cy*sh-ch/2, 0), sh-ch))
    return lambda px, py: (x + (px-x0)*sc, y + (py-y0)*sc)

def card(im, name, box, alpha=1.0, scale=1.0, zoom=1.0, cx=.5, cy=.5, glow=None, radius=22):
    if alpha <= 0.01: return
    x, y, w, h = box
    w2, h2 = max(2, int(w*scale)), max(2, int(h*scale))
    x2, y2 = int(x + (w-w2)/2), int(y + (h-h2)/2)
    pic = fit(name, w2, h2, zoom, cx, cy)
    mask = Image.new('L', (w2, h2), 0); ImageDraw.Draw(mask).rounded_rectangle((0,0,w2-1,h2-1), radius, fill=int(255*alpha))
    # shadow
    sh = Image.new('RGBA', im.size, (0,0,0,0))
    ImageDraw.Draw(sh).rounded_rectangle((x2+4, y2+10, x2+w2+4, y2+h2+10), radius, fill=(60,40,80,int(45*alpha)))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(12)))
    if glow:
        g = Image.new('RGBA', im.size, (0,0,0,0))
        ImageDraw.Draw(g).rounded_rectangle((x2-6, y2-6, x2+w2+6, y2+h2+6), radius+6, outline=glow+(int(200*alpha),), width=6)
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(3)))
    im.paste(pic, (x2, y2), mask)

def text(im, xy, s, size, color=INK, path=PB, anchor='la', alpha=1.0):
    if alpha <= 0.01: return
    lay = Image.new('RGBA', im.size, (0,0,0,0))
    ImageDraw.Draw(lay).text(xy, s, font=font(size, path), fill=color+(int(255*alpha),), anchor=anchor)
    im.alpha_composite(lay)

def chip(im, x, y, s, color, alpha=1.0, size=22, anchor='l'):
    if alpha <= 0.01: return
    d = ImageDraw.Draw(im); tw = d.textlength(s, font=font(size)); w = int(tw + 34); h = size + 22
    if anchor == 'c': x = int(x - w/2)
    lay = Image.new('RGBA', im.size, (0,0,0,0)); dl = ImageDraw.Draw(lay)
    dl.rounded_rectangle((x, y, x+w, y+h), h//2, fill=color+(int(255*alpha),))
    dl.text((x+17, y+h/2), s, font=font(size), fill=(255,255,255,int(255*alpha)), anchor='lm')
    im.alpha_composite(lay)
    return w

def arrow(im, p0, p1, color, prog=1.0, width=7):
    if prog <= 0: return
    x0, y0 = p0; x1, y1 = p1
    xe, ye = x0 + (x1-x0)*prog, y0 + (y1-y0)*prog
    d = ImageDraw.Draw(im); d.line((x0, y0, xe, ye), fill=color, width=width)
    a = math.atan2(ye-y0, xe-x0); L = 20
    d.polygon([(xe+6*math.cos(a), ye+6*math.sin(a)), (xe-L*math.cos(a-.5), ye-L*math.sin(a-.5)), (xe-L*math.cos(a+.5), ye-L*math.sin(a+.5))], fill=color)

def stroke_ellipse(im, box, color, prog, width=6, start=-90):
    if prog <= 0: return
    lay = Image.new('RGBA', im.size, (0,0,0,0))
    ImageDraw.Draw(lay).arc(box, start, start + 360*min(1, prog), fill=color+(255,), width=width)
    glow = lay.filter(ImageFilter.GaussianBlur(5))
    im.alpha_composite(glow); im.alpha_composite(lay)

def stroke_poly(im, pts, color, prog, width=6, closed=True, fill_alpha=0):
    if prog <= 0: return
    if closed: pts = pts + [pts[0]]
    segs = [math.dist(pts[i], pts[i+1]) for i in range(len(pts)-1)]; tot = sum(segs); goal = tot*min(1, prog)
    out = [pts[0]]; acc = 0
    for i, sl in enumerate(segs):
        if acc + sl <= goal: out.append(pts[i+1]); acc += sl
        else:
            r = (goal-acc)/sl; out.append((pts[i][0]+(pts[i+1][0]-pts[i][0])*r, pts[i][1]+(pts[i+1][1]-pts[i][1])*r)); break
    lay = Image.new('RGBA', im.size, (0,0,0,0)); d = ImageDraw.Draw(lay)
    if fill_alpha and prog >= 1: d.polygon(pts[:-1], fill=color+(fill_alpha,))
    d.line(out, fill=color+(255,), width=width, joint='curve')
    im.alpha_composite(lay.filter(ImageFilter.GaussianBlur(5))); im.alpha_composite(lay)

def sparkle(im, x, y, r, color, alpha=1.0):
    if alpha <= 0: return
    lay = Image.new('RGBA', im.size, (0,0,0,0)); d = ImageDraw.Draw(lay)
    pts = []
    for k in range(8):
        a = k*math.pi/4; rr = r if k % 2 == 0 else r*.32
        pts.append((x + rr*math.cos(a), y + rr*math.sin(a)))
    d.polygon(pts, fill=color+(int(255*alpha),))
    im.alpha_composite(lay)

def background(t):
    im = Image.new('RGBA', (W, H), BG+(255,)); d = ImageDraw.Draw(im)
    a = t*0.25
    d.ellipse((1010+30*math.sin(a), -220, 1450+30*math.sin(a), 220), fill=(236, 226, 246))
    d.ellipse((-220, 520+20*math.cos(a), 200, 940+20*math.cos(a)), fill=(222, 241, 236))
    return im

def header(im, s, color, t0, t):
    a = ease((t-t0)/.4)
    chip(im, 44, 34, s, color, a)

# ------------------------------------------------------------------ scenes
FORMS = ['cube', 'sphere', 'cylinder', 'cone']
OBJS = ['box', 'apple', 'cup', 'icecream', 'papercrane']

def s_forms(im, t):       # 0 – 4.2
    header(im, 'LEVEL 1 · BASIC FORMS', LILAC, T(0), t)
    times = [T(0.5), T(1.3), T(1.9), T(2.9)]
    names = ['Cube', 'Sphere', 'Cylinder', 'Cone']
    cw, ch = 520, 270
    for i, n in enumerate(FORMS):
        x = 110 + (i % 2)*(cw+30); y = 112 + (i//2)*(ch+28)
        p = (t - times[i])/.45
        if p > 0:
            card(im, n, (x, y, cw, ch), alpha=ease(p), scale=.7+.3*back(p), zoom=1.05+.02*(t-times[i]))
            chip(im, x+16, y+ch-56, names[i], [LILAC, MINT, PEACH, GOLD][i], ease(p))

def s_intersect(im, t):   # 4.2 – 9.8
    header(im, 'LEVEL 1 · INTERSECTING GEOMETRY', LILAC, T(4.2), t)
    loc = t - T(4.2)
    z = 1.0+.035*loc
    card(im, 'intersecting', (150, 100, 980, 551), alpha=ease(loc/.4), zoom=z, cx=.45, cy=.5)
    P = mapper('intersecting', (150, 100, 980, 551), z, .45, .5)
    if loc > 3.0:
        p = (loc-3.0)/.9
        stroke_poly(im, [P(633, 74), P(422, 634), P(839, 634)], MINT, p, 6)
        stroke_ellipse(im, (*P(818, 325), *P(928, 519)), PEACH, (loc-3.4)/.8, 6)

def s_question(im, t):    # 9.8 – 13.0
    loc = t - T(9.8)
    n = FORMS + ['intersecting']
    for i, nm in enumerate(n):
        p = (loc - .12*i)/.4
        x = 50 + i*240; y = 300 + 10*math.sin(t*2.2 + i)
        card(im, nm, (x, y, 220, 200), alpha=ease(p), scale=.8+.2*back(p), radius=16)
    text(im, (W/2, 150), 'Geometry… forever?', 64, INK, anchor='mm', alpha=ease((loc-.3)/.4))
    q = (loc - 1.3)/.5
    if q > 0:
        s = back(q); text(im, (1150, 210 - 10*math.sin(t*5)), '?', int(120*s)+1, PEACH, anchor='mm', alpha=ease(q))
        text(im, (140, 215 + 10*math.sin(t*5)), '?', int(80*s)+1, LILAC, anchor='mm', alpha=ease(q))

def s_makeover(im, t):    # 13.0 – 16.2
    loc = t - T(13.0)
    header(im, 'LEVEL 2 · FORMS INTO OBJECTS', MINT, T(13.0), t)
    text(im, (W/2, 170), 'Makeover time!', 66, INK, anchor='mm', alpha=ease(loc/.4))
    for i, nm in enumerate(FORMS):
        x = 70 + i*290; y = 300
        card(im, nm, (x, y, 270, 220), alpha=1, scale=1+.04*math.sin(t*4+i), radius=18)
    # sparkle sweep
    sx = -100 + 1500*ease((loc-.6)/1.6)
    for k in range(7):
        sparkle(im, sx - k*70, 290 + 120*math.sin(k*1.7) + 60, 22 - k*2, [GOLD, MINT, LILAC][k % 3], max(0, 1 - k*.12) * (1 if 0 < loc-.6 < 2.2 else 0))

def s_pair(im, t, start, morph, form, obj, flabel, olabel, color, form2=None):
    loc = t - T(start)
    header(im, 'LEVEL 2 · FORMS INTO OBJECTS', MINT, T(13.0), t)
    a = ease(loc/.35)
    if form2:
        card(im, form, (60, 150, 400, 225), alpha=a, radius=18)
        card(im, form2, (60, 395, 400, 225), alpha=ease((loc-.3)/.35), radius=18)
        chip(im, 76, 320, flabel[0], LILAC, a, 20); chip(im, 76, 565, flabel[1], LILAC, ease((loc-.3)/.35), 20)
        ay = 385
    else:
        card(im, form, (60, 210, 440, 248), alpha=a, radius=18)
        chip(im, 76, 400, flabel, LILAC, a, 22)
        ay = 334
    m = (t - T(morph))/.5
    arrow(im, (520, ay), (610, ay), color, ease(m/.6), 8)
    if m > 0:
        card(im, obj, (640, 150, 600, 450), alpha=ease(m), scale=.75+.25*back(m), zoom=1.08+.02*(t-T(morph)), glow=color)
        chip(im, 660, 540, olabel, color, ease(m))
        for k in range(4):
            sparkle(im, 640 + 600*((k*.31+.1) % 1), 150 + 450*((k*.53+.2) % 1), 16, GOLD, max(0, 1-abs(m-1.2)*1.2))

def s_crane(im, t):       # 29.1 – 37.5
    loc = t - T(29.1)
    header(im, 'LEVEL 2 · PAPER CRANE', MINT, T(29.1), t)
    bx, by, bw, bh = 150, 100, 980, 551
    card(im, 'papercrane', (bx, by, bw, bh), alpha=ease(loc/.4), zoom=1.0+.02*loc)
    P = mapper('papercrane', (bx, by, bw, bh), 1.0+.02*loc)
    # angled planes (right wing)
    pa = (t - T(32.7))/.8
    stroke_poly(im, [P(690, 490), P(822, 425), P(1035, 478), P(760, 515)], MINT, pa, 6, fill_alpha=50)
    chip(im, *P(860, 520), 'Angled planes', MINT, ease(pa), 20)
    # pointed forms (tail tip + head)
    pp = (t - T(34.1))/.7
    stroke_poly(im, [P(905, 118), P(775, 380), P(845, 400)], PEACH, pp, 6)
    stroke_poly(im, [P(475, 328), P(595, 245), P(585, 280)], PEACH, pp, 6)
    chip(im, *P(930, 160), 'Pointed forms', PEACH, ease(pp), 20)
    # overlapping parts (body)
    po = (t - T(35.5))/.7
    stroke_ellipse(im, (*P(585, 330), *P(810, 600)), LILAC, po, 6)
    chip(im, *P(250, 560), 'Overlapping parts', LILAC, ease(po), 20)

def s_hiding(im, t):      # 37.5 – 41.8
    loc = t - T(37.5)
    text(im, (W/2, 92), 'Forms hiding in everyday objects', 46, INK, anchor='mm', alpha=ease(loc/.4))
    boxes = [(80, 160, 360, 230), (460, 160, 360, 230), (840, 160, 360, 230), (270, 420, 360, 230), (650, 420, 360, 230)]
    for i, (nm, b) in enumerate(zip(OBJS, boxes)):
        p = (loc - .25*i)/.4
        card(im, nm, b, alpha=ease(p), scale=.8+.2*back(p), radius=16, zoom=1.1)

def s_world(im, t):       # 41.8 – 50.8
    loc = t - T(41.8)
    words = [('People', T(42.2), LILAC), ('Animals', T(42.8), MINT), ('Places', T(43.5), PEACH)]
    x = 380
    for s, tt, c in words:
        w = chip(im, x, 46, s, c, ease((t-tt)/.3), 26) or 0
        x += 190
    card(im, 'dog', (60, 135, 640, 540), alpha=ease((t-T(42.6))/.4), zoom=1.15, cx=.5, cy=.42)
    card(im, 'swan', (730, 175, 490, 340), alpha=ease((t-T(43.2))/.4), zoom=1.05)
    # break down into simpler forms (dog head)
    def P(x, y):   # dog source 1280x720, card cover-crop zoom 1.15 centered (.5,.42)
        sw, sh = 1280, 720; s = max(640/sw, 540/sh)*1.15; cw, ch = 640/s, 540/s
        x0 = min(max(.5*sw-cw/2, 0), sw-cw); y0 = min(max(.42*sh-ch/2, 0), sh-ch)
        return (60 + (x-x0)*s, 135 + (y-y0)*s)
    pb = (t - T(47.2))/.9
    stroke_ellipse(im, (*P(500, 160), *P(800, 430)), LILAC, pb, 7)
    stroke_ellipse(im, (*P(545, 360), *P(690, 470)), MINT, (t-T(48.0))/.7, 7)
    stroke_poly(im, [P(330, 170), P(470, 140), P(430, 380)], PEACH, (t-T(48.5))/.7, 6)
    # swan: S-curve neck + oval body
    def Q(x, y): return (730 + x*490/1280, 175 + y*340/(1280*1864/2671))
    stroke_ellipse(im, (*Q(260, 330), *Q(1000, 620)), GOLD, (t-T(48.8))/.8, 6)
    chip(im, 760, 560, 'Simple forms inside', LILAC, ease((t-T(48.6))/.4), 22)

def s_why(im, t):         # 50.8 – 59.5
    loc = t - T(50.8)
    text(im, (W/2, 74), 'That’s why we started with geometry', 42, INK, anchor='mm', alpha=ease(loc/.4))
    pairs = [('cube', 'box'), ('sphere', 'apple'), ('cylinder', 'cup'), ('cone', 'icecream')]
    for i, (f, o) in enumerate(pairs):
        x = 70 + i*290
        p = (loc - .15*i)/.4
        card(im, f, (x, 140, 260, 180), alpha=ease(p), radius=16)
        q = (t - T(53.8) - .25*i)/.45
        arrow(im, (x+130, 335), (x+130, 400), [LILAC, MINT, PEACH, GOLD][i], ease(q/.6), 7)
        card(im, o, (x, 420, 260, 220), alpha=ease(q), scale=.8+.2*back(q), radius=16, zoom=1.1, glow=[LILAC, MINT, PEACH, GOLD][i] if q > 0 else None)

def s_steps(im, t):       # 59.5 – 71.0
    loc = t - T(59.5)
    header(im, 'NEXT LESSONS', MINT, T(59.5), t)
    steps = [('1', 'Start with a form', T(61.4), LILAC), ('2', 'Adjust proportions', T(63.6), MINT), ('3', 'Add a few details', T(65.7), PEACH), ('4', 'A real object!', T(67.6), GOLD)]
    for i, (n, s, tt, c) in enumerate(steps):
        p = ease((t-tt)/.4); y = 150 + i*120
        if p <= 0: continue
        lay = Image.new('RGBA', im.size, (0,0,0,0)); d = ImageDraw.Draw(lay)
        d.ellipse((60, y, 140, y+80), fill=c+(int(255*p),))
        d.text((100, y+40), n, font=font(40), fill=(255,255,255,int(255*p)), anchor='mm')
        im.alpha_composite(lay)
        text(im, (165 - 30*(1-p), y+40), s, 34, INK, anchor='lm', alpha=p)
    # visual: cube morphs into gift box
    m = (t - T(66.0))/1.2
    card(im, 'cube', (620, 140, 600, 480), alpha=ease((t-T(61.4))/.4)*(1-ease(m)), zoom=1.08)
    if m > 0:
        card(im, 'box', (620, 140, 600, 480), alpha=ease(m), zoom=1.08, glow=GOLD if m > 1 else None)

def s_ask(im, t):         # 71.0 – 76.8
    loc = t - T(71.0)
    header(im, 'BEFORE YOU DRAW', PEACH, T(71.0), t)
    bx, by, bw, bh = 385, 115, 840, 473
    card(im, 'apple', (bx, by, bw, bh), alpha=ease(loc/.4), zoom=1.0+.02*loc)
    AP = mapper('apple', (bx, by, bw, bh), 1.0+.02*loc)
    text(im, (70, 300), 'What simple', 40, INK, alpha=ease((t-T(73.8))/.4))
    text(im, (70, 350), 'forms can', 40, INK, alpha=ease((t-T(73.8))/.4))
    text(im, (70, 400), 'I find?', 40, LILAC, alpha=ease((t-T(73.8))/.4))
    P = AP
    stroke_ellipse(im, (*P(280, 120), *P(548, 388)), MINT, (t-T(74.6))/.9, 7)

def s_enjoy(im, t):       # 76.8 – 83.9
    loc = t - T(76.8)
    # slow pan across a strip of the objects
    strip = OBJS + ['cube', 'sphere']
    off = -loc*60
    for i, nm in enumerate(strip):
        card(im, nm, (int(60 + i*330 + off), 330, 300, 250), alpha=ease(loc/.5), radius=16, zoom=1.1)
    words = [('Take your time', T(76.8), LILAC), ('Stay curious', T(78.0), MINT), ('Enjoy!', T(80.0), PEACH)]
    x = [90, 470, 830]
    for i, (s, tt, c) in enumerate(words):
        p = (t-tt)/.4
        text(im, (x[i], 180 + 18*(1-back(p))), s, 44, c, alpha=ease(p))

def s_end(im, t):         # 83.9 – end
    loc = t - T(83.9)
    ring = OBJS
    for i, nm in enumerate(ring):
        a = -math.pi/2 + i*2*math.pi/5 + loc*.15
        cx, cy = 640 + 430*math.cos(a), 375 + 235*math.sin(a)
        p = (loc - .1*i)/.4
        card(im, nm, (int(cx-120), int(cy-80), 240, 160), alpha=ease(p), scale=.7+.3*back(p), radius=16, zoom=1.1)
    p = (loc - .2)/.5
    text(im, (W/2, 330), 'Let’s bring forms', 58, INK, anchor='mm', alpha=ease(p))
    text(im, (W/2, 400), 'to life!', 58, LILAC, anchor='mm', alpha=ease(p))
    q = (t - T(87.0))/.4
    chip(im, W/2, 460, 'Level 2 · Gift Box is next', MINT, ease(q), 22, anchor='c')
    for k in range(6):
        sparkle(im, 640 + 330*math.cos(k*1.05+loc*.5), 380 + 150*math.sin(k*1.05+loc*.5), 14, [GOLD, MINT, LILAC][k % 3], ease((loc-.5)/.5)*(.6+.4*math.sin(t*6+k)))

SCENES = [
    (0, s_forms), (T(4.2), s_intersect), (T(9.8), s_question), (T(13.0), s_makeover),
    (T(16.2), lambda im, t: s_pair(im, t, 16.2, 16.7, 'cube', 'box', 'Cube', 'Gift Box', LILAC)),
    (T(19.1), lambda im, t: s_pair(im, t, 19.1, 20.2, 'sphere', 'apple', 'Sphere', 'Apple', MINT)),
    (T(22.7), lambda im, t: s_pair(im, t, 22.7, 23.2, 'cylinder', 'cup', 'Cylinder', 'Cup', PEACH)),
    (T(24.6), lambda im, t: s_pair(im, t, 24.6, 26.9, 'cone', 'icecream', ('Cone', 'Sphere'), 'Ice Cream', GOLD, form2='sphere')),
    (T(29.1), s_crane), (T(37.5), s_hiding), (T(41.8), s_world), (T(50.8), s_why),
    (T(59.5), s_steps), (T(71.0), s_ask), (T(76.8), s_enjoy), (T(83.9), s_end),
]

def render(t):
    idx = max(i for i, s in enumerate(SCENES) if t >= s[0])
    im = background(t)
    SCENES[idx][1](im, t)
    # cross-fade from previous scene in first 0.3s
    st = SCENES[idx][0]
    if idx > 0 and t - st < .3:
        prev = background(t); SCENES[idx-1][1](prev, t)
        im = Image.blend(prev, im, ease((t-st)/.3))
    # global fade in/out
    a = min(1, t/.6, (TOTAL - t)/1.0)
    if a < 1: im = Image.blend(Image.new('RGBA', (W, H), BG+(255,)), im, max(0, a))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((44, 694, 1236, 699), 3, fill=(231, 224, 233))
    d.rounded_rectangle((44, 694, 44 + int(1192*min(1, t/TOTAL)), 699), 3, fill=LILAC)
    return im.convert('RGB')

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'stills':
        for s in sys.argv[2:]:
            render(float(s)).save(f'still_{s}.jpg', quality=88)
        sys.exit()
    out, audio = sys.argv[1], sys.argv[2]
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
                          '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    n = int(TOTAL*FPS)
    for i in range(n):
        p.stdin.write(render(i/FPS).tobytes())
    p.stdin.close(); p.wait()
