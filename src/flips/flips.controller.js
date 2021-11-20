const flips = require("../data/flips-data");
const counts = require("../data/counts-data");

// GET flips
const list = (req, res) => {
  res.json({ data: flips });
};

// VALIDATION middleware ====================================================================================
// handle if the body contains a result property errors with a status code and error message
const bodyHasResultProperty = (req, res, next) => {
  // set the value of data to result as an object from req.body
  const { data: { result } = {} } = req.body;
  if (result) {
    return next();
  }
  next({
    status: 400,
    message: "A 'result' property is required.",
  });
};

const resultPropertyIsValid = (req, res, next) => {
  const { data: { result } = {} } = req.body;
  const validResult = ["heads", "tails", "edge"];

  if (validResult.includes(result)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'result' property must be one of ${validResult}. Received: ${result}`,
  });
};

// find the larget flip.id number so the new flip.id is set to 1 number higher
let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

// POST create flip
const create = (req, res, next) => {
  // set the value of data to result as an object from req.body
  const { data: { result } = {} } = req.body;

  // create new flip and increment the id from the lastFlipId
  const newFlip = {
    id: ++lastFlipId,
    result,
  };
  // push newFlip to flips array
  flips.push(newFlip);

  // increment counts
  counts[result] = counts[result] + 1;

  // send response with statuscode 201 created
  res.status(201).json({ data: newFlip });
};

module.exports = {
  list,
  create: [bodyHasResultProperty, resultPropertyIsValid, create],
};
