const express = require("express");
const { scanDocument } = require("../controllers/scanController");
const router = express.Router();

router.post("/", scanDocument);

module.exports = router;
