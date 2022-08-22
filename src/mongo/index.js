const mongoose = require("mongoose");
const { DB_URL_AUTH } = require("../config/config.default");
const schema = new mongoose.Schema({}, { strict: false });
const TaskModel = mongoose.model("task", schema);

module.exports.mongoConnect = async () => {
  mongoose
    .connect(DB_URL_AUTH, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connection Successful");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports.addTask = async (ctx) => {
  try {
    const Task = new TaskModel();
    await Task.save();
    ctx.body = Task._id;
  } catch (error) {
    console.error(error);
  }
};

module.exports.setTask = async (ctx) => {
  try {
    const { _id, cookie, className, idName, option, sign } = ctx.request.body;
    const oldTask = await TaskModel.findById({ _id });
    const newTaskObj = {
      id: _id,
      url: ctx.request.body.url,
      cookie,
      className,
      idName,
      option,
      sign,
      stage: 5,
    };
    oldTask.overwrite(newTaskObj);
    await oldTask.save();
    ctx.body = oldTask;
  } catch (error) {
    console.log(error);
  }
};

module.exports.getTaskByID = async (_id) => {
  return await TaskModel.findById({ _id });
};

module.exports.addNewTask = async (data = {}) => {
  try {
    const Task = new TaskModel(data);
    await Task.save();
    return new Promise((rs) => rs(Task));
  } catch (error) {
    return new Promise((rs, rj) => rj(error));
  }
};

module.exports.updateTask = async (_id, data) => {
  try {
    const oldTask = await TaskModel.findById({ _id });
    oldTask.overwrite(data);
    await oldTask.save();
    return new Promise((rs) => rs(oldTask));
  } catch (error) {
    return new Promise((rs, rj) => rj(error));
  }
};

module.exports.uploadTask = async () => {};
