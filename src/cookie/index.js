const cookieSet = async (cookies, domain) => {
  if (typeof cookies === "string" && cookies.trim() === "") {
    return {};
  }
  if (typeof domain === "string") {
    domain = domain.split("/")[2];
    domain = domain.split(".");
    domain = "." + domain[domain.length - 2] + "." + domain[domain.length - 1];
  }
  let COOKIE = [];
  let temp = cookies.split(";");
  temp.forEach((item) => {
    let name = item.trim().slice(0, item.trim().indexOf("="));
    let value = item.trim().slice(item.trim().indexOf("=") + 1);
    if (name !== "" && value !== "") {
      COOKIE.push({ name, value, domain });
    }
  });
  return COOKIE;
};

const cookieFilter = async (cookie) => {
  cookie.forEach((item) => {
    if (typeof item === "object") {
      delete item["hostOnly"];
      delete item["httpOnly"];
      delete item["sameSite"];
      delete item["secure"];
      delete item["session"];
      delete item["storeId"];
      delete item["expirationDate"];
      delete item["Priority"];
    }
  });
};
module.exports = { cookieSet, cookieFilter };
