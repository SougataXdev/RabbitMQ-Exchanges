import amqp from "amqplib";

async function consumePaymentNotifications() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "Notification-exchange";
    const queue = "payment-notification-queue";

    // Declare exchange
    await channel.assertExchange(exchange, "topic", { durable: false });

    // Declare queue
    await channel.assertQueue(queue, { durable: false });

    // Bind queue to exchange with payment routing key pattern
    await channel.bindQueue(queue, exchange, "payment*");

    console.log("Waiting for payment notifications");

    channel.consume(
      queue,
      (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          const routingKey = message.fields.routingKey;
          
          console.log("💳 Received payment notification:");
          console.log(`   Message: ${JSON.stringify(content, null, 2)}`);
          
          // Acknowledge the message
          channel.ack(message);
        }
      },
      { noAck: false }
    );

  } catch (error) {
    console.error("Payment notification consumer error:", error);
  }
}

consumePaymentNotifications();