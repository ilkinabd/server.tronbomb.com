const { PUBLIC_PATH } = process.env;

const path = require('path');

const db = require('@db');
const { successRes, errorRes } = require('@utils/res-builder');

const getLanguages = async(_req, res) => {
  const languages = await db.i18n.getLanguages();
  successRes(res, { languages });
};

const getLanguage = async(req, res) => {
  const { language } = req.query;
  const jsonPath = await db.i18n.getPath({ language });
  console.log(jsonPath);
  if (!jsonPath) return errorRes(res, 422, 73412);

  res.sendFile(path.resolve(PUBLIC_PATH + jsonPath));
};

module.exports = {
  getLanguages,
  getLanguage,
};
