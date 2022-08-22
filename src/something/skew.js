const puppeteer = require("puppeteer");
const { v4: uuidv4 } = require("uuid");

const Shot = async () => {
  const browser = await puppeteer.launch({
    bindAddress: "0.0.0.0",
    // args: [
    //   "--headless",
    //   "--disable-gpu",
    //   "--disable-dev-shm-usage",
    //   "--remote-debugging-port=9222",
    //   "--remote-debugging-address=0.0.0.0",
    // ],
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 3000,
  });
  await page.goto("https://www.baidu.com");
  await page.waitForTimeout(5000);
  let uuid = uuidv4();
  await page.screenshot({
    path: `./${uuid}.png`,
    fullPage: true,
  });
  await browser.close();
};
const main = async () => {
  await Shot();
  await Shot();
  console.log(1);
};
function x() {
  main();
  console.log(1);
}
x();
