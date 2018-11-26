!function(e){function t(t){for(var s,a,o=t[0],l=t[1],c=t[2],p=0,u=[];p<o.length;p++)a=o[p],r[a]&&u.push(r[a][0]),r[a]=0;for(s in l)Object.prototype.hasOwnProperty.call(l,s)&&(e[s]=l[s]);for(h&&h(t);u.length;)u.shift()();return n.push.apply(n,c||[]),i()}function i(){for(var e,t=0;t<n.length;t++){for(var i=n[t],s=!0,o=1;o<i.length;o++){var l=i[o];0!==r[l]&&(s=!1)}s&&(n.splice(t--,1),e=a(a.s=i[0]))}return e}var s={},r={1:0},n=[];function a(t){if(s[t])return s[t].exports;var i=s[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=s,a.d=function(e,t,i){a.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},a.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var o=window.webpackJsonp=window.webpackJsonp||[],l=o.push.bind(o);o.push=t,o=o.slice();for(var c=0;c<o.length;c++)t(o[c]);var h=l;n.push([26,0]),i()}([,function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0);t.coinflip=(()=>Math.random()>.5),t.clamp=((e,t)=>i=>{let s=Math.min(i,t);return Math.max(s,e)}),t.keyToDirection=(e=>{let t;return e!==s.Input.Keys.A&&e!==s.Input.Keys.Left||(t="left"),e!==s.Input.Keys.D&&e!==s.Input.Keys.Right||(t="right"),e!==s.Input.Keys.S&&e!==s.Input.Keys.Down||(t="down"),e!==s.Input.Keys.W&&e!==s.Input.Keys.Up||(t="up"),t}),t.oppositeWay=(e=>{let t;switch(e){case"left":t="right";break;case"right":t="left";break;case"up":t="down";break;case"down":t="up"}return t}),t.mode=(e=>{const t=new Map;let i,s=0;for(const r of e){let e=t.has(r)?t.get(r):0;++e>s&&(s=e,i=r),t.set(r,e)}return i}),t.addScalarToVec=((e,t,i)=>{switch(t){case"up":e.y-=i;break;case"down":e.y+=i;break;case"left":e.x-=i;break;case"right":e.x+=i}}),t.dirFromVec=(e=>{let{x:t,y:i}=e;return Math.abs(t)>Math.abs(i)?t>0?"right":"left":i>0?"down":"up"}),t.angleFromDir=(e=>{switch(e){case"up":return 90;case"down":return 270;case"left":return 180;case"right":return 0}})},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(24),n=i(23),a=i(22),o=i(21),l=i(20),c=i(19),h=i(18),p=i(17),u=i(16),d=i(15),f=i(14),g=i(13),y=i(12);let m={Brand:new s.Texture(a),Alphabet:new s.Texture(n),Alex:new s.Texture(c),AlexPortrait:new s.Texture(h),Miranda:new s.Texture(p),MirandaPortrait:new s.Texture(u),Spritemap:new s.Texture(o),BasicSprites:new s.Texture(l),Map:new r.default("map/solidity.json"),GreatPalm:new s.Texture(d),Palm:new s.Texture(f),Campfire:new s.Texture(g),FineMist:new s.Sound(y)};t.Resources=m,m.Map.imagePathAccessor=((e,t)=>e.replace(/^(?:\.\.\/)+/,""))},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(10),n=i(9),a=i(2),o=i(8);!function(e){e.Wood="wood",e.Stone="stone"}(t.Material||(t.Material={})),t.World=class{constructor(e,t,i,n){this.scene=e,this.hud=t,this.config=i,this.engine=n,this.island=new r.Isle("sorna"),this.itemKinds={},this.playerCharacterMeta={Alex:{sprites:new s.SpriteSheet(a.Resources.Alex,4,7,32,64),portrait:a.Resources.AlexPortrait.asSprite(),primary:!0},Miranda:{sprites:new s.SpriteSheet(a.Resources.Miranda,4,7,32,64),portrait:a.Resources.MirandaPortrait.asSprite(),primary:!1}},this.debugBoxes=i.debugBoundingBoxes,this.stocks={wood:0,stone:0}}enterCraftMode(e,t,i){this.crafting=!0,this.craftingItem=e,this.craftingAt={x:t,y:i}}equip(e){this._primaryCharacter.equipped&&this.spawn(this._primaryCharacter.equipped.kind,this.playerCell()),this._primaryCharacter.equip(e),this.hud.equip(e)}collect(e,t,i=1){console.log("WOULD COLLECT ITEM",{it:e,material:t,count:i}),this.destroy(e),this.stocks[t]+=i,this.hud.updateInventory(this.stocks),console.log("AFTER COLLECT ITEM",{it:e,material:t,count:i,stocks:this.stocks})}debit(e,t=1){this.stocks[e]-=t,this.hud.updateInventory(this.stocks)}interact(e,t){if(e instanceof r.Item){let{name:t,description:i}=e.kind;return e.activate()||i}if(e instanceof o.Player){let i=this._primaryCharacter,s=`nice to see you again, ${i.name}`;return t.__isle_pc=i,i.x=t.x,i.y=t.y,i.move("down"),i.halt(),this.makePrimaryCharacter(e),s}}useItem(e,t,i){if(e instanceof r.Item){let t=e.activate(i)||`use ${i.kind.name} on ${e.kind.name} `;return this.hud.describe(t),t}}entityAt(e,t){let i=this.tileMap.getCellByPoint(e,t);if(i){if(i.__isle_item)return{entity:i.__isle_item,cell:i};if(i.__isle_pc)return{entity:i.__isle_pc,cell:i}}return null}entityNear(e,t){return this.entityAt(e,t)||this.entityAt(e,t+10)||this.entityAt(e,t-10)||this.entityAt(e-10,t)||this.entityAt(e+10,t)}destroy(e){console.log("DESTROY",{it:e});let{kind:t,cell:i}=e,{size:s}=t;for(const e of Array(s).keys())for(const t of Array(s).keys())this.tileMap.getCellByIndex(i.index+e+t*this.tileMap.cols).__isle_item=null;return e.actor.kill(),!0}spawn(e,t){let{size:i}=e;i=i||1;let s=t.x+16*i,a=t.y+16*i,o=new n.Thing(s,a,i,i,this.debugBoxes);e.drawing&&o.addDrawing(e.drawing),o.constructCollisionArea(e.collision);let l=r.buildItem(e,o,t,this);this.island.items.push(l);for(const e of Array(i).keys())for(const s of Array(i).keys())this.tileMap.getCellByIndex(t.index+e+s*this.tileMap.cols).__isle_item=l;return this.scene.add(o),o.setZIndex(o.computeZ()),o}createPlayableCharacter(e,t){let i=this.playerCharacterMeta[e];if(i){let{x:s,y:r}=t;console.log("CREATE PC",{pcMeta:i});const n=new o.Player(e,s,r,this.config,i.sprites,i.portrait,this.engine);n.wireWorld(this),this.scene.add(n),i.primary?this.makePrimaryCharacter(n):(console.log("PC is not primary",{pcMeta:i}),t.__isle_pc=n)}}makePrimaryCharacter(e){console.log("CREATE PRIMARY PC!!!",{pc:e}),this._primaryCharacter=e,e.move("down"),e.halt(),this.scene.camera.strategy.lockToActor(e),this.scene.camera.zoom(this.config.zoom),this.hud.playing(e)}primaryCharacter(){return this._primaryCharacter}playerCell(){return this.tileMap.getCellByPoint(this._primaryCharacter.x,this._primaryCharacter.y)}processTiledMap(e){let t=e,i={},s={},r={},n={},a={};t.data.tilesets.forEach(e=>{e.terrains&&(e.terrains.forEach(e=>{e.properties&&(i[e.tile]=e.properties.reduce((e,t)=>{let{name:i,value:s}=t;return Object.assign(e,{[i]:s})},{}),i[e.tile].terrainName=e.name,console.log(`terrain ${e.name} (${e.tile}) has props: `,i[e.tile]))}),s=e.tiles.reduce((e,t)=>{let{terrain:s,id:r}=t,n={solid:s.every(e=>i[e]&&i[e].solid)};return Object.assign(e,{[r]:n})},{})),e.tiles&&e.tiles.some(e=>e.objectgroup)&&(r=e.tiles.reduce((e,t)=>{let{objectgroup:i,id:s}=t;return i&&i.objects&&i.objects.length?Object.assign(e,{[s]:i.objects[0]}):e},{}),console.log({spriteCollisionById:r}),console.log({ts:e}),a=e.tiles.reduce((e,t)=>{if(t.properties&&!t.properties.some(e=>"character"===e.name)){let i=t.properties.reduce((e,t)=>{let{name:i,value:s}=t;return Object.assign(e,{[i]:s})},{});return Object.assign(e,{[t.id]:i})}return console.warn("no props for sprite with id (or maybe char?)",{curr:t}),e},{})),e.tiles&&e.tiles.some(e=>e.properties&&e.properties.some(e=>"character"===e.name))?(n=e.tiles.reduce((e,t)=>{if(t.properties&&t.properties.some(e=>"character"===e.name)){let i=t.properties.find(e=>"character"===e.name).value;return Object.assign(e,{[t.id]:i})}return e},{}),console.log({characterById:n})):console.warn("no chars in tileset",{tiles:e.tiles})}),this.tileMap=t.getTileMap(),this.tileMap.data.forEach((e,t)=>{if(e.sprites[0]){let i=s[e.sprites[0].spriteId];if((e=Object.assign(e,i)).sprites[1]){let{spriteSheetKey:i,spriteId:s}=e.sprites[1];e.removeSprite(e.sprites[1]);const o=a[s];if(!o){const t=n[s];return void(t?(console.log("WOULD CREATE PLAYABLE CHARACTER",{characterName:t,cell:e}),this.createPlayableCharacter(t,e)):console.warn("CELL has sprite with no kind or character",{cell:e,itemKindBySpriteId:a,characterById:n}))}this.itemKinds[o.name]=o;const l=r[s];let c=this.tileMap._spriteSheets[i],h=o.size||1;if(h>1)for(const e of Array(h).keys())for(const i of Array(h).keys()){let s=e,r=i,n=this.tileMap.getCellByIndex(t+s+r*this.tileMap.cols);n.sprites[1]&&n.removeSprite(n.sprites[1])}o.collision=l;let p=c.getSprite(s);o.drawing=p,this.spawn(o,e)}}})}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(2),n=new s.SpriteSheet(r.Resources.BasicSprites,8,8,32,32),a=r.Resources.GreatPalm.asSprite(),o=r.Resources.Palm.asSprite(),l=r.Resources.Campfire.asSprite();t.BasicSpriteMap={chestClosed:n.getSprite(2),chestOpen:n.getSprite(3),greatPalm:a,palm:o,BigCampfire:l,wood:n.getSprite(9),stone:n.getSprite(15)}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(3),n=i(4),a={[r.Material.Wood]:n.BasicSpriteMap.wood,[r.Material.Stone]:n.BasicSpriteMap.stone};class o{constructor(e,t,i,r){this.material=e,this.count=t,this.yOff=i,this.baseFontFamily=r,this.label=new s.Label(`${e} x ${t}`,0,0,r),this.label.fontSize=12,this.label.color=s.Color.White}draw(e,t,i){let r=a[this.material].clone();r.scale=new s.Vector(.5,.5),r.draw(e,t,i),this.label.text=`${this.material} x ${this.count}`,this.label.x=t+24,this.label.y=i+16,this.label.draw(e,0)}}t.Hud=class extends s.UIActor{constructor(e){super(0,0,e.canvasWidth,e.canvasHeight),this.initialize(e)}initialize(e){this.output=new s.Label("(press E to interact)",e.canvasWidth/2,e.canvasHeight-40,"Helvetica"),this.output.color=s.Color.White,this.output.fontSize=48,this.output.setWidth(e.canvasWidth),this.output.textAlign=s.TextAlign.Center;const t=new s.Label("ISLE",20,60,"Helvetica");t.color=s.Color.Azure,t.fontSize=24,this.inventory=new class extends s.UIActor{constructor(e,t,i){super(e,t,100,300),this.x=e,this.y=t,this.fontFamily=i,this.lineItems={[r.Material.Wood]:new o(r.Material.Wood,0,0,i),[r.Material.Stone]:new o(r.Material.Stone,0,1,i)}}setStock(e){Object.keys(e).forEach(t=>{this.lineItems[t].count=e[t]})}draw(e,t){super.draw(e,t),Object.keys(this.lineItems).forEach((t,i)=>this.lineItems[t].draw(e,this.x,this.y+32*i))}}(e.canvasWidth-300,50,"Helvetica"),this.add(this.output),this.add(t),this.add(this.inventory),this.updateInventory({[r.Material.Wood]:0,[r.Material.Stone]:0}),this.activePlayer=new class extends s.UIActor{constructor(e,t,i){super(e,t),this.x=e,this.y=t,this.baseFont=i,this.currentPlayer=new s.Label("???",0,10,i),this.currentPlayer.color=s.Color.White,this.currentPlayer.fontSize=16,this.add(this.currentPlayer),this.equipped=new s.Label("Equipped: NONE",0,124,i),this.equipped.color=s.Color.White,this.equipped.fontSize=16,this.add(this.equipped),this.playerPortrait=new s.UIActor(0,10),this.playerPortrait.scale=new s.Vector(2,2),this.add(this.playerPortrait),this.equipmentDrawing=new s.UIActor(0,124),this.equipmentDrawing.scale=new s.Vector(2,2),this.add(this.equipmentDrawing)}equip(e){e&&e.kind?(this.equipped.text=`${e.kind.name}`,e.kind.drawing&&(this.equipmentDrawing.addDrawing(e.kind.name,e.kind.drawing),this.equipmentDrawing.setDrawing(e.kind.name),this.add(this.equipmentDrawing))):(this.equipped.text="(no equipment)",this.remove(this.equipmentDrawing))}playing(e){this.currentPlayer.text=`Playing: ${e.name}`,e.equipped?this.equip(e.equipped):this.equip(null),this.playerPortrait.addDrawing(e.name,e.portrait),this.playerPortrait.setDrawing(e.name)}}(20,70,"Helvetica"),this.add(this.activePlayer)}updateInventory(e){this.inventory.setStock(e)}describe(e){this.output.text=e,this.output.opacity=1,this.output.actions.clearActions(),this.output.actions.fade(0,4e3)}equip(e){this.activePlayer.equip(e)}playing(e){this.activePlayer.playing(e)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(1);t.Logo=class extends s.Label{constructor(e,t,i){super(i),this.strobeClamp=r.clamp(50,200),this.strobe=(()=>{this.intensity=this.intensity+Math.ceil(16*Math.random())-8,this.intensity=this.strobeClamp(this.intensity),this.opacity=this.intensity/255}),this.x=e,this.y=t,this.fontFamily="Arial",this.fontSize=256,this.color=new s.Color(255,255,255),this.intensity=150,this.strobe()}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(1);t.Player=class extends s.Actor{constructor(e,t,i,r,n,a,o){super(t,i,32,64),this.name=e,this.x=t,this.y=i,this.config=r,this.spriteSheet=n,this.portrait=a,this.wireWorld=(e=>{this._world=e}),this.computeZ=(()=>this.y+24),this.halt=(()=>{this.vel=new s.Vector(0,0),this.currentDrawing=this.sprites[this.facing]}),this.move=(e=>{this.facing=e;const t=32*this.speed;this.halt(),"left"===e&&(this.vel.x=-t),"right"===e&&(this.vel.x=t),"up"===e&&(this.vel.y=-t),"down"===e&&(this.vel.y=t),this.currentDrawing=this.walkSprites[this.facing]}),this.collisionArea.body.useCircleCollision(6,new s.Vector(0,22)),this.color=new s.Color(255,255,255),this.collisionType=s.CollisionType.Active,this.collisionArea.recalc(),this.speed=r.playerSpeed,this.interacting=!1,this.usingItem=!1,this.sprites={down:n.getSprite(0),up:n.getSprite(1),right:n.getSprite(2),left:n.getSprite(3)};let l=[1,2,3,4,5,6].map(e=>4*e);this.walkSprites={down:n.getAnimationByIndices(o,l,125),up:n.getAnimationByIndices(o,l.map(e=>e+1),125),right:n.getAnimationByIndices(o,l.map(e=>e+2),125),left:n.getAnimationByIndices(o,l.map(e=>e+3),125)},this.move("down"),this.halt()}interact(){let e=this.interactionPos();this.interacting=!0;let t=this._world.entityNear(e.x,e.y);if(t){let{entity:e,cell:i}=t;return this._world.interact(e,i)}}equip(e){this.equipped=e,this.equipSprite=e.kind.drawing.clone(),this.equipSprite.scale=new s.Vector(1.25,1.25)}interactUsingEquipped(){let e=this.interactionPos();this.interacting=!0;let t=this._world.entityNear(e.x,e.y);if(t){let{entity:e,cell:i}=t;return this._world.useItem(e,i,this.equipped)}}interactionPos(){let e=this.getCenter().clone(),t=20;return"up"===this.facing&&(t-=2),"down"===this.facing&&(t-=4),e.y+=t,e.x-=2,r.addScalarToVec(e,this.facing,24),e}useEquippedItem(){this.usingItem=!0,this.usingItemTicks=0,this.interactUsingEquipped()}equipmentPos(){let e=this.getCenter().clone();return"left"===this.facing?e.y+=6:(e.x-=4,e.y+=8),e}draw(e,t){if("up"!==this.facing&&super.draw(e,t),this.usingItem&&this.equipped&&this.equipSprite){let t=this.equipSprite,i=this.usingItemTicks;"left"===this.facing?(i=6-i,t.flipHorizontal=!0,t.anchor=new s.Vector(-1,1)):(t.flipHorizontal=!1,t.anchor=new s.Vector(0,1),"up"===this.facing&&(i-=4),"down"===this.facing&&(i+=6)),t.rotation=i/3-1;let r=this.equipmentPos();t.draw(e,r.x,r.y)}if("up"===this.facing&&super.draw(e,t),this.config.debugBoundingBoxes){if(this.collisionArea.debugDraw(e,s.Color.Chartreuse),this.interacting){let t=this.interactionPos();e.fillRect(t.x,t.y-10,4,4),e.fillRect(t.x,t.y,4,4),e.fillRect(t.x,t.y+10,4,4),e.fillRect(t.x-10,t.y,4,4),e.fillRect(t.x+10,t.y,4,4)}e.fillRect(this.x,this.computeZ(),3,3)}}update(e,t){if(super.update(e,t),this.setZIndex(this.computeZ()),this.usingItem){let e=5;this.usingItemTicks+=1,this.usingItemTicks>e&&(this.usingItem=!1)}}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(7);t.Player=s.Player;const r=i(6);t.Logo=r.Logo},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0);t.Thing=class extends s.Actor{constructor(e,t,i=0,r=1,n){super(e,t,32*r,32*r,s.Color.Chartreuse),this.x=e,this.y=t,this.zOff=i,this.size=r,this.debugBoxes=n,this.computeZ=(()=>this.y+4+16*(this.size-1))}draw(e,t){super.draw(e,t),this.debugBoxes&&(this.collisionArea.debugDraw(e,s.Color.LightGray),e.fillRect(this.x,this.computeZ(),5,5))}constructCollisionArea(e){if(e){if(this.collisionType=s.CollisionType.Fixed,e.ellipse){let t=new s.Vector(e.x+e.width/2-16,e.y+e.height/2-16);this.body.useCircleCollision(e.height/2,t)}else if(e.polygon){let t=e.polygon.map(({x:t,y:i})=>new s.Vector(t+e.x,i+e.y));this.body.usePolygonCollision(t)}}else this.size>1?(this.collisionType=s.CollisionType.Fixed,this.body.useBoxCollision(new s.Vector(0,16*this.size-14)),this.setHeight(26*this.size/4),this.setWidth(24*this.size)):this.collisionType=s.CollisionType.PreventCollision}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(3),r=i(1),n=i(4);class a{constructor(e,t,i,s){this.kind=e,this.actor=t,this.cell=i,this.world=s,this.initialize()}initialize(){}activate(e){return null}}t.Item=a;const o={Chest:class extends a{constructor(){super(...arguments),this.state={open:!1}}initialize(){this.actor.addDrawing("closed",n.BasicSpriteMap.chestClosed),this.actor.addDrawing("open",n.BasicSpriteMap.chestOpen)}activate(e){if(!e)return console.log("Chest activated!"),this.state.open?(this.actor.setDrawing("closed"),this.state={open:!1},"closed"):(this.actor.setDrawing("open"),this.state={open:!0},"opened")}},Palm:class extends a{initialize(){this.actor.addDrawing("palm",n.BasicSpriteMap.palm),this.actor.setDrawing("palm")}},GreatPalm:class extends a{constructor(){super(...arguments),this.state={hp:100}}initialize(){this.actor.addDrawing("palm",n.BasicSpriteMap.greatPalm),this.actor.setDrawing("palm")}activate(e){if(this.state.hp>0){const t=`once a seed (${this.state.hp})`;let i=e&&"Handaxe"===e.kind.name?25:0;return this.state.hp-=i,t}{let e=[-2,-1,0,1,2].map(e=>this.world.tileMap.getCellByIndex(this.cell.index+this.kind.size/2+e+(this.kind.size-1)*this.world.tileMap.cols));return this.world.destroy(this),e.forEach(e=>{let t=r.coinflip()?"WoodLogStack":"WoodLog";this.world.spawn(this.world.itemKinds[t],e)}),"timber"}}},BigCampfire:class extends a{initialize(){this.actor.addDrawing("fire",n.BasicSpriteMap.BigCampfire),this.actor.setDrawing("fire")}},WoodLog:class extends a{activate(e){return e||this.world.collect(this,s.Material.Wood),this.kind.description}},WoodLogStack:class extends a{activate(e){return e||this.world.collect(this,s.Material.Wood,3),this.kind.description}},Handaxe:class extends a{activate(){return this.world.equip(this),this.world.destroy(this),this.kind.description}},Machete:class extends a{activate(){return this.world.equip(this),this.world.destroy(this),this.kind.description}}};t.buildItem=((e,t,i,s)=>o[e.name]?new o[e.name](e,t,i,s):new a(e,t,i,s)),t.Isle=class{constructor(e,t=[]){this.name=e,this.items=t}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(2);t.Game=class extends s.Engine{constructor(e,t,i){super({width:e,height:t,displayMode:s.DisplayMode.FullScreen}),this.setup()}start(){let e=new s.Loader;for(let t in r.Resources)e.addResource(r.Resources[t]);return e.logo="data:image/png;base64,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",e.logoWidth=256,e.playButtonText="Let's go!",super.start(e).then(this.kick)}setup(){}kick(){}}},function(e,t,i){e.exports=i.p+"fac8210e66067d101e48370329fc4c5a.mp3"},function(e,t,i){e.exports=i.p+"8e8aa6414e948820c3ad76cc2be5950e.png"},function(e,t,i){e.exports=i.p+"db6f4f593c47b1aa561da3453157f4bb.png"},function(e,t,i){e.exports=i.p+"e12b440e05a78caaa8a410ac5a9ae975.png"},function(e,t,i){e.exports=i.p+"a50b1e1e7cee2ca0bc0432c2f60c9762.png"},function(e,t,i){e.exports=i.p+"4370e7e154e6bf9f7f29f94d09f57d4d.png"},function(e,t,i){e.exports=i.p+"9ed23a06339fdd13866ae30b9487fee6.png"},function(e,t,i){e.exports=i.p+"2a68646c6ea259ec7876244b66663310.png"},function(e,t,i){e.exports=i.p+"62a76f84a12bb5ca1f3aa3ee157a7612.png"},function(e,t,i){e.exports=i.p+"b9b405c74e06d77b7a88f04d6d3ae5cd.png"},function(e,t,i){e.exports=i.p+"95be6eddfa20f80a10098ddeddb5e618.png"},function(e,t,i){e.exports=i.p+"721a1650db3d410b2328a96727466a7f.png"},,function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0);t.LevelOne=class extends s.Scene{onInitialize(e){}wireWorld(e){this.world=e}onActivate(){}onDeactivate(){}draw(e,t){super.draw(e,t)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),r=i(25),n=i(2),a=i(11),o=i(1),l=i(3),c=i(5),h={debugCells:!1,debugBoundingBoxes:!1,zoom:2,playerSpeed:6.8,bgMusic:!0},p=new a.Game(800,600,h),u=new r.LevelOne,d=new c.Hud(p);u.add(d);const f=new l.World(u,d,h,p);u.wireWorld(f),p.input.keyboard.on("press",e=>{if(p.currentScene===u){let t=f.primaryCharacter(),{key:i}=e;if(i===s.Input.Keys.E){let e=t.interact();e&&d.describe(e)}else if(i===s.Input.Keys.C)f.crafting?f.crafting=!1:(d.describe("would craft!"),f.enterCraftMode("BigCampfire",0,0));else{let e=o.keyToDirection(i);e&&t.move(e)}}}),p.input.keyboard.on("hold",e=>{let{key:t}=e,i=o.keyToDirection(t);i&&f.primaryCharacter().move(i)}),p.input.keyboard.on("release",e=>{let{key:t}=e;if(o.keyToDirection(t)){let e=f.primaryCharacter();e.halt(),e.interacting=!1}}),p.add("wander",u),p.start().then(()=>{f.processTiledMap(n.Resources.Map);let e=f.tileMap;if(u.addTileMap(e),p.goToScene("wander"),h.bgMusic){let e=n.Resources.FineMist;setTimeout(()=>{e.play(.2)},3e3)}p.input.pointers.primary.on("down",e=>{let{pos:t}=e;if(f&&f.crafting){let e=f.itemKinds[f.craftingItem],i=f.tileMap.getCellByPoint(t.x,t.y);f.spawn(e,i),f.crafting=!1,f.debit(l.Material.Wood)}else f._primaryCharacter.equipped&&f.primaryCharacter().useEquippedItem()})})}]);
//# sourceMappingURL=main.js.map