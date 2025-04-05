import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

class Message extends Schema {
  @type("string") sender: string;
    @type("string") message: string;

    constructor(sender : string, message : string) {
        super();
        this.sender = sender;
        this.message = message;
    
    }
}

class TestState extends Schema {
    @type("string") sender: string;
    @type("string") message: string;
    @type({ map: Message }) messages = new MapSchema<Message>(); 
    
    constructor(sender : string, message : string) {
        super();
        this.sender = sender;
        this.message = message;
        this.generateFakeData();
    }   
    generateFakeData() {

        const root2 = new Message( "Dave", "Nice to meet you all!");
        const reply3 = new Message("Eve", "Replying to Dave!");

        this.messages.set("1", root2);
        this.messages.set("2", reply3);
    }

}

export { TestState, Message };