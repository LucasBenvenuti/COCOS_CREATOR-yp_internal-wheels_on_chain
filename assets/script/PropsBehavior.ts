
import { _decorator, Component, Node, Prefab, PlaneCollider, instantiate, setDefaultLogTimes } from 'cc';
import { PlayerBehavior } from './PlayerBehavior';
const { ccclass, property } = _decorator;
 
@ccclass('PropsBehavior')
export class PropsBehavior extends Component {

    public static instance : PropsBehavior =  null;

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

    @property([String])
    instanceType = [];

    instanceTypeIndex = 0;

    instantiated = false;

    lastPropIndex = -1;

    onLoad(){
        if(PropsBehavior.instance != null && PropsBehavior.instance != this){
            this.destroy();
        }else{
            PropsBehavior.instance = this;
        }
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
        // let carIndex = 0;
        console.log("Car Index - " + carIndex);

        let wayIndex = Math.floor(Math.random() * ((PlayerBehavior.instance.wayNodes.length) - 0) + 0);
        
        console.log("Way Index - " + wayIndex);

        let carObject = instantiate(self.carEnemyPrefabs[carIndex]);
        self.scheduleOnce(()=>{
            carObject.parent = self.carEnemyParent;
            carObject.setPosition(PlayerBehavior.instance.wayNodes[wayIndex].position.x, self.spawnPoint.position.y, carObject.position.z);
        }, 0);
    }

    SpawnProps() {
        var self = this;

        let propsIndex = self.lastPropIndex;

        while(propsIndex == self.lastPropIndex)
        {
            propsIndex = Math.floor(Math.random() * ((self.propsPrefabs.length) - 0) + 0);
            console.log("Props Index - " + propsIndex);
        }

        self.lastPropIndex = propsIndex;

        let propObject = instantiate(self.propsPrefabs[propsIndex]);
        self.scheduleOnce(()=>{
            propObject.parent = self.propsParent;
            propObject.setPosition(propObject.position.x, self.propsSpawnPoint.position.y, propObject.position.z);

            self.instantiated = false;
        }, 0);
    }

    MoveStreet()
    {
        var self = this;

        console.log("MOVE STREET");
    }
}