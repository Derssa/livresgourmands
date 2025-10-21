const { Router } = require("express");
const C = require("../controllers/reviewController");
const { authenticateJwt, authorizeRoles } = require("../middleware/auth");

const router = Router();

// Public: read validated comments for a book
router.get("/books/:bookId/comments", C.listComments);

// Auth: purchasers only
router.post("/reviews", authenticateJwt, C.postReview);
router.post("/comments", authenticateJwt, C.postComment);

// Editor/Admin: validate/reject comments
router.put(
  "/comments/:id/validate",
  authenticateJwt,
  authorizeRoles("EDITOR", "ADMIN"),
  C.validateComment
);
router.put(
  "/comments/:id/reject",
  authenticateJwt,
  authorizeRoles("EDITOR", "ADMIN"),
  C.rejectComment
);

module.exports = router;
