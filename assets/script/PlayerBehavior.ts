
import { _decorator, Component, Node, tween, Vec3, UIOpacity, BlockInputEvents, lerp, BoxCollider2D, Contact2DType, Label } from 'cc';
import { PropsBehavior } from './PropsBehavior';
const { ccclass, property } = _decorator;

@ccclass('PlayerBehavior')
export class PlayerBehavior extends Component {

    public static instance : PlayerBehavior =  null;

    currentLine = 1;
    canMove = true;

    collided = false;

    @property(Number)
    timeToFullSpeed = 5;

    speed = 0;

    @property(Number)
    maximumSpeed = 800;

    totalDistance = 0;

    started = false;

    @property(Node)
    startButton: Node = null!;

    @property(Label)
    distanceCounter: Label = null!;

    @property([Node])
    wayNodes: Node[] = [];
    @property(Node)
    playerNode: Node = null!;

    gameStarted = false;

    onLoad(){
        if(PlayerBehavior.instance != null && PlayerBehavior.instance != this){
            this.destroy();
        }else{
            PlayerBehavior.instance = this;
        }
    }

    start () {
        var self = this;

        let collider = self.getComponent(BoxCollider2D);
        if(collider)
        {
            collider.on(Contact2DType.BEGIN_CONTACT, self.onBeginContact, self);
            console.log(collider);
        }
    }

    update (deltaTime: number) {
        var self = this;

        self.totalDistance += self.speed * deltaTime * 0.1;

        let totalDistanceInt = Math.round(self.totalDistance);
        
        if(self.distanceCounter)
            self.distanceCounter.string = totalDistanceInt.toString() + " m";
    }

    StartGame() {
        var self = this;

        if(self.gameStarted)
            return;

        self.gameStarted = true;

        self.scheduleOnce(()=>{
            PropsBehavior.instance.SpawnProps();
        }, 3);

        tween(self.startButton.getComponent(UIOpacity)).to(0.5, {opacity: 0}, {easing: 'cubicInOut', onStart: ()=>{
            self.startButton.getComponent(BlockInputEvents).enabled = false;
            self.started = true;

            tween(self.node).to(self.timeToFullSpeed, {}, {easing: "cubicIn", onUpdate(target, ratio: number) {
                self.speed = lerp(0, self.maximumSpeed, ratio);
            }}).start();
        }, onComplete: ()=>{ self.startButton.active = false; }}).start();
    }

    GoLeft() {
        var self = this;

        if(!self.started)
            return;

        if(self.currentLine == 0 || !self.canMove)
            return;

        self.currentLine--;
        
        tween(self.node).to(0.2, {position: new Vec3(self.wayNodes[self.currentLine].position.x, self.node.position.y, self.node.position.z)}, {easing: 'quadInOut', onStart: ()=>{ self.canMove = false; }, onComplete: ()=>{ self.canMove = true; }}).start();

        console.log("Go Left!");
    }
    GoRight() {
        var self = this;

        if(!self.started)
            return;

        if(self.currentLine == self.wayNodes.length - 1 || !self.canMove)
            return;

        self.currentLine++;
        
        tween(self.node).to(0.2, {position: new Vec3(self.wayNodes[self.currentLine].position.x, self.node.position.y, self.node.position.z)}, {easing: 'quadInOut', onStart: ()=>{ self.canMove = false; }, onComplete: ()=>{ self.canMove = true; }}).start();

        console.log("Go Right!");
    }
    Restart() {
        var self = this;

        if(!self.started)
            return;

        console.log("Restart!");

        self.CarCollide();
    }

    CarCollide()
    {
        var self = this;

        self.collided = true;
        let lastY = self.playerNode.position.y;

        let animOpacityLow = tween().to(0.2, {opacity: 160}, {easing: 'cubicInOut', onStart: ()=>{  }, onComplete: ()=>{  }});
        let animOpacityHigh = tween().to(0.2, {opacity: 255}, {easing: 'cubicInOut', onStart: ()=>{  }, onComplete: ()=>{  }});

        tween(self.node).to(0.1, {}, {easing: "linear", onUpdate(target, ratio: number) {
            self.speed = lerp(self.speed, self.speed - 100, ratio);
        }, onComplete() {
            tween(self.node).to(1, {}, {easing: "cubicInOut", onUpdate(target, ratio: number) {
                self.speed = lerp(self.speed, self.maximumSpeed, ratio);
            }}).start();
        }}).start();

        tween(self.playerNode.getComponent(UIOpacity)).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).then(animOpacityLow).then(animOpacityHigh).start();

        tween(self.playerNode).to(0.1, {position: new Vec3(0, lastY - 150, 0)},{easing: 'cubicOut', onStart: ()=>{ }, onComplete: ()=>{
            tween(self.playerNode).to(3, {position: new Vec3(0, lastY, 0)}, {easing: 'circOut', onStart: ()=>{  }, onComplete: ()=>{ self.collided = false; }}).start();
        }}).start();
    }

    onBeginContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        var self = this;

        console.log("PLAYER COLLIDE");

        if(!self.collided)
            self.CarCollide();
    }
}
