const flips = require("../data/flips-data");

const list = (req, res) => {
  res.json({ data: flips });
};

module.exports = { list };
