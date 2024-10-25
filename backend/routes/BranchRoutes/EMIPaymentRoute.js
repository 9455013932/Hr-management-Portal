import express from 'express'
import { authToken } from '../../middlewares/authToken.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { shikCustomerDataController,getCustomerID,createbranchEmiPayment,getAssociateAdvPayController,
  getPartWiseCustomerIdController ,createBranchPartPayment,getAssociateIdController,createAssociatePaymentController
} from '../../controllers/BranchController/EMIPaymentController.js'
const router = express.Router()

router.post('/shink-value-customer',authToken,shikCustomerDataController)
router.post('/get-customer-id/:value',getCustomerID)


const EmiPayment = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = "bonanza/EMIPayment";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
      const ext = file.originalname.split('.').pop();
      const imageName = file.originalname.split('.')[0]
      cb(null, file.fieldname + '-' + imageName + '-' + uniqueSuffix + '.' + ext);
    },
  });
  const upload = multer({ storage: EmiPayment });
router.post('/create-branch-emipayment',upload.single('image'),createbranchEmiPayment)

// part payment route
router.post('/get-part-customerid/:value',getPartWiseCustomerIdController)
router.post('/create-branch-partpayment',upload.single('image'),createBranchPartPayment)
router.get('/get-associate-id',getAssociateIdController)
router.post('/associate-advance-payment',createAssociatePaymentController)
router.get('/get-associate-advance-payment',getAssociateAdvPayController)

export default router