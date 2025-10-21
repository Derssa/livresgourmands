const GiftLists = require("../models/giftListModel");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2024-06-20",
});

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
  try {
    const { shareCode } = req.params;

    // Get gift list by share code
    const giftList = await GiftLists.getGiftListByCode(shareCode);
    if (!giftList)
      return res.status(404).json({ message: "Gift list not found" });

    const items = await GiftLists.getGiftListItems(giftList.id);
    if (!items || !items.length)
      return res.status(400).json({ message: "Gift list is empty" });

    // Build Stripe line_items from gift list items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "cad",
        product_data: { name: item.title },
        unit_amount: Math.round(Number(item.price) * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      metadata: {
        giftListId: giftList.id.toString(),
        buyerUserId: req.user.id.toString(),
        items: JSON.stringify(items),
      },
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    // Return session URL to frontend
    res.status(201).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Failed to create Stripe checkout session:", err);
    res.status(500).json({
      message: "Could not create checkout session",
      error: err.message,
    });
  }
}

module.exports = {
  createGiftList,
  getGiftListByCode,
  getMyGiftLists,
  addItem,
  removeItem,
  purchaseFromGiftList,
};
