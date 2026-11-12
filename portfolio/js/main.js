(function(){
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
var lb=document.getElementById('lightbox'),lbImg=lb.querySelector('img'),cap=lb.querySelector('figcaption'),prev=lb.querySelector('.lb-prev'),next=lb.querySelector('.lb-next'),list=[],idx=0;
function show(i){idx=(i+list.length)%list.length;var im=list[idx];lbImg.src=im.currentSrc||im.src;lbImg.alt=im.alt;cap.textContent=im.alt;}
document.querySelectorAll('[data-open]').forEach(function(b){
  b.addEventListener('click',function(){document.getElementById(b.dataset.open).showModal();});
});
document.querySelectorAll('dialog[id^="p-"]').forEach(function(d){
  d.addEventListener('click',function(e){if(e.target===d)d.close();});
  d.querySelector('[data-close]').addEventListener('click',function(){d.close();});
  var imgs=[].slice.call(d.querySelectorAll('img'));
  imgs.forEach(function(img){
    var b=document.createElement('button');b.type='button';b.className='zoom';b.setAttribute('aria-label','Bild vergrößern');
    img.parentNode.insertBefore(b,img);b.appendChild(img);
    b.addEventListener('click',function(){list=imgs;prev.hidden=next.hidden=imgs.length<2;show(imgs.indexOf(img));lb.showModal();});
  });
});
prev.addEventListener('click',function(){show(idx-1);});
next.addEventListener('click',function(){show(idx+1);});
lb.querySelector('.lb-close').addEventListener('click',function(){lb.close();});
lb.addEventListener('click',function(e){if(e.target===lb)lb.close();});
lb.addEventListener('keydown',function(e){if(list.length>1){if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1);}});
document.querySelectorAll('.flip').forEach(function(f){f.addEventListener('click',function(){f.classList.toggle('on');});});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){rm?el.classList.add('in'):io.observe(el);});
document.querySelectorAll('.card').forEach(function(c){c.addEventListener('click',function(e){if(!e.target.closest('button'))c.querySelector('[data-open]').click();});});
var stm=[].slice.call(document.querySelectorAll('.statement'));
if(rm){stm.forEach(function(s){s.style.setProperty('--sp',100);});return;}
var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target;el.classList.add('in');sio.unobserve(el);setTimeout(function(){el.classList.remove('st','in');},1500+(+el.style.getPropertyValue('--i')||0)*80);}});},{threshold:.15});
['.services','.tiles','.timeline','.facts'].forEach(function(g){document.querySelectorAll(g).forEach(function(c){[].slice.call(c.children).forEach(function(k,i){k.classList.add('st');k.style.setProperty('--i',i);sio.observe(k);});});});
var bar=document.createElement('div');bar.className='progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
function onScroll(){var max=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(max>0?scrollY/max:0)+')';
  document.querySelectorAll('.grid>.card').forEach(function(c,i){var r=c.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight*.6))),e=1-Math.pow(1-p,3),d=(i%2===0?-1:1)*(innerWidth<820?10:18);
    c.style.setProperty('--tx',((1-e)*d).toFixed(2));c.style.setProperty('--o',(.15+.85*e).toFixed(2));});
  stm.forEach(function(s){var r=s.getBoundingClientRect(),p=(innerHeight*.85-r.top)/(r.height+innerHeight*.3);s.style.setProperty('--sp',Math.max(0,Math.min(1,p))*100);});}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  var cur=document.createElement('div');cur.className='cursor';cur.setAttribute('aria-hidden','true');document.body.appendChild(cur);
  var cx=0,cy=0,tx=0,ty=0,seen=false;
  window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!seen){seen=true;cx=tx;cy=ty;cur.style.opacity=1;}cur.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,.card,.flip,.tile')));});
  (function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cur.style.transform='translate3d('+cx+'px,'+cy+'px,0) translate(-50%,-50%)';requestAnimationFrame(loop);})();
}
var rig=document.querySelector('.rig');
if(rig)window.addEventListener('pointermove',function(e){
  var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
  rig.style.setProperty('--rx',(-14-y*26)+'deg');rig.style.setProperty('--ry',(22+x*40)+'deg');
});
})();

/* Visitenkarte: mit Maus oder Finger frei drehbar, Klick dreht um */
(function(){
  var st=document.querySelector('.flip-stage'),sp=st&&st.querySelector('.fl-spin');if(!sp)return;
  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ry=0,rx=0,vy=0,vx=0,drag=false,hover=false,lx=0,ly=0,lt=0,moved=0,target=null,last=performance.now();
  function cl(v,a,b){return Math.max(a,Math.min(b,v));}
  st.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')hover=true;});
  st.addEventListener('pointerleave',function(){hover=false;});
  st.addEventListener('pointerdown',function(e){drag=true;moved=0;lx=e.clientX;ly=e.clientY;lt=e.timeStamp;vy=vx=0;target=null;st.classList.add('drag');try{st.setPointerCapture(e.pointerId);}catch(_){}});
  st.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lx,dy=e.clientY-ly,dt=Math.max(8,e.timeStamp-lt);
    lx=e.clientX;ly=e.clientY;lt=e.timeStamp;moved+=Math.abs(dx)+Math.abs(dy);
    ry+=dx*.45;rx=cl(rx-dy*.35,-45,45);vy=dx*.45/dt;vx=-dy*.35/dt;});
  function up(){if(!drag)return;drag=false;st.classList.remove('drag');
    if(moved<6){var b=Math.round(ry/180)*180;target=b+180;vy=vx=0;}}
  st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  function loop(now){var dt=Math.min(50,now-last);last=now;
    if(!drag){
      if(target!==null){ry+=(target-ry)*Math.min(1,dt*.008);if(Math.abs(target-ry)<.3){ry=target;target=null;}}
      else{ry+=vy*dt;rx+=vx*dt;var f=Math.pow(.994,dt);vy*=f;vx*=f;}
      rx+=(0-rx)*Math.min(1,dt*.002);
    }
    sp.style.transform='rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg)';
    requestAnimationFrame(loop);}
  requestAnimationFrame(loop);
})();