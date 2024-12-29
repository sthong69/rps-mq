const amqplib = require("amqplib/callback_api");
const { v4: uuidv4 } = require("uuid");
let roomsLists = [];

amqplib.connect("amqp://localhost", (err, conn) => {
  if (err) throw err;

  // Listeners
  conn.createChannel((err, ch) => {
    if (err) throw err;
    console.log("Server connected to RabbitMQ!");

    // Initial connection pipeline
    ch.assertQueue("connections", { durable: false });
    ch.consume("connections", (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        const message = JSON.stringify(roomsLists);
        ch.sendToQueue(msg.content.toString(), Buffer.from(message));
        ch.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });

    ch.assertQueue("create", { durable: false });
    ch.assertQueue("join", { durable: false });
    ch.assertExchange("update", "fanout", { durable: false });

    // Room creation pipeline
    ch.consume("create", (msg) => {
      if (msg !== null) {
        console.log("[Room creation]" + msg.content.toString());
        let roomInput = JSON.parse(msg.content.toString());

        let roomInfos = {
          roomID: uuidv4(),
          player1: roomInput.player,
          player2: null,
          player1Move: roomInput.playerMove,
          player2Move: null,
          status: "waiting",
        };
        roomsLists.push(roomInfos);

        let message = JSON.stringify(roomsLists);
        ch.publish("update", "", Buffer.from(message));

        ch.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });

    // Room joining pipeline
    ch.consume("join", (msg) => {
      if (msg !== null) {
        console.log("[Room joining]" + msg.content.toString());
        let roomInput = JSON.parse(msg.content.toString());

        let roomID = roomInput.roomID;

        // Checking if the room exists
        let roomInfos = roomsLists.find((room) => room.roomID === roomID);
        if (roomInfos === undefined) {
          console.log("Room does not exist");
          ch.ack(msg);
          return;
        }

        // Checking if the room is full
        if (roomInfos.player2 !== null) {
          console.log("Room is closed");
          ch.ack(msg);
          return;
        }

        // Updating room infos
        roomInfos.player2 = roomInput.player;
        roomInfos.player2Move = roomInput.playerMove;
        roomInfos.status = "closed";

        // Deleting old room infos and pushing the new one
        roomsLists = roomsLists.filter((room) => room.roomID !== roomID);
        roomsLists.push(roomInfos);

        let message = JSON.stringify(roomsLists);
        ch.publish("update", "", Buffer.from(message));

        ch.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });
  });
});
