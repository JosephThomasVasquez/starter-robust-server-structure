const flips = require("../data/flips-data");
const counts = require("../data/counts-data");

// VALIDATION MIDDLEWARE ====================================================================================
// VALIDATION MIDDLEWARE ====================================================================================
// VALIDATION MIDDLEWARE ====================================================================================

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

// check if result is valid
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

// Check if flip exists
const flipExists = (req, res, next) => {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  if (foundFlip) {
    //   if found set the response.locals.flip to the foundFlip so it is accessible on the response chain of middleware
    res.locals.flip = foundFlip;
    return next();
  }
  next({
    status: 404,
    message: `Flip id not found: ${flipId}`,
  });
};

// find the larget flip.id number so the new flip.id is set to 1 number higher
let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

// RESOURCES RESPONSES ====================================================================================
// RESOURCES RESPONSES ====================================================================================
// RESOURCES RESPONSES ====================================================================================

// GET flips
const list = (req, res) => {
  const { countId } = req.params;
  const byResult = countId ? (flip) => flip.result === countId : () => true;
  res.json({ data: flips.filter(byResult) });
};

// POST create flip
const create = (req, res) => {
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

// GET flip.id
const read = (req, res) => {
  // send the res.locals.flip response which was received from the flipExists() middlweare
  res.json({ data: res.locals.flip });
};

// PUT update flip
const update = (req, res) => {
  // get the flip from response.locals.flip which was received from flipExists() middlweare
  const flip = res.locals.flip;

  //   set foundFlip.result to a variable
  const originalResult = flip.result;

  const { data: { result } = {} } = req.body;

  //   check if original result is not equal to result
  if (originalResult !== result) {
    // update the original flip.result to the new result value
    flip.result = result;

    // update the counts by removing 1 from the previous result and adding 1 to the new result
    counts[originalResult] = counts[originalResult] - 1;
    counts[result] = counts[result] + 1;
  }

  res.json({ data: foundFlip });
};

// DELETE flip.id
const destroy = (req, res) => {
  const { flipId } = req.params;
  const index = flips.findIndex((flip) => flip.id === Number(flipId));
  // `splice()` returns an array of the deleted elements, even if it is one element
  const deletedFlips = flips.splice(index, 1);
  console.log("deletedFlips:", deletedFlips);
  deletedFlips.forEach(
    (deletedFlip) =>
      (counts[deletedFlip.result] = counts[deletedFlip.result] - 1)
  );

  res.sendStatus(204);
};

module.exports = {
  list,
  read: [flipExists, read],
  create: [bodyHasResultProperty, resultPropertyIsValid, create],
  update: [flipExists, bodyHasResultProperty, resultPropertyIsValid, update],
  destroy: [flipExists, destroy],
};
