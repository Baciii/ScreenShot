const { mongoConnect } = require("./mongo/index");
const { kafkaConnect } = require("./kafka/index");
const { Shot } = require("./Shot");
const {
  KAFKA_CONSUMER_TOPIC,
  KAFKA_CLIENT_ID1,
  KAFKA_CLIENT_ID2,
  KAFKA_PRODUCER_BROKERS,
  KAFKA_CONSUMER_TOPIC2,
} = require("./config/config.default");

/*---------- kafka消费者进程 ----------*/
(async () => {
  await mongoConnect();
  console.log("---------- FIRSTSHOT READY ----------");
  const kafka = kafkaConnect(KAFKA_CLIENT_ID1, KAFKA_PRODUCER_BROKERS);
  const consumer = kafka.consumer({
    groupId: "firstShot-group",
    sessionTimeout: 1000 * 60 * 10,
  });
  await consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_CONSUMER_TOPIC,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // const task = await getTaskByID(JSON.parse(message.value.toString()).id);
      // console.log("task", task);
      console.log(JSON.parse(message.value.toString()));
      await Shot(JSON.parse(message.value.toString()), 1);
    },
  });
})();

(async () => {
  await mongoConnect();
  console.log("---------- SECONDSHOT READY ----------");
  const kafka = kafkaConnect(KAFKA_CLIENT_ID2, KAFKA_PRODUCER_BROKERS);
  const consumer = kafka.consumer({
    groupId: "secondShot-group",
    sessionTimeout: 1000 * 60 * 10,
  });
  await consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_CONSUMER_TOPIC2,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("message id:", data.id);
      await Shot(data, 2);
    },
  });
})();
