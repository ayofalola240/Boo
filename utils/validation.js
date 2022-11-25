const joi = require("joi");

module.exports = {
  getCommentSchema: joi.object({
    filter: joi.string().valid("MBTI", "Enneagram", "Zodiac"),
    sort: joi.string().valid("best", "recent"),
  }),
  createCommentSchema: joi.object({
    title: joi.string(),
    profileID: joi.string(),
    comment: joi.string(),
    personality: joi.array().items({
      type: joi.string(),
      value: joi.string(),
    }),
  }),
};
