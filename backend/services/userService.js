const mapper = require("../database/mappers/mapper");

const getExpiringNotices = async () => {
  const res = await mapper.query("findExpiringNotices", []);
  return res;
};

const getSurveyToUserWard = async (userName) => {
  const res = await mapper.query("findSurveyToUserWard", userName);
  return res;
};
module.exports = { getExpiringNotices, getSurveyToUserWard };
