const { Router } = require("express");
const Books = require("../controllers/bookController");
const { authenticateJwt, authorizeRoles } = require("../middleware/auth");

const router = Router();

router.get("/", Books.list);
router.get("/:id", Books.get);
router.post(
  "/",
  authenticateJwt,
  authorizeRoles("ADMIN", "EDITOR", "MANAGER"),
  Books.create
);
router.put(
  "/:id",
  authenticateJwt,
  authorizeRoles("ADMIN", "EDITOR", "MANAGER"),
  Books.update
);
router.delete(
  "/:id",
  authenticateJwt,
  authorizeRoles("ADMIN", "EDITOR", "MANAGER"),
  Books.remove
);

module.exports = router;
