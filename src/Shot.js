const puppeteer = require("puppeteer");
const { v4: uuidv4 } = require("uuid");
const { producer } = require("./producer");
const { cookieSet, cookieFilter } = require("./cookie/index");
const { mongoConnect, getTaskByID } = require("./mongo/index");
const { domainCheck } = require("./Reg/index");
const COS = require("cos-nodejs-sdk-v5");
const sizeOf = require("image-size");
const fs = require("fs");
const {
  COS_SECRETID,
  COS_SECRETKEY,
  COS_BUCKET,
  COS_REGION,
} = require("./config/config.default");
const cos = new COS({
  SecretId: COS_SECRETID,
  SecretKey: COS_SECRETKEY,
});

async function uploadFile([Bucket, Region, key], path) {
  return new Promise((resolve) => {
    cos.putObject(
      {
        Bucket: Bucket,
        Region: Region,
        Key: key,
        StorageClass: "STANDARD",
        Body: fs.createReadStream(path),
      },
      (err, data) => {
        resolve(err || data.Location);
      }
    );
  });
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 200;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  });
}

const Shot = async (msg, order) => {
  await mongoConnect();
  console.log(`---------- Shot ${order} ----------`);
  const task = await getTaskByID(msg.id);
  console.log("task", task);
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

  const { url, classname, btnId, enableButton, enableLazyload } = task;
  let CLASS = "";
  let ID = "";
  let COOKIE = {};
  let ENABLEBUTTON = false;
  let LAZYLOAD = false;

  if (typeof enableButton === "boolean") {
    ENABLEBUTTON = enableButton;
  }
  if (Array.isArray(classname) && classname.length > 0) {
    CLASS = "." + classname.join(".");
  }
  if (typeof btnId === "string" && btnId.trim() !== "") {
    ID = "#" + btnId.trim();
  }
  if (typeof task.cookie === "string") {
    COOKIE = await cookieSet(task.cookie, url[0].before);
  }
  if (JSON.stringify(COOKIE) !== "{}") {
    await cookieFilter(COOKIE);
    await page.setCookie(...COOKIE);
  }
  if (enableLazyload && typeof enableLazyload === "boolean") {
    LAZYLOAD = enableLazyload;
  }

  let inf = [];
  const urlNum = url.length;
  console.log("---------- SHOT START ----------");
  for (let index = 0; index < urlNum; index++) {
    let domain =
      order === 1 ? url[index].before.trim() : url[index].after.trim();
    /* 域名正则 */
    if (!domain.trim().toLowerCase().includes("http")) {
      domain = "https://" + domain.trim();
    }
    let timeOut = false;
    try {
      await page.goto(domain, {
        timeout: 1000 * 60,
      });
    } catch (e) {
      console.log("BROWSER ERROR:", e);
      timeOut = true;
      continue;
    }
    console.log("DOMAIN MATCH:", domainCheck(domain));
    if (!domainCheck(domain) || timeOut) {
      if (fs.existsSync("src/image/ERROR.png")) {
        fs.cp(
          "src/image/ERROR.png",
          `src/image/${msg.id}${
            order === 1 ? "-before" : "-after"
          }${index}.png`,
          (err) => {
            console.log(err);
          }
        );
      }
      continue;
    }

    await page.waitForTimeout(5000);
    console.log("ID:", ID, "CLASS:", CLASS);
    if (ENABLEBUTTON) {
      if (ID) {
        await page.$$eval(ID, (elements) => {
          let eles = [];
          elements.forEach((item, index) => {
            item.click();
          });
          return eles;
        });
      }
      if (CLASS) {
        await page.$$eval(CLASS, (elements) => {
          let eles = [];
          elements.forEach((item, index) => {
            item.click();
          });
          return eles;
        });
      }
    }
    if (LAZYLOAD) {
      await autoScroll(page);
    }
    await page.waitForTimeout(10000);
    await page.screenshot({
      path: `src/image/${msg.id}${
        order === 1 ? "-before" : "-after"
      }${index}.png`,
      fullPage: true,
      type: "png",
    });

    const uuid = order === 1 ? uuidv4() : task.shotInfo[index].uuid;
    const Height = sizeOf(
      `src/image/${msg.id}-${order === 1 ? "before" : "after"}${index}.png`
    ).height;
    const Width = sizeOf(
      `src/image/${msg.id}-${order === 1 ? "before" : "after"}${index}.png`
    ).width;
    const Image = await uploadFile(
      [COS_BUCKET, COS_REGION, `${uuid}/${order === 1 ? "before" : "after"}`],
      `src/image/${msg.id}-${order === 1 ? "before" : "after"}${index}.png`
    );
    if (order === 1) {
      inf.push({
        uuid,
        beforeHeight: Height,
        beforeWidth: Width,
        beforeImage: Image,
      });
      if (fs.existsSync(`src/image/${msg.id}-before${index}.png`)) {
        fs.unlinkSync(`src/image/${msg.id}-before${index}.png`);
      }
    } else if (order === 2) {
      const shotInfo = task.shotInfo;
      inf.push({
        uuid,
        beforeHeight: shotInfo[index].beforeHeight,
        beforeWidth: shotInfo[index].beforeWidth,
        beforeImage: shotInfo[index].beforeImage,
        afterHeight: Height,
        afterWidth: Width,
        afterImage: Image,
      });
      if (fs.existsSync(`src/image/${msg.id}-after${index}.png`)) {
        fs.unlinkSync(`src/image/${msg.id}-after${index}.png`);
      }
    }
  }

  await browser.close();
  console.log(`--------- ScreenShot ${order} Done ----------`);
  const info = {
    shotInfo: inf,
  };
  if (order === 1) {
    info.status = 4;
  }
  task.set(info);
  await task.save();

  if (order === 2) {
    console.log("---------- PRODUCER ----------");
    await producer(msg);
  }
};

module.exports = { Shot };
