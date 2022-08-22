/* 域名正则检查 */
const domainCheck = (domain) => {
  let match =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/i;
  return match.test(domain);
};
module.exports = { domainCheck };
