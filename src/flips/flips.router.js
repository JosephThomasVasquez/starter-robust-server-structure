const router = require("express").Router();
const controller = require("./flips.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//  GET method, POST method: attach controller.list and controller.create to router.
// /flips
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

//  GET method, PUT method: attach controller.list and controller.create to router.
// /:flipId
router
  .route("/:flipId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.destroy)
  .all(methodNotAllowed);

module.exports = router;
