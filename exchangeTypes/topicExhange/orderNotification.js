import amqp from "amqplib";


async function consumeOrderNotifications() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const queue = "order-queue"
        const exchange = "Notification-exchange";


        await channel.assertExchange(exchange, "topic", { durable: false });


        await channel.assertQueue(queue , {durable:false});

        await channel.bindQueue(queue , exchange , "order.*");

        console.log("waiting in consume order notification")

        channel.consume(queue , (m)=>{
            if(m){
                const msg = JSON.parse(m.content.toString());
                console.log("order notification sent : " , msg);
                channel.ack(m);
            }
            else{
                console.log("no message recived");
            }
        })



    } catch (error) {
        console.log(error)
    }
}


consumeOrderNotifications();