const express = require("express");
const app = express();
const flips = require("./data/flips-data");
const flipsRouter = require("./flips/flips.router");
const counts = require("./data/counts-data");
const countsRouter = require("./counts/counts.router");

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

// /counts router
app.use("/counts", countsRouter);

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

// /flips router
app.use("/flips", flipsRouter);

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
