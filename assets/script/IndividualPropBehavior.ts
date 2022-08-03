
import { _decorator, Component, Node, BoxCollider2D, Contact2DType, find } from 'cc';
import { PlayerBehavior } from './PlayerBehavior';
import { PropsBehavior } from './PropsBehavior';
const { ccclass, property } = _decorator;
 
@ccclass('IndividualPropBehavior')
export class IndividualPropBehavior extends Component {

    playerBehavior: PlayerBehavior = null!;
    propsBehavior: PropsBehavior = null!;

    @property(Boolean)
    isPropStarter = false;

    @property(Boolean)
    isGround = false;

    @property(Boolean)
    isDestructive = false;

    @property(Boolean)
    isMovable = false;

    @property(Number)
    movableSpeed = 1;

    @property(Number)
    maximumSpeed = 0.5;

    @property(Number)
    minimumSpeed = 0.9;

    start () {
        var self = this;

        self.playerBehavior = find("Canvas/All/Player")?.getComponent(PlayerBehavior);
        self.propsBehavior = find("Canvas/All/Props")?.getComponent(PropsBehavior);
        
        if(self.isMovable)
            self.movableSpeed = (Math.random() * (self.minimumSpeed - self.maximumSpeed) + self.maximumSpeed);

        let collider = self.getComponent(BoxCollider2D);

        if(collider)
        {
            collider.on(Contact2DType.BEGIN_CONTACT, self.onBeginContact, self);
        }
    }

    update (deltaTime: number) {
        var self = this;
        
        if(self.playerBehavior){
            self.node.setPosition(self.node.position.x, (self.node.position.y - ((self.playerBehavior.speed * self.movableSpeed) * deltaTime)));
        }
    }

    onBeginContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        var self = this;
        
        if(!self.isMovable)
        {
            if(otherCollider.group != 64 && otherCollider.group != 4)
            {
                return;
            }
        }

        if(self.isPropStarter && !self.propsBehavior.instantiated)
        {
            self.propsBehavior.instantiated = true;
            self.propsBehavior.SpawnProps();
        }

        self.scheduleOnce(()=>{
            self.node.destroy();
        }, 0.01);
    }
}