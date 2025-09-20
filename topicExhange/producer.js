import amqp from "amqplib";

async function produce(routingKey, message) {
  try {
    // connect
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "Notification-exchange";

    // declare exchange
    await channel.assertExchange(exchange, "topic", { durable: false });

    // publish the message
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: false } 
    );

    console.log(`✅ Sent message to "${routingKey}":`, message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("❌ Producer error:", error);
  }
}


produce("order.*", { userId: "N123", status:"confirmed"});
produce("payment*", { userId: "S456", status:"confirmed"});
