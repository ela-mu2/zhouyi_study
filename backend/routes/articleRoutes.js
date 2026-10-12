const express = require("express");
const controller = require("../controllers/articleController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", auth.authenticate, auth.requireAdmin, controller.create);
router.put("/:id", auth.authenticate, auth.requireAdmin, controller.update);
router.delete("/:id", auth.authenticate, auth.requireAdmin, controller.remove);

module.exports = router;
