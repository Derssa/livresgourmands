const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
  apiVersion: "2024-06-20",
});
const GiftLists = require("../models/giftListModel");

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
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};

      // --- Case 1: Gift list purchase ---
      if (metadata.giftListId && metadata.items) {
        const GiftLists = require("../models/giftListModel");
        let itemsData = [];

        try {
          itemsData = JSON.parse(metadata.items);
        } catch (err) {
          console.error("Failed to parse items metadata:", err);
        }

        for (const item of itemsData) {
          try {
            await GiftLists.recordGiftPurchase({
              giftListId: parseInt(metadata.giftListId),
              buyerUserId: parseInt(metadata.buyerUserId),
              bookId: item.bookId || item.book_id,
              quantity: item.quantity,
            });
          } catch (err) {
            console.error("Failed to record gift list purchase:", item, err);
          }
        }
      }

      // --- Case 2: Simple order (single or multiple items) ---
      else if (metadata.userId) {
        const userId = parseInt(metadata.userId);
        const isGift = metadata.isGift === "true";
        const giftRecipientName = metadata.giftRecipientName || null;
        const giftRecipientEmail = metadata.giftRecipientEmail || null;
        const giftMessage = metadata.giftMessage || null;

        let itemsData = [];
        if (metadata.items) {
          try {
            itemsData = JSON.parse(metadata.items);
          } catch (err) {
            console.error("Failed to parse items metadata:", err);
          }
        }

        const Orders = require("../models/orderModel");
        const order = await Orders.createOrder({
          userId,
          total: (session.amount_total || 0) / 100,
          status: "PAID",
          paymentMode: (session.payment_method_types || ["card"])[0],
          isGift,
          giftRecipientName,
          giftRecipientEmail,
          giftMessage,
        });

        const pool = require("../config/db");

        for (const item of itemsData) {
          try {
            await pool.query(
              "INSERT INTO order_items (order_id, book_id, quantity, price_each) VALUES (?, ?, ?, ?)",
              [order.id, item.bookId, item.quantity, item.price]
            );
          } catch (err) {
            console.error("Failed to insert order item:", item, err);
          }
        }

        // --- Create ONE redemption token per ORDER ---
        if (isGift && giftRecipientEmail) {
          try {
            const Gifts = require("../models/giftRedemptionModel");

            const { token } = await Gifts.createRedemption({
              orderId: order.id,
              recipientEmail: giftRecipientEmail,
            });

            // TODO: send email to giftRecipientEmail (adding email conformation)
            console.log(
              `Gift redemption created for order ${order.id} (token: ${token})`
            );
          } catch (err) {
            console.error("Failed to create gift redemption for order:", err);
          }
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    res.status(500).send(`Webhook failed: ${err.message}`);
  }
}

module.exports = { createCheckoutSession, stripeWebhook };
