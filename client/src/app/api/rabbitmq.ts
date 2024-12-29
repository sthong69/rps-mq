import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
}

export async function assertQueueAndBindToExchange(
  queueName: string,
  exchangeName: string = "update"
) {
  const { connection, channel } = await connectRabbitMQ();
  try {
    // Assert that the queue exists
    await channel.assertQueue(queueName, { durable: false });
    console.log(`Asserted queue: ${queueName}`);

    // Assert that the exchange exists
    await channel.assertExchange(exchangeName, "fanout", { durable: false });
    console.log(`Asserted exchange: ${exchangeName}`);

    // Bind the queue to the exchange
    await channel.bindQueue(queueName, exchangeName, "");
    console.log(`Bound queue ${queueName} to exchange ${exchangeName}`);

    return {
      success: true,
      message: `Queue ${queueName} asserted and bound to exchange ${exchangeName}`,
    };
  } catch (error) {
    console.error("Error in assertQueueAndBindToExchange:", error);
    return {
      success: false,
      message: "Failed to assert queue and bind to exchange",
    };
  } finally {
    await connection.close();
  }
}

export async function listenToQueue(queueName: string): Promise<amqp.Channel> {
  const { connection, channel } = await connectRabbitMQ();
  try {
    await channel.assertQueue(queueName, { durable: false });
    console.log(`Listening to queue: ${queueName}`);
    return channel;
  } catch (error) {
    console.error("Error setting up queue listener:", error);
    await connection.close();
    throw error;
  }
}
