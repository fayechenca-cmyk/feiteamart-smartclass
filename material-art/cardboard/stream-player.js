// Load the official Stream player only after a learner requests a demonstration.
let sdkPromise;
function loadStreamSDK(){
 if(window.Stream)return Promise.resolve(window.Stream);
 if(!sdkPromise)sdkPromise=new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  const timer=setTimeout(()=>{script.remove();sdkPromise=null;reject(new Error('Stream timed out'));},15000);
  script.src='https://embed.cloudflarestream.com/embed/sdk.latest.js';
  script.onload=()=>{clearTimeout(timer);if(window.Stream)resolve(window.Stream);else{sdkPromise=null;reject(new Error('Stream unavailable'));}};
  script.onerror=()=>{clearTimeout(timer);script.remove();sdkPromise=null;reject(new Error('Stream unavailable'));};
  document.head.append(script);
 });
 return sdkPromise;
}
export async function mountStream(host,uid,{full=false,title='',onEnded,onError,onPlay,onPause,isCurrent=()=>true}={}){
 const Stream=await loadStreamSDK();
 if(!host.isConnected||!isCurrent())return null;
 const frame=document.createElement('iframe');
 frame.title=title+' — silent demonstration';
 frame.allow='autoplay; fullscreen; picture-in-picture';
 frame.allowFullscreen=true;
 frame.src=`https://customer-a78os4oj56dr67ab.cloudflarestream.com/${uid}/iframe?muted=true&autoplay=true&controls=${full}&letterboxColor=%23e9f4f7`;
 host.replaceChildren(frame);
 const player=Stream(frame);
 player.muted=true;player.controls=full;player.loop=false;
 const current=()=>frame.isConnected&&isCurrent();
 for(const [event,callback] of Object.entries({ended:onEnded,error:onError,play:onPlay,pause:onPause})){
  if(callback)player.addEventListener(event,()=>{if(current())callback();});
 }
 return {play:()=>player.play(),pause:()=>player.pause(),get paused(){return player.paused;},destroy:()=>{player.destroy();frame.remove();}};
}
