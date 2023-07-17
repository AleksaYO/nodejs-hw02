const { bodyValidator } = require("../models/contacts");
const httpErr = require("./httpErr");

const validateBody = () => {
  const func = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      next(httpErr(400, "Missing fields"));
    }

    const { error } = await bodyValidator(req.body);

    if (error) {
      const err = error.details[0].path[0];

      next(httpErr(400, `Missing required '${err}' field`));
    }

    next();
  };

  return func;
};

module.exports = validateBody;
