const amqp = require('amqplib');

let channel;

const connect = async () => {
  try {
    console.log("process.env.RABBITMQ_URL", process.env.RABBITMQ_URL)
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('catalog-emit', { durable: true });
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
  }
};

const publishToQueue = async (queueName, message) => {
  try {
    await channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
    console.log(`Message sent to queue ${queueName}`);
  } catch (error) {
    console.error('Error sending message to queue', error);
  }
};

connect();

module.exports = {
  publishToQueue,
};
