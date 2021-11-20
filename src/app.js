const express = require("express");
const app = express();
const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

app.use(express.json());

// TODO: Follow instructions in the checkpoint to implement ths API.

app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next({ status: 404, message: `Count id not found: ${countId}` });
  } else {
    res.json({ data: foundCount }); // Return a JSON object, not a number.
  }
});

app.get("/counts", (req, res, next) => {
  res.json({ data: counts });
});

// /flips/:flips
app.get("/flips/:flipId", (req, res, next) => {
  const { flipId } = req.params;

  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  if (foundFlip) {
    res.json({ data: foundFlip });
  } else {
    next({ status: 404, message: `Flip id not found: ${flipId}` });
  }

  res.json({ data: flips });
});

// /flips GET
app.get("/flips", (req, res) => {
  res.json({ data: flips });
});

// VALIDATION middleware to handleif body contains a result property errors with a status code and error message
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

// find the larget flip.id number so the new flip.id is set to 1 number higher
let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

// /flips POST
app.post("/flips", bodyHasResultProperty, (req, res, next) => {
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
});

// Not found handler
app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  // Set default status code and error message
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
