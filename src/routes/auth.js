const express = require("express")
const router = express.Router();

const {
    token, 
    get_token, 
    // index, 
    auth, 
    indextes
} = require("../controllers/authorization/authorizationController")

router.post("/", token)
router.get("/", get_token)
router.post("/menucoba", indextes)
// router.post("/menu", index)
router.post("/usman", auth)

module.exports = router