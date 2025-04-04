import { Room, Client, AuthContext } from "colyseus";
import { MyRoomState, Player } from "./schema/MyRoomState";


export type ChatMessage = {
  sender: string;
  message: string;
};



export class ChatRoom extends Room<MyRoomState> {

    
  onCreate (options: any) {
    this.setState(new MyRoomState());
    this.autoDispose = false;

    this.onMessage("chat", (client, message: string) => {
      console.log(`Nhận tin nhắn từ ${client.sessionId}: ${message}`);
      
      this.broadcast("chat", { sender: client.sessionId, message: message });
    });

  }

  onAuth(client: Client, options: any, context: AuthContext) {
    return true;
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    this.state.players.set(client.sessionId, new Player());

    client.send("welcomeMessage", "Welcome to Colyseus!");
  }
  
  
  onLeave (client: Client, consented: boolean) {
    
    this.state.players.delete(client.id);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
