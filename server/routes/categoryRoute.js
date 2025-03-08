const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoriesController");

router.get("/", categoryController.getCategories);
// router.post("/mapped", categoryController.getMappedSubcategories);
// router.post("/", categoryController.addCategory);
// router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
