
const router = require("express").Router();
const auth = require("../middleware/auth")
 
const reporterController =require("../controllers/userController")

router.get("/allreporters",auth, reporterController.allUsers);

router.post("/addUser", reporterController.addUser);
router.post('/login', reporterController.login);

router.get("/get/:userId",auth, reporterController.getById);
router.get('/profile',auth,(req, res) =>{
    res.send(req.user)
}
)

router.post('/profile/avatar',auth,reporterController.uploads.single('avatar'),reporterController.avatar);
router.patch("/editUser/:userId",auth,reporterController.updateUser);

router.delete("/logout",auth,reporterController.logout);
router.delete("/logoutAll",auth,reporterController.logoutAll);
router.delete('/deleteUser/:userID',auth,reporterController.deleteUser);
module.exports = router;