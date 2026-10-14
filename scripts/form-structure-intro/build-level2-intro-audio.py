# Original synthesized upbeat music bed + narration mix. No samples.
import numpy as np, subprocess, sys
SR=44100; OFF=1.5
nar=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',sys.argv[1],'-ar',str(SR),'-ac','1','-f','f32le','-'],capture_output=True).stdout,dtype=np.float32).copy()
TOTAL=OFF+len(nar)/SR+3.2
N=int(TOTAL*SR); t=np.arange(N)/SR
BPM=112; beat=60/BPM; bar=4*beat
def note(m): return 440*2**((m-69)/12)
def env(n,a=.005,d=.25):
    x=np.arange(n)/SR; e=np.minimum(1,x/a)*np.exp(-x/d); return e
mix=np.zeros(N)
def add(buf,start,sig,g):
    i=int(start*SR); j=min(N,i+len(sig))
    if i<N: buf[i:j]+=sig[:j-i]*g
# I–vi–IV–V in C, bright
chords=[[60,64,67],[57,60,64],[53,57,60],[55,59,62]]
roots=[36,33,29,31]
nbars=int(TOTAL/bar)+1
rng=np.random.default_rng(7)
for b in range(nbars):
    c=chords[b%4]; r=roots[b%4]; t0=b*bar
    # pad
    n=int(bar*SR); x=np.arange(n)/SR
    pad=sum(np.sin(2*np.pi*note(m)*x)+.3*np.sin(2*np.pi*note(m)*2.003*x) for m in c)
    pe=np.minimum(1,x/.3)*np.minimum(1,(bar-x)/.3)
    add(mix,t0,pad*pe,.035)
    # bass: root on beats with octave bounce
    for k in range(8):
        m=r+(12 if k%2 else 0); n=int(beat/2*SR); x=np.arange(n)/SR
        s=np.sin(2*np.pi*note(m+12)*x)+.4*np.sin(2*np.pi*note(m+24)*x)
        add(mix,t0+k*beat/2,s*env(n,.004,.12),.16)
    # pluck arpeggio 8ths
    pat=[0,1,2,1,2,0,1,2]
    for k in range(8):
        m=c[pat[k]]+12+(12 if k in(3,6) else 0); n=int(.4*SR); x=np.arange(n)/SR
        s=np.sin(2*np.pi*note(m)*x)+.5*np.sin(2*np.pi*2*note(m)*x)*np.exp(-x/.05)
        add(mix,t0+k*beat/2,s*env(n,.002,.13),.075)
    # bell melody every other bar
    if b%2==1:
        mel=[c[2]+12,c[1]+12,c[2]+12,c[0]+24]
        for k,m in enumerate(mel):
            n=int(.7*SR); x=np.arange(n)/SR
            s=np.sin(2*np.pi*note(m)*x)+.25*np.sin(2*np.pi*note(m)*3.01*x)
            add(mix,t0+(k*0.75+0.5)*beat,s*env(n,.003,.3),.05)
    # drums
    for k in range(4):
        tb=t0+k*beat
        if k in(0,2):
            n=int(.25*SR); x=np.arange(n)/SR; f=50+90*np.exp(-x/.03)
            add(mix,tb,np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x/.12),.35)
        if k in(1,3):
            n=int(.18*SR); x=np.arange(n)/SR
            add(mix,tb,rng.standard_normal(n)*np.exp(-x/.045),.07)
        for h in range(2):
            n=int(.05*SR); x=np.arange(n)/SR; z=rng.standard_normal(n); z=np.diff(z,prepend=0)
            add(mix,tb+h*beat/2,z*np.exp(-x/.012),.035 if h else .02)
# music fades
fi=np.minimum(1,t/1.0); fo=np.clip((TOTAL-t)/2.6,0,1)
mix*=fi*fo
# voice placement + ducking
voice=np.zeros(N); i=int(OFF*SR); voice[i:i+len(nar)]=nar[:N-i]
def rms(x): return np.sqrt(np.mean(x**2)+1e-12)
vact=voice[np.abs(voice)>.02]; voice*=0.12/rms(vact)   # speech level
win=int(.05*SR); e=np.sqrt(np.convolve(voice**2,np.ones(win)/win,'same'))
active=(e>.02).astype(float)
k=int(.35*SR); active=np.convolve(active,np.ones(k)/k,'same'); active=np.clip(active*3,0,1)
mix=mix/ rms(mix[int(2*SR):int(10*SR)]) *0.11
duck=1-0.55*active      # ~ -7 dB under speech; lively when no speech
out=voice+mix*duck
out=np.stack([out+mix*duck*0.0,out],1)
pk=np.max(np.abs(out)); out=out/max(pk,1)*0.95 if pk>.95 else out
print('total',TOTAL,'peak',pk)
open('mix.f32','wb').write(out.astype(np.float32).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','mix.f32','-c:a','libmp3lame','-b:a','192k','mix.mp3'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','mix.f32','-c:a','aac','-b:a','160k','mix.m4a'],check=True)
