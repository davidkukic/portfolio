(function(){
var stage=document.getElementById('toy'),cv=document.getElementById('toy-cv');
if(!stage||!cv)return;
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var gl=cv.getContext('webgl2',{antialias:true,alpha:true,premultipliedAlpha:false});
if(!gl){stage.classList.add('nogl');return;}
var VS='#version 300 es\nprecision highp float;in vec3 p;in vec4 c;uniform mat4 m;uniform vec3 cs;out vec4 vc;out vec3 vp;void main(){vc=c;vp=p;gl_Position=m*vec4(p,1.);gl_PointSize=cs.x;}';
var FS='#version 300 es\nprecision highp float;in vec4 vc;in vec3 vp;uniform int mode;uniform vec3 L;out vec4 o;void main(){'
+'if(mode==1){vec2 d=gl_PointCoord-.5;float a=1.-smoothstep(.2,.5,length(d));o=vec4(1.,1.,1.,a*.9);return;}'
+'vec3 n=normalize(cross(dFdx(vp),dFdy(vp)));float d=max(dot(n,L),0.);float sky=.5+.5*n.y;'
+'vec3 base=vc.rgb;vec3 lit=base*(.16+.5*sky*vec3(.55,.65,1.)+.75*d*vec3(.7,.78,1.));'
+'vec3 g=base*vec3(1.55,1.2,.6);o=vec4(mix(lit,g,vc.a),1.);}';
function sh(t,s){var h=gl.createShader(t);gl.shaderSource(h,s);gl.compileShader(h);return h;}
var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){stage.classList.add('nogl');return;}
gl.useProgram(pr);
var uM=gl.getUniformLocation(pr,'m'),uCS=gl.getUniformLocation(pr,'cs'),uMode=gl.getUniformLocation(pr,'mode'),uL=gl.getUniformLocation(pr,'L');
var aP=gl.getAttribLocation(pr,'p'),aC=gl.getAttribLocation(pr,'c');
var vaoH=gl.createVertexArray(),vaoS=gl.createVertexArray(),count=0,ready=false;
var snow=[],snowBuf=gl.createBuffer(),snowOn=true;
function bin(b64){var s=atob(b64),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a;}
function load2(){
  if(ready||!window.HAUS_DATA)return;
  var u=bin(window.HAUS_DATA),n=Math.floor(u.length/10);count=n;
  var f=new Float32Array(n*3),cc=new Uint8Array(n*4),dv=new DataView(u.buffer);
  for(var i=0;i<n;i++){var o=i*10;
    f[i*3]=dv.getInt16(o,true)/32767;f[i*3+1]=dv.getInt16(o+2,true)/32767;f[i*3+2]=dv.getInt16(o+4,true)/32767;
    cc[i*4]=u[o+6];cc[i*4+1]=u[o+7];cc[i*4+2]=u[o+8];cc[i*4+3]=u[o+9];}
  gl.bindVertexArray(vaoH);
  var b1=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b1);gl.bufferData(gl.ARRAY_BUFFER,f,gl.STATIC_DRAW);gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,0,0);
  var b2=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b2);gl.bufferData(gl.ARRAY_BUFFER,cc,gl.STATIC_DRAW);gl.enableVertexAttribArray(aC);gl.vertexAttribPointer(aC,4,gl.UNSIGNED_BYTE,true,0,0);
  for(var k=0;k<260;k++)snow.push([Math.random()*2.4-1.2,Math.random()*1.6-.5,Math.random()*2.4-1.2,.003+Math.random()*.004]);
  ready=true;stage.classList.add('ready');
}
var Z=1,ry=-0.55,rx=0.38,vy=0,vx=0,drag=false,lx=0,ly=0,idle=0,raf=0;
function mul(a,b){var r=new Float32Array(16);for(var i=0;i<4;i++)for(var j=0;j<4;j++){var s=0;for(var k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];r[i*4+j]=s;}return r;}
function matrix(w,h){
  var f=1/Math.tan(.4),a=w/h,n=.1,fa=20,P=new Float32Array([f/a,0,0,0,0,f,0,0,0,0,(fa+n)/(n-fa),-1,0,0,2*fa*n/(n-fa),0]);
  var cy=Math.cos(ry),sy=Math.sin(ry),cx=Math.cos(rx),sx=Math.sin(rx),sc=Z*1.18;
  var Ry=new Float32Array([cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1]);
  var Rx=new Float32Array([1,0,0,0,0,cx,sx,0,0,-sx,cx,0,0,0,0,1]);
  var S=new Float32Array([sc,0,0,0,0,sc,0,0,0,0,sc,0,0,0,-3.1,1]);
  return mul(P,mul(S,mul(Rx,Ry)));
}
function size(){var d=Math.min(window.devicePixelRatio||1,2),w=stage.clientWidth,h=stage.clientHeight;
  if(cv.width!==Math.round(w*d)||cv.height!==Math.round(h*d)){cv.width=Math.round(w*d);cv.height=Math.round(h*d);}}
function draw(){
  if(!ready){load2();if(!ready)return;}
  size();gl.viewport(0,0,cv.width,cv.height);
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  var M=matrix(cv.width,cv.height);gl.uniformMatrix4fv(uM,false,M);gl.uniform3f(uL,.35,.8,.5);
  gl.uniform1i(uMode,0);gl.bindVertexArray(vaoH);gl.drawArrays(gl.TRIANGLES,0,count);
  if(snowOn){
    var d=new Float32Array(snow.length*3),cl=new Uint8Array(snow.length*4);
    for(var i=0;i<snow.length;i++){var s=snow[i];if(!rm){s[1]-=s[3];if(s[1]<-.45)s[1]=1.1;}
      d[i*3]=s[0];d[i*3+1]=s[1];d[i*3+2]=s[2];cl[i*4]=cl[i*4+1]=cl[i*4+2]=255;cl[i*4+3]=0;}
    gl.bindVertexArray(vaoS);
    gl.bindBuffer(gl.ARRAY_BUFFER,snowBuf);gl.bufferData(gl.ARRAY_BUFFER,d,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,0,0);
    gl.disableVertexAttribArray(aC);gl.vertexAttrib4f(aC,1,1,1,0);
    gl.uniform1i(uMode,1);gl.uniform3f(uCS,Math.max(3,cv.width/150),0,0);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
    gl.drawArrays(gl.POINTS,0,snow.length);gl.depthMask(true);gl.disable(gl.BLEND);
  }
}
function loop(){
  if(!drag){ry+=vy;rx+=vx;vy*=.95;vx*=.95;
    if(Math.abs(vy)<.0008&&Math.abs(vx)<.0008){idle++;if(idle>150&&!rm)ry+=.0035;}}
  rx=Math.max(-.2,Math.min(1.3,rx));draw();raf=requestAnimationFrame(loop);
}
function reset(){vy=vx=0;ry=-0.55;rx=0.38;Z=1;idle=0;draw();}
function zoom(d){Z=Math.max(.6,Math.min(2.2,Z+d));draw();}
stage.addEventListener('pointerdown',function(e){
  if(e.target.closest&&e.target.closest('button'))return;
  drag=true;idle=0;vy=vx=0;lx=e.clientX;ly=e.clientY;try{stage.setPointerCapture(e.pointerId);}catch(x){}stage.classList.add('grab');});
stage.addEventListener('pointermove',function(e){
  if(!drag)return;var dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;
  ry+=dx*.01;rx+=dy*.008;vy=dx*.01;vx=dy*.008;draw();});
function up(){drag=false;stage.classList.remove('grab');}
stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
stage.addEventListener('dblclick',function(e){if(!(e.target.closest&&e.target.closest('button')))reset();});
stage.addEventListener('keydown',function(e){
  var m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];
  if(m){e.preventDefault();vy+=m[0]*.07;vx+=m[1]*.05;idle=0;}
  if(e.key==='Home'||e.key==='Escape')reset();if(e.key==='+')zoom(.2);if(e.key==='-')zoom(-.2);});
var sb=document.getElementById('toy-snow');
if(sb)sb.addEventListener('click',function(){snowOn=!snowOn;sb.setAttribute('aria-pressed',snowOn);draw();});
var b_toy_zi=document.getElementById('toy-zi');if(b_toy_zi)b_toy_zi.addEventListener('click',function(){zoom(.2);});
var b_toy_zo=document.getElementById('toy-zo');if(b_toy_zo)b_toy_zo.addEventListener('click',function(){zoom(-.2);});
var b_toy_reset=document.getElementById('toy-reset');if(b_toy_reset)b_toy_reset.addEventListener('click',function(){reset();});
if(window.IntersectionObserver){new IntersectionObserver(function(es){es.forEach(function(en){
  if(en.isIntersecting&&!raf)raf=requestAnimationFrame(loop);
  if(!en.isIntersecting&&raf){cancelAnimationFrame(raf);raf=0;}});},{threshold:0}).observe(stage);}
else raf=requestAnimationFrame(loop);
window.addEventListener('resize',draw);
})();
