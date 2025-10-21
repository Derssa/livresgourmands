const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
  apiVersion: "2024-06-20",
});

async function createCheckoutSession(req, res) {
  const {
    items,
    successUrl,
    cancelUrl,
    isGift = false,
    giftRecipientName,
    giftRecipientEmail,
    giftMessage,
  } = req.body || {};

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ message: "items required" });

  const line_items = items.map((i) => ({
    price_data: {
      currency: "cad",
      product_data: { name: i.title },
      unit_amount: Math.round(Number(i.price) * 100),
    },
    quantity: Number(i.quantity || 1),
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url:
      successUrl ||
      "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: cancelUrl || "http://localhost:3000/cancel",
    metadata: {
      userId: req.user.id,
      isGift: isGift.toString(),
      giftRecipientName: giftRecipientName || "",
      giftRecipientEmail: giftRecipientEmail || "",
      giftMessage: giftMessage || "",
      items: JSON.stringify(items),
    },
  });
  res.json({ id: session.id, url: session.url });
}

async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const {
        userId,
        isGift,
        giftRecipientName,
        giftRecipientEmail,
        giftMessage,
        items,
      } = session.metadata;

      // Create order
      const Orders = require("../models/orderModel");
      const order = await Orders.createOrder({
        userId: parseInt(userId),
        total: session.amount_total / 100,
        status: "PAID",
        paymentMode: session.payment_method_types[0],
        isGift: isGift === "true",
        giftRecipientName: giftRecipientName || null,
        giftRecipientEmail: giftRecipientEmail || null,
        giftMessage: giftMessage || null,
      });

      // Create order items
      const pool = require("../config/db");
      const itemsData = JSON.parse(items);
      for (const item of itemsData) {
        await pool.query(
          "INSERT INTO order_items (order_id, book_id, quantity, price_each) VALUES (?, ?, ?, ?)",
          [order.id, item.bookId, item.quantity, item.price]
        );
      }

      // Create gift redemption tokens and email if it's a gift
      if (isGift === "true" && giftRecipientEmail) {
        const Gifts = require("../models/giftRedemptionModel");
        for (const item of itemsData) {
          const { token } = await Gifts.createRedemption({
            orderId: order.id,
            bookId: item.bookId,
            recipientEmail: giftRecipientEmail,
          });
          // TODO: send email to giftRecipientEmail with link to redeem: https://yourapp/gift/redeem?t=${token}
        }
      }
      break;
    default:
      break;
  }
  res.json({ received: true });
}

module.exports = { createCheckoutSession, stripeWebhook };
