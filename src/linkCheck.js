const standardLinks = await page.evaluate(() => {
  const els = [...document.querySelectorAll("a[href*='//']")];
  return els.map((el) => {
    return el.href.trim();
  });
});
const badLinks = [];
for (const link of standardLinks) {
  const res = await page.goto(link);
  const status = res.status();
  if (status >= 400) {
    badLinks.push(link);
  }
}
