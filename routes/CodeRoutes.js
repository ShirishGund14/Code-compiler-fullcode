const express = require("express");
const {
    getAllCodesController,
  createCodeController,
  updateCodeController,
  getCodeByIdController,
  deleteCodeController,
  userCodeController,
} = require("../controllers/codeController");

//router object
const router = express.Router();

//routes
// GET || all blogs
router.get("/all-codes", getAllCodesController);

//POST || create blog
router.post("/create-code", createCodeController);

//PUT || update blog
router.put("/update-code/:id", updateCodeController);

//GET || SIngle Blog Details
router.get("/get-code/:id", getCodeByIdController);

//DELETE || delete blog
router.delete("/delete-code/:id", deleteCodeController);

//GET || get all user codes  
router.get("/user-code/:id", userCodeController);

module.exports = router;
