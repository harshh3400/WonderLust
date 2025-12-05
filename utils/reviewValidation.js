const Joi = require("joi");

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required(),
});

function validateReview(req, res, next) {
  if (!req.body.review) {
    return res.status(400).send("Review data is required");
  }
  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
}

module.exports = validateReview;
