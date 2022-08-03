
import { _decorator, Component, Node, tween, Vec3, UIOpacity, BlockInputEvents, lerp, BoxCollider2D, Contact2DType, Label, game, SystemEvent, Event, Game, find } from 'cc';
import { PropsBehavior } from './PropsBehavior';
const { ccclass, property } = _decorator;

@ccclass('PlayerBehavior')
export class PlayerBehavior extends Component {

    currentLine = 1;
    canMove = true;

    collided = false;

    propsBehavior: PropsBehavior = null!;

    @property(UIOpacity)
    fadeOpacity = null!;

    @property(BlockInputEvents)
    fadeBlockEvents = null;

    @property(Number)
    timeToFullSpeed = 5;

    speed = 0;

    @property(Number)
    maximumSpeed = 800;

    totalDistance = 0;

    started = false;

    @property(Node)
    startButton: Node = null!;

    @property(UIOpacity)
    startBG: UIOpacity = null!;

    @property(Label)
    distanceCounter: Label = null!;

    @property([Node])
    wayNodes: Node[] = [];
    @property(Node)
    playerNode: Node = null!;

    gameStarted = false;

    @property(Number)
    lifes = 3;

    @property([UIOpacity])
    tireLifes = [];

    onLoad(){
        var self = this;

    }

    start () {
        var self = this;

        self.propsBehavior = find("Canvas/All/Props").getComponent(PropsBehavior);

        let collider = self.getComponent(BoxCollider2D);
        if(collider)
        {
            collider.on(Contact2DType.BEGIN_CONTACT, self.onBeginContact, self);
        }

        self.distanceCounter.string = "0Km";

        tween(self.startButton).to(0.5, {scale: new Vec3(0.95, 0.95, 0.95)}, {easing: "quadIn"}).to(0.5, {scale: new Vec3(1, 1, 1)}, {easing: "quadOut"}).union().repeatForever().start();

        self.scheduleOnce(()=> {
            tween(self.fadeOpacity).to(0.5, {opacity: 0}, {easing: "cubicInOut", onStart: ()=>{ self.fadeBlockEvents.enabled = false; } }).start();
        }, 0.5);
    }

    update (deltaTime: number) {
        var self = this;
        
        if(!self.gameStarted)
            return;

        self.totalDistance += (self.speed * deltaTime * 1) / 1000;

        let totalDistanceInt = Math.round(self.totalDistance * 10) / 10;
        
        if(self.distanceCounter)
            self.distanceCounter.string = totalDistanceInt.toString() + "Km";
    }

    StartGame() {
        var self = this;

        if(self.gameStarted)
            return;

        self.gameStarted = true;

        self.scheduleOnce(()=>{
            self.propsBehavior.SpawnProps();
        }, 3);

        tween(self.startButton).to(0.25, {scale: new Vec3(0.85, 0.85, 0.85)}, {easing: "quadIn"}).to(0.25, {scale: new Vec3(1, 1, 1)}, {easing: "quadOut"}).union().start();

        tween(self.startBG).to(0.5, {opacity: 0}, {easing: 'cubicInOut', onStart: ()=>{
            self.startBG.getComponent(BlockInputEvents).enabled = false;
            self.started = true;

            tween(self.node).to(self.timeToFullSpeed, {}, {easing: "cubicIn", onUpdate(target, ratio: number) {
                self.speed = lerp(0, self.maximumSpeed, ratio);
            }}).start();
        }, onComplete: ()=>{ self.startBG.node.active = false; }}).start();
    }

    GoLeft() {
        var self = this;

        if(!self.started)
            return;

        if(self.currentLine == 0 || !self.canMove)
            return;

        if(self.lifes == 0)
        {
            return;
        }

        self.currentLine--;
        
        let animRotationGo = tween().to(0.1, {}, {easing: 'quadInOut', onUpdate(target, ratio: number){ self.node.setRotationFromEuler(new Vec3(0, 0, lerp(0, 30, ratio))); }}).start();
        let animRotationReturn = tween().to(0.1, {}, {easing: 'quadInOut', onUpdate(target, ratio: number){ self.node.setRotationFromEuler(new Vec3(0, 0, lerp(30, 0, ratio))); }}).start();

        tween(self.playerNode).then(animRotationGo).then(animRotationReturn).start();

        tween(self.node).to(0.2, {position: new Vec3(self.wayNodes[self.currentLine].position.x, self.node.position.y, self.node.position.z)}, {easing: 'quadInOut', onStart: ()=>{ self.canMove = false; }, onComplete: ()=>{ self.canMove = true; }}).start();
    }
    GoRight() {
        var self = this;

        if(!self.started)
            return;

        if(self.currentLine == self.wayNodes.length - 1 || !self.canMove)
            return;

        if(self.lifes == 0)
        {
            return;
        }

        self.currentLine++;

        let animRotationGo = tween().to(0.1, {}, {easing: 'quadInOut', onUpdate(target, ratio: number){ self.node.setRotationFromEuler(new Vec3(0, 0, lerp(0, -30, ratio))); }}).start();
        let animRotationReturn = tween().to(0.1, {}, {easing: 'quadInOut', onUpdate(target, ratio: number){ self.node.setRotationFromEuler(new Vec3(0, 0, lerp(-30, 0, ratio))); }}).start();

        tween(self.playerNode).then(animRotationGo).then(animRotationReturn).start();
        
        tween(self.node).to(0.2, {position: new Vec3(self.wayNodes[self.currentLine].position.x, self.node.position.y, self.node.position.z)}, {easing: 'quadInOut', onStart: ()=>{ self.canMove = false; }, onComplete: ()=>{ self.canMove = true; }}).start();
    }
    Restart() {
        var self = this;

        if(!self.started)
            return;

        self.scheduleOnce(()=> {
            tween(self.fadeOpacity).to(0.5, {opacity: 255}, {easing: "cubicInOut", onStart: ()=>{ self.fadeBlockEvents.enabled = true; }, onComplete: ()=>{ game.restart(); } }).start();
        }, 0.5);
    }

    CarCollide()
    {
        var self = this;

        self.collided = true;
        let lastY = self.playerNode.position.y;

        console.log("PLAYER LOSES LIFE...");
        self.lifes--;

        tween(self.tireLifes[self.lifes].node).to(0.4, {scale: new Vec3(1.1, 1.1, 1.1)}, {easing: "expoIn", onStart: ()=>{  }, onComplete: ()=>{  }}).start();
        tween(self.tireLifes[self.lifes]).to(0.3, {opacity: 0}, {easing: "expoIn", onStart: ()=>{  }, onComplete: ()=>{ }}).start();

        let animOpacityLow = tween().to(0.2, {opacity: 160}, {easing: 'cubicInOut', onStart: ()=>{  }, onComplete: ()=>{  }});
        let animOpacityHigh = tween().to(0.2, {opacity: 255}, {easing: 'cubicInOut', onStart: ()=>{  }, onComplete: ()=>{  }});

        if(self.lifes == 0)
        {
            console.log("PLAYER DIES!!");

            tween(self.playerNode.getComponent(UIOpacity)).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).start();
            
            self.scheduleOnce(()=>{
                self.playerNode.getComponent(UIOpacity).opacity = 0;

                self.scheduleOnce(()=> {
                    self.Restart();
                }, 0.5);
            }, 2.2);

            tween(self.playerNode).to(0.1, {position: new Vec3(0, lastY - 150, 0)},{easing: 'cubicOut', onStart: ()=>{
                tween(self.node).to(15, {}, {easing: "cubicOut", onUpdate(target, ratio: number) {
                    self.speed = lerp(self.speed, 0, ratio);
                }}).start();
            }, onComplete: ()=>{}}).start();
        }
        else
        {
            tween(self.node).to(0.1, {}, {easing: "linear", onUpdate(target, ratio: number) {
                self.speed = lerp(self.speed, self.speed - 100, ratio);
            }, onComplete() {
                tween(self.node).to(1, {}, {easing: "cubicInOut", onUpdate(target, ratio: number) {
                    self.speed = lerp(self.speed, self.maximumSpeed, ratio);
                }}).start();
            }}).start();
            
            tween(self.playerNode.getComponent(UIOpacity)).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).start();
            
            tween(self.playerNode).to(0.1, {position: new Vec3(0, lastY - 150, 0)},{easing: 'cubicOut', onStart: ()=>{ }, onComplete: ()=>{
                tween(self.playerNode).to(3, {position: new Vec3(0, lastY, 0)}, {easing: 'circOut', onStart: ()=>{  }, onComplete: ()=>{ self.collided = false; }}).start();
            }}).start();
        }
    }

    onBeginContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        var self = this;

        // console.log("PLAYER COLLIDE");

        if(!self.collided)
            self.CarCollide();
    }
}
