import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

class Message extends Schema {
    @type("string") id: string;
    @type("string") sender: string;
    @type("string") content: string;
    @type("number") timestamp: number;
    @type("string") parentId: string | null; 
    @type([Message]) replies = new ArraySchema<Message>();

    constructor(id: string, sender: string, content: string, parentId: string | null = null) {
        super();
        this.id = id;
        this.sender = sender;
        this.content = content;
        this.timestamp = Date.now();
        this.parentId = parentId;
    }
}

class LevelState extends Schema {
    @type("string") levelName: string;
    @type({ map: Message }) messages = new MapSchema<Message>(); 

    constructor(levelName: string) {
        super();
        this.levelName = levelName;
        this.generateFakeData();
    }

    generateFakeData() {
        const root1 = new Message("1", "Alice", "Hello everyone!", null);
        const reply1 = new Message("2", "Bob", "Hi Alice!", "1");
        const reply2 = new Message("3", "Charlie", "This is great!", "1");
        const subReply1 = new Message("6", "Eve", "I agree!", "3");

        reply2.replies.push(subReply1); 
        root1.replies.push(reply1, reply2); 

        const root2 = new Message("4", "Dave", "Nice to meet you all!", null);
        const reply3 = new Message("5", "Eve", "Replying to Dave!", "4");

        root2.replies.push(reply3);

        this.messages.set(root1.id, root1);
        this.messages.set(root2.id, root2);
    }

    addMessage(sender: string, content: string, parentId: string | null = null) {
        const id = Math.random().toString(36).substring(7);
        const newMessage = new Message(id, sender, content, parentId);

        if (parentId && this.messages.has(parentId)) {
            this.messages.get(parentId)?.replies.push(newMessage);
        } else {
            this.messages.set(id, newMessage);
        }
    }
}

export { LevelState, Message };