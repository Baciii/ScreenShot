const { mongoConnect, getTaskByID } = require("../mongo/index");
const waitUntilFirstDone = async (id) => {
  mongoConnect();
  return await new Promise((resolve) => {
    const timer = setInterval(async () => {
      let temp = await getTaskByID(id);
      if (temp.status === 3) {
        resolve("FirstShot Done");
      }
    }, 5000);
  });
};
module.exports = { waitUntilFirstDone };
