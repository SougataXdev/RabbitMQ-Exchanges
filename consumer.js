import amqp from "amqplib";

async function consumer() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const N_queue = "N_mail-queue";
    const S_queue = "S_mail-queue";

    // Ensure both queues exist
    await channel.assertQueue(N_queue, { durable: false });
    await channel.assertQueue(S_queue, { durable: false });

    console.log(`Waiting for messages in ${N_queue} and ${S_queue}...`);

    // Consumer for normal users
    channel.consume(N_queue, (m) => {
      if (m !== null) {
        const msg = JSON.parse(m.content.toString());
        console.log("NORMAL user mail received:", msg);
        channel.ack(m);
      }
    });

    // Consumer for subscribed users
    channel.consume(S_queue, (m) => {
      if (m !== null) {
        const msg = JSON.parse(m.content.toString());
        console.log("SUBSCRIBED user mail received:", msg);
        channel.ack(m);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

consumer();
