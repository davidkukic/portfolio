/* Start-Animation: Der Würfel dreht sich groß in der Mitte und fliegt dann an seinen Platz. */
(function(){
var root=document.documentElement;
function done(){root.classList.remove('intro');root.style.overflow='';}
if(!root.classList.contains('intro'))return;
var stage=document.querySelector('.stage'),cube=document.querySelector('.cube');
if(!stage||!cube||!stage.animate){done();return;}
window.scrollTo(0,0);
root.style.overflow='hidden';
var failsafe=setTimeout(done,6000);
function go(){
  var r=stage.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight;
  var dx=vw/2-(r.left+r.width/2),dy=vh/2-(r.top+r.height/2)-20;
  var big=vw<820?2.1:2.7,hold=1300,move=1500;
  var spin=cube.getAnimations()[0];
  stage.style.position='relative';stage.style.zIndex='40';stage.style.pointerEvents='none';
  var from='translate('+dx+'px,'+dy+'px) scale('+big+')';
  var a=stage.animate([{transform:from},{transform:from,offset:hold/(hold+move)},{transform:'none'}],
    {duration:hold+move,easing:'cubic-bezier(.65,0,.2,1)',fill:'both'});
  var t0=performance.now(),textShown=false;
  (function tick(now){
    var t=now-t0;
    if(spin){
      var k=t<hold?1:Math.max(0,1-(t-hold)/move);
      spin.playbackRate=1+60*k*k;
    }
    if(!textShown&&t>hold+move*.45){textShown=true;root.classList.remove('intro');root.classList.add('intro-end');}
    if(t<hold+move)requestAnimationFrame(tick);
    else{if(spin)spin.playbackRate=1;a.cancel();stage.style.position=stage.style.zIndex=stage.style.pointerEvents='';root.style.overflow='';clearTimeout(failsafe);setTimeout(function(){root.classList.remove('intro-end');},1500);}
  })(t0);
}
if(document.readyState==='complete')requestAnimationFrame(go);else window.addEventListener('load',function(){requestAnimationFrame(go);});
})();
