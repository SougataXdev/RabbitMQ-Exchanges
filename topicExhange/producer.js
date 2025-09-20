/*
 * TOPIC EXCHANGE - RabbitMQ
 * 
 * DEFINITION:
 * A topic exchange routes messages to queues based on wildcard pattern matching 
 * of routing keys. It provides flexible routing by allowing partial matches using 
 * '*' (single word) and '#' (zero or more words) wildcards.
 * 
 * KEY POINTS:
 * • Uses dot-separated routing keys (e.g., "user.payment.failed")
 * • '*' matches exactly one word (e.g., "*.payment.*" matches "user.payment.success")
 * • '#' matches zero or more words (e.g., "user.#" matches "user", "user.payment", "user.payment.failed")
 * • Enables selective message consumption based on hierarchical patterns
 * • More flexible than direct exchanges, more structured than fanout exchanges
 * 
 * REAL-WORLD APPLICATIONS:
 * 1. LOGGING SYSTEMS: Route logs by severity and service (e.g., "error.auth.#", "warn.database.*")
 * 2. NOTIFICATION SERVICES: Send notifications based on event types (e.g., "user.*.created", "order.#")
 * 3. MICROSERVICES COMMUNICATION: Route events between services (e.g., "payment.success.*", "inventory.#")
 */

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
