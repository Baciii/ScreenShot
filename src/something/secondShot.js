const puppeteer = require("puppeteer");
const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const { Kafka, Partitioners } = require("kafkajs");
const sizeOf = require("image-size");
const { v4: uuidv4 } = require("uuid");

const { uploadFile } = require("./COS");
const { getTaskByID, addNewTask, updateTask } = require("./mongo");
const { cookieFilter } = require("./cookie/cookieFilter");
const { mongoConnect } = require("./mongo/mongoConnect");
const { cookieSet } = require("./cookie");

const {
  KAFKA_CONSUMER_TOPIE2,
  KAFKA_PRODUCER_TOPIE2,
  COS_ID,
  COS_KEY,
  COS_BUCKET,
  COS_REGION,
  KAFKA_URL,
} = require("./config/config.default");

//懒加载
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 200;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

(async () => {
  await mongoConnect();
  const kafka = new Kafka({
    clientId: "consumer1",
    brokers: [KAFKA_URL],
  });
  const cos = new COS({
    SecretId: COS_ID,
    SecretKey: COS_KEY,
  });
  const consumer = kafka.consumer({ groupId: "secondShot-group" });
  await consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_CONSUMER_TOPIE2,
    fromBeginning: true,
  });

  async function uploadFile([Bucket, Region, key], path) {
    return await new Promise((resolve) => {
      cos.putObject(
        {
          Bucket: Bucket,
          Region: Region,
          Key: key,
          StorageClass: "STANDARD",
          Body: fs.createReadStream(path),
        },
        function (err, data) {
          resolve(err || data.Location);
        }
      );
    });
  }

  const producer = async (d) => {
    console.log("---------- Upload ----------");

    const kafka = new Kafka({
      clientId: "secondShotProducer",
      brokers: ["134.175.215.182:9094"],
    });
    const producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    await producer.connect();

    let screenShotResult = [];

    const task = await getTaskByID(d.id);
    const len = task.url.length;

    const option = task.options;
    console.log("task", task);
    console.log("options:", option);
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

    for (let i = 0; i < len; i++) {
      console.log(`---------- PICTURE ${i} ----------`);
      /* 检测前后图片尺寸是否匹配 */
      const dimensionsBefore = sizeOf(`src/image/before${i}.png`);
      const dimensionsAfter = sizeOf(`src/image/after${i}.png`);
      const BeforeHeight = dimensionsBefore.height;
      const BeforeWidth = dimensionsBefore.width;
      const AfterHeight = dimensionsAfter.height;
      const AfterWidth = dimensionsAfter.width;

      const options1 = pixelMatch_DiffPercentThreshold / (BeforeHeight / 1080);
      const options2 = shiftJudge_rateThreshold / (BeforeHeight / 1080);

      console.log("BeforeHeight:", BeforeHeight, "BeforeWidth:", BeforeWidth);
      console.log("AfterHeight:", AfterHeight, "AfterWidth:", AfterWidth);
      let match = true;
      if (BeforeHeight !== AfterHeight || BeforeWidth !== AfterWidth) {
        match = false;
      }

      let uuid = uuidv4();
      let beforeImage = await uploadFile(
        [COS_BUCKET, COS_REGION, `${uuid}/before`],
        `src/image/before${i}.png`
      );
      let afterImage = await uploadFile(
        [COS_BUCKET, COS_REGION, `${uuid}/after`],
        `src/image/after${i}.png`
      );

      const item = {
        beforeImage,
        afterImage,
        beforeUrl: task.url[i].before,
        afterUrl: task.url[i].after,
        uuid,
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

    console.log("COS Upload Result", screenShotResult);
    console.log("---------- Upload Done ----------");
    const inf = {
      status: 5,
      screenShotResult,
    };
    task.set(inf);
    await task.save();

    console.log("Send ID", d.id);
    await producer.send({
      topic: "toImageDiffPod",
      messages: [
        {
          value: d.id,
        },
      ],
    });

    await producer.disconnect();
    console.log("---------- Kafka Done ----------");
  };

  const Shot = async (data) => {
    console.log("---------- Shot ----------");
    console.log(data.id);
    const task = await getTaskByID(data.id);
    console.log("task", task);
    const url = task.url;
    console.log("url", url);

    const className = task.classname;
    const idName = task.btnId;
    const enableButton = task.enableButton;

    const cookie = await cookieSet(task.cookie, url[0].before);

    const browser = await puppeteer.launch({
      bindAddress: "0.0.0.0",
      args: [
        "--headless",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--remote-debugging-port=9222",
        "--remote-debugging-address=0.0.0.0",
      ],
      headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 3000,
    });

    let CLASS = undefined;
    let ID = undefined;
    if (className !== "") {
      CLASS = "." + className.join(".");
    }
    if (!idName == "") {
      ID = "#" + idName;
    }
    await cookieFilter(cookie);
    await page.setCookie(...cookie);

    const n = url.length;
    for (let index = 0; index < n; index++) {
      try {
        await page.goto(url[index].after);
      } catch (e) {
        console.log(e);
      }

      await page.waitForTimeout(5000);
      console.log(enableButton);
      console.log("ID", ID, "CLASS", CLASS);
      if (enableButton) {
        if (ID) {
          await page.$$eval(ID, (elements) => {
            let eles = [];
            elements.forEach(function (item, index) {
              if (true) {
                item.click();
              }
            });
            return eles;
          });
        }
        if (CLASS) {
          await page.$$eval(CLASS, (elements) => {
            let eles = [];
            elements.forEach(function (item, index) {
              if (true) {
                item.click();
              }
            });
            return eles;
          });
        }
      }

      await page.waitForTimeout(1000);
      await page.screenshot({
        path: `src/image/after${index}.png`,
        fullPage: true,
      });
    }
    await browser.close();
    console.log("---------- Shot Done ----------");
    await producer(data);
  };

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("data:", data);
      console.log("message id:", data.id);
      Shot(data);
    },
  });
})();
