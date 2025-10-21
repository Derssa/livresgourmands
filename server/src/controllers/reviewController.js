const Reviews = require("../models/reviewModel");

async function postReview(req, res) {
  const { bookId, rating } = req.body || {};
  if (!bookId || !rating)
    return res.status(400).json({ message: "bookId and rating required" });
  const eligible = await Reviews.userPurchasedBook(req.user.id, bookId);
  if (!eligible)
    return res.status(403).json({ message: "Only purchasers can review" });
  const r = await Reviews.addReview({ userId: req.user.id, bookId, rating });
  res.status(201).json(r);
}

async function postComment(req, res) {
  const { bookId, content } = req.body || {};
  if (!bookId || !content)
    return res.status(400).json({ message: "bookId and content required" });
  const eligible = await Reviews.userPurchasedBook(req.user.id, bookId);
  if (!eligible)
    return res.status(403).json({ message: "Only purchasers can comment" });
  const c = await Reviews.addComment({ userId: req.user.id, bookId, content });
  res.status(201).json(c);
}

async function listComments(req, res) {
  const rows = await Reviews.listComments(req.params.bookId);
  res.json(rows);
}

async function validateComment(req, res) {
  await Reviews.validateComment(req.params.id, true);
  res.json({ ok: true });
}

async function rejectComment(req, res) {
  await Reviews.validateComment(req.params.id, false);
  res.json({ ok: true });
}

module.exports = {
  postReview,
  postComment,
  listComments,
  validateComment,
  rejectComment,
};
