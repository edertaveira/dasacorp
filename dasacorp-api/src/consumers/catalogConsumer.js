const amqp = require("amqplib");

const connectConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("catalog-emit", { durable: true });

    channel.consume("catalog-emit", (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log("Received message:", messageContent);

        // Processar mensagem aqui
        processCatalogChange(messageContent);

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
};

const processCatalogChange = (messageContent) => {
  const { action, product, productId } = messageContent;

  switch (action) {
    case "update":
      // Lógica para processar atualização de produto
      console.log("Processing update:", product);
      break;
    case "delete":
      // Lógica para processar exclusão de produto
      console.log("Processing delete:", productId);
      break;
    default:
      console.log("Unknown action:", action);
  }
};

module.exports = {
  connectConsumer,
  processCatalogChange,
};
