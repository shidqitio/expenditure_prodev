const express = require("express");
const router = express.Router();
const { register,login } = require("../controllers/aplikasi_get_data");
const verifyToken = require("../middleware/auth")


// router.get("/",verifyToken, getAll);
// router.get("/byid/:id", getByid);
// router.get("/nested/:id", nestedbaru);
// router.post("/pilihskema",skemaPerjadinScema.pilihskema,pilihskema);
// router.put("/updatekomponen",updatekomponen);
// router.put("/updatetransport",updatetransport);
router.post("/register",register);
router.post("/login",login);


module.exports = router;
