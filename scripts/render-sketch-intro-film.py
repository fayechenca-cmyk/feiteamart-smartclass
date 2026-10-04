"""Render a 35-second course trailer with titles and teaching graphics baked in.
Usage: python render-sketch-intro-film.py --media-dir /path/to/selected/course/media
Requires Pillow, numpy and imageio-ffmpeg. See assets/sketch-intro/README.md.
"""
from pathlib import Path
import argparse, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import imageio_ffmpeg
parser=argparse.ArgumentParser();parser.add_argument('--media-dir',type=Path,required=True);args=parser.parse_args()
R=args.media_dir; OUT=Path(__file__).resolve().parents[1]/'assets/sketch-intro'; FF=imageio_ffmpeg.get_ffmpeg_exe()
W,H,FPS=1280,720,24
INK='#302b40';MUTED='#756a82';BG='#faf7f1';LILAC='#aa88d0';MINT='#62a994';PEACH='#df947a'
FONT=Path('/System/Library/Fonts/Supplemental')
def font(size,bold=False):return ImageFont.truetype(str(FONT/('Arial Bold.ttf' if bold else 'Arial.ttf')),size)
F={n:font(n) for n in [18,20,22,24,26,30]};B={n:font(n,True) for n in [20,22,24,26,30,44,48,52,58]}
def txt(im,xy,text,size=24,color=INK,bold=False):ImageDraw.Draw(im).text(xy,text,font=(B if bold else F)[size],fill=color)
def wrapped(im,text,xy,width,size=48,color=INK):
 d=ImageDraw.Draw(im);line='';y=xy[1]
 for word in text.split():
  trial=(line+' '+word).strip()
  if d.textlength(trial,font=B[size])>width and line:
   txt(im,(xy[0],y),line,size,color,True);y+=size*1.14;line=word
  else:line=trial
 txt(im,(xy[0],y),line,size,color,True);return y+size*1.2

def rounded_image(im,source,box,fit='contain'):
 x,y,w,h=box;card=Image.new('RGB',(w,h),'#f1ede6')
 pic=ImageOps.fit(source,(w,h)) if fit=='cover' else ImageOps.contain(source,(w,h))
 card.paste(pic,((w-pic.width)//2,(h-pic.height)//2));mask=Image.new('L',(w,h));ImageDraw.Draw(mask).rounded_rectangle((0,0,w-1,h-1),24,fill=255)
 im.paste(card,(x,y),mask)
def arrow(im,points,color,progress=1):
 layer=Image.new('RGBA',im.size);d=ImageDraw.Draw(layer)
 a,b,c=points;pts=[]
 for u in np.linspace(0,min(1,max(.01,progress)),60):pts.append(((1-u)**2*a[0]+2*(1-u)*u*b[0]+u*u*c[0],(1-u)**2*a[1]+2*(1-u)*u*b[1]+u*u*c[1]))
 d.line(pts,fill=color,width=5,joint='curve')
 if progress>=.96:
  x,y=pts[-1];px,py=pts[-4];angle=math.atan2(y-py,x-px)
  d.polygon([(x,y),(x-17*math.cos(angle-.5),y-17*math.sin(angle-.5)),(x-17*math.cos(angle+.5),y-17*math.sin(angle+.5))],fill=color)
 im.alpha_composite(layer)
def glow(im,box,color,t):
 layer=Image.new('RGBA',im.size);d=ImageDraw.Draw(layer);alpha=int(70+35*math.sin(t*2.4));rgb=tuple(bytes.fromhex(color[1:]));d.ellipse(box,outline=rgb+(alpha,),width=15)
 im.alpha_composite(layer.filter(ImageFilter.GaussianBlur(10)));d=ImageDraw.Draw(im);d.ellipse(box,outline=rgb+(185,),width=3)
def label(im,x,y,text,color=LILAC):
 d=ImageDraw.Draw(im);width=int(d.textlength(text,font=B[22]))+30;d.rounded_rectangle((x,y,x+width,y+42),14,fill=color);txt(im,(x+15,y+8),text,22,'#fff',True)

images={name:Image.open(R/file).convert('RGB') for name,file in [('icecream','icecream.jpg'),('cup','cup.jpg'),('crane','crane.jpg'),('giftbox','giftbox.jpg'),('materials','materials.png'),('portrait','portrait.png')]}
images['landscape']=Image.open(OUT/'swan-teacher-study.jpg').convert('RGB')
images['portrait']=images['portrait'].crop((582,0,1502,1166))
# Decode only the short excerpts, not full teacher lessons.
clips={}
for name in ['hatching','cube','glass']:
 raw=subprocess.check_output([FF,'-loglevel','error','-i',str(R/(name+'.mp4')),'-t','4','-vf',f'scale=800:450,fps={FPS}','-f','rawvideo','-pix_fmt','rgb24','-'])
 clips[name]=np.frombuffer(raw,dtype=np.uint8).reshape(-1,450,800,3)
def clip(name,t):
 arr=clips[name];return Image.fromarray(arr[min(len(arr)-1,int(t*FPS))])

scenes=[
 (0,3.335,'welcome','Welcome to Foundation of Sketch','Your starting point.',PEACH),
 (3.335,6.672,'materials','Start from zero','One pencil. One small step.',MINT),
 (6.672,9.7,'hatching','Train your hand','Light marks. Steady control.',LILAC),
 (9.7,12.974,'cube','Build from simple forms','See the structure underneath.',MINT),
 (12.974,15.229,'icecream','Make something real','A scoop. A cone. Your drawing.',PEACH),
 (15.229,17.2,'glass','Explore texture','Edges make glass feel real.',LILAC),
 (17.2,19.365,'cup','Bring form to life','Follow the light.',MINT),
 (19.365,22.4,'landscape','Create space & depth','Light. Contrast. Reflection.',MINT),
 (22.4,25.783,'portrait','Discover the face','Observe form and proportion.',PEACH),
 (25.783,28,'crane','Put it all together','From simple shapes to paper folds.',LILAC),
 (28,31.788,'giftbox','Make it your own','A pencil. A little curiosity.',MINT),
 (31.788,35.23,'finish','Let’s draw. Have fun.','Your first drawing starts today.',PEACH)
]

def render(t):
 idx=max(i for i,s in enumerate(scenes) if t>=s[0]);start,end,kind,title,sub,color=scenes[idx];local=t-start;reveal=min(1,local/.65)
 im=Image.new('RGBA',(W,H),BG);d=ImageDraw.Draw(im)
 d.ellipse((1000,-200,1420,220),fill='#e9e0f2');d.ellipse((-200,500,180,900),fill='#e0efe9')
 txt(im,(44,26),'FEI TEAMART  /  FOUNDATION OF SKETCH',18,MUTED)
 txt(im,(1160,26),f'{idx+1:02} / 12',18,MUTED)
 if kind in ['welcome','finish','invitation']:
  txt(im,(48,93),title,52,INK,True);txt(im,(50,160),sub,26,MUTED)
  for j,name in enumerate(['icecream','cup','crane']):
   x=48+j*399;y=228+int(8*math.sin(local*1.2+j));box=(x,y,382,322)
   rounded_image(im,images[name],box,'cover');label(im,x+12,y+270,['Ice cream','The cup','Paper crane'][j],[PEACH,MINT,LILAC][j])
  if kind=='welcome':txt(im,(50,590),'REAL LESSONS. REAL DRAWING. YOUR OWN PROGRESS.',22,MUTED,True)
  elif kind=='finish':
   label(im,50,585,'Begin with Form & Structure',LILAC);arrow(im,[(470,604),(620,585),(755,604)],MINT,reveal)
  else:txt(im,(50,590),'No experience needed. Just a willingness to try.',24,MUTED)
 else:
  label(im,44,110,{'materials':'YOUR START','hatching':'HAND CONTROL','cube':'FORM & STRUCTURE','icecream':'EVERYDAY OBJECTS','glass':'STILL LIFE & TEXTURE','cup':'LIGHT & SHADOW','landscape':'TEACHER’S SWAN STUDY','portrait':'COURSE-LIBRARY STUDY','crane':'BRING IT TOGETHER','giftbox':'YOUR OWN DRAWING'}[kind],color)
  y=wrapped(im,title,(44,180),340,48)
  # Short supporting lines, deliberately fewer than a full subtitle.
  words=sub.split();line='';sy=y+18
  for word in words:
   trial=(line+' '+word).strip()
   if d.textlength(trial,font=F[24])>335 and line:txt(im,(44,sy),line,24,MUTED);sy+=32;line=word
   else:line=trial
  txt(im,(44,sy),line,24,MUTED)
  box=(424,104,812,500)
  source=clip(kind,local) if kind in clips else images[kind]
  rounded_image(im,source,box,'contain')
  # Mapping for 16:9 teacher footage in the 812×500 card.
  def pt(x,y):return (424+x*812/1280,125.5+y*812/1280)
  if kind=='icecream':
   cx,cy=pt(667,185);glow(im,(cx-83,cy-83,cx+83,cy+83),PEACH,local)
   label(im,473,542,'Soft sphere',PEACH);arrow(im,[(557,542),(570,360),(cx-67,cy+44)],PEACH,reveal)
   if local>.65:
    points=[pt(558,325),pt(638,681),pt(781,328)];ImageDraw.Draw(im).line(points,fill='#7cad99',width=4);label(im,995,542,'Cone',MINT)
  elif kind=='cube':
   points=[pt(335,181),pt(584,116),pt(905,172),pt(608,243),pt(335,181)]
   layer=Image.new('RGBA',im.size);ld=ImageDraw.Draw(layer);ld.polygon(points,fill=(147,114,197,35));ld.line(points[:max(2,int(2+3*reveal))],fill=(139,96,188,220),width=4);im.alpha_composite(layer)
   label(im,475,548,'Find the planes',LILAC);arrow(im,[(651,548),(665,400),pt(606,185)],LILAC,reveal)
  elif kind=='cup':
   light=pt(516,346);dark=pt(725,376);glow(im,(light[0]-38,light[1]-75,light[0]+38,light[1]+75),PEACH,local)
   label(im,454,540,'Light',PEACH);arrow(im,[(510,540),(520,440),light],PEACH,reveal)
   label(im,1068,540,'Shadow',LILAC);arrow(im,[(1100,538),(1080,420),dark],LILAC,reveal)
  elif kind=='glass':
   label(im,472,548,'Notice the edges',LILAC);arrow(im,[(668,545),(702,392),pt(519,290)],LILAC,reveal)
  elif kind=='hatching':
   label(im,466,548,'Build control, one mark at a time',LILAC)
   for j in range(7):
    if local>.1*j:ImageDraw.Draw(im).line((65+j*30,sy+112,88+j*30,sy+66),fill=color,width=3)
  elif kind=='landscape':
   label(im,455,125,'Light against dark',MINT);arrow(im,[(651,168),(752,163),(950,230)],MINT,reveal)
   label(im,1030,545,'Reflection',PEACH);arrow(im,[(1057,545),(990,525),(885,507)],PEACH,reveal)
  elif kind=='portrait':
   label(im,458,544,'Look. Compare. Draw.',PEACH)
  elif kind=='crane':
   label(im,457,545,'Structure + light + edges',LILAC);arrow(im,[(765,541),(850,471),pt(702,391)],LILAC,reveal)
  elif kind=='giftbox':
   label(im,462,548,'From a cube to a gift box',MINT);arrow(im,[(748,548),(840,471),pt(596,278)],MINT,reveal)
  elif kind=='materials':label(im,467,545,'Everything begins with a pencil',MINT)
 # Always-visible fine progress line and a warm colored signature.
 d=ImageDraw.Draw(im);d.rounded_rectangle((44,665,1236,671),3,fill='#e7e0e9');d.rounded_rectangle((44,665,44+int(1192*t/35.23),671),3,fill=color)
 txt(im,(44,688),'LOOK  ·  PRACTISE  ·  CREATE',18,MUTED)
 # A brief soft reveal, never a flashing cut.
 if local<.14:im=Image.blend(Image.new('RGBA',im.size,BG),im,max(.2,local/.14))
 return im.convert('RGB')

def render_mobile(t,desktop):
 idx=max(i for i,s in enumerate(scenes) if t>=s[0]);start,end,kind,title,sub,color=scenes[idx]
 im=Image.new('RGBA',(720,960),BG);d=ImageDraw.Draw(im);d.ellipse((540,-130,900,230),fill='#e9e0f2');d.ellipse((-170,750,170,1090),fill='#e0efe9')
 txt(im,(32,24),'FEI TEAMART  /  FOUNDATION OF SKETCH',18,MUTED)
 label(im,32,75,f'{idx+1:02}  /  YOUR DRAWING JOURNEY',color)
 y=wrapped(im,title,(32,148),656,48);txt(im,(32,y+14),sub,24,MUTED)
 if kind in ['welcome','finish','invitation']:
  for j,name in enumerate(['icecream','cup','crane']):
   x=32+j*221;rounded_image(im,images[name],(x,388,212,340),'cover');label(im,x+8,665,['Ice cream','The cup','Paper crane'][j],[PEACH,MINT,LILAC][j])
  txt(im,(32,793),'Your first drawing starts today.' if kind=='finish' else 'Real lessons. Your own progress.',30,INK)
 else:
  # Reframe the teaching image and its baked-in annotations as one layer.
  art=desktop.crop((424,104,1236,604)).resize((656,404),Image.Resampling.LANCZOS)
  im.paste(art,(32,386));label(im,32,823,'Look. Practise. Create.',color)
 d=ImageDraw.Draw(im);d.rounded_rectangle((32,912,688,918),3,fill='#e7e0e9');d.rounded_rectangle((32,912,32+int(656*t/35.23),918),3,fill=color)
 return im.convert('RGB')

def encoder(name,size):
 return subprocess.Popen([FF,'-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',size,'-r',str(FPS),'-i','-','-i',str(OUT/'intro.mp3'),'-map','0:v','-map','1:a','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-t','35.22',str(OUT/name)],stdin=subprocess.PIPE)
wide=encoder('intro-film-v3.mp4','1280x720');mobile=encoder('intro-film-mobile-v3.mp4','720x960')
for n in range(math.ceil(35.23*FPS)):
 t=n/FPS;frame=render(t);wide.stdin.write(frame.tobytes());mobile.stdin.write(render_mobile(t,frame).tobytes())
 if n%120==0:print(f'Rendered {n}/{math.ceil(35.23*FPS)} frames',flush=True)
for process in [wide,mobile]:
 process.stdin.close();code=process.wait()
 if code:raise SystemExit(code)
render(1.5).save(OUT/'poster-v2.jpg',quality=90);render_mobile(1.5,render(1.5)).save(OUT/'poster-mobile-v2.jpg',quality=90)
for t in [1.5,5,8,11,14,16,18,21,24,27,30,33]:
 frame=render(t);frame.save(R/f'review-{t}.jpg',quality=85);render_mobile(t,frame).save(R/f'review-mobile-{t}.jpg',quality=85)
print('Rendered both versions',flush=True)
