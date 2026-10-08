"""Render Cylinder's short narrated orientation. Inputs and scene script: see lesson intro README.
Usage: PYTHONPATH=<imageio-ffmpeg install> python render-cylinder-intro.py --media-dir <temporary inputs>
Only the final MP4, poster and captions belong in the website repository.
"""
from pathlib import Path
import argparse,json,math,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageOps
import imageio_ffmpeg
ap=argparse.ArgumentParser();ap.add_argument('--media-dir',type=Path,required=True);a=ap.parse_args();P=a.media_dir
O=Path(__file__).resolve().parents[1]/'lessons/lesson-5-cylinder/intro';O.mkdir(exist_ok=True)
ff=imageio_ffmpeg.get_ffmpeg_exe();W,H,FPS=1280,720,20
scenes=json.loads((P/'scenes.json').read_text());durations=json.loads((P/'durations.json').read_text());durations=[math.ceil(t*FPS)/FPS for t in durations]
fontdir=Path('/System/Library/Fonts/Supplemental')
def font(n,b=False):return ImageFont.truetype(str(fontdir/('Arial Bold.ttf' if b else 'Arial.ttf')),n)
fonts={(n,b):font(n,b) for n in [18,22,24,28,36,42] for b in [True,False]}
def txt(im,xy,s,n=24,c='#332c43',b=False):ImageDraw.Draw(im).text(xy,s,font=fonts[n,b],fill=c)
def tag(im,xy,s,c='#1262ff'):
 d=ImageDraw.Draw(im);w=d.textlength(s,font=fonts[22,True]);x,y=xy;d.rounded_rectangle((x,y,x+w+28,y+38),12,fill=c);txt(im,(x+14,y+6),s,22,'white',True)
def arrow(im,start,end,c='#00b69b'):
 d=ImageDraw.Draw(im);d.line([start,end],fill=c,width=5);ang=math.atan2(end[1]-start[1],end[0]-start[0]);d.polygon([end,(end[0]-18*math.cos(ang-.5),end[1]-18*math.sin(ang-.5)),(end[0]-18*math.cos(ang+.5),end[1]-18*math.sin(ang+.5))],fill=c)
clips={}
for name in ['structure','ellipse','shadow','tones','finish']:
 raw=subprocess.check_output([ff,'-loglevel','error','-i',str(P/(name+'.mp4')),'-vf',f'scale=960:540,fps={FPS}','-f','rawvideo','-pix_fmt','rgb24','-'])
 clips[name]=np.frombuffer(raw,dtype=np.uint8).reshape(-1,540,960,3)
reference=Image.open(P/'reference.png').convert('RGB');process=Image.open(P/'process.png').convert('RGB')
def light_frame(im,t):
 d=ImageDraw.Draw(im);cx,cy,r=640,305,145;phase=-.9+1.8*(.5-.5*math.cos(t*.8));lx=math.sin(phase);lz=math.cos(phase);ly=.65+.18*math.sin(t*.8)
 # Ground shadow points away from the moving light.
 shift=-lx*240;d.ellipse((cx-120+min(0,shift),560,cx+120+max(0,shift),627),fill='#b6b1bd')
 for x in range(-r,r):
  nx=x/r;nz=math.sqrt(max(0,1-nx*nx));v=int(95+145*max(0,nx*lx+nz*lz)/math.sqrt(1+ly*ly));bottom=565+int(40*math.sqrt(max(0,1-nx*nx)));d.line((cx+x,cy,cx+x,bottom),fill=(v,v,v+min(5,255-v)))
 top=int(110+110*ly/math.sqrt(1+ly*ly));d.ellipse((cx-r,cy-42,cx+r,cy+42),fill=(top,top,top),outline='#827b8a',width=3)
 sun=(int(cx+lx*370),165);d.ellipse((sun[0]-22,sun[1]-22,sun[0]+22,sun[1]+22),fill='#efb649');arrow(im,(sun[0],193),(cx+lx*100,cy-60),'#df9e30')
 tag(im,(170,290),'FLAT TOP');arrow(im,(315,328),(cx-45,cy))
 tag(im,(850,410),'CURVED SIDE');arrow(im,(850,455),(cx+105,445))
 txt(im,(sun[0]-64,118),'MOVING LIGHT',18,'#80622a',True)
def frame(i,t):
 im=Image.new('RGB',(W,H),'#faf8ff');d=ImageDraw.Draw(im)
 txt(im,(42,22),'FOUNDATION OF SKETCH  /  THE CYLINDER',18,'#79668d',True)
 txt(im,(42,53),scenes[i][0],36,b=True);txt(im,(42,100),scenes[i][1],24,'#756a82')
 if i in [1,2,3,5,6]:
  name={1:'structure',2:'ellipse',3:'shadow',5:'tones',6:'finish'}[i];arr=clips[name];idx=min(len(arr)-1,int(t/max(.01,durations[i]-.6)*(len(arr)-1)));im.paste(Image.fromarray(arr[idx]).resize((900,506)),(190,153))
  pulse=int(3+2*(.5+.5*math.sin(t*2)))
  if i==1:
   d.line((640,193,640,594),fill='#1262ff',width=3);tag(im,(205,165),'CENTRE');arrow(im,(330,202),(637,238))
  elif i==2:
   d.ellipse((490,181,795,276),outline='#1262ff',width=pulse);tag(im,(205,165),'ELLIPSE');arrow(im,(330,200),(490,229))
  elif i==3:
   tag(im,(205,165),'SHADOW SIDE');arrow(im,(388,211),(736,411))
  elif i==5:
   tag(im,(205,165),'GRADUAL TONES');arrow(im,(393,212),(643,391))
  else:
   tag(im,(205,165),'KEEP THE RIM CLEAR');arrow(im,(470,207),(620,310))
 elif i==4:light_frame(im,t)
 elif i==0:
  pic=ImageOps.contain(reference,(900,500));im.paste(pic,((W-pic.width)//2,151));tag(im,(70,210),'FLAT TOP');arrow(im,(225,253),(630,285));tag(im,(970,380),'CURVED SIDE');arrow(im,(970,423),(680,446))
 else:
  # Animate the six panels of the supplied teaching sequence in order.
  for k in range(6):
   crop=process.crop((165+k*228,690,365+k*228,920));crop=ImageOps.fit(crop,(178,210));x=48+k*200;im.paste(crop,(x,290));
   active=min(5,int(t/durations[i]*6));d.rounded_rectangle((x-4,286,x+182,504),16,outline='#1262ff' if k==active else '#e1d8ec',width=5 if k==active else 2)
   txt(im,(x+73,520),str(k+1),28,'#79668d',True)
  txt(im,(440,193),'One clear step at a time.',28,b=True)
 # Small chapter markers carry progress without adding paragraphs.
 for k in range(8):d.rounded_rectangle((42+k*151,692,42+k*151+137,697),2,fill='#9b78c2' if k<=i else '#e5ddec')
 return im
for i,duration in enumerate(durations):
 cmd=[ff,'-loglevel','error','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',str(P/f'voice-{i}.mp3'),'-af','apad','-t',str(duration),'-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k',str(P/f'scene-{i}.mp4')]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 for n in range(round(duration*FPS)):proc.stdin.write(frame(i,n/FPS).tobytes())
 proc.stdin.close();assert proc.wait()==0
 print('Rendered',i,flush=True)
frame(0,0).save(O/'poster.jpg',quality=88)
(P/'concat.txt').write_text(''.join(f"file '{P}/scene-{i}.mp4'\n" for i in range(8)))
subprocess.run([ff,'-loglevel','error','-y','-f','concat','-safe','0','-i',str(P/'concat.txt'),'-c','copy','-movflags','+faststart',str(O/'meet-the-cylinder.mp4')],check=True)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'
vtt='WEBVTT\n\n';at=0
for i,(title,sub,spoken) in enumerate(scenes):
 import re
 phrases=re.split(r'(?<=[.!?])\s+',spoken);total=sum(len(p) for p in phrases);cursor=at
 for phrase in phrases:
  end=cursor+(durations[i]-.5)*len(phrase)/total;vtt+=f'{stamp(cursor)} --> {stamp(end)}\n{phrase}\n\n';cursor=end
 at+=durations[i]
(O/'captions.vtt').write_text(vtt)
(O/'scenes.json').write_text(json.dumps([{'title':s[0],'cue':s[1],'narration':s[2],'seconds':durations[i]} for i,s in enumerate(scenes)],indent=2))
print('Complete',at,flush=True)
