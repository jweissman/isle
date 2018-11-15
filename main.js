!function(e){function t(t){for(var i,r,l=t[0],a=t[1],c=t[2],d=0,p=[];d<l.length;d++)r=l[d],o[r]&&p.push(o[r][0]),o[r]=0;for(i in a)Object.prototype.hasOwnProperty.call(a,i)&&(e[i]=a[i]);for(u&&u(t);p.length;)p.shift()();return n.push.apply(n,c||[]),s()}function s(){for(var e,t=0;t<n.length;t++){for(var s=n[t],i=!0,l=1;l<s.length;l++){var a=s[l];0!==o[a]&&(i=!1)}i&&(n.splice(t--,1),e=r(r.s=s[0]))}return e}var i={},o={1:0},n=[];function r(t){if(i[t])return i[t].exports;var s=i[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=i,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:s})},r.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var l=window.webpackJsonp=window.webpackJsonp||[],a=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var u=a;n.push([17,0]),s()}([,function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0);t.clamp=((e,t)=>s=>{let i=Math.min(s,t);return Math.max(i,e)}),t.keyToDirection=(e=>{let t;return e!==i.Input.Keys.A&&e!==i.Input.Keys.Left||(t="left"),e!==i.Input.Keys.D&&e!==i.Input.Keys.Right||(t="right"),e!==i.Input.Keys.S&&e!==i.Input.Keys.Down||(t="down"),e!==i.Input.Keys.W&&e!==i.Input.Keys.Up||(t="up"),t}),t.oppositeWay=(e=>{let t;switch(e){case"left":t="right";break;case"right":t="left";break;case"up":t="down";break;case"down":t="up"}return t}),t.mode=(e=>{const t=new Map;let s,i=0;for(const o of e){let e=t.has(o)?t.get(o):0;++e>i&&(i=e,s=o),t.set(o,e)}return s}),t.addScalarToVec=((e,t,s)=>{switch(t){case"up":e.y-=s;break;case"down":e.y+=s;break;case"left":e.x-=s;break;case"right":e.x+=s}}),t.dirFromVec=(e=>{let{x:t,y:s}=e;return Math.abs(t)>Math.abs(s)?t>0?"right":"left":s>0?"down":"up"})},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),o=s(11),n=s(10),r=s(9),l=s(8),a=s(7);let c={Sword:new i.Texture(n),Spritemap:new i.Texture(r),BasicSprites:new i.Texture(l),Alex:new i.Texture(a),Map:new o.default("map/solidity.json")};t.Resources=c,c.Map.imagePathAccessor=((e,t)=>{let s=e.replace(/^(?:\.\.\/)+/,"");return console.log("LOAD IMG",{path:e,actualPath:s}),s})},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(14);t.Player=i.Player;const o=s(13);t.Enemy=o.Enemy;const n=s(12);t.Logo=n.Logo},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Isle=class{constructor(e,t=[]){this.name=e,this.items=t}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),o=s(4);t.World=class{constructor(e,t){this.mapResource=e,this.debugBoxes=t,this.island=new o.Isle("sorna"),this._processTiledMap()}entityAt(e,t){let s=this.tileMap.getCellByPoint(e,t);return s.sprites.length>1?s.__isle_item:null}_processTiledMap(){let e=this.mapResource,t={},s={},o={},n={};e.data.tilesets.forEach(e=>{e.terrains&&(e.terrains.forEach(e=>{e.properties&&(t[e.tile]=e.properties.reduce((e,t)=>{let{name:s,value:i}=t;return Object.assign(e,{[s]:i})},{}),t[e.tile].terrainName=e.name,console.log(`terrain ${e.name} (${e.tile}) has props: `,t[e.tile]))}),s=e.tiles.reduce((e,s)=>{let{terrain:i,id:o}=s,n={solid:i.every(e=>t[e]&&t[e].solid)};return Object.assign(e,{[o]:n})},{})),e.tiles&&e.tiles.some(e=>e.objectgroup)&&(o=e.tiles.reduce((e,t)=>{let{objectgroup:s,id:i}=t;return s&&s.objects&&s.objects.length?Object.assign(e,{[i]:s.objects[0]}):e},{}),n=e.tiles.reduce((e,t)=>{if(t.properties){let s=t.properties.reduce((e,t)=>{let{name:s,value:i}=t;return Object.assign(e,{[s]:i})},{});return Object.assign(e,{[t.id]:s})}return console.warn("no props for sprite with id",{curr:t}),e},{}),console.log({itemKindBySpriteId:n}))}),this.tileMap=e.getTileMap(),this.blockingActors=[],this.tileMap.data.forEach(e=>{if(e.sprites[0]){let t=s[e.sprites[0].spriteId];if((e=Object.assign(e,t)).sprites[1]){const t=e.sprites[1].spriteId,s=o[t];if(s){let o=new i.Actor(e.x,e.y,32,32);if(o.collisionType=i.CollisionType.Fixed,s.ellipse){let e=new i.Vector(s.x+s.width/2,s.y+s.height/2);o.body.useCircleCollision(s.height/2,e)}else if(s.polygon){let e=s.polygon.map(({x:e,y:t})=>new i.Vector(e+s.x,t+s.y));o.body.usePolygonCollision(e)}else console.warn("implement collider:",{collision:s});this.debugBoxes&&(o.draw=(e=>{o.collisionArea.debugDraw(e,i.Color.LightGray)})),this.blockingActors.push(o);const r=n[t];if(r){let t={kind:r,x:e.x,y:e.y};this.island.items.push(t),e.__isle_item=t}}}}})}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),o=s(2);t.Game=class extends i.Engine{constructor(e,t){super({width:e,height:t,displayMode:i.DisplayMode.FullScreen})}start(){let e=new i.Loader;for(let t in o.Resources)e.addResource(o.Resources[t]);return super.start(e)}}},function(e,t,s){e.exports=s.p+"d3bca9f7263fa39ee7b60b02cbbb2a0e.png"},function(e,t,s){e.exports=s.p+"6c58b202773ef36a8c3ffd4538381400.png"},function(e,t,s){e.exports=s.p+"b9b405c74e06d77b7a88f04d6d3ae5cd.png"},function(e,t,s){e.exports=s.p+"94754f62e0ae4d23d386e246f5e0cb6e.png"},,function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),o=s(1);t.Logo=class extends i.Label{constructor(e,t,s){super(s),this.strobeClamp=o.clamp(50,200),this.strobe=(()=>{this.intensity=this.intensity+Math.ceil(16*Math.random())-8,this.intensity=this.strobeClamp(this.intensity),this.opacity=this.intensity/255}),this.x=e,this.y=t,this.fontFamily="Arial",this.fontSize=256,this.color=new i.Color(255,255,255),this.intensity=150,this.strobe()}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0);t.Enemy=class extends i.Actor{constructor({initialVelocity:e}){super(),this.setWidth(15),this.setHeight(15),this.x=200,this.y=200,this.color=i.Color.Red,this.collisionType=i.CollisionType.Passive,this.vel.setTo(e[0],e[1])}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),o=s(1);t.Player=class extends i.Actor{constructor(e,t,s){super(),this.x=e,this.y=t,this.config=s,this.wireWorld=(e=>{this._world=e}),this.halt=(()=>{this.vel=new i.Vector(0,0)}),this.move=(e=>{this.facing=e;const t=16*this.speed;this.halt(),"left"===e&&(this.vel.x=-t),"right"===e&&(this.vel.x=t),"up"===e&&(this.vel.y=-t),"down"===e&&(this.vel.y=t)}),this.setWidth(20),this.setHeight(36),this.collisionArea.pos.y=12,this.color=new i.Color(255,255,255),this.collisionType=i.CollisionType.Active,this.speed=15,this.facing="down",this.interacting=!1}interact(){let e=this.interactionPos();console.log("attempting to interact at",{pos:e}),this.interacting=!0;let t=this._world.entityAt(e.x,e.y);if(t){let{name:e,description:s}=t.kind;return console.log("ENTITY IS",{name:e,description:s}),s}return"(..)"}interactionPos(){let e=this.getCenter().clone(),t="up"===this.facing?10:16;return e.y+=t,o.addScalarToVec(e,this.facing,18),e}draw(e,t){if(super.draw(e,t),this.config.debugBoundingBoxes&&this.collisionArea.debugDraw(e,i.Color.Chartreuse),this.interacting){let t=this.interactionPos();e.fillRect(t.x,t.y,4,4)}}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),o=s(3),n=e=>{let t=document.createElement("button");return t.textContent=e,t};t.MainMenu=class extends i.Scene{onInitialize(e){const t=new o.Logo(e.drawWidth/2,400,"Isle");this.add(t),e.addTimer(new i.Timer(t.strobe,20,!0));const s=new class extends i.UIActor{constructor(e,t,s,i,o=n){super(),this.hide=(()=>this.rootElement.style.display="none"),this.rootElement=document.createElement("div"),this.rootElement.style.position="absolute",document.body.appendChild(this.rootElement),this.buttonElement=o(e),this.rootElement.appendChild(this.buttonElement),this.buttonElement.addEventListener("click",i)}draw(e){let t=this._engine.canvasHeight/window.devicePixelRatio,s=this._engine.canvasWidth/window.devicePixelRatio,i=e.canvas.offsetLeft,o=e.canvas.offsetTop,n=this.buttonElement.clientWidth,r=this.buttonElement.clientHeight;this.rootElement.style.left=`${i+s/2-n/2}px`,this.rootElement.style.top=`${o+t/2-r/2+100}px`}}("start game",e.drawWidth/2,400,()=>{s.hide(),e.goToScene("wander")});this.add(s)}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0);t.LevelOne=class extends i.Scene{onInitialize(e){}onActivate(){}onDeactivate(){}update(e,t){super.update(e,t)}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),o=s(16),n=s(15),r=s(3),l=s(2),a=s(6),c=s(1),u=s(5),d={debugCells:!1,debugBoundingBoxes:!1,zoom:2,playerStart:{x:30,y:30}};i.Physics.collisionPasses=8;const p=new a.Game(800,600),h=new n.MainMenu;p.add("main-menu",h);const y=new o.LevelOne,f=(new i.SpriteSheet(l.Resources.Spritemap,8,8,32,32),new i.SpriteSheet(l.Resources.BasicSprites,8,8,32,32).getSprite(4),l.Resources.Alex.asSprite()),g=d.playerStart.x,b=d.playerStart.y,m=new r.Player(32*g,32*b,d);m.addDrawing(f);const w=new i.Label("(welcome to isle)",500,500,"Arial"),x=new i.Label("(welcome to isle)",500,500,"Arial");y.add(w),y.add(x),p.input.keyboard.on("press",e=>{let{key:t}=e;if(t==i.Input.Keys.E){console.log("INTERACT?!");let e=m.interact();e&&(w.x=y.camera.x,w.y=y.camera.y,w.text=e,w.color=i.Color.White,w.fontSize=48)}else{let e=c.keyToDirection(t);e&&m.move(e)}}),p.input.keyboard.on("hold",e=>{let{key:t}=e,s=c.keyToDirection(t);s&&m.move(s)}),p.input.keyboard.on("release",e=>{let{key:t}=e;c.keyToDirection(t)&&(m.halt(),m.interacting=!1)}),y.add(m),y.camera.strategy.lockToActor(m),y.camera.zoom(d.zoom),p.add("wander",y),p.start().then(()=>{p.goToScene("wander");let e=new u.World(l.Resources.Map,d.debugBoundingBoxes),t=e.tileMap;if(y.addTileMap(t),m.wireWorld(e),e.blockingActors.forEach(e=>y.add(e)),d.debugCells){let e=null;p.input.pointers.primary.on("move",s=>{let{pos:i}=s,o=t.getCellByPoint(i.x,i.y);o&&e!=o&&(console.debug("CELL",{pos:i,spriteId:o.sprites[0].spriteId},o),e=o)})}})}]);
//# sourceMappingURL=main.js.map