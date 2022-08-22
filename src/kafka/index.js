const { Kafka, Partitioners } = require("kafkajs");
const kafkaConnect = (clientId, brokers) => {
  return new Kafka({
    clientId: clientId,
    brokers: [brokers],
  });
};
module.exports = { kafkaConnect };
