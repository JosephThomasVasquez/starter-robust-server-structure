const router = require("express").Router();
const controller = require("./counts.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const flipsRouter = require("../flips/flips.router");

//  GET method: attach controller.list to router.
router.route("/:countId").get(controller.read).all(methodNotAllowed);
router.route("/").get(controller.list).all(methodNotAllowed);
router.use("/:countId/flips", controller.countExists, flipsRouter);

module.exports = router;
