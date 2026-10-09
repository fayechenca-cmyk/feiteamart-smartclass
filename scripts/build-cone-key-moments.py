"""Build Cone analysis SVGs from unchanged teacher frames, and add narration audit entries."""
from pathlib import Path
import json,base64,subprocess,concurrent.futures
R=Path(__file__).resolve().parents[1];O=R/'assets/sketch-support/cone';P=Path('/tmp/cone-pauses');P.mkdir(exist_ok=True)
plan=json.loads((O/'plan.json').read_text());sources=json.loads((O/'sources.json').read_text())
marks={
'axis':'<path d="M640 95 V640"/><path d="M580 95 H700 M580 640 H700"/>',
'width':'<path d="M425 620 H850 M640 100 V640" stroke-dasharray="12 9"/>',
'sides':'<path d="M420 630 L630 85 L865 630"/>',
'base':'<ellipse cx="640" cy="610" rx="210" ry="56"/>',
'boundary':'<path d="M635 110 Q700 380 790 615" stroke-dasharray="12 9"/>',
'cast':'<ellipse cx="925" cy="611" rx="160" ry="48"/>',
'dark':'<path d="M670 205 L800 585" stroke-width="10" stroke-opacity=".55"/>',
'middle':'<ellipse cx="642" cy="455" rx="62" ry="160"/>',
'tip':'<ellipse cx="638" cy="137" rx="60" ry="72"/>',
'background':'<ellipse cx="371" cy="328" rx="80" ry="155"/>',
'tissue':'<ellipse cx="715" cy="292" rx="58" ry="70"/>'}
targets={'axis':(640,250),'width':(430,615),'sides':(460,500),'base':(475,610),'boundary':(745,435),'cast':(860,610),'dark':(738,442),'middle':(620,444),'tip':(637,135),'background':(367,324),'tissue':(713,295)}
def one(row):
 v,t,title,prompt,voice,kind=row;uid=sources[v-1]['uid'];file=f'v{v}-{t}.svg';jpg=P/f'full-{v}-{t}.jpg';url=f'https://customer-a78os4oj56dr67ab.cloudflarestream.com/{uid}/thumbnails/thumbnail.jpg?time={t}s&height=720'
 if not jpg.exists():subprocess.run(['curl','-L','--fail','-sS',url,'-o',str(jpg)],check=True)
 data=base64.b64encode(jpg.read_bytes()).decode();x,y=targets[kind];startx=1020 if x<800 else 1120;starty=max(80,y-130)
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"><defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#00d5b0"/></marker></defs><image width="1280" height="720" href="data:image/jpeg;base64,{data}"/><g fill="none" stroke="#1262ff" stroke-width="4">{marks[kind]}</g><path d="M{startx} {starty} Q{startx-80} {y-70} {x} {y}" fill="none" stroke="#00d5b0" stroke-width="5" marker-end="url(#arrow)"/></svg>'
 (O/file).write_text(svg)
 return dict(lesson='lesson-7-cone',uid=uid,time=t,title=title,shortPrompt=prompt,text=voice,voiceoverEn=voice,image=f'../../assets/sketch-support/cone/{file}',source=url)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:entries=list(ex.map(one,plan))
(O/'pauses.json').write_text(json.dumps(entries,indent=2))
p=R/'assets/sketch-support/pause-audit.json';audit=json.loads(p.read_text());p.write_text(json.dumps([x for x in audit if x['lesson']!='lesson-7-cone']+entries,indent=2));print('Built',len(entries),'Cone key moments')
