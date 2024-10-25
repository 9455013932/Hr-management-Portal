import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { createBranchMemberController,getAllMemberController
   , accessmemberData ,updateMemberController,deleteMemberController,searchMemberData,accessmemberwiseData,accessMemberDataById,getPlotPrices
   ,getExpenseFromAdminController,createBranchExpenseController,getExpenseController,updateBranchExpenseController,deleteExpenseController
} from '../../controllers/BranchController/memberController.js'
import {authToken} from '../../middlewares/authToken.js'
const router=express.Router()


router.post('/create-branch_member',createBranchMemberController)
router.post('/find_memberdata/:value' ,accessmemberData)
router.get('/getall-member_data',getAllMemberController)
router.put('/update_member_data/:Id' ,updateMemberController)
router.delete('/delete_member_data/:Id' ,deleteMemberController)
router.post('/find_member_data/:value',searchMemberData)
router.post('/access_member_id_name/:value',accessmemberwiseData)
// load member data on associate form
router.post('/load-on-member-data',accessMemberDataById)


// access plot price 
router.post('/get-plot-price',getPlotPrices)

// expense routes
router.get('/getexpense-to-admin',getExpenseFromAdminController)

const expense = multer.diskStorage({
   destination: function (req, file, cb) {
     const uploadDir = "bonanza/expense";
     if (!fs.existsSync(uploadDir)) {
       fs.mkdirSync(uploadDir, { recursive: true });
     }
     cb(null, uploadDir);
   },
   filename: function (req, file, cb) {
     const uniqueSuffix = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
     const ext = file.originalname.split('.').pop();
     const imageName = file.originalname.split('.')[0]
     cb(null, file.fieldname + '-' + imageName + '-' + uniqueSuffix + '.' + ext);
   },
 });
 const uploadexpesne = multer({ storage: expense });
router.post('/create-branch-expense',authToken,uploadexpesne.single('image'),createBranchExpenseController)
router.use('/getall-expense', express.static(path.join('bonanza/expense')))
router.get('/getall-expense',getExpenseController)
router.put('/update-branch-expense/:Id',authToken,uploadexpesne.single('image'),updateBranchExpenseController)
router.delete('/delete-expense/:Id',deleteExpenseController)

export default router