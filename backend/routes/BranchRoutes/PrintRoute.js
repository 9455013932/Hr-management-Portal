import express from 'express'
import { authToken } from '../../middlewares/authToken.js'; 
import { getAssociateDataById } from '../../controllers/BranchController/PrintController.js';
const router = express.Router()


router.post('/get-associte-data',authToken,getAssociateDataById)


export default router;