import { Client, Room } from "colyseus";
import { LevelState } from "./LevelState";
import { type } from "@colyseus/schema";
import { TestState } from "./TestState";

export class LevelRoom extends Room<LevelState> {
  @type(TestState) testState: TestState;
  onCreate() {
    this.autoDispose = false;

    const fakeLevelNames = ["1", "2", "3"];
    const levelName =
      fakeLevelNames[Math.floor(Math.random() * fakeLevelNames.length)];

    this.state = new LevelState(levelName);

    this.onMessage("initData", (client, message: string) => {
      console.log(`Nhận tin nhắn từ ${client.sessionId}: ${message}`);

      this.broadcast("initData", this.state);
    });

    this.onMessage("sendMessage", (client, { sender, content, parentId }) => {
      this.state.addMessage(sender, content, parentId);
    });
  }
  onJoin(
    client: Client<any, any>,
    options?: any,
    auth?: any
  ): void | Promise<any> 
  {
    this.broadcast("initData", this.state);
  }
}
