from pathlib import Path
import numpy as np, wave, subprocess, json, re
import imageio_ffmpeg
r=Path(__file__).resolve().parents[1]/'assets/sketch-intro'; ff=imageio_ffmpeg.get_ffmpeg_exe()
import tempfile
scratch = tempfile.TemporaryDirectory(prefix='fei-sketch-audio-')
voice_wav = str(Path(scratch.name)/'voice.wav')
music_wav = str(Path(scratch.name)/'music.wav')
# Decode the generated voice to measure its exact running time.
subprocess.run([ff,'-y','-i',str(r/'voice.mp3'),'-ar','44100','-ac','1',voice_wav],check=True,capture_output=True)
with wave.open(voice_wav) as w: duration=w.getnframes()/w.getframerate()
sr=44100; length=duration+1.5; track=np.zeros((int(sr*length),2),np.float64)
# An original, gentle four-chord motif; no third-party music samples.
chords=[[48,55,59,64],[45,52,59,60],[41,48,52,57],[43,50,55,60]]
def note(midi,start,dur,level,pan):
 n=min(int(dur*sr),len(track)-int(start*sr))
 if n<=0:return
 t=np.arange(n)/sr; f=440*2**((midi-69)/12)
 tone=sum(g*np.sin(2*np.pi*f*h*t)*np.exp(-t*(.35+.25*h)) for h,g in [(1,1),(2,.25),(3,.09),(4,.035)])
 env=(1-np.exp(-t*35))*np.minimum(1,(dur-t)/.3)
 signal=tone*env*level
 begin=int(start*sr);track[begin:begin+n,0]+=signal*np.sqrt(1-pan);track[begin:begin+n,1]+=signal*np.sqrt(pan)
 for delay,gain in [(.12,.10),(.24,.06)]:
  offset=int((start+delay)*sr); count=min(n,len(track)-offset)
  if count>0:track[offset:offset+count]+=signal[:count,None]*gain
beat=60/78
for bar,start in enumerate(np.arange(0,length,beat*4)):
 chord=chords[bar%4]
 for j,midi in enumerate(chord):note(midi,start+j*.075,4.3,.07,.3+j*.12)
 for j,midi in enumerate([chord[2]+12,chord[3]+12,chord[1]+12]):note(midi,start+beat*(j+1),2.6,.035,.35+j*.15)
t=np.arange(len(track))/sr;fade=np.minimum(1,t/1.4)*np.minimum(1,np.maximum(0,(length-t)/2.2));track*=fade[:,None]
with wave.open(music_wav,'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(track,-1,1)*32767).astype('<i2').tobytes())
subprocess.run([ff,'-y','-i',str(r/'voice.mp3'),'-i',music_wav,'-filter_complex','[0:a]loudnorm=I=-17:TP=-2:LRA=7,adelay=500|500[v];[1:a]loudnorm=I=-32:TP=-8:LRA=5[m];[v][m]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.89[out]','-map','[out]','-ar','44100','-ac','2','-b:a','160k',str(r/'intro.mp3')],check=True,capture_output=True)
def secs(text):
 h,m,s=re.split('[:,]',text)[:3];ms=text.split(',')[1];return int(h)*3600+int(m)*60+int(s)+int(ms)/1000+.5
cues=[]
for block in (r/'voice.srt').read_text().strip().split('\n\n'):
 lines=block.splitlines()
 if len(lines)>=3:
  start,end=lines[1].split(' --> ');cues.append({'start':round(secs(start),3),'end':round(secs(end),3),'text':' '.join(lines[2:])})
(r/'captions.json').write_text(json.dumps(cues,indent=2))
print(json.dumps({'voiceSeconds':duration,'introSeconds':length,'captionCount':len(cues),'sizeBytes':(r/'intro.mp3').stat().st_size}))

scratch.cleanup()
