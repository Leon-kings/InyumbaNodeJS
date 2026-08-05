const express = require("express");

const router = express.Router();

const {
  createRequest,

  getRequests,

  getRequestById,

  updateRequest,

  deleteRequest,

  upload,
} = require("../controllers/requestController");

router.post(
  "/",

  upload.single("image"),

  createRequest,
);

router.get("/", getRequests);

router.get("/:id", getRequestById);

router.put("/:id", updateRequest);

router.delete("/:id", deleteRequest);

module.exports = router;
