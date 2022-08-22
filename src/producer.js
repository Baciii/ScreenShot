const { Partitioners } = require("kafkajs");
const { kafkaConnect } = require("./kafka/index");
const { getTaskByID } = require("./mongo/index");

const {
  KAFKA_PRODUCER_BROKERS,
  KAFKA_PRODUCER_TOPIC2,
} = require("./config/config.default");

const producer = async (data) => {
  console.log("---------- Upload ----------");

  const kafka = kafkaConnect("secondShotProducer", KAFKA_PRODUCER_BROKERS);
  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();

  const task = await getTaskByID(data.id);

  const len = task.url.length;
  const option = task.options;
  const shotInfo = task.shotInfo;
  console.log("task", task);

  /* option参数初始化 */
  let pixelMatch_DiffPercentThreshold = 1;
  let shiftJudge_rateThreshold = 0.3;

  if (option.pixelMatch_DiffPercentThreshold) {
    pixelMatch_DiffPercentThreshold = option.pixelMatch_DiffPercentThreshold;
  }
  if (option.shiftJudge_rateThreshold) {
    shiftJudge_rateThreshold = option.shiftJudge_rateThreshold;
  }
  console.log(
    "pixelMatch_DiffPercentThreshold",
    pixelMatch_DiffPercentThreshold
  );
  console.log("shiftJudge_rateThreshold", shiftJudge_rateThreshold);

  let screenShotResult = [];
  for (let index = 0; index < len; index++) {
    console.log(`---------- PICTURE ${index} ----------`);
    const { beforeHeight, beforeWidth, afterHeight, afterWidth } =
      shotInfo[index];

    console.log("BeforeHeight:", beforeHeight, "BeforeWidth:", beforeWidth);
    console.log("AfterHeight:", afterHeight, "AfterWidth:", afterWidth);
    let match = true;
    if (beforeHeight !== afterHeight || beforeWidth !== afterWidth) {
      match = false;
    }

    const options1 = pixelMatch_DiffPercentThreshold / (beforeHeight / 1080);
    const options2 = shiftJudge_rateThreshold / (beforeHeight / 1080);

    const item = {
      beforeImage: shotInfo[index].beforeImage,
      afterImage: shotInfo[index].afterImage,
      beforeUrl: task.url[index].before,
      afterUrl: task.url[index].after,
      uuid: shotInfo[index].uuid,
      options: {
        pixelMatch_DiffPercentThreshold: options1,
        shiftJudge_rateThreshold: options2,
      },
    };
    if (!match) {
      item.isNotMatch = true;
    }
    screenShotResult.push(item);
  }
  console.log("COS Upload Result:", screenShotResult);
  console.log("---------- Upload Done ----------");
  const inf = {
    status: 5,
    screenShotResult,
  };
  task.set(inf);
  await task.save();

  console.log("Send ID:", data.id);
  await producer.send({
    topic: KAFKA_PRODUCER_TOPIC2,
    messages: [
      {
        value: data.id,
      },
    ],
  });

  await producer.disconnect();
  console.log("---------- Kafka Done ----------");
};
module.exports = { producer };
