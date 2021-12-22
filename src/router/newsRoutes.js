
const router = require("express").Router();
const newsController = require("../controllers/newsControllers")
const auth = require("../middleware/auth")
router.get("/news",auth, newsController.allNews);

router.post("/add",auth, newsController.addnews);

router.get("/getnews/:newsId",auth, newsController.getById);

router.patch("/edit/:newsId",newsController.updateNews);

router.delete('/delete/:newsID',newsController.deleteNews);
module.exports = router;