import express from 'express'
import { forgetPassController, loginController,apiController ,deleteUserController} from '../controllers/userController.js'
import { authToken } from '../middlewares/authToken.js'
 const router = express.Router()


router.post('/login',loginController)
router.post('/forget-password',forgetPassController)
router.post('/set-api',apiController)
router.delete('/delete-user',authToken,deleteUserController)
export default router