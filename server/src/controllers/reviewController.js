const Joi = require("joi");
const Reviews = require("../models/reviewModel");

const reviewSchema = Joi.object({
  bookId: Joi.number().integer().required(),
  rating: Joi.number().min(1).max(5).required(), // assuming rating is 1-5
});

const commentSchema = Joi.object({
  bookId: Joi.number().integer().required(),
  content: Joi.string().trim().min(1).required(),
});

async function postReview(req, res) {
  try {
    const { error, value } = reviewSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const eligible = await Reviews.userPurchasedBook(req.user.id, value.bookId);
    if (!eligible)
      return res.status(403).json({ message: "Only purchasers can review" });

    const r = await Reviews.addReview({ userId: req.user.id, ...value });
    res.status(201).json(r);
  } catch (err) {
    console.error("Post review error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function postComment(req, res) {
  try {
    const { error, value } = commentSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const eligible = await Reviews.userPurchasedBook(req.user.id, value.bookId);
    if (!eligible)
      return res.status(403).json({ message: "Only purchasers can comment" });

    const c = await Reviews.addComment({ userId: req.user.id, ...value });
    res.status(201).json(c);
  } catch (err) {
    console.error("Post comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listComments(req, res) {
  try {
    const rows = await Reviews.listComments(req.params.bookId);
    res.json(rows);
  } catch (err) {
    console.error("List comments error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function validateComment(req, res) {
  try {
    await Reviews.validateComment(req.params.id, true);
    res.json({ ok: true });
  } catch (err) {
    console.error("Validate comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function rejectComment(req, res) {
  try {
    await Reviews.validateComment(req.params.id, false);
    res.json({ ok: true });
  } catch (err) {
    console.error("Reject comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  postReview,
  postComment,
  listComments,
  validateComment,
  rejectComment,
};
