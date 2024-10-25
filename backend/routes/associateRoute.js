import express from "express";
import {  GetCustomer} from "../controllers/AssociateController.js";

const router=express.Router()

router.post(`/getcustomer/:AId`,GetCustomer)
// router.post(`/referencecustomer`,)

export default router