import express from "express";
import { authToken } from "../middlewares/authToken.js";
import { authController,
    // changeRouteController 
} from "../controllers/authController.js";
const router = express.Router();
router.get('/access-token',authToken, authController);

// router.post('/change_route',changeRouteController)

export default router;
