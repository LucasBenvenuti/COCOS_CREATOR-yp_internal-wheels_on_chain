
import { _decorator, Component, Node, Prefab, PlaneCollider, instantiate, setDefaultLogTimes } from 'cc';
import { PlayerBehavior } from './PlayerBehavior';
const { ccclass, property } = _decorator;
 
@ccclass('PropsBehavior')
export class PropsBehavior extends Component {

    @property(Prefab)
    groundPrefab = null!;
    @property(Node)
    groundParent = null!;

    @property(Node)
    propsParent = null!;
    @property([Prefab])
    propsPrefabs = [];

    @property([Prefab])
    carEnemyPrefabs = [];
    @property(Node)
    carEnemyParent = null!;
    
    @property(Prefab)
    walkwayPrefab = null!;
    @property(Node)
    walkwayParent = null!;

    @property(Node)
    spawnPoint = null!;

    @property(Node)
    propsSpawnPoint = null!;

    @property(PlayerBehavior)
    playerBehavior = null!;

    instantiated = false;
    loopCanGo = false;

    lastPropIndex = -1;
    propIndexGone: Array<Number> = [];

    onLoad(){
        var self = this;
    }

    start () {
        var self = this;

        // self.SpawnCar();

        // self.schedule(()=>{
        //     self.SpawnCar();
        // }, 3);

    }

    SpawnObject() {
        var self = this;

        let groundObject = instantiate(self.groundPrefab);
        self.scheduleOnce(()=>{
            groundObject.parent = self.groundParent;
            groundObject.setPosition(self.spawnPoint.position);
        }, 0);
    }

    SpawnCar() {
        var self = this;

        let carIndex = Math.floor(Math.random() * ((self.carEnemyPrefabs.length) - 0) + 0);

        let wayIndex = Math.floor(Math.random() * ((self.playerBehavior.wayNodes.length) - 0) + 0);

        let carObject = instantiate(self.carEnemyPrefabs[carIndex]);
        self.scheduleOnce(()=>{
            carObject.parent = self.carEnemyParent;
            carObject.setPosition(self.playerBehavior.wayNodes[wayIndex].position.x, self.spawnPoint.position.y, carObject.position.z);
        }, 0);
    }

    SpawnProps() {
        var self = this;

        let propsIndex = self.lastPropIndex;

        if(self.propIndexGone.length == self.propsPrefabs.length)
        {
            console.log("Reseting List");
            
            self.propIndexGone = [];
            console.log(self.propIndexGone);
        }

        self.loopCanGo = false;

        while(!self.loopCanGo)
        {
            propsIndex = Math.floor(Math.random() * ((self.propsPrefabs.length) - 0) + 0);
            console.log("Props Index - " + propsIndex);

            if(propsIndex != self.lastPropIndex)
            {
                if(self.propIndexGone.indexOf(propsIndex) == -1)
                {
                    console.log("Not repeated!");
                    self.loopCanGo = true;
                }
            }
        }
        
        self.lastPropIndex = propsIndex;
        self.propIndexGone.push(self.lastPropIndex);
        console.log(self.propIndexGone);

        let propObject = instantiate(self.propsPrefabs[propsIndex]);
        self.scheduleOnce(()=>{
            propObject.parent = self.propsParent;
            propObject.setPosition(propObject.position.x, self.propsSpawnPoint.position.y, propObject.position.z);

            self.instantiated = false;
        }, 0);
    }
}