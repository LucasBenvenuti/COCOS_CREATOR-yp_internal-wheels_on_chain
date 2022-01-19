
import { _decorator, Component, Node, BoxCollider2D, Contact2DType } from 'cc';
import { PropsBehavior } from './PropsBehavior';
const { ccclass, property } = _decorator;

 
@ccclass('RepositionPoint')
export class RepositionPoint extends Component {
    @property(PropsBehavior)
    propsBehavior = null!;

    start () {
        var self = this;

        let collider = self.getComponent(BoxCollider2D);
        if(collider)
        {
            collider.on(Contact2DType.BEGIN_CONTACT, self.onBeginContact, self);
            // console.log(collider);
        }
    }

    onBeginContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        var self = this;

        // console.log(otherCollider);

        if(otherCollider.group == 2)
        {
            console.log("GROUND");
            // otherCollider.node.setPosition(0, self.propsBehavior.spawnPoint.position.y, 0);
            // self.propsBehavior.MoveStreet();
            self.propsBehavior.SpawnObject();
        }
    }
}