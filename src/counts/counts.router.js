const router = require("express").Router();
const controller = require("./counts.controller");

//  GET method: attach controller.list to router.
router.route("/").get(controller.list);

module.exports = router;
