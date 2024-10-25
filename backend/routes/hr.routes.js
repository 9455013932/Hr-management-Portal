import express from "express"
import { addSalary, Checkvalidmonth, deleteEmployee, EmployeeLeave, GeneratedSalary, GenerateSalary, GetAllEmlpoyee, getallEmpId, getAllLeave, GetAttendenceList, GetEmlpoyee, GetMonthlySalary, GetYearlySalary, PaidSalary, RegisterEmployee, SetAttendence, TerminatedEmployee, updateEmployee, UpdateTerminatedEmployee, ViewGenereatedSalary } from "../controllers/hr.controller.js"
const router = express.Router()
import multer from 'multer'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'bonanza', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'bonanza/uploads'); // Define your upload folder path
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Define file naming convention
  }
});

const upload = multer({ storage: storage });

router.post('/registeremployee', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), RegisterEmployee);
router.get("/getallemployee", GetAllEmlpoyee)
router.put("/updateemployee/:id", updateEmployee)
router.delete("/deleteemployee/:Id", deleteEmployee)

router.post("/getattendencelist", GetAttendenceList)
router.post("/setattendence", SetAttendence)

router.post("/employeeleave", EmployeeLeave)
router.post("/getallempid/:intro", getallEmpId)
router.post("/getselectedleave", getAllLeave)
router.get("/getemployee", GetEmlpoyee)


router.post("/checkvalidmonth", Checkvalidmonth)
router.post("/addsalary", addSalary)
router.post("/viewgenereatedsalary", ViewGenereatedSalary)
router.post("/generatesalary", GenerateSalary)
router.post("/generatedsalary", GeneratedSalary)
router.post("/paysalary", PaidSalary)



router.post("/getmonthlysalary", GetMonthlySalary)
router.post("/getyearlysalary", GetYearlySalary)
router.get("/terminatdemployee", TerminatedEmployee)
router.put("/updateterminatedemployee/:EId", UpdateTerminatedEmployee)


export default router   