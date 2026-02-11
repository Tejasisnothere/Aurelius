import Router from "express";
import {register, login, logout} from "../controllers/auth.controller.js";
import {protect} from "../middlewares/auth.middleware.js"

const router =  Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router;