import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  createBranchController, getBranchController, updateBranchController, deleteBranchController, createHRController, getHRController, updateHRController, deleteHRController, creatProjectController, getProjectController, updateProjectController, deleteProjectController, accessGradeController, rankController, getRankController, updateRankController,
  deleteRankController, createGradeController, getGradeController, updateGradeController, createBonanzaController, imageUploadController, getBonanzaController, getDeleteController, updateBonanzaController, createAdvanceController, getAdvanceController,
  //  accessProjectController,
  updateAdvanceController, deleteAdvanceController, createBankController, getbankController, updateBankController, deleteBankController, getCommissionController, accessCommissionController, updateCommissionController,
  deleteCommissionController, createTDSController, getTDSController, updateTDSController, deleteTDSController, getDistrictController, createAssociateController, getAssociateController, deleteAssociateController, updateAssociateController,
  createCustomerController, getCustomerController, introCodeController, getIntroducrController, deleteCustomerController, updateCustomerController, branchCodeController
  , CustbranchCodeController, CustintroCodeController, createExpenseController, getExpenseController, updateExpenseController,deleteExpenseController
} from "../controllers/createController.js";
import { authToken } from "../middlewares/authToken.js";
const router = express.Router();

// branch methods
router.post("/create-branch", authToken, createBranchController);
router.get("/getAll-branch", getBranchController);
router.put("/update-branch/:Id", authToken, updateBranchController);
router.delete("/delete-branch/:Id", deleteBranchController);

//  HR methods
router.post("/create-hr", authToken, createHRController);
router.get("/getAll-hr", getHRController);
router.put("/update-hr/:Id", updateHRController);
router.delete("/delete-hr/:Id", deleteHRController);

// Project methods
router.post("/create-project", authToken, creatProjectController);
router.get("/get-grade", accessGradeController);
router.get("/get-project", getProjectController);
router.put("/update-project/:Id", authToken, updateProjectController);
router.delete("/delete-project/:Id", deleteProjectController);

// Rank methods
router.post("/create-rank", authToken, rankController);
router.get("/get-rank", getRankController);
router.put("/update-rank/:Id", updateRankController);
router.delete("/delete-rank/:Id", deleteRankController);
// router.get('/get-rankproject', accessProjectController)

// Grade methods
router.post("/create-grade", authToken, createGradeController);
router.get("/get-grade", getGradeController);
router.put("/update-grade/:Id", updateGradeController);

// Bonanza methods
// image upload in directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "bonanza";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(6, '0')
    const ext = file.originalname.split('.').pop()
    const name = file.originalname.split('.')[0]
    cb(null, file.fieldname + name + '_' + suffix + '.' + ext);
  },
});
const upload = multer({ storage: storage });
router.post("/create-bonanza", upload.single("image"), authToken, createBonanzaController);

router.use("/get-bonanza", express.static(path.join("bonanza"))
);
router.get("/get-bonanza", getBonanzaController);
router.put("/update-bonanza/:Id", upload.single("image"), updateBonanzaController);
router.delete("/delete-bonanza/:BPic/:Id", getDeleteController);

// advance Commisssion methods
router.post("/create-advance", authToken, createAdvanceController);
router.get("/get-advance", getAdvanceController);
router.put("/update-advance/:Id", updateAdvanceController);
router.delete("/delete-advance/:Id", deleteAdvanceController);

// Bank methods
router.post("/create-bank", authToken, createBankController);
router.get("/getall-bank", getbankController);
router.put("/update-bank/:Id", updateBankController);
router.delete("/delete-bank/:Id", deleteBankController);

// commission methods
router.post("/access-commission", accessCommissionController);
router.get("/get-commission", getCommissionController);
router.put("/update-commission/:Id", updateCommissionController);
router.delete("/delete-commission/:Id", deleteCommissionController);

// tds methods
router.post("/create-tds", createTDSController);
router.get("/get-tds", getTDSController);
router.put("/update-tds/:Id", updateTDSController);
router.delete("/delete-tds/:Id", deleteTDSController);

// assosiate methods
router.post("/getall-district", getDistrictController);
const imageStore = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "bonanza/associate";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const ext = file.originalname.split('.').pop();
    const imageName = file.originalname.split('.')[0]
    cb(null, file.fieldname + '-' + imageName + '-' + uniqueSuffix + '.' + ext);
  },
});
const uploadImage = multer({ storage: imageStore });
router.post("/create-associate", uploadImage.single("image"), authToken, createAssociateController);
// use first
router.use("/getall-associate", express.static(path.join("bonanza", "associate")));
router.get("/getall-associate", getAssociateController);
router.delete("/delete-associate/:image/:Id", deleteAssociateController);
router.put("/update-associate/:Id", uploadImage.single("image"), updateAssociateController);


// Customer methods
const imageCustomer = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "bonanza/customer";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const ext = file.originalname.split('.').pop();
    const imageName = file.originalname.split('.')[0]
    cb(null, file.fieldname + '-' + imageName + '-' + uniqueSuffix + '.' + ext);
  },
});
const uploadImageCustomer = multer({ storage: imageCustomer });
router.post('/create-customer', uploadImageCustomer.array('image', 2), createCustomerController)
router.use('/getall-customer', express.static(path.join('bonanza/customer')))
router.get('/getall-customer', getCustomerController)
router.put('/update-customer/:Id', uploadImageCustomer.array('image', 2), updateCustomerController)
router.delete('/delete-customer/:Id', deleteCustomerController)


// access Branch Code
router.post('/branchcode-data/:code', branchCodeController)
router.post('/branchcode_customer/:code', CustbranchCodeController)
router.post('/introducer_code/:intro', introCodeController)
router.post('/introducer-customer/:intro', CustintroCodeController)
router.post('/access_introducer_name', getIntroducrController)


router.post('/admin-create-expense', createExpenseController)
router.get('/admin-get-expense', getExpenseController)
router.put('/admin-update-expense/:Id', updateExpenseController)
router.delete('/admin-expense-delete/:Id',deleteExpenseController)

export default router;
