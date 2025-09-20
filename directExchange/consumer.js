import amqp from "amqplib";

async function consumeQueue(queueName) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  // Ensure queue exists
  await channel.assertQueue(queueName, { durable: false });

  console.log(`Waiting for messages in ${queueName}...`);

  // Consume messages
  await channel.consume(
    queueName,
    (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log(`${queueName} received:`, message);
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
}

async function consumer() {
  try {
    await Promise.all([consumeQueue("N_mail-queue"), consumeQueue("S_mail-queue")]);
  } catch (error) {
    console.error("Error in consumer:", error);
  }
}

consumer();
