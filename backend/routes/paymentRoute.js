import express from 'express'
import machineIdPkg from 'node-machine-id';

const { machineId } = machineIdPkg;
import { authToken } from '../middlewares/authToken.js';
import {createPaymentController,getAdvancePaymentController,updateAdvancePayment,getSuggestions,paymentReportController,deleteAdvancePayment} from '../controllers/paymentController.js'
const router=express.Router()


router.post('/advance-payment',authToken,createPaymentController)

router.post('/getadvance_payment' ,getAdvancePaymentController)
router.put('/advance_update_payment/:Pay_Id',updateAdvancePayment)
router.post('/access-suggesion/:value',getSuggestions)
router.delete('/advance_payment_delete/:Pay_Id',deleteAdvancePayment)

router.get('/system-info', (req, res) => {
    machineId().then(id => {
      res.json({ machineId: id });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
  });

// Payment Report
router.post('/payment-report-datewise',paymentReportController)
export default router;