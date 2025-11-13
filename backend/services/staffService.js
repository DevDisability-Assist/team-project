const db = require("../database/mappers/mapper");

const surveySelect = async (req, res) => {
  let result = await db.query(survey_select, []);
  res.send(result);
};

module.exports = {
  surveySelect,
};
