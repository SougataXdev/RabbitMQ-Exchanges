import amqp from "amqplib";

async function sendEmail() {
  try {
    // 1. Connect
    const connection = await amqp.connect("amqp://localhost");

    // 2. Create ConfirmChannel 
    const channel = await connection.createConfirmChannel();

    const exchange = "mail-exchange";
    const N_user_routingKey = "send-mail";
    const S_user_routingKey = "send-s-mail";
    const N_queue = "N_mail-queue";
    const S_queue = "S_mail-queue";

    const message = {
      to: "normaluser@gmail.com",
      from: "dev@gmail.com",
      sub: "normal mail",
      body: "hello from rabbitmq",
    };

    const message2 = {
      to: "subscribeduseruser@gmail.com",
      from: "dev@gmail.com",
      sub: "subscribed user mail",
      body: "hello from rabbitmq",
    };

    // 3. Assert exchange & queues
    await channel.assertExchange(exchange, "direct", { durable:false });
    await channel.assertQueue(N_queue, { durable: false});
    await channel.assertQueue(S_queue, { durable: false});

    await channel.bindQueue(N_queue, exchange, N_user_routingKey);
    await channel.bindQueue(S_queue, exchange, S_user_routingKey);

    // 4. Publish first message → normal users
    channel.publish(
      exchange,
      N_user_routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
      (err, ok) => {
        if (err) {
          console.error("Message publish failed:", err);
        } else {
          console.log("Mail data sent to NORMAL queue:", message);
        }
      }
    );

    // 5. Publish second message → subscribed users
    channel.publish(
      exchange,
      S_user_routingKey,
      Buffer.from(JSON.stringify(message2)),
      { persistent: true },
      (err, ok) => {
        if (err) {
          console.error("Message publish failed:", err);
        } else {
          console.log("Mail data sent to SUBSCRIBED queue:", message2);
        }
      }
    );

    // 6. Close after a short delay
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error:", error);
  }
}

sendEmail();
