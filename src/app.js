const express = require("express");
const app = express();

const flipsRouter = require("./flips/flips.router");
const countsRouter = require("./counts/counts.router");

app.use(express.json());

// TODO: Follow instructions in the checkpoint to implement ths API.

// /counts router
app.use("/counts", countsRouter);

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
