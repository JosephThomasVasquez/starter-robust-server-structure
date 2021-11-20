const counts = require("../data/counts-data");

const list = (req, res) => {
  res.json({ data: counts });
};

module.exports = { list };
