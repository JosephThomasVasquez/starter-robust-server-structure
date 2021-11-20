const router = require("express").Router();
const controller = require("./flips.controller");

//  GET method: attach controller.list to router.
router.route("/").get(controller.list).post(controller.create);

module.exports = router;
