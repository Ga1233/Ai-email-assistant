const express = require("express");
const router = express.Router();

const {
  generateEmailReply,
  getHistory,
  deleteHistory,
  clearHistory,
} = require("../controllers/emailController");

// GENERATE EMAIL (no auth required)
router.post("/generate-email", generateEmailReply);

// GET HISTORY
router.get("/history", getHistory);

// DELETE HISTORY ITEM
router.delete("/history/:id", deleteHistory);

// CLEAR ALL HISTORY
router.delete("/history", clearHistory);

module.exports = router;
