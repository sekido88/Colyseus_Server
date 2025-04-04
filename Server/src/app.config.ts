import config from "@colyseus/tools";

import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";

import { matchMaker } from "colyseus";
// import { RedisDriver } from "@colyseus/redis-driver";
// import { RedisPresence } from "@colyseus/redis-presence";

/**
 * Import your Room files
 */

const roomsByLevel : { [level : number] : string} = {};

async function createLevelRoom() {
  for (let level = 1; level <= 10; level++){
    try {
      const room = await matchMaker.createRoom("level_room", { level });
      roomsByLevel[level] = room.roomId;
      console.log(`Room for level ${level} created with ID: ${room.roomId}`);
  } catch (error) {
      console.error(`Failed to create room for level ${level}:`, error);
  }
  }
}


import { MyRoom } from "./rooms/MyRoom";
import auth from "./config/auth";
import { LobbyRoom } from "colyseus";
import { ChatRoom } from "./rooms/ChatRoom";
import { LevelRoom } from "./levels/LevelRoom";

export default config({
  
  options: {
        // devMode: true,
        // driver: new RedisDriver(),
        // presence: new RedisPresence(),
    },

    initializeTransport: (options) => new WebSocketTransport(options),

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);
        gameServer.define("chat_room", ChatRoom);

        gameServer.define('lobby', LobbyRoom);
        gameServer.define("level_room", LevelRoom);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send(`Instance ID => ${process.env.NODE_APP_INSTANCE ?? "NONE"}`);
        });
        
        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());

        // Bind "playground"
        app.use("/playground", playground());

        // Bind auth routes
        app.use(auth.prefix, auth.routes());
    },


    beforeListen: async () => {
      await createLevelRoom();
      console.log("✅ Đã tạo xong phòng test!");
    }
});
