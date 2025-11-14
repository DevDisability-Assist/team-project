const db = require("../database/mappers/mapper");

const surveySelect = async (req, res) => {
  console.log("서베이셀렉트 ");
  let result = await db.query("survey_select", []);
  console.log("여기다, ", result);
  res.send(result);
};

module.exports = {
  surveySelect,
};
