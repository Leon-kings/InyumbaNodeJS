const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const houseController = require("../controllers/houseController");

// Validation rules
const houseValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("university").trim().notEmpty().withMessage("University is required"),
  body("pricePerMonth").isNumeric().withMessage("Price must be a number"),
  body("bedrooms")
    .isInt({ min: 0 })
    .withMessage("Bedrooms must be a positive number"),
  body("bathrooms")
    .isInt({ min: 0 })
    .withMessage("Bathrooms must be a positive number"),

  // ✅ FIXED: Use 'guests' (matches your Mongoose model)
  body("guests").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
];

// Public Routes
router.get("/available", houseController.getAvailableHouses);
router.get("/statistics", houseController.getHouseStatistics);
router.get("/university/:university", houseController.getHousesByUniversity);
router.get("/newly-added", houseController.getNewlyAddedHouses);
router.get("/notifications", houseController.getHouseNotifications);
router.get(
  "/notifications/unread-count",
  houseController.getUnreadNotificationCount,
);
router.get("/", houseController.getAllHouses);
router.get("/:email", houseController.getHousesByEmail);
router.get("/notifications/:email", houseController.getNotificationsByEmail);
router.get("/:id", houseController.getHouseById);
router.get("/house-id/:houseId", houseController.getHouseByHouseId);

// Admin Routes
router.post(
  "/",
  houseController.upload.array("images", 10),
  houseValidation,
  houseController.createHouse,
);

router.put(
  "/:id",
  houseController.upload.array("images", 10),
  houseValidation,
  houseController.updateHouse,
);

router.put("/:id/status", houseController.updateHouseStatus);
router.put(
  "/notifications/:id/read",
  houseController.markNotificationAsRead,
);
router.put(
  "/notifications/:id/mark-all-read",
  houseController.markAllNotificationsAsRead,
);
// Delete one notification
router.delete("/notifications/:id", houseController.deleteNotification);

// Bulk delete notifications
router.delete("/bulk", houseController.bulkDeleteNotifications);
router.delete("/:id", houseController.deleteHouse);

module.exports = router;
