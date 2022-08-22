const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const puppeteer = require("puppeteer");
const cookieSet = (cookies, domain) => {
  if (cookies.trim() === "") {
    return {};
  }
  domain = domain.split("/")[2];
  domain = domain.split(".");
  domain = "." + domain[domain.length - 2] + "." + domain[domain.length - 1];
  let c = cookies.split(";").map((pair) => {
    let name = pair.trim().slice(0, pair.trim().indexOf("="));
    let value = pair.trim().slice(pair.trim().indexOf("=") + 1);
    if (name === "" || value === "") {
      name = "null";
      value = "null";
    }
    return { name, value, domain };
  });
  return c;
};
const cookieFilter = async (cookie) => {
  cookie.forEach((item, index) => {
    delete item["hostOnly"];
    delete item["httpOnly"];
    delete item["sameSite"];
    delete item["secure"];
    delete item["session"];
    delete item["storeId"];
    delete item["expirationDate"];
    delete item["Priority"];
  });
};
const test = async () => {
  //   let uuid = uuidv4();
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
    height: 1920,
  });

  let cookie = `pgv_pvi=6181532672; RK=Vur1/tsCFH; ptcz=e9e3f38c17e052b305ad9556e62fdb8ec5120d7fc46196992e74480b238b7287; iip=0; tvfe_boss_uuid=d06518acb2b2dc15; uin_cookie=o2927370445; pvid=4272404170; eas_sid=d1W6b3x9w5C0C337f2p4s675B5; pgv_pvid=8994037597; Qs_lvt_323937=1607948769%2C1607948776%2C1612280544%2C1626889190%2C1645881128; Qs_pv_323937=3606127120694701000%2C4013697640479389000%2C1446306594607030300%2C2496023195698114600%2C3977776060893246500; LW_uid=S1B6F467H681N6L9F6m1A2S6u1; fqm_pvqid=3ee7b24f-4e0d-459f-bf92-69b5b20c6049; _tc_unionid=01a77c60-2389-4e58-b2b4-12df6140df67; wxrefresh_token=; psrf_access_token_expiresAt=1660913064; psrf_qqaccess_token=10BE8D512B0CD60F1BE1B1FA1B7EF5BC; wxunionid=; tmeLoginType=2; psrf_qqrefresh_token=40C14B4A8F8FB2A8435D492BDA3B5ED9; psrf_qqunionid=3CCBF0FF7B0DDB98F1BAB446A92DB652; wxopenid=; euin=oKcAoK-koi-s7z**; psrf_qqopenid=D13386F26498A722ABD59918C32E1A16; o_cookie=2927370445; _clck=17tfaj9|1|f39|0; _ga=GA1.2.63539784.1660049319; ariaDefaultTheme=undefined; ied_qq=o1821253267; LW_sid=g1C6h6R0W4A8q6Q283H1N1A644; pac_uid=1_1821253267; _qpsvr_localtk=0.977399551225065; ptui_loginuin=2927370445; user_id="QQ::13D26BA8ADA88A1937C537FD9AF2C96F"; user_type=QQ; athena_token="UVE6OjEzRDI2QkE4QURBODhBMTkzN0M1MzdGRDlBRjJDOTZGfHwxNjYxMzI1ODI3NTkyMDg1MDgwNzE0ZTI1NGJiMDZkYjgxYWIyNDk1NGQwMDA0N2QyOA=="; user_nick=JTIzQmFjaWlpJUMyJUIw; token="UVE6OjEzRDI2QkE4QURBODhBMTkzN0M1MzdGRDlBRjJDOTZGfHwxNjYxMzI1ODI3ODM4ODk4NTg3ODM4ZDJjYmZlYmQ2MmJjZWJiMmZiNmQ2MmRjNGQzNg=="; user_name=13D26BA8ADA88A1937C537FD9AF2C96F; p_id=7706`;
  cookie = await cookieSet(
    cookie,
    "https://qapm.qq.com/web2/7706/lm-dashboard/"
  );
  await cookieFilter(cookie);
  await page.setCookie(...cookie);
  await page.goto("https://qapm.qq.com/web2/7706/lm-dashboard/");
  //   try {
  //     await page.goto("", {
  //       timeout: 1000 * 60,
  //     });
  //   } catch (e) {
  //     console.log("BROWSER ERROR:", e);
  //     if (fs.existsSync("src/image/ERROR.png")) {
  //       fs.cp("src/image/ERROR.png", `src/image/${uuid}.png`, (err) => {
  //         console.log(err);
  //       });
  //     }
  //   }
  await page.waitForTimeout(5000);

  await page.$$eval(
    ".t-button.t-button--theme-primary.t-button--variant-base",
    (elements) => {
      let eles = [];
      elements.forEach(function (item, index) {
        item.click();
      });
      return eles;
    }
  );
  await page.waitForTimeout(5000);
  await page.screenshot({
    path: `src/image/QAPM.png`,
    fullPage: true,
    type: "png",
  });
  await browser.close();
};
test();
