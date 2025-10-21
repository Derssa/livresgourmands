const { Router } = require("express");
const Categories = require("../controllers/categoryController");
const { authenticateJwt, authorizeRoles } = require("../middleware/auth");

const router = Router();

router.get("/", Categories.list);
router.post(
  "/",
  authenticateJwt,
  authorizeRoles("ADMIN", "EDITOR", "MANAGER"),
  Categories.create
);
router.put(
  "/:id",
  authenticateJwt,
  authorizeRoles("ADMIN", "EDITOR", "MANAGER"),
  Categories.update
);
router.delete(
  "/:id",
  authenticateJwt,
  authorizeRoles("ADMIN", "EDITOR", "MANAGER"),
  Categories.remove
);

module.exports = router;
