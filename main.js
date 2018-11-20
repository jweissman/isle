!function(e){function t(t){for(var s,n,a=t[0],c=t[1],l=t[2],p=0,d=[];p<a.length;p++)n=a[p],r[n]&&d.push(r[n][0]),r[n]=0;for(s in c)Object.prototype.hasOwnProperty.call(c,s)&&(e[s]=c[s]);for(h&&h(t);d.length;)d.shift()();return o.push.apply(o,l||[]),i()}function i(){for(var e,t=0;t<o.length;t++){for(var i=o[t],s=!0,a=1;a<i.length;a++){var c=i[a];0!==r[c]&&(s=!1)}s&&(o.splice(t--,1),e=n(n.s=i[0]))}return e}var s={},r={1:0},o=[];function n(t){if(s[t])return s[t].exports;var i=s[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=s,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="";var a=window.webpackJsonp=window.webpackJsonp||[],c=a.push.bind(a);a.push=t,a=a.slice();for(var l=0;l<a.length;l++)t(a[l]);var h=c;o.push([23,0]),i()}([,function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0);t.coinflip=(()=>Math.random()>.5),t.clamp=((e,t)=>i=>{let s=Math.min(i,t);return Math.max(s,e)}),t.keyToDirection=(e=>{let t;return e!==s.Input.Keys.A&&e!==s.Input.Keys.Left||(t="left"),e!==s.Input.Keys.D&&e!==s.Input.Keys.Right||(t="right"),e!==s.Input.Keys.S&&e!==s.Input.Keys.Down||(t="down"),e!==s.Input.Keys.W&&e!==s.Input.Keys.Up||(t="up"),t}),t.oppositeWay=(e=>{let t;switch(e){case"left":t="right";break;case"right":t="left";break;case"up":t="down";break;case"down":t="up"}return t}),t.mode=(e=>{const t=new Map;let i,s=0;for(const r of e){let e=t.has(r)?t.get(r):0;++e>s&&(s=e,i=r),t.set(r,e)}return i}),t.addScalarToVec=((e,t,i)=>{switch(t){case"up":e.y-=i;break;case"down":e.y+=i;break;case"left":e.x-=i;break;case"right":e.x+=i}}),t.dirFromVec=(e=>{let{x:t,y:i}=e;return Math.abs(t)>Math.abs(i)?t>0?"right":"left":i>0?"down":"up"})},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(21),o=i(20),n=i(19),a=i(18),c=i(17),l=i(16),h=i(15),p=i(14),d=i(13),u=i(12);let y={Alex:new s.Texture(a),Miranda:new s.Texture(c),Spritemap:new s.Texture(o),BasicSprites:new s.Texture(n),Map:new r.default("map/solidity.json"),GreatPalm:new s.Texture(l),Palm:new s.Texture(h),Campfire:new s.Texture(p),FineMist:new s.Sound(d),Science:new s.Sound(u)};t.Resources=y,y.Map.imagePathAccessor=((e,t)=>{let i=e.replace(/^(?:\.\.\/)+/,"");return console.log("LOAD IMG",{path:e,actualPath:i}),i})},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(10),o=i(9),n=i(2),a=i(8);!function(e){e.Wood="wood",e.Stone="stone"}(t.Material||(t.Material={})),t.World=class{constructor(e,t,i){this.scene=e,this.hud=t,this.config=i,this.island=new r.Isle("sorna"),this.itemKinds={},this.playerCharacterMeta={Alex:{sprites:new s.SpriteSheet(n.Resources.Alex,4,1,32,64),primary:!1},Miranda:{sprites:new s.SpriteSheet(n.Resources.Miranda,4,1,32,64),primary:!0}},this.debugBoxes=i.debugBoundingBoxes,this.stocks={wood:0,stone:0}}equip(e){this._primaryCharacter.equipped=e}collect(e,t,i=1){console.log("WOULD COLLECT ITEM",{it:e,material:t,count:i}),this.destroy(e),this.stocks[t]+=i,this.hud.updateInventory(this.stocks),console.log("AFTER COLLECT ITEM",{it:e,material:t,count:i,stocks:this.stocks})}interact(e,t){if(e instanceof r.Item){let{name:t,description:i}=e.kind;return e.activate()||i}if(e instanceof a.Player){let i=this._primaryCharacter,s=`nice to see you again, ${i.name}`;return t.__isle_pc=i,i.x=t.x,i.y=t.y-16,i.move("down"),i.halt(),this.makePrimaryCharacter(e),s}}entityAt(e,t){let i=this.tileMap.getCellByPoint(e,t);if(i){if(i.__isle_item)return{entity:i.__isle_item,cell:i};if(i.__isle_pc)return{entity:i.__isle_pc,cell:i}}return null}destroy(e){console.log("DESTROY",{it:e});let{kind:t,cell:i}=e,{size:s}=t;for(const e of Array(s).keys())for(const t of Array(s).keys())this.tileMap.getCellByIndex(i.index+e+t*this.tileMap.cols).__isle_item=null;return e.actor.kill(),!0}spawn(e,t){let{size:i}=e;i=i||1;let s=t.x+16*i,n=t.y+16*i,a=new o.Thing(s,n,i,i,this.debugBoxes);e.drawing&&a.addDrawing(e.drawing),a.constructCollisionArea(e.collision);let c=r.buildItem(e,a,t,this);this.island.items.push(c);for(const e of Array(i).keys())for(const s of Array(i).keys())this.tileMap.getCellByIndex(t.index+e+s*this.tileMap.cols).__isle_item=c;return this.scene.add(a),a.setZIndex(a.computeZ()),a}createPlayableCharacter(e,t){let i=this.playerCharacterMeta[e];if(i){let{x:s,y:r}=t;console.log("CREATE PC",{pcMeta:i});const o=new a.Player(e,s,r,this.config,i.sprites);o.wireWorld(this),this.scene.add(o),t.__isle_pc=o,i.primary?this.makePrimaryCharacter(o):console.log("PC is not primary",{pcMeta:i})}}makePrimaryCharacter(e){console.log("CREATE PRIMARY PC!!!",{pc:e}),this._primaryCharacter=e,e.move("down"),e.halt(),this.scene.camera.strategy.lockToActor(e),this.scene.camera.zoom(this.config.zoom)}primaryCharacter(){return this._primaryCharacter}processTiledMap(e){let t=e,i={},s={},r={},o={},n={};t.data.tilesets.forEach(e=>{e.terrains&&(e.terrains.forEach(e=>{e.properties&&(i[e.tile]=e.properties.reduce((e,t)=>{let{name:i,value:s}=t;return Object.assign(e,{[i]:s})},{}),i[e.tile].terrainName=e.name,console.log(`terrain ${e.name} (${e.tile}) has props: `,i[e.tile]))}),s=e.tiles.reduce((e,t)=>{let{terrain:s,id:r}=t,o={solid:s.every(e=>i[e]&&i[e].solid)};return Object.assign(e,{[r]:o})},{})),e.tiles&&e.tiles.some(e=>e.objectgroup)&&(r=e.tiles.reduce((e,t)=>{let{objectgroup:i,id:s}=t;return i&&i.objects&&i.objects.length?Object.assign(e,{[s]:i.objects[0]}):e},{}),console.log({spriteCollisionById:r}),console.log({ts:e}),n=e.tiles.reduce((e,t)=>{if(t.properties&&!t.properties.some(e=>"character"===e.name)){let i=t.properties.reduce((e,t)=>{let{name:i,value:s}=t;return Object.assign(e,{[i]:s})},{});return Object.assign(e,{[t.id]:i})}return console.warn("no props for sprite with id (or maybe char?)",{curr:t}),e},{})),e.tiles&&e.tiles.some(e=>e.properties&&e.properties.some(e=>"character"===e.name))?(o=e.tiles.reduce((e,t)=>{if(t.properties&&t.properties.some(e=>"character"===e.name)){let i=t.properties.find(e=>"character"===e.name).value;return Object.assign(e,{[t.id]:i})}return e},{}),console.log({characterById:o})):console.warn("no chars in tileset",{tiles:e.tiles})}),this.tileMap=t.getTileMap(),this.tileMap.data.forEach((e,t)=>{if(e.sprites[0]){let i=s[e.sprites[0].spriteId];if((e=Object.assign(e,i)).sprites[1]){let{spriteSheetKey:i,spriteId:s}=e.sprites[1];e.removeSprite(e.sprites[1]);const a=n[s];if(!a){const t=o[s];return void(t?(console.log("WOULD CREATE PLAYABLE CHARACTER",{characterName:t,cell:e}),this.createPlayableCharacter(t,e)):console.warn("CELL has sprite with no kind or character",{cell:e,itemKindBySpriteId:n,characterById:o}))}this.itemKinds[a.name]=a;const c=r[s];let l=this.tileMap._spriteSheets[i],h=a.size||1;if(h>1)for(const e of Array(h).keys())for(const i of Array(h).keys()){let s=e,r=i,o=this.tileMap.getCellByIndex(t+s+r*this.tileMap.cols);o.sprites[1]&&o.removeSprite(o.sprites[1])}a.collision=c;let p=l.getSprite(s);a.drawing=p,this.spawn(a,e)}}})}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(2),o=new s.SpriteSheet(r.Resources.BasicSprites,8,8,32,32),n=r.Resources.GreatPalm.asSprite(),a=r.Resources.Palm.asSprite(),c=r.Resources.Campfire.asSprite();t.BasicSpriteMap={chestClosed:o.getSprite(2),chestOpen:o.getSprite(3),greatPalm:n,palm:a,campfire:c,wood:o.getSprite(9),stone:o.getSprite(15)}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(3),o=i(4),n={[r.Material.Wood]:o.BasicSpriteMap.wood,[r.Material.Stone]:o.BasicSpriteMap.stone};t.Hud=class extends s.UIActor{constructor(e){super(0,0,e.canvasWidth,e.canvasHeight),this.initialize(e)}initialize(e){this.output=new s.Label("(press E to interact)",e.canvasWidth/2,e.canvasHeight-40,"Arial"),this.output.color=s.Color.White,this.output.fontSize=48,this.output.setWidth(e.canvasWidth),this.output.textAlign=s.TextAlign.Center;const t=new s.Label("I S L E",10,50,"Arial");t.color=s.Color.Azure,t.fontSize=24,this.inventory=new s.UIActor(e.canvasWidth-300,50,300,500),this.add(this.output),this.add(t),this.add(this.inventory),this.updateInventory({[r.Material.Wood]:0,[r.Material.Stone]:0})}updateInventory(e){let t=Object.keys(e).map((t,i)=>new class extends s.UIActor{constructor(e,t,i){super(0,30*i,200,20),this.material=e,this.count=t,this.yOff=i,this.label=new s.Label(`${e} x ${t}`,this.x,this.y,"Arial"),this.label.fontSize=12,this.label.color=s.Color.White,this.add(this.label)}draw(e,t){super.draw(e,t);let i=n[this.material].clone();i.scale=new s.Vector(.5,.5),i.draw(e,this.x,this.y)}}(t,e[t],i));t.forEach(e=>this.inventory.add(e)),console.log("update inventory",{stocks:e,stockLines:t}),this.inventory.children.forEach(e=>this.inventory.remove(e)),t.forEach(e=>this.inventory.add(e))}describe(e){this.output.text=e,this.output.opacity=1,this.output.actions.clearActions(),this.output.actions.fade(0,2e3)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(1);t.Logo=class extends s.Label{constructor(e,t,i){super(i),this.strobeClamp=r.clamp(50,200),this.strobe=(()=>{this.intensity=this.intensity+Math.ceil(16*Math.random())-8,this.intensity=this.strobeClamp(this.intensity),this.opacity=this.intensity/255}),this.x=e,this.y=t,this.fontFamily="Arial",this.fontSize=256,this.color=new s.Color(255,255,255),this.intensity=150,this.strobe()}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(1);t.Player=class extends s.Actor{constructor(e,t,i,r,o){super(t,i,32,64),this.name=e,this.x=t,this.y=i,this.config=r,this.spriteSheet=o,this.wireWorld=(e=>{this._world=e}),this.computeZ=(()=>this.y+24),this.halt=(()=>{this.vel=new s.Vector(0,0)}),this.move=(e=>{this.facing=e;const t=32*this.speed;this.halt(),"left"===e&&(this.vel.x=-t),"right"===e&&(this.vel.x=t),"up"===e&&(this.vel.y=-t),"down"===e&&(this.vel.y=t)}),this.collisionArea.body.useCircleCollision(6,new s.Vector(0,22)),this.color=new s.Color(255,255,255),this.collisionType=s.CollisionType.Active,this.speed=r.playerSpeed,this.interacting=!1,this.sprites={down:o.getSprite(0),up:o.getSprite(1),right:o.getSprite(2),left:o.getSprite(3)},this.move("down"),this.halt()}interact(){let e=this.interactionPos();this.interacting=!0;let t=this._world.entityAt(e.x,e.y)||this._world.entityAt(e.x,e.y+10)||this._world.entityAt(e.x,e.y-10)||this._world.entityAt(e.x-10,e.y)||this._world.entityAt(e.x+10,e.y);if(t){let{entity:e,cell:i}=t;return this._world.interact(e,i)}}interactionPos(){let e=this.getCenter().clone(),t=20;return"up"===this.facing&&(t-=2),"down"===this.facing&&(t-=4),e.y+=t,e.x-=2,r.addScalarToVec(e,this.facing,24),e}draw(e,t){if(super.draw(e,t),this.equipped){let t=this.equipped.kind.drawing.clone();t.scale=new s.Vector(.5,.5),t.draw(e,this.pos.x,this.pos.y)}if(this.config.debugBoundingBoxes){if(this.collisionArea.debugDraw(e,s.Color.Chartreuse),this.interacting){let t=this.interactionPos();e.fillRect(t.x,t.y-10,4,4),e.fillRect(t.x,t.y,4,4),e.fillRect(t.x,t.y+10,4,4),e.fillRect(t.x-10,t.y,4,4),e.fillRect(t.x+10,t.y,4,4)}e.fillRect(this.x,this.computeZ(),3,3)}}update(e,t){this.currentDrawing=this.sprites[this.facing],super.update(e,t),this.setZIndex(this.computeZ())}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(7);t.Player=s.Player;const r=i(6);t.Logo=r.Logo},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0);t.Thing=class extends s.Actor{constructor(e,t,i=0,r=1,o){super(e,t,32*r,32*r,s.Color.Chartreuse),this.x=e,this.y=t,this.zOff=i,this.size=r,this.debugBoxes=o,this.computeZ=(()=>this.y+4+16*(this.size-1))}draw(e,t){super.draw(e,t),this.debugBoxes&&(this.collisionArea.debugDraw(e,s.Color.LightGray),e.fillRect(this.x,this.computeZ(),5,5))}constructCollisionArea(e){if(e)if(this.collisionType=s.CollisionType.Fixed,e.ellipse){let t=new s.Vector(e.x+e.width/2-16,e.y+e.height/2-16);this.body.useCircleCollision(e.height/2,t)}else if(e.polygon){let t=e.polygon.map(({x:t,y:i})=>new s.Vector(t+e.x,i+e.y));this.body.usePolygonCollision(t)}else console.warn("implement collider:",{collision:e});else this.size>1?(this.collisionType=s.CollisionType.Fixed,this.body.useBoxCollision(new s.Vector(0,16*this.size-14)),this.setHeight(26*this.size/4),this.setWidth(24*this.size)):this.collisionType=s.CollisionType.PreventCollision}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(3),r=i(1),o=i(4);class n{constructor(e,t,i,s){this.kind=e,this.actor=t,this.cell=i,this.world=s,this.initialize()}initialize(){}activate(){return console.warn("item is non-interactive",{kind:this.kind}),null}}t.Item=n;const a={Chest:class extends n{constructor(){super(...arguments),this.state={open:!1}}initialize(){this.actor.addDrawing("closed",o.BasicSpriteMap.chestClosed),this.actor.addDrawing("open",o.BasicSpriteMap.chestOpen)}activate(){return console.log("Chest activated!"),this.state.open?(this.actor.setDrawing("closed"),this.state={open:!1},"closed"):(this.actor.setDrawing("open"),this.state={open:!0},"opened")}},Palm:class extends n{initialize(){this.actor.addDrawing("palm",o.BasicSpriteMap.palm),this.actor.setDrawing("palm")}},GreatPalm:class extends n{constructor(){super(...arguments),this.state={hp:100}}initialize(){this.actor.addDrawing("palm",o.BasicSpriteMap.greatPalm),this.actor.setDrawing("palm")}activate(){if(this.state.hp>0){const e=`once a seed (${this.state.hp}%)`;let t=this.world._primaryCharacter.equipped?30:3;return this.state.hp-=t,e}{let e=[-2,-1,0,1,2].map(e=>this.world.tileMap.getCellByIndex(this.cell.index+this.kind.size/2+e+(this.kind.size-1)*this.world.tileMap.cols));return this.world.destroy(this),e.forEach(e=>{let t=r.coinflip()?"WoodLogStack":"WoodLog";this.world.spawn(this.world.itemKinds[t],e)}),"timber"}}},BigCampfire:class extends n{initialize(){this.actor.addDrawing("fire",o.BasicSpriteMap.campfire),this.actor.setDrawing("fire")}},WoodLog:class extends n{activate(){return this.world.collect(this,s.Material.Wood),this.kind.description}},WoodLogStack:class extends n{activate(){return this.world.collect(this,s.Material.Wood,3),this.kind.description}},Handaxe:class extends n{activate(){return this.world.equip(this),this.world.destroy(this),"chop chop"}}};t.buildItem=((e,t,i,s)=>a[e.name]?new a[e.name](e,t,i,s):new n(e,t,i,s)),t.Isle=class{constructor(e,t=[]){this.name=e,this.items=t}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(2);t.Game=class extends s.Engine{constructor(e,t,i){super({width:e,height:t,displayMode:s.DisplayMode.FullScreen}),this.setup()}start(){let e=new s.Loader;for(let t in r.Resources)e.addResource(r.Resources[t]);return super.start(e).then(this.kick)}setup(){}kick(){}}},function(e,t,i){e.exports=i.p+"1452350757e2b9db94866b0f3a01e215.mp3"},function(e,t,i){e.exports=i.p+"fac8210e66067d101e48370329fc4c5a.mp3"},function(e,t,i){e.exports=i.p+"8e8aa6414e948820c3ad76cc2be5950e.png"},function(e,t,i){e.exports=i.p+"db6f4f593c47b1aa561da3453157f4bb.png"},function(e,t,i){e.exports=i.p+"e12b440e05a78caaa8a410ac5a9ae975.png"},function(e,t,i){e.exports=i.p+"9cc1647a9ee8e4b02e846cff8fa0e3db.png"},function(e,t,i){e.exports=i.p+"46e1c84312a40f66fc1fb74c55561536.png"},function(e,t,i){e.exports=i.p+"53a219e01679b3babc8afba20c0f0839.png"},function(e,t,i){e.exports=i.p+"b9b405c74e06d77b7a88f04d6d3ae5cd.png"},,function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0);t.LevelOne=class extends s.Scene{onInitialize(e){}onActivate(){}onDeactivate(){}update(e,t){super.update(e,t)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(22),o=i(2),n=i(11),a=i(1),c=i(3),l=i(5),h={debugCells:!1,debugBoundingBoxes:!1,zoom:2,playerSpeed:7,bgMusic:!0},p=new n.Game(800,600,h),d=new r.LevelOne,u=new l.Hud(p);d.add(u);const y=new c.World(d,u,h);p.input.keyboard.on("press",e=>{if(p.currentScene===d){let t=y.primaryCharacter(),{key:i}=e;if(i==s.Input.Keys.E){let e=t.interact();e&&u.describe(e)}else{let e=a.keyToDirection(i);e&&t.move(e)}}}),p.input.keyboard.on("hold",e=>{let{key:t}=e,i=a.keyToDirection(t);i&&y.primaryCharacter().move(i)}),p.input.keyboard.on("release",e=>{let{key:t}=e;if(a.keyToDirection(t)){let e=y.primaryCharacter();e.halt(),e.interacting=!1}}),p.add("wander",d),p.start().then(()=>{y.processTiledMap(o.Resources.Map);let e=y.tileMap;if(d.addTileMap(e),p.goToScene("wander"),h.bgMusic){let e=o.Resources.FineMist;setTimeout(()=>{console.log("about to play music",{theme:e,isLoaded:e.isLoaded()}),e.play(.2)},3e3)}})}]);
//# sourceMappingURL=main.js.map