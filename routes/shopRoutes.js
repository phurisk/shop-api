const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

router.get("/shops", shopController.getAllShops);
router.get("/shops/:id", shopController.getShopById);
router.post("/shops", shopController.createShop);
router.put("/shops/:id", shopController.updateShop);
router.delete("/shops/:id", shopController.deleteShop);

module.exports = router;