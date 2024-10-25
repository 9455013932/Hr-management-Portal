
import { error } from "console";
import { db } from "../../utils/db.js";
import fs from 'fs'
import path from "path";

export const shikCustomerDataController = async (req, res) => {
    try {
        const { search } = req.body;

        // Check if search value is provided
        if (!search) {
            return res.status(400).send({ error: 'Search is required' });
        }

        // SQL query to fetch customer data based on the search value
        const sql = `
           SELECT 
    customer.*, 
    associate.C_Id AS assoId, 
    associate.IntrodName, 
    COALESCE(b.ToInstall, 0) AS ToInstall, 
    b.PartAmount
FROM customer
INNER JOIN associate ON customer.memberId = associate.MemberId
LEFT JOIN (
    SELECT 
        CustomerId, 
        MAX(ToInstall) AS ToInstall, 
        SUM(PartAmount) AS PartAmount
    FROM branchemipayment
    GROUP BY CustomerId
) b ON customer.C_Id = b.CustomerId
WHERE customer.C_Id = ?
ORDER BY ToInstall DESC
LIMIT 1;`;

        // Execute the queryf
        db.query(sql, [search], (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Internal Server Error'
                });
            }

            if (result.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: 'No data found'
                });
            }

            // Send success response with the result
            res.status(200).send({
                success: true,
                message: 'Data accessed successfully',
                result
            });
        });
    } catch (error) {
        console.error('Something went wrong inside the shikCustomerDataController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the shikCustomerDataController'
        });
    }
};

// get custoer Id
export const getCustomerID = async (req, res) => {
    try {
        const { value } = req.params
        // console.log(value)
        const sql = `select * from customer where C_Id like '%${value}%' and PayMode='Monthly' or PayMode='Quaterly' or PayMode='Halfyearly' or PayMode='Yearly'`
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Internal Server Error'
                });
            }

            if (result.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: 'No data found'
                });
            }

            // Send success response with the result
            res.status(200).send({
                success: true,
                message: 'Data accessed successfully',
                result
            });
        })

    } catch (error) {
        console.error('Something went wrong inside the getCustomerID', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the getCustomerID'
        });
    }
}

// create Branch createbranchEmiPayment
export const createbranchEmiPayment = async (req, res) => {
    try {
        const { CustomerId, CustomerName, AssociateName, ProjectName, term, PayMode, ExpireDate, DueDate, LateFine, FromInstall, ToInstall, P_Mode, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC, P_Date, ReliefAmount, PayAmount, AmountWord, user } = req.body

        const fields = { CustomerId, CustomerName, AssociateName, ProjectName, term, PayMode, ExpireDate, DueDate, LateFine, FromInstall, ToInstall, P_Mode }

        for (const [key, value] of Object.entries(fields)) {
            if (!value) {
                return res.status(404).send({ error: `${key} is required` });
            }
        }


        const file = req.file ? req.file.filename : ''

        const sql = 'select E_Id from branchemipayment order by E_Id desc limit 1'
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Internal Server Error'
                });
            }
            let newId = '100100001'
            if (result.length > 0) {
                const EID = result[0].E_Id
                const lastId = parseInt(EID, 10)
                newId = lastId + 1
            }
            const insSQL = `insert into branchemipayment (
            E_Id ,CustomerId, CustomerName, AssociateName, ProjectName, term, PayMode, ExpireDate, DueDate, LateFine,
             FromInstall, ToInstall, P_Mode, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC,
              ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC, P_Date, ReliefAmount, 
              PayAmount, AmountWord, E_User,cheque_Image
               )
                 values(
                 ?,?,?,?,?,?,?,?,?,?,
                 ?,?,?,?,?,?,?,?,?,?,
                 ?,?,?,?,?,?,?,?,?,?,
                 ?,?,?,?
                 )`
            const values = [newId, CustomerId, CustomerName, AssociateName, ProjectName, term, PayMode, ExpireDate, DueDate, LateFine,
                FromInstall, ToInstall, P_Mode, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC,
                ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC, P_Date, ReliefAmount,
                PayAmount, AmountWord, user, file]
            db.query(insSQL, values, (insErr, insResult) => {
                if (insErr) {
                    console.log(insErr.message)
                    return res.status(500).send({
                        success: false,
                        message: 'Internal Server Error'
                    });
                }
                res.status(201).send({
                    success: true,
                    message: 'Payment Successfull',
                    result: insResult
                })
            })


        })
    } catch (error) {
        console.error('Something went wrong inside the createbranchEmiPayment', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the createbranchEmiPayment'
        });
    }
}

// Part payment getPartWiseCustomerIdController
export const getPartWiseCustomerIdController = async (req, res) => {
    try {
        const { value } = req.params
        // console.log(value)
        const sql = `select * from customer where C_Id like '%${value}%' and PayMode='Part'`
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Internal Server Error'
                });
            }

            if (result.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: 'No data found'
                });
            }

            // Send success response with the result
            res.status(200).send({
                success: true,
                message: 'Data accessed successfully',
                result
            });
        })

    } catch (error) {
        console.error('Something went wrong inside the getPartWiseCustomerIdController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the getPartWiseCustomerIdController'
        });
    }
}
// create createBranchPartPayment
export const createBranchPartPayment = async (req, res) => {
    try {
        const { CustomerId, CustomerName, AssociateName, ProjectName, term, PayMode, PartPayment, DueAmount, LateFine, ToInstall, P_Mode, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC, P_Date, OverAllCost, PaidAmount, PayAmount, AmountWord, user } = req.body

        const fields = { CustomerId, CustomerName, AssociateName, ProjectName, term, PayMode, PartPayment, DueAmount, LateFine, OverAllCost, ToInstall, P_Mode, PaidAmount }

        for (const [key, value] of Object.entries(fields)) {
            if (!value) {
                return res.status(404).send({ error: `${key} is required` });
            }
        }


        const file = req.file ? req.file.filename : ''

        const sql = 'select E_Id from branchemipayment order by E_Id desc limit 1'
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Internal Server Error'
                });
            }
            let newId = '100100001'
            if (result.length > 0) {
                const EID = result[0].E_Id
                const lastId = parseInt(EID, 10)
                newId = lastId + 1
            }
            const insSQL = `INSERT INTO branchemipayment (
                E_Id, CustomerId, CustomerName, AssociateName, ProjectName, term, PayMode, DueAmount, LateFine, 
                ToInstall, P_Mode, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, PartAmount,
                ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC, P_Date, OverAllCost,
                PayAmount, AmountWord, E_User, cheque_Image, PaidAmount
              ) VALUES (
                ?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?
              )`;

            const values = [
                newId, CustomerId, CustomerName, AssociateName, ProjectName, term, PayMode, DueAmount, LateFine,
                ToInstall, P_Mode, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, PartPayment,
                ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC, P_Date, OverAllCost,
                PayAmount, AmountWord, user, file, PaidAmount
            ];

            db.query(insSQL, values, (insErr, insResult) => {
                if (insErr) {
                    console.log(insErr.message)
                    return res.status(500).send({
                        success: false,
                        message: 'Internal Server Error'
                    });
                }
                res.status(201).send({
                    success: true,
                    message: 'Payment Successfull',
                    result: insResult
                })
            })


        })
    } catch (error) {
        console.error('Something went wrong inside the createBranchPartPayment', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the createBranchPartPayment'
        });
    }
}
// get getAssociateIdController
export const getAssociateIdController = async (req, res) => {
    try {
        const sql = 'select C_Id from associate'
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Internal Server Error'
                });
            }

            if (result.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: 'No data found'
                });
            }

            res.status(200).send({
                success: true,
                message: 'Data accessed successfully',
                result
            });
        })
    } catch (error) {
        console.error('Something went wrong inside the getAssociateIdController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the getAssociateIdController'
        });
    }
}

// Create associate advance payment createAssociatePaymentController
export const createAssociatePaymentController = async (req, res) => {
    try {
        const { Excode, AdAmount, Paydate, Remarks, user } = req.body
        const fields = { Excode, AdAmount, Paydate, Remarks }

        for (const [key, value] of Object.entries(fields)) {
            if (!value) {
                res.status(404).send({ error: `${key} is required` })
            }
        }
        const sql = 'select AAP_Id from branchassoadvancepay order by AAP_Id desc limit 1'
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err.message)
                return res.status(500).send({
                    success: false,
                    message: 'Internal Server Error'
                });
            }
            let newId = 'AAP100001'
            if (result.length > 0) {
                const AAPId = result[0].AAP_Id
                const lastId = parseInt(AAPId.slice(4), 10)
                newId = `AAP${(lastId + 1).toString().padStart(6, '0')}`
            }


            const insSQL = 'Insert  into branchassoadvancepay (AAP_Id,Associate_Id,Advance_Amount,Remarks,Payment_Date,E_User) values (?,?,?,?,?,?)'
            const values = [newId, Excode, AdAmount, Remarks, Paydate, user]
            db.query(insSQL, values, (insErr, insResult) => {
                if (insErr) {
                    console.log(insErr.message)
                    return res.status(500).send({
                        success: false,
                        message: 'Internal Server Error'
                    });
                }
                res.status(201).send({
                    success: true,
                    message: 'Created Successfully',
                    result: insResult
                })
            })

        })

    } catch (error) {
        console.error('Something went wrong inside the createAssociatePaymentController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the createAssociatePaymentController'
        });
    }
}
// get associate advance paymen controller
export const getAssociateAdvPayController = async (req, res) => {
    try {
        const sql = 'select * from branchassoadvancepay'
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Internal Server Error'
                });
            }
            res.status(200).send({
                success: true,
                message: 'Access Successfully',
                result
            })
        })

    } catch (error) {
        console.error('Something went wrong inside the getAssociateAdvPayController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the getAssociateAdvPayController'
        });
    }
}