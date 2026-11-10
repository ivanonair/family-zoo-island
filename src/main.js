import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const host=document.querySelector('#scene');
const scene=new THREE.Scene(); scene.background=new THREE.Color('#b6d9ce');
let renderer;
try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:false}); } catch(e){ document.querySelector('#fallback').hidden=false; throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.outputColorSpace=THREE.SRGBColorSpace; host.appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(38,1,.1,350); camera.position.set(88,105,112);
const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(0,0,0); controls.enableDamping=true; controls.minDistance=17; controls.maxDistance=200; controls.maxPolarAngle=Math.PI*.48; controls.enablePan=true; controls.screenSpacePanning=true;
scene.add(new THREE.HemisphereLight(0xfff6d7,0x547d6a,2.25)); const sun=new THREE.DirectionalLight(0xfff4dc,2.8); sun.position.set(-18,35,18); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30}); sun.shadow.bias=-.0004; scene.add(sun);
const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.9}); const mats={grass:mat('#91ba77'),grass2:mat('#a4c983'),sand:mat('#e6ce95'),earth:mat('#b58a61'),water:mat('#72bdb4'),dark:mat('#345f47'),leaf:mat('#669a65'),leaf2:mat('#81ae70'),trunk:mat('#966c4e'),cream:mat('#f8e8c9'),black:mat('#334139'),white:mat('#f6f3df'),pink:mat('#e99083'),orange:mat('#de9d55'),yellow:mat('#e8bd65')};
function mesh(geometry,material,x=0,y=0,z=0,parent=scene){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(x,y,z,w,h,d,m,p=scene){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,p)}
function ball(x,y,z,r,m,p=scene){return mesh(new THREE.SphereGeometry(r,12,9),m,x,y,z,p)}
function cyl(x,y,z,rt,rb,h,m,p=scene,n=14){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),m,x,y,z,p)}
function group(x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);scene.add(g);return g}
function tree(x,z,s=1,palm=false){const g=group(x,0,z);cyl(0,1*s,0,.16*s,.23*s,2*s,mats.trunk,g,8);if(palm){for(let i=0;i<6;i++){const a=i*Math.PI/3;const leaf=ball(Math.cos(a)*.62*s,2.15*s,Math.sin(a)*.62*s,.57*s,mats.leaf,g);leaf.scale.set(1.6,.3,.6);leaf.rotation.y=-a;}}else{ball(0,2.3*s,0,.92*s,mats.leaf,g);ball(-.55*s,2.1*s,.1*s,.6*s,mats.leaf2,g);ball(.48*s,2.2*s,0,.55*s,mats.leaf2,g)}}
// The original park remains in the middle of a much larger walkable island.
// Its radius is 48 versus the former 14.8: over ten times the land area.
const ISLAND_RADIUS = 48;
cyl(0,-1.3,0,47,46,1.2,mats.earth,scene,96);
cyl(0,-.69,0,ISLAND_RADIUS,47,.18,mats.sand,scene,96);
cyl(0,-.52,0,46,46,.2,mats.grass,scene,96);
const outerPath=mesh(new THREE.TorusGeometry(31,1.05,6,100),mats.sand,0,-.39,0);outerPath.rotation.x=Math.PI/2;outerPath.scale.z=.08;
for(let i=0;i<6;i++){const a=i*Math.PI/3;const path=box(Math.cos(a)*21,-.38,Math.sin(a)*21,15,.07,1.7,mats.sand);path.rotation.y=-a;}
// Layered, low-poly island, beaches and winding paths.
cyl(0,-1.05,0,14.4,13.8,1.2,mats.earth,scene,64);cyl(0,-.4,0,14.8,14.4,.35,mats.sand,scene,64);cyl(0,-.18,0,13.4,13.7,.3,mats.grass,scene,64);
const path=mesh(new THREE.TorusGeometry(7.2,1.1,8,80),mats.sand,0,.015,0);path.rotation.x=Math.PI/2; path.scale.set(1,1,.12);
for(let i=0;i<30;i++){let a=i*2.4,r=12.8+Math.sin(i*8)*.6;let b=ball(Math.cos(a)*r,-.1,Math.sin(a)*r,.22,mats.cream);b.scale.y=.3}
// Lagoon on the right, with a cream shoreline.
const shore=cyl(7,.015,3,3.8,3.8,.07,mats.sand,scene,40);shore.scale.set(1,.9,.75);const pond=cyl(7,.06,3,3.3,3.3,.08,mats.water,scene,40);pond.scale.set(1,1,.72);
function animal(type,x,z,s=1,rot=0){const g=group(x,.1,z);g.rotation.y=rot;g.scale.setScalar(s);let body=mats.cream;
if(type==='giraffe'){body=mats.yellow;let b=ball(0,1.25,0,.8,body,g);b.scale.set(1.25,.8,.65);for(let xx of [-.65,.65])for(let zz of [-.35,.35])cyl(xx,.55,zz,.11,.12,1.1,body,g,8);cyl(.65,2.15,0,.18,.22,1.65,body,g,9);ball(.72,3.05,0,.37,body,g);cyl(.6,3.47,-.15,.05,.05,.27,mats.trunk,g);cyl(.8,3.47,.15,.05,.05,.27,mats.trunk,g);for(let i=0;i<7;i++){let spot=ball(-.6+(i%3)*.48,1.35+(i%2)*.3,.49,.12,mats.trunk,g);spot.scale.z=.25}ball(.9,3.1,.3,.045,mats.black,g)}
else if(type==='elephant'){body=mat('#98a9a0');let b=ball(0,1.05,0,1,body,g);b.scale.set(1.2,.85,.75);for(let xx of [-.7,.7])for(let zz of [-.45,.45])cyl(xx,.45,zz,.2,.23,.85,body,g);ball(.95,1.35,0,.62,body,g);let ear=ball(.75,1.35,.54,.45,body,g);ear.scale.set(.55,1,.3);const trunk=cyl(1.45,.9,0,.15,.12,.9,body,g);trunk.rotation.z=.3;ball(1.25,1.5,.48,.045,mats.black,g)}
else if(type==='flamingo'){body=mats.pink;cyl(0,.55,0,.035,.035,1,mats.trunk,g);let b=ball(0,1.15,0,.4,body,g);b.scale.set(1,.8,.65);const neck=cyl(.28,1.62,0,.08,.08,.8,body,g);neck.rotation.z=-.32;ball(.4,2,0,.19,body,g);const beak=mesh(new THREE.ConeGeometry(.09,.28,8),mats.black,.58,1.96,0,g);beak.rotation.z=-Math.PI/2}
else if(type==='panda'){let b=ball(0,.8,0,.75,mats.white,g);b.scale.set(1.1,.85,.7);for(let x of [-.55,.55])for(let z of [-.4,.4])ball(x,.3,z,.23,mats.black,g);ball(.72,1.25,0,.48,mats.white,g);for(let z of [-.3,.3]){ball(.73,1.64,z,.17,mats.black,g);let eye=ball(1.09,1.32,z,.15,mats.black,g);eye.scale.set(.3,1,1)}ball(1.17,1.18,0,.08,mats.black,g)}
else if(type==='penguin'){let b=ball(0,.7,0,.55,mats.black,g);b.scale.set(.75,1.35,.7);let belly=ball(.28,.68,0,.43,mats.white,g);belly.scale.set(.55,1.15,.8);ball(.05,1.4,0,.34,mats.black,g);let beak=mesh(new THREE.ConeGeometry(.12,.35,8),mats.orange,.38,1.4,0,g);beak.rotation.z=-Math.PI/2;for(let z of [-.3,.3]){let wing=ball(-.1,.8,z,.3,mats.black,g);wing.scale.set(.35,1.4,.35);ball(.1,.08,z,.15,mats.orange,g)}}
else if(type==='deer'){let b=ball(0,.9,0,.65,mats.orange,g);b.scale.set(1.3,.8,.6);for(let x of [-.5,.5])for(let z of [-.3,.3])cyl(x,.4,z,.07,.08,.8,mats.orange,g,8);ball(.8,1.35,0,.32,mats.orange,g);for(let z of [-.2,.2]){let horn=cyl(.8,1.8,z,.035,.035,.6,mats.trunk,g);horn.rotation.z=.25}ball(1.04,1.4,.2,.04,mats.black,g)}
else if(type==='tiger'){let b=ball(0,.9,0,.7,mats.orange,g);b.scale.set(1.3,.8,.65);for(let x of [-.55,.55])for(let z of [-.3,.3])cyl(x,.4,z,.1,.11,.8,mats.orange,g,8);ball(.85,1.2,0,.4,mats.orange,g);for(let x of [-.5,-.2,.1,.4]){let stripe=box(x,1,.43,.1,.7,.04,mats.black,g);stripe.rotation.z=.25}for(let z of [-.2,.2])ball(.85,1.5,z,.12,mats.black,g);ball(1.17,1.24,.22,.05,mats.black,g)}
else {body=type==='zebra' ?mats.white:type==='lion'?mats.orange:mats.cream;let b=ball(0,1,0,.7,body,g);b.scale.set(1.3,.8,.65);for(let xx of [-.57,.57])for(let zz of [-.32,.32])cyl(xx,.42,zz,.1,.12,.8,body,g,8);if(type==='lion')ball(.75,1.3,0,.57,mats.trunk,g);ball(.92,1.3,0,.38,body,g);ball(1.19,1.33,.25,.045,mats.black,g);for(let zz of [-.25,.25])ball(.95,1.62,zz,.13,body,g);if(type==='zebra')for(let xx of [-.5,-.18,.16,.48]){let stripe=box(xx,1.05,.43,.11,.8,.035,mats.black,g);stripe.rotation.z=.25} }
return g}
animal('giraffe',-7,-3,1.1,.5);animal('giraffe',-9,-5,.75,.3);animal('zebra',-5,-6,.85,-.5);animal('lion',-4,-9,.9,.4);animal('elephant',-8,5,1.1,-.4);animal('elephant',-10,7,.65,-.4);animal('flamingo',6,3,.8,.6);animal('flamingo',8,4,.75,-.3);animal('flamingo',7,1.8,.65,.2);
for(const [x,z,s,p] of [[-12,-2,1,1],[-11,-8,1.2,1],[-5,-11,.9,1],[0,-12,1,0],[4,-10,1.1,0],[11,-7,1,1],[12,-2,1,1],[11,7,1,1],[7,10,1,0],[2,12,1,0],[-4,11,1,0],[-12,3,1,0],[-11,10,.8,0],[-2,-3,.7,0]])tree(x,z,s,p);
// Outer habitats: individually modelled, distributed around the island.
const habitatColors={rain:mat('#5c9b65'),bamboo:mat('#a9c77a'),snow:mat('#e8f1df'),forest:mat('#779d71'),desert:mat('#d9bf81'),wetland:mat('#82bba0')};
function habitat(x,z,color){const patch=cyl(x,-.37,z,10,10,.12,color,scene,40);patch.scale.z=.8;return patch}
habitat(29,-17,habitatColors.rain);habitat(0,-32,habitatColors.bamboo);habitat(-29,-17,habitatColors.snow);habitat(-29,17,habitatColors.forest);habitat(0,32,habitatColors.desert);habitat(29,17,habitatColors.wetland);
// Rainforest canopy, high walk and tigers.
for(const [x,z] of [[22,-21],[25,-24],[31,-25],[35,-21],[37,-15],[32,-11],[24,-12]])tree(x,z,1.35,true);
box(29,3,-17,13,.24,1.4,mats.trunk);for(let x of [23,27,31,35]){cyl(x,1.5,-17,.13,.13,3,mats.trunk);box(x,3.55,-17.65,.1,1,.1,mats.trunk)}
animal('tiger',28,-19,1,.4);animal('tiger',32,-15,.7,-.3);
// Taiwan-inspired bamboo forest and pandas.
for(const [x,z] of [[-8,-36],[-6,-39],[-3,-40],[1,-40],[5,-39],[8,-35],[-8,-29],[7,-27]]){tree(x,z,.8);for(let j=0;j<3;j++){const stem=cyl(x+j*.35,1.3,z+.5,.07,.07,2.6,mats.dark,scene,6);}}
animal('panda',-2,-32,1.05,.4);animal('panda',3,-34,.75,-.4);
// Hokkaido snow forest and a blue underwater penguin viewing tunnel.
for(const [x,z] of [[-37,-20],[-36,-25],[-30,-25],[-24,-23],[-23,-12],[-34,-10]]){tree(x,z,1.1);let snow=ball(x,2.7,z,.7,mats.white);snow.scale.y=.25}
const ice=cyl(-29,-.22,-17,6,6,.12,mats.water,scene,32);ice.scale.z=.75;
// A transparent aquarium wall makes the arched viewing tunnel read below the waterline.
const aquariumMat=new THREE.MeshStandardMaterial({color:'#86d3d3',transparent:true,opacity:.22,roughness:.25,side:THREE.DoubleSide,depthWrite:false});
const aquarium=mesh(new THREE.CylinderGeometry(6,6,2.5,32,1,true),aquariumMat,-29,1.05,-17);aquarium.scale.z=.75;aquarium.castShadow=false;
const tunnel=mesh(new THREE.TorusGeometry(2.3,.14,8,24,Math.PI),mats.cream,-29,1,-17);tunnel.rotation.z=0;
for(let z of [-19,-17,-15]){let arch=mesh(new THREE.TorusGeometry(2.3,.13,8,24,Math.PI),mats.white,-29,.1,z);}
for(const [x,z] of [[-32,-19],[-30,-20],[-27,-19],[-25,-16],[-31,-14],[-28,-13]])animal('penguin',x,z,.8,.2);
// Temperate forest, deer and woodland paths.
for(const [x,z] of [[-37,13],[-36,20],[-33,24],[-28,25],[-22,21],[-23,13],[-30,10]])tree(x,z,1.15);
animal('deer',-31,17,1,.3);animal('deer',-27,19,.75,-.4);
// Golden open plains and extra savanna animals.
for(const [x,z] of [[-8,29],[-6,37],[3,39],[8,33]])tree(x,z,.9,true);
animal('giraffe',-3,31,1.1,.3);animal('zebra',3,34,.9,-.4);animal('lion',4,29,.9,.5);
// Wetland boardwalk, palms and flamingos.
let lake=cyl(29,-.23,17,7,7,.12,mats.water,scene,36);lake.scale.z=.7;
box(29,.02,17,13,.18,1.1,mats.trunk);for(let x of [23,26,29,32,35])cyl(x,-.12,17,.12,.12,.5,mats.trunk);
for(const [x,z] of [[22,13],[24,24],[32,24],[37,20],[37,13]])tree(x,z,1,true);
for(const [x,z] of [[27,14],[30,13],[32,19],[26,20]])animal('flamingo',x,z,.8,.2);
// Ferris wheel and candy-colored park at the back.
const wheel=group(5,0,-6);const red=mat('#d87956'), teal=mat('#518d7a');for(let z of [-.5,.5]){let leg=box(0,2.1,z,.23,4.4,.23,teal,wheel);leg.rotation.z=.25;let leg2=box(0,2.1,z,.23,4.4,.23,teal,wheel);leg2.rotation.z=-.25}let ring=mesh(new THREE.TorusGeometry(2.5,.12,8,40),mats.cream,0,4,0,wheel);const wheelGroup=new THREE.Group();wheelGroup.position.y=4;wheel.add(wheelGroup);wheelGroup.add(ring);ring.position.set(0,0,0);for(let i=0;i<8;i++){let a=i*Math.PI/4;let spoke=box(Math.sin(a)*1.2,Math.cos(a)*1.2,0,.08,2.4,.08,mats.cream,wheelGroup);spoke.rotation.z=-a;box(Math.sin(a)*2.5,Math.cos(a)*2.5,0,.65,.5,.65,i%2?red:mats.yellow,wheelGroup)}ball(0,0,0,.23,red,wheelGroup);
// Pavilion, benches, and little signposts.
const hut=group(2,0,4);box(0,1,0,2.2,2,1.7,mats.cream,hut);const roof=mesh(new THREE.ConeGeometry(1.9,1,4),red,0,2.5,0,hut);roof.rotation.y=Math.PI/4;box(0,.65,.87,.55,1.3,.05,teal,hut);
function person(name,x,z,color){const g=group(x,.05,z);cyl(0,.28,0,.16,.16,.55,mats.trunk,g);ball(0,.73,0,.34,mat(color),g);ball(0,1.25,0,.3,mat('#d9a57f'),g);let hair=ball(0,1.42,-.03,.3,mats.trunk,g);hair.scale.y=.5;for(let q of [-1,1]){let arm=cyl(q*.33,.77,0,.07,.07,.55,mat(color),g);arm.rotation.z=q*.5}const canvas=document.createElement('canvas');canvas.width=256;canvas.height=96;const c=canvas.getContext('2d');c.fillStyle='#fff9e9';c.beginPath();c.roundRect(5,5,246,76,28);c.fill();c.fillStyle='#345a47';c.font='bold 38px sans-serif';c.textAlign='center';c.fillText(name,128,56);let sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthTest:false}));sprite.position.set(0,2.05,0);sprite.scale.set(1.5,.56,1);g.add(sprite);return g}
person('Ivan',-2,4,'#d57851');person('Renee',-.8,4.5,'#e8b764');person('Mike',.2,5.7,'#629986');person('Nina',-1.1,6,'#d78c89');
const zones={savanna:{target:[-7,0,-5],pos:[-17,15,13]},lagoon:{target:[7,0,3],pos:[21,13,20]},grove:{target:[-8,0,5],pos:[-21,14,20]},park:{target:[5,1,-6],pos:[20,15,10]},rainforest:{target:[29,0,-17],pos:[43,15,-1]},pandas:{target:[0,0,-32],pos:[14,15,-16]},penguins:{target:[-29,0,-17],pos:[-15,15,-1]},forest:{target:[-29,0,17],pos:[-15,15,33]},plains:{target:[0,0,32],pos:[14,15,48]},wetlands:{target:[29,0,17],pos:[43,15,33]}};let transition=null;
function fly(target,pos){transition={start:performance.now(),fromTarget:controls.target.clone(),fromPos:camera.position.clone(),target:new THREE.Vector3(...target),pos:new THREE.Vector3(...pos)}}
document.querySelectorAll('[data-zone]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-zone]').forEach(x=>x.classList.remove('active'));b.classList.add('active');let z=zones[b.dataset.zone];fly(z.target,z.pos)}));document.querySelector('#reset').addEventListener('click',()=>{document.querySelectorAll('[data-zone]').forEach(x=>x.classList.remove('active'));fly([0,0,0],[88,105,112])});controls.addEventListener('start',()=>{transition=null});
const guide=document.querySelector('#guide');document.querySelector('#help').onclick=()=>guide.showModal();document.querySelector('.close').onclick=()=>guide.close();document.querySelector('.got-it').onclick=()=>guide.close();
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<600?55:38;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(host);resize();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;function animate(t){requestAnimationFrame(animate);if(transition){let p=Math.min(1,(t-transition.start)/(reduced?1:1100));let e=1-Math.pow(1-p,3);camera.position.lerpVectors(transition.fromPos,transition.pos,e);controls.target.lerpVectors(transition.fromTarget,transition.target,e);if(p===1)transition=null}if(!reduced)wheelGroup.rotation.z=t*.00012;controls.update();renderer.render(scene,camera)}requestAnimationFrame(animate);
