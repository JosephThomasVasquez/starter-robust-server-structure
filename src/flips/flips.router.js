const router = require("express").Router();
const controller = require("./flips.controller");

//  GET method, POST method: attach controller.list and controller.create to router.
// /flips
router.route("/").get(controller.list).post(controller.create);

//  GET method, PUT method: attach controller.list and controller.create to router.
// /:flipId
router
  .route("/:flipId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.destroy);

module.exports = router;
