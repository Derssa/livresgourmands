const { Router } = require("express");
const Orders = require("../controllers/orderController");
const { authenticateJwt, authorizeRoles } = require("../middleware/auth");

const router = Router();

router.get("/me", authenticateJwt, Orders.listMine);
// Creating orders is allowed to authenticated clients
router.post("/", authenticateJwt, Orders.create);
// Admin and Manager can change order status and delete orders
router.put(
  "/:id/status",
  authenticateJwt,
  authorizeRoles("ADMIN", "MANAGER"),
  Orders.updateStatus
);
router.delete(
  "/:id",
  authenticateJwt,
  authorizeRoles("ADMIN", "MANAGER"),
  Orders.remove
);

module.exports = router;
