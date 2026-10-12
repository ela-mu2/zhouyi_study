const express = require("express");
const controller = require("../controllers/userController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", auth.authenticate, controller.getProfile);
router.put("/profile", auth.authenticate, controller.updateProfile);
router.get("/favorites", auth.authenticate, controller.getFavorites);
router.post("/favorites/:id", auth.authenticate, controller.addFavorite);
router.delete("/favorites/:id", auth.authenticate, controller.removeFavorite);

module.exports = router;
