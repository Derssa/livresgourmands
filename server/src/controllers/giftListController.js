const GiftLists = require("../models/giftListModel");

async function createGiftList(req, res) {
  const { title, description } = req.body || {};
  if (!title) return res.status(400).json({ message: "title is required" });

  const giftList = await GiftLists.createGiftList({
    userId: req.user.id,
    title,
    description,
  });
  res.status(201).json(giftList);
}

async function getGiftListByCode(req, res) {
  const { shareCode } = req.params;
  const giftList = await GiftLists.getGiftListByCode(shareCode);
  if (!giftList)
    return res.status(404).json({ message: "Gift list not found" });

  const items = await GiftLists.getGiftListItems(giftList.id);
  res.json({ ...giftList, items });
}

async function getMyGiftLists(req, res) {
  const giftLists = await GiftLists.getUserGiftLists(req.user.id);
  res.json(giftLists);
}

async function addItem(req, res) {
  const { giftListId, bookId, quantity } = req.body || {};
  if (!giftListId || !bookId) {
    return res
      .status(400)
      .json({ message: "giftListId and bookId are required" });
  }

  const item = await GiftLists.addItemToGiftList({
    giftListId,
    bookId,
    quantity,
  });
  res.status(201).json(item);
}

async function removeItem(req, res) {
  const { giftListId, bookId } = req.params;
  await GiftLists.removeItemFromGiftList(giftListId, bookId);
  res.status(204).end();
}

async function purchaseFromGiftList(req, res) {
  const { shareCode } = req.params;
  const { bookId, quantity } = req.body || {};

  if (!bookId) return res.status(400).json({ message: "bookId is required" });

  const giftList = await GiftLists.getGiftListByCode(shareCode);
  if (!giftList)
    return res.status(404).json({ message: "Gift list not found" });

  const purchase = await GiftLists.recordGiftPurchase({
    giftListId: giftList.id,
    buyerUserId: req.user.id,
    bookId,
    quantity: quantity || 1,
  });

  res.status(201).json(purchase);
}

module.exports = {
  createGiftList,
  getGiftListByCode,
  getMyGiftLists,
  addItem,
  removeItem,
  purchaseFromGiftList,
};
