"""Render a short Cone welcome with teacher clips, everyday forms and original music.
Usage: python render-cone-intro.py --media-dir <scratch inputs>. See intro/README.md.
"""
from pathlib import Path
import argparse,json,re,subprocess,math,wave
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageOps
import imageio_ffmpeg
ap=argparse.ArgumentParser();ap.add_argument('--media-dir',type=Path,required=True);P=ap.parse_args().media_dir
R=Path(__file__).resolve().parents[1];O=R/'lessons/lesson-7-cone/intro';O.mkdir(exist_ok=True)
ff=imageio_ffmpeg.get_ffmpeg_exe();W,H,FPS=1280,720,20;scenes=json.loads((P/'scenes.json').read_text())
durations=[]
for i in range(len(scenes)):
 text=subprocess.run([ff,'-i',str(P/f'voice-{i}.mp3')],capture_output=True,text=True).stderr;m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',text);h,m,s=map(float,m.groups());durations.append(h*3600+m*60+s+.22)
speed=max(1,sum(durations)/39);durations=[math.ceil(t/speed*FPS)/FPS for t in durations]
fonts={(s,b):ImageFont.truetype('/System/Library/Fonts/Supplemental/'+('Arial Bold.ttf' if b else 'Arial.ttf'),s) for s in [18,24,28,38,48] for b in [False,True]}
def txt(im,xy,s,n=28,c='#302b40',b=True):ImageDraw.Draw(im).text(xy,s,font=fonts[n,b],fill=c)
def card(im,pic,box,cover=False):
 x,y,w,h=box;im2=ImageOps.fit(pic,(w,h)) if cover else ImageOps.contain(pic,(w,h));base=Image.new('RGB',(w,h),'white');base.paste(im2,((w-im2.width)//2,(h-im2.height)//2));mask=Image.new('L',(w,h));ImageDraw.Draw(mask).rounded_rectangle((0,0,w-1,h-1),24,fill=255);im.paste(base,(x,y),mask)
refs={n:Image.open(R/f'assets/sketch-support/finals/{n}.jpg').convert('RGB') for n in ['box','apple','cup','cone','icecream']}
examples=Image.open(P/'examples.png').convert('RGB');ew,eh=examples.size
ice=examples.crop((0,0,ew//2,eh));hat=examples.crop((ew//2,0,ew,eh));rocket=Image.open(P/'rocket.jpg').convert('RGB')
clips={}
for name in ['structure','ellipse','tone']:
 raw=subprocess.check_output([ff,'-loglevel','error','-i',str(P/f'{name}.mp4'),'-vf',f'scale=960:540,fps={FPS}','-f','rawvideo','-pix_fmt','rgb24','-']);clips[name]=np.frombuffer(raw,dtype=np.uint8).reshape(-1,540,960,3)
def frame(i,t):
 im=Image.new('RGB',(W,H),'#faf8ff');d=ImageDraw.Draw(im)
 d.ellipse((-170,-240,370,200),fill='#e1f5ee');d.ellipse((1100,540,1440,900),fill='#ffe6d6')
 txt(im,(42,25),'FOUNDATION OF SKETCH  /  THE CONE',18,'#79668d');txt(im,(42,60),scenes[i][0],38)
 if i==0:
  for k,(n,label) in enumerate([('box','Cube → box'),('apple','Sphere → apple'),('cup','Cylinder → cup')]):
   y=184-int(8*math.sin(min(1,t/1.4)*math.pi+k*.4));card(im,refs[n],(42+k*410,y,376,350));txt(im,(60+k*410,570),label,28)
 elif i==1:
  card(im,refs['cone'],(180,145,920,510));p=min(1,t/1.1);d.line([(640,220),(640,220+360*p)],fill='#1262ff',width=4);d.ellipse((496,559,800,623),outline='#00b69b',width=4);txt(im,(75,260),'ONE POINT',24,'#1262ff');txt(im,(940,565),'ROUND BASE',24,'#008c7a')
 elif i==2:
  for k,(pic,label) in enumerate([(ice,'Ice-cream cone'),(hat,'Party hat'),(rocket,'Rocket nose')]):
   card(im,pic,(42+k*410,150,376,454),k!=1);txt(im,(60+k*410,625),label,24)
  # The rocket photo shows a curved nose: highlight only its tapered tip.
  active=min(2,int(t/durations[i]*3));x=42+active*410;d.rounded_rectangle((x-4,146,x+380,608),27,outline='#a78bfa',width=5)
  if active==2:d.ellipse((995,180,1071,275),outline='#00b69b',width=5)
 elif i in [3,4]:
  name=('structure' if t<durations[i]*.45 else 'ellipse') if i==3 else 'tone';arr=clips[name];local=t/(durations[i]*.45) if name=='structure' else (t-durations[i]*.45)/(durations[i]*.55) if name=='ellipse' else t/durations[i];idx=min(len(arr)-1,int(max(0,local)*(len(arr)-1)));card(im,Image.fromarray(arr[idx]),(140,145,1000,540));txt(im,(160,156),'TEACHER DEMONSTRATION',18,'#1262ff')
 else:
  card(im,refs['cone'],(45,160,560,385));card(im,refs['icecream'],(675,160,560,385));d.line((606,350,660,350),fill='#00b69b',width=6);d.polygon([(660,350),(646,338),(646,362)],fill='#00b69b');txt(im,(358,593),"Grab your pencil. Let's draw!",38)
 for k in range(6):d.rounded_rectangle((42+k*203,699,42+k*203+189,705),3,fill='#a78bfa' if k<=i else '#e6deed')
 return im
for i,duration in enumerate(durations):
 proc=subprocess.Popen([ff,'-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',str(P/f'voice-{i}.mp3'),'-af',f'atempo={speed},apad','-t',str(duration),'-c:v','libx264','-crf','24','-preset','fast','-pix_fmt','yuv420p','-c:a','aac','-b:a','112k',str(P/f'scene-{i}.mp4')],stdin=subprocess.PIPE)
 for f in range(round(duration*FPS)):proc.stdin.write(frame(i,f/FPS).tobytes())
 proc.stdin.close();assert proc.wait()==0;print('scene',i,flush=True)
(P/'concat.txt').write_text(''.join(f"file '{P}/scene-{i}.mp4'\n" for i in range(6)))
subprocess.run([ff,'-loglevel','error','-y','-f','concat','-safe','0','-i',str(P/'concat.txt'),'-c','copy',str(P/'voice-film.mp4')],check=True)
# Original major-key plucks and bell accents; no external samples.
sr=44100;length=sum(durations);music=np.zeros((math.ceil(length*sr),2));beat=60/114
for j,at in enumerate(np.arange(0,length,beat/2)):
 chord=[[60,64,67,71],[65,69,72,76],[67,71,74,79],[60,64,67,72]][(j//8)%4];midi=chord[j%4]+(12 if j%8==0 else 0);n=min(int(.7*sr),len(music)-int(at*sr));t=np.arange(n)/sr;freq=440*2**((midi-69)/12);tone=(np.sin(2*np.pi*freq*t)+.23*np.sin(4*np.pi*freq*t))*np.exp(-t*6)*(1-np.exp(-t*80))*.08;music[int(at*sr):int(at*sr)+n]+=tone[:,None]*np.array([.8,1] if j%2 else [1,.8])
t=np.arange(len(music))/sr;music*= (np.minimum(1,t/.5)*np.minimum(1,np.maximum(0,(length-t)/1.1)))[:,None]
with wave.open(str(P/'music.wav'),'wb') as wav:wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(sr);wav.writeframes((music*32767).astype('<i2').tobytes())
subprocess.run([ff,'-loglevel','error','-y','-i',str(P/'voice-film.mp4'),'-i',str(P/'music.wav'),'-filter_complex','[0:a]loudnorm=I=-17:TP=-2:LRA=7[v];[1:a]loudnorm=I=-31:TP=-8:LRA=5[m];[v][m]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[a]','-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','128k','-movflags','+faststart',str(O/'meet-the-cone.mp4')],check=True)
frame(1,1).save(O/'poster.jpg',quality=88)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'
at=0;vtt='WEBVTT\n\n';records=[]
for i,(title,voice) in enumerate(scenes):
 phrases=re.split(r'(?<=[.!?])\s+',voice);cursor=at;total=sum(map(len,phrases))
 for phrase in phrases:
  end=cursor+(durations[i]-.15)*len(phrase)/total;vtt+=f'{stamp(cursor)} --> {stamp(end)}\n{phrase}\n\n';cursor=end
 records.append({'title':title,'narration':voice,'seconds':durations[i]});at+=durations[i]
(O/'captions.vtt').write_text(vtt);(O/'scenes.json').write_text(json.dumps(records,indent=2));print('Total seconds',length,flush=True)
