// THIS FILE IS FOR TESTING PURPOSES ONLY
const amqplib = require("amqplib/callback_api");
const name = "client1";
let roomsLists = {};

amqplib.connect("amqp://localhost", (err, conn) => {
  if (err) throw err;

  // Listener
  conn.createChannel((err, ch1) => {
    if (err) throw err;
    console.log("Client connected to RabbitMQ!");

    // Asserts and creates queues
    ch1.assertQueue("connections", { durable: false });
    ch1.assertQueue("client1", { durable: false });

    ch1.bindQueue("client1", "update", "");

    ch1.consume("client1", (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        roomsLists = JSON.parse(msg.content.toString());
        ch1.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });
  });

  conn.createChannel((err, ch2) => {
    if (err) throw err;

    // Send message to server
    ch2.sendToQueue("connections", Buffer.from(name));
    ch2.sendToQueue(
      "create",
      Buffer.from(JSON.stringify({ player: name, playerMove: "rock" }))
    );
    ch2.sendToQueue(
      "join",
      Buffer.from(
        JSON.stringify({
          roomID: "ca4ebeb6-d937-4145-82e5-d89ed3ba2283",
          player: "player2",
          move: "paper",
        })
      )
    );
  });
});
