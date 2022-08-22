const puppeteer = require("puppeteer");
var hiff = require("hiff");
const { cookieFilter } = require("../cookie/index");

const Shot = async () => {
  const browser = await puppeteer.launch({
    bindAddress: "0.0.0.0",
    // headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 3000,
  });
  const cookie = [
    {
      domain: "qapm.qq.com",
      expirationDate: 1661325825.033596,
      hostOnly: true,
      httpOnly: false,
      name: "athena_token",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value:
        '"UVE6OjEzRDI2QkE4QURBODhBMTkzN0M1MzdGRDlBRjJDOTZGfHwxNjYxMzI1ODI3NTkyMDg1MDgwNzE0ZTI1NGJiMDZkYjgxYWIyNDk1NGQwMDA0N2QyOA=="',
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.669548,
      hostOnly: false,
      httpOnly: false,
      name: "wxunionid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "",
    },
    {
      domain: ".qq.com",
      expirationDate: 1926259865,
      hostOnly: false,
      httpOnly: false,
      name: "tvfe_boss_uuid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "d06518acb2b2dc15",
    },
    {
      domain: ".qq.com",
      expirationDate: 1692022231,
      hostOnly: false,
      httpOnly: false,
      name: "LW_sid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "g1C6h6R0W4A8q6Q283H1N1A644",
    },
    {
      domain: ".qq.com",
      expirationDate: 1695103235.715619,
      hostOnly: false,
      httpOnly: false,
      name: "o_cookie",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "2927370445",
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.669562,
      hostOnly: false,
      httpOnly: false,
      name: "tmeLoginType",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "2",
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.669649,
      hostOnly: false,
      httpOnly: false,
      name: "euin",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "oKcAoK-koi-s7z**",
    },
    {
      domain: ".qq.com",
      expirationDate: 1690023792,
      hostOnly: false,
      httpOnly: false,
      name: "uin_cookie",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "o2927370445",
    },
    {
      domain: ".qq.com",
      expirationDate: 1682863983.397633,
      hostOnly: false,
      httpOnly: true,
      name: "_tc_unionid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "01a77c60-2389-4e58-b2b4-12df6140df67",
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.669436,
      hostOnly: false,
      httpOnly: false,
      name: "wxrefresh_token",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "",
    },
    {
      domain: ".qq.com",
      expirationDate: 2147483647.44892,
      hostOnly: false,
      httpOnly: false,
      name: "RK",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "Vur1/tsCFH",
    },
    {
      domain: ".qq.com",
      expirationDate: 1692117330.959154,
      hostOnly: false,
      httpOnly: true,
      name: "ied_qq",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "o1821253267",
    },
    {
      domain: ".qq.com",
      expirationDate: 1677417128,
      hostOnly: false,
      httpOnly: false,
      name: "Qs_lvt_323937",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "1607948769%2C1607948776%2C1612280544%2C1626889190%2C1645881128",
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.669589,
      hostOnly: false,
      httpOnly: false,
      name: "psrf_qqrefresh_token",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "40C14B4A8F8FB2A8435D492BDA3B5ED9",
    },
    {
      domain: "qapm.qq.com",
      expirationDate: 1661325825.033489,
      hostOnly: true,
      httpOnly: false,
      name: "user_id",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: '"QQ::13D26BA8ADA88A1937C537FD9AF2C96F"',
    },
    {
      domain: ".qq.com",
      expirationDate: 1695141330.848576,
      hostOnly: false,
      httpOnly: false,
      name: "pgv_pvid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "8994037597",
    },
    {
      domain: ".qq.com",
      expirationDate: 2147385600,
      hostOnly: false,
      httpOnly: false,
      name: "pvid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "4272404170",
    },
    {
      domain: ".qq.com",
      expirationDate: 1677417128,
      hostOnly: false,
      httpOnly: false,
      name: "Qs_pv_323937",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value:
        "3606127120694701000%2C4013697640479389000%2C1446306594607030300%2C2496023195698114600%2C3977776060893246500",
    },
    {
      domain: ".qq.com",
      expirationDate: 1663310419,
      hostOnly: false,
      httpOnly: false,
      name: "ptui_loginuin",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "2927370445",
    },
    {
      domain: ".qq.com",
      expirationDate: 1689672211,
      hostOnly: false,
      httpOnly: false,
      name: "_clck",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "17tfaj9|1|f39|0",
    },
    {
      domain: ".qq.com",
      expirationDate: 1694846346.756621,
      hostOnly: false,
      httpOnly: false,
      name: "_ga",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "GA1.2.63539784.1660049319",
    },
    {
      domain: ".qq.com",
      expirationDate: 1661262780,
      hostOnly: false,
      httpOnly: false,
      name: "ariaDefaultTheme",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "undefined",
    },
    {
      domain: ".qq.com",
      expirationDate: 1671039724,
      hostOnly: false,
      httpOnly: false,
      name: "eas_sid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "d1W6b3x9w5C0C337f2p4s675B5",
    },
    {
      domain: ".qq.com",
      expirationDate: 2147385600,
      hostOnly: false,
      httpOnly: false,
      name: "fqm_pvqid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "3ee7b24f-4e0d-459f-bf92-69b5b20c6049",
    },
    {
      domain: ".qq.com",
      expirationDate: 1694958780.279229,
      hostOnly: false,
      httpOnly: false,
      name: "iip",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "0",
    },
    {
      domain: ".qq.com",
      expirationDate: 1679152961,
      hostOnly: false,
      httpOnly: false,
      name: "LW_uid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "S1B6F467H681N6L9F6m1A2S6u1",
    },
    {
      domain: "qapm.qq.com",
      hostOnly: true,
      httpOnly: false,
      name: "p_id",
      path: "/",
      sameSite: null,
      secure: false,
      session: true,
      storeId: null,
      value: "7706",
    },
    {
      domain: ".qq.com",
      expirationDate: 1695103236.051115,
      hostOnly: false,
      httpOnly: false,
      name: "pac_uid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "1_1821253267",
    },
    {
      domain: ".qq.com",
      expirationDate: 2147385600,
      hostOnly: false,
      httpOnly: false,
      name: "pgv_pvi",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "6181532672",
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.66951,
      hostOnly: false,
      httpOnly: false,
      name: "psrf_access_token_expiresAt",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "1660913064",
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.669533,
      hostOnly: false,
      httpOnly: false,
      name: "psrf_qqaccess_token",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "10BE8D512B0CD60F1BE1B1FA1B7EF5BC",
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.669679,
      hostOnly: false,
      httpOnly: false,
      name: "psrf_qqopenid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "D13386F26498A722ABD59918C32E1A16",
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.669603,
      hostOnly: false,
      httpOnly: false,
      name: "psrf_qqunionid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "3CCBF0FF7B0DDB98F1BAB446A92DB652",
    },
    {
      domain: ".qq.com",
      expirationDate: 1695281023.175624,
      hostOnly: false,
      httpOnly: false,
      name: "ptcz",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "e9e3f38c17e052b305ad9556e62fdb8ec5120d7fc46196992e74480b238b7287",
    },
    {
      domain: "qapm.qq.com",
      expirationDate: 1661325825.033625,
      hostOnly: true,
      httpOnly: false,
      name: "token",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value:
        '"UVE6OjEzRDI2QkE4QURBODhBMTkzN0M1MzdGRDlBRjJDOTZGfHwxNjYxMzI1ODI3ODM4ODk4NTg3ODM4ZDJjYmZlYmQ2MmJjZWJiMmZiNmQ2MmRjNGQzNg=="',
    },
    {
      domain: "qapm.qq.com",
      expirationDate: 1661325825.03364,
      hostOnly: true,
      httpOnly: false,
      name: "user_name",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "13D26BA8ADA88A1937C537FD9AF2C96F",
    },
    {
      domain: "qapm.qq.com",
      expirationDate: 1661325825.033612,
      hostOnly: true,
      httpOnly: false,
      name: "user_nick",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "JTIzQmFjaWlpJUMyJUIw",
    },
    {
      domain: "qapm.qq.com",
      expirationDate: 1661325825.033578,
      hostOnly: true,
      httpOnly: false,
      name: "user_type",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "QQ",
    },
    {
      domain: ".qq.com",
      expirationDate: 1660913064.669617,
      hostOnly: false,
      httpOnly: false,
      name: "wxopenid",
      path: "/",
      sameSite: null,
      secure: false,
      session: false,
      storeId: null,
      value: "",
    },
  ];
  await cookieFilter(cookie);
  await page.setCookie(...cookie);
  await page.goto("https://cn.vuejs.org/");
  await page.waitForTimeout(5000);

  // await page.$$eval(
  //   ".t-button.t-button--theme-primary.t-button--variant-base",
  //   (elements) => {
  //     let eles = [];
  //     elements.forEach(function (item, index) {
  //       item.click();
  //     });
  //     return eles;
  //   }
  // );
  await page.waitForTimeout(10000);

  let a = await page.$eval("#app", (elements) => {
    let eles = elements.innerHTML;
    return eles;
  });
  await page.goto("https://cn.vuejs.org/");
  await page.waitForTimeout(5000);

  // await page.$$eval(
  //   ".t-button.t-button--theme-primary.t-button--variant-base",
  //   (elements) => {
  //     let eles = [];
  //     elements.forEach(function (item, index) {
  //       item.click();
  //     });
  //     return eles;
  //   }
  // );
  await page.waitForTimeout(10000);

  let b = await page.$eval("#app", (elements) => {
    let eles = elements.innerHTML;
    return eles;
  });

  var result = hiff.compare(a, b, {
    tagComparison: { name: 1, id: 1, attributes: 1, contents: 1 },
  });

  let changes = [];

  if (result.different) {
    console.log("HTML fragments are different, changes:");
    result.changes.map(function (change) {
      console.log(
        "In node " + change.before.parentPath + ":\n\t" + change.message
      );
      changes.push(change.before.parentPath);
    });
  } else {
    console.log("No changes found.");
  }

  // changes.forEach(async (item, index) => {
  //   const ele = await page.$(item);
  //   // console.log(ele.innerHTML);
  //   await page.evaluate((e) => {
  //     try {
  //       e.style.opacity = 0.2;
  //     } catch {
  //       console.log("pass");
  //     }
  //   }, ele);
  // });

  // const zxc = await page.$(".pop.active");
  // await page.evaluate((e) => {
  //   e.style.opacity = 0;
  // }, zxc);

  const standardLinks = await page.evaluate(() => {
    const els = [...document.querySelectorAll("a[href*='//']")];
    return els.map((el) => {
      return el.href.trim();
    });
  });
  console.log("standard:", standardLinks);
  const badLinks = []; // 死链集合
  for (const link of standardLinks) {
    console.log(link);
    const res = await page.goto(link);
    try {
      console.log(res._status);
      const status = res.status();
      if (status >= 400) {
        // 针对用户不可正常访问的链接认为是死链
        badLinks.push(link);
      }
    } catch (e) {
      console.log(e);
    }
  }
  console.log("bad:", badLinks);

  changes.forEach(async (ele) => {
    await page.$eval(ele, (e) => {
      e.style.opacity = 0;
    });
  });

  await page.waitForTimeout(10000);
  await page.screenshot({
    path: "src/diff3.png",
    fullPage: true,
  });
  await browser.close();
};
Shot();
