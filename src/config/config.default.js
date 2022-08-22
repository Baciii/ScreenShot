//配置.env文件作为全局环境变量
const dotenv = require("dotenv");

dotenv.config();

let DB_URL_AUTH;
if (process.env.MONGO_TYPE == "replicaset") {
  DB_URL_AUTH = `mongodb://root:${process.env.MONGO_ROOT_PASS}@${process.env.MONGO_URL}/shot?authSource=admin&replicaSet=rsName`;
} else {
  DB_URL_AUTH = `mongodb://root:${process.env.MONGO_ROOT_PASS}@${process.env.MONGO_URL}/shot?authSource=admin`;
}

const COS_SECRETID = process.env.COS_SECRETID;
const COS_SECRETKEY = process.env.COS_SECRETKEY;
const COS_BUCKET = process.env.COS_BUCKET;
const COS_REGION = process.env.COS_REGION;

const KAFKA_PRODUCER_BROKERS = process.env.KAFKA_PRODUCER_BROKERS;
const KAFKA_CONSUMER_TOPIC = process.env.TOPIC_BRIDGE0A;
const KAFKA_CONSUMER_TOPIC2 = process.env.TOPIC_BRIDGE0B;
const KAFKA_PRODUCER_TOPIC2 = process.env.TOPIC_BRIDGE1;
const KAFKA_CLIENT_ID1 = process.env.KAFKA_CLIENT_ID1;
const KAFKA_CLIENT_ID2 = process.env.KAFKA_CLIENT_ID2;

module.exports = {
  DB_URL_AUTH,
  COS_SECRETID,
  COS_SECRETKEY,
  COS_BUCKET,
  COS_REGION,
  KAFKA_PRODUCER_BROKERS,
  KAFKA_CONSUMER_TOPIC,
  KAFKA_CONSUMER_TOPIC2,
  KAFKA_PRODUCER_TOPIC2,
  KAFKA_CLIENT_ID1,
  KAFKA_CLIENT_ID2,
};
