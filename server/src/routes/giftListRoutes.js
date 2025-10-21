const { Router } = require("express");
const GiftLists = require("../controllers/giftListController");
const { authenticateJwt } = require("../middleware/auth");

const router = Router();

// Public: Anyone can view a gift list by share code
router.get("/:shareCode", GiftLists.getGiftListByCode);

// Authenticated users only
router.post("/", authenticateJwt, GiftLists.createGiftList);
router.get("/", authenticateJwt, GiftLists.getMyGiftLists);
router.post("/items", authenticateJwt, GiftLists.addItem);
router.delete(
  "/:giftListId/items/:bookId",
  authenticateJwt,
  GiftLists.removeItem
);
router.post(
  "/:shareCode/purchase",
  authenticateJwt,
  GiftLists.purchaseFromGiftList
);

module.exports = router;
