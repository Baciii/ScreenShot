const puppeteer = require("puppeteer");

const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const { Kafka, Partitioners } = require("kafkajs");

const { getTaskByID } = require("../mongo");
const { cookieFilter } = require("./cookie/cookieFilter");
const { mongoConnect } = require("./mongo/mongoConnect");
const { cookieSet } = require("../cookie");

const {
  KAFKA_CONSUMER_TOPIE,
  KAFKA_PRODUCER_TOPIE,
  KAFKA_CLIENT_ID1,
  KAFKA_URL,
} = require("../config/config.default");

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
/*---------- kafka消费者进程 ----------*/
(async () => {
  console.log("---------- Begin ----------");
  await mongoConnect();

  const kafka = new Kafka({
    clientId: "consumer1",
    brokers: [KAFKA_URL],
  });
  const consumer = kafka.consumer({ groupId: "test-group3" });
  await consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_CONSUMER_TOPIE,
    fromBeginning: true,
  });

  /* ---------- ScreenShot ---------- */
  const Shot = async (id) => {
    console.log("---------- ScreenShot ----------");
    const task = await getTaskByID(id.id);

    const url = task.url;
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
    console.log("---------- Skiped ----------");
    for (let index = 0; index < n; index++) {
      try {
        await page.goto(url[index].before);
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
        path: `src/image/before${index}.png`,
        fullPage: true,
      });
    }

    await browser.close();
    console.log("--------- Done ----------");
  };

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("SHOT");
      Shot(JSON.parse(message.value.toString()));
    },
  });
})();
