const router = require("express").Router();
const controller = require("./counts.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//  GET method: attach controller.list to router.
router.route("/:countId").get(controller.read).all(methodNotAllowed);
router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
