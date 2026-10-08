from pathlib import Path
import subprocess,json,re,concurrent.futures
from urllib.parse import urljoin
root=Path(__file__).resolve().parents[1];out=root/'assets/sketch-support/finals';out.mkdir(parents=True,exist_ok=True)
sources=json.loads((root/'assets/sketch-map/sources.json').read_text());uids={k:re.search(r'cloudflarestream.com/([^/]+)/',u)[1] for k,u in sources.items() if 'cloudflarestream.com' in u}
uids['dog']='8876d665061fa07356f6a08db27ef169'
uids.update({'prep-lines':'8bd402e0d2480692b41a65817038baf3','prep-setup':'9b335ebd533cbfdab6a608255a1c202c','prep-tape':'5fee79867ca52d1ec9b26654bb3bc0e5','prep-warmup':'cf7834125b757d86d0965702c6550202'})
def get(url):return subprocess.check_output(['curl','-L','--fail','--silent','--show-error',url]).decode()
def one(item):
 k,uid=item;base=f'https://customer-a78os4oj56dr67ab.cloudflarestream.com/{uid}/';url=base+'manifest/video.m3u8';m=get(url);v=re.search(r'RESOLUTION=852x480[^\n]*\n([^\n]+)',m) or re.search(r'#EXT-X-STREAM-INF:[^\n]*\n([^\n]+)',m);pl=get(urljoin(url,v[1]));duration=sum(map(float,re.findall(r'#EXTINF:([\d.]+)',pl)));t=round(max(0,duration-4),2);source=base+f'thumbnails/thumbnail.jpg?time={t}s&height=720';
 for at in ([120] if k=='prep-warmup' else [10] if k in ['apple','cylinder','cup'] else [t,round(duration*.85,2),10]):
  source=base+f'thumbnails/thumbnail.jpg?time={at}s&height=720'
  result=subprocess.run(['curl','-L','--fail','--silent','--show-error',source,'-o',str(out/(k+'.jpg'))])
  if result.returncode==0:break
 else:raise RuntimeError(k)
 print(k,duration,flush=True);return k,{'uid':uid,'seconds':at,'source':source}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=dict(pool.map(one,uids.items()))
(out/'sources.json').write_text(json.dumps(results,indent=2))
