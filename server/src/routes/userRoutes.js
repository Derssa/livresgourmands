const { Router } = require("express");
const Users = require("../controllers/userController");
const { authenticateJwt, authorizeRoles } = require("../middleware/auth");

const router = Router();

router.get("/", authenticateJwt, authorizeRoles("ADMIN"), Users.list);
router.put("/:id", authenticateJwt, authorizeRoles("ADMIN"), Users.update);
router.delete("/:id", authenticateJwt, authorizeRoles("ADMIN"), Users.remove);

module.exports = router;
