import { Client, Room } from "colyseus";
import { LevelState } from "./LevelState";
import {type} from "@colyseus/schema"

export class LevelRoom extends Room<LevelState> {

    @type(LevelState) levelState : LevelState ;

    onCreate() {
        this.autoDispose = false;

        const fakeLevelNames = ["1", "2", "3"];
        const levelName = fakeLevelNames[Math.floor(Math.random() * fakeLevelNames.length)];
        
        this.levelState = new LevelState(levelName);
        this.setState( this.levelState);
        

        this.onMessage("sendMessage", (client, { sender, content, parentId }) => {
            this.state.addMessage(sender, content, parentId);
        });
    }
    onJoin(client: Client<any, any>, options?: any, auth?: any): void | Promise<any> {
        this.setState( this.levelState);
    }
}
