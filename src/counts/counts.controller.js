const counts = require("../data/counts-data");

// VALIDATION MIDDLEWARE ====================================================================================
// VALIDATION MIDDLEWARE ====================================================================================
// VALIDATION MIDDLEWARE ====================================================================================

// Check if flip exists
const countExists = (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next({ status: 404, message: `Count id not found: ${countId}` });
  }

  //   if found set the response.locals.count to foundCount so it is accessible on the response chain of middleware
  res.locals.count = foundCount;
  return next();
};

// RESOURCES RESPONSES ====================================================================================
// RESOURCES RESPONSES ====================================================================================
// RESOURCES RESPONSES ====================================================================================

const list = (req, res) => {
  res.json({ data: counts });
};

const read = (req, res, next) => {
  res.json({ data: res.locals.count }); // Return a JSON object, not a number.
};

module.exports = { list, read: [countExists, read] };
