
import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CarSkinRandomizer
 * DateTime = Wed Jan 19 2022 11:20:49 GMT-0300 (Horário Padrão de Brasília)
 * Author = YellowPandaGames
 * FileBasename = CarSkinRandomizer.ts
 * FileBasenameNoExtension = CarSkinRandomizer
 * URL = db://assets/script/CarSkinRandomizer.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('CarSkinRandomizer')
export class CarSkinRandomizer extends Component {
    
    @property([SpriteFrame])
    carSprites = [];

    @property(Sprite)
    spriteComponent = null!;

    start () {
        var self = this;

        let skinIndex = Math.floor(Math.random() * ((self.carSprites.length) - 0) + 0);
        // console.log("Props Index - " + skinIndex);

        // console.log(self.spriteComponent);

        self.spriteComponent.spriteFrame = self.carSprites[skinIndex];

    }
}