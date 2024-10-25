
import { db } from "../utils/db.js"


// create Advance payment controller
export const createPaymentController = async (req, res) => {
    try {
        const { AssociateId, Name, Amount, PaymentDate, PaymentMode, user, TransactionId, ChequeNo, DraftNo } = req.body;

        const fields = { AssociateId, Name, Amount, PaymentDate, PaymentMode, user };
        for (const [key, value] of Object.entries(fields)) {
            if (!value && value !== 0) {
                return res.status(400).send({ error: `${key} is required.` });
            }
        }

        const checkSql = 'SELECT * FROM advancepayment WHERE AssociateId = ? ';
        const existResult = await controFun(checkSql, [AssociateId]);

        if (existResult.length > 0) {
            return res.status(200).send({
                success: false,
                message: 'Payment with this AssociateId already exists',
            });
        }

        const getLastIdSql = 'SELECT Pay_Id FROM advancepayment ORDER BY Pay_Id DESC LIMIT 1';
        const checkPayId = await controFun(getLastIdSql);
        let Pay_Id = '100100001';
        if (checkPayId.length > 0) {
            const lastId = parseInt(checkPayId[0].Pay_Id.slice(4), 10);
            Pay_Id = `1001${(lastId + 1).toString().padStart(5, '0')}`;
        }

        const insertSql = 'INSERT INTO advancepayment (Pay_Id, AssociateId, Name, Amount, PaymentDate, PaymentMode, E_User, TransactionId, ChequeNo, DraftNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [Pay_Id, AssociateId, Name, Amount, PaymentDate, PaymentMode, user, TransactionId, ChequeNo, DraftNo];

        const insertResult = await controFun(insertSql, values);

        if (insertResult && insertResult.affectedRows > 0) {
            return res.status(201).send({
                success: true,
                message: 'Payment inserted successfully',
            });
        } else {
            return res.status(500).send({
                success: false,
                message: 'Insert operation did not affect any rows',
            });
        }
    } catch (error) {
        console.error('Error in createPaymentController:', error);
        return res.status(500).send({
            success: false,
            message: 'Something went wrong in createPaymentController',
            error: error.message,
        });
    }
};


export const getAdvancePaymentController = async (req, res) => {
    try {
        const { search } = req.body;

        if (!search) {
            return res.status(400).send({ error: 'search is required' });
        }

        const sql = `SELECT * FROM advancepayment WHERE AssociateId = ?`;
        const paymentResult = await controFun(sql, [search]);

        if (paymentResult.length > 0) {
            return res.status(200).send({
                success: true,
                message: 'Access successfully',
                result: paymentResult,
            });
        } else {
            return res.status(404).send({
                success: false,
                message: 'No records found',
            });
        }
    } catch (error) {
        console.error('Error in getAdvancePaymentController:', error);
        return res.status(500).send({
            success: false,
            message: 'Something went wrong in getAdvancePaymentController',
            error: error.message,
        });
    }
};

// update advance payment
export const updateAdvancePayment = async (req, res) => {
    try {
        const { Pay_Id } = req.params
        const { AssociateId, Name, Amount, PaymentDate, PaymentMode, user, TransactionId, ChequeNo, DraftNo } = req.body
        const fields = { AssociateId, Name, Amount, PaymentDate, PaymentMode, user }
        for (const [key, value] of Object.entries(fields)) {
            if (!value && value == null) {
                res.status(404).send({ error: `${key} is required` })
            }
        }
        const sql = 'update advancepayment set AssociateId=?, Name=?, Amount=?, PaymentDate=?, PaymentMode=?, M_user=?, TransactionId=?, ChequeNo=?, DraftNo=? where Pay_Id=?'
        const result = await controFun(sql, [AssociateId, Name, Amount, PaymentDate, PaymentMode, user, TransactionId, ChequeNo, DraftNo, Pay_Id])
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Update Successfully',
                result
            })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            success: false,
            message: 'Something Wrong inside the updateAdvancePayment'
        })
    }
}
// get suggestions
export const getSuggestions = async (req, res) => {
    try {
        const { value } = req.params;

        // Ensure `value` is properly escaped
        const sql = `SELECT AssociateId, Name FROM advancepayment WHERE AssociateId  || Name LIKE ?`;
        const result = await controFun(sql, [`%${value}%`]);

        if (result.length > 0) {
            res.status(200).send({
                success: true,
                result
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'No suggestions found'
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside getSuggestions'
        });
    }
}
// delete advance payment 
export const deleteAdvancePayment = async (req, res) => {
    try {
        const { Pay_Id } = req.params
        const sql = 'DELETE from advancepayment where Pay_Id=?'
        const result = await controFun(sql, [Pay_Id])
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Deleted Successfully'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside deleteAdvancePayment'
        });
    }
}

const controFun = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('SQL Error:', err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

// Payment Report Controller
export const paymentReportController = async (req, res) => {
    try {
        const { SDate, EDate } = req.body;
        const fields = { SDate, EDate };

        for (const [key, value] of Object.entries(fields)) {
            if (!value || value == null) {
                return res.status(400).send({ error: `${key} is required` });
            }
        }

        const sql = `SELECT * FROM advancepayment WHERE PaymentDate BETWEEN ? AND ?`;
        const result = await controFun(sql, [SDate, EDate]);

        if (result) {
            return res.status(200).send({
                success: true,  // Assuming it should be true since the operation was successful
                message: 'Accessed Successfully',
                result
            });
        } else {
            return res.status(404).send({
                success: false,
                message: 'No records found'
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: 'Something went wrong inside paymentReportController'
        });
    }
};
