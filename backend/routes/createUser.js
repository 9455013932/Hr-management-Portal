import express from 'express'
import { createUserController,getUserDetailsController,deleteUserDataController ,updateUserDetailsController,
    findDataController,userStatusController,
} from '../controllers/createUserController.js'

const router = express.Router()

router.post('/create-users_foruser', createUserController)
router.get('/getuser-data',getUserDetailsController) 
router.put('/updateuser-data/:Id',updateUserDetailsController)
router.post('/find_data/:value',findDataController) 
router.delete('/delete_user_data/:Id',deleteUserDataController)


// block and approval
router.post('/users_status/:Id',userStatusController)


export default router 